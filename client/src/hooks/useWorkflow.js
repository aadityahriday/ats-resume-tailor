import { useCallback, useEffect, useRef, useState } from 'react'
import {
  WORKFLOW_STEPS,
  STATUS,
  buildInitialState,
  getStepIndex,
} from '../lib/workflowSteps'

/**
 * useWorkflow — orchestrates workflow visual state.
 *
 * Modes:
 *   - "drive(serverTimings)": run a stepper using estimates while in-flight,
 *      replace each finished step's elapsed with the server-measured value.
 *   - "abort()": fast-forward remaining steps to "done".
 *   - "fail(stepId | null)": mark current/last running step as error.
 *   - "reset()": clear everything.
 *
 * Future: replace `drive()` with a true SSE consumer; the public API stays the same.
 */
export function useWorkflow() {
  const [state, setState] = useState(() => buildInitialState())
  const [activeStepId, setActiveStepId] = useState(null)

  const tickRef = useRef(null)
  const stepRef = useRef(null)
  const abortRef = useRef(false)

  const reset = useCallback(() => {
    abortRef.current = false
    if (tickRef.current) clearInterval(tickRef.current)
    if (stepRef.current) clearTimeout(stepRef.current)
    setState(buildInitialState())
    setActiveStepId(null)
  }, [])

  const updateStep = useCallback((id, patch) => {
    setState((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }))
  }, [])

  /**
   * Drive the visual workflow.
   * Returns a Promise that resolves once all steps have visually completed
   * OR `abort()` is called.
   */
  const drive = useCallback(async () => {
    abortRef.current = false
    setState(buildInitialState())

    for (let i = 0; i < WORKFLOW_STEPS.length; i++) {
      const step = WORKFLOW_STEPS[i]

      if (abortRef.current) {
        // Mark remaining as done with their estimate (final cleanup)
        setState((prev) => {
          const next = { ...prev }
          for (let j = i; j < WORKFLOW_STEPS.length; j++) {
            const s = WORKFLOW_STEPS[j]
            if (next[s.id]?.status !== STATUS.DONE) {
              next[s.id] = { ...next[s.id], status: STATUS.DONE, elapsed: s.estMs }
            }
          }
          return next
        })
        break
      }

      setActiveStepId(step.id)
      const startedAt = Date.now()
      updateStep(step.id, { status: STATUS.RUNNING, elapsed: 0 })

      // Live elapsed counter
      if (tickRef.current) clearInterval(tickRef.current)
      tickRef.current = setInterval(() => {
        const elapsed = Date.now() - startedAt
        updateStep(step.id, { elapsed })
      }, 80)

      // Wait the estimated duration OR until abort
      await new Promise((resolve) => {
        const expected = step.estMs
        stepRef.current = setTimeout(resolve, expected)
      })
      clearInterval(tickRef.current)
      tickRef.current = null

      if (abortRef.current) {
        updateStep(step.id, { status: STATUS.DONE, elapsed: Date.now() - startedAt })
        continue
      }

      updateStep(step.id, { status: STATUS.DONE, elapsed: Date.now() - startedAt })

      // Tiny pause between steps for visual clarity
      await new Promise((r) => setTimeout(r, 140))
    }

    setActiveStepId(null)
  }, [updateStep])

  const finalize = useCallback(
    (timings) => {
      console.info('[workflow] finalize called with timings:', timings)

      // When server response lands, overwrite elapsed for known steps
      // and ensure ALL steps are unconditionally marked done.
      abortRef.current = true
      if (tickRef.current) {
        clearInterval(tickRef.current)
        tickRef.current = null
      }
      if (stepRef.current) {
        clearTimeout(stepRef.current)
        stepRef.current = null
      }

      // Use functional setState to avoid stale closure issues
      setState((prev) => {
        console.info('[workflow] current state before finalize:', prev)
        const next = { ...prev }
        for (const step of WORKFLOW_STEPS) {
          const realMs = step.timingKey && timings ? timings[step.timingKey] : null
          const currentElapsed = next[step.id]?.elapsed ?? 0
          // Use server timing if available, otherwise keep the visual elapsed
          // (which may be from the drive loop), falling back to estimate.
          const finalElapsed = realMs ?? (currentElapsed > 0 ? currentElapsed : step.estMs)
          next[step.id] = {
            ...next[step.id],
            status: STATUS.DONE,
            elapsed: finalElapsed,
          }
          console.info(`[workflow] step ${step.id}: status=DONE, elapsed=${finalElapsed}ms`)
        }
        console.info('[workflow] state after finalize:', next)
        return next
      })
      setActiveStepId(null)
    },
    []
  )

  const fail = useCallback((stepId) => {
    abortRef.current = true
    if (tickRef.current) clearInterval(tickRef.current)
    if (stepRef.current) clearTimeout(stepRef.current)

    setState((prev) => {
      // Find the first non-done step and mark it as error
      const next = { ...prev }
      const targetId =
        stepId ||
        WORKFLOW_STEPS.find(
          (s) => next[s.id]?.status === STATUS.RUNNING || next[s.id]?.status === STATUS.IDLE
        )?.id
      if (targetId) {
        next[targetId] = { ...next[targetId], status: STATUS.ERROR }
        // Mark subsequent as idle (visually halted)
        const idx = getStepIndex(targetId)
        for (let i = idx + 1; i < WORKFLOW_STEPS.length; i++) {
          const sid = WORKFLOW_STEPS[i].id
          if (next[sid]?.status !== STATUS.DONE) {
            next[sid] = { ...next[sid], status: STATUS.IDLE }
          }
        }
      }
      return next
    })
  }, [])

  const abort = useCallback(() => {
    abortRef.current = true
    if (stepRef.current) clearTimeout(stepRef.current)
  }, [])

  useEffect(
    () => () => {
      if (tickRef.current) clearInterval(tickRef.current)
      if (stepRef.current) clearTimeout(stepRef.current)
    },
    []
  )

  return {
    state,
    activeStepId,
    drive,
    finalize,
    fail,
    abort,
    reset,
  }
}
