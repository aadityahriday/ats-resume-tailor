import { useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

export default function useKeyboardShortcuts({ onGenerate, onScrollToForm, canGenerate, isGenerating }) {
  // Cmd/Ctrl + K: Scroll to form / Focus input
  useHotkeys('cmd+k, ctrl+k', (e) => {
    e.preventDefault()
    onScrollToForm()
  }, { enableOnFormTags: true })

  // Cmd/Ctrl + R: Generate resume
  useHotkeys('cmd+r, ctrl+r', (e) => {
    e.preventDefault()
    if (canGenerate && !isGenerating) {
      onGenerate()
    }
  }, [canGenerate, isGenerating, onGenerate])

  // Cmd/Ctrl + S: Save / Export (placeholder for future save functionality)
  useHotkeys('cmd+s, ctrl+s', (e) => {
    e.preventDefault()
    // Future: Implement save functionality
    console.log('Save shortcut triggered')
  }, [])

  // Cmd/Ctrl + E: Export (open export modal)
  useHotkeys('cmd+e, ctrl+e', (e) => {
    e.preventDefault()
    // Future: Trigger export modal
    console.log('Export shortcut triggered')
  }, [])

  // Escape: Close modals / Stop generation
  useHotkeys('escape', (e) => {
    // Close any open modals by dispatching a custom event
    window.dispatchEvent(new CustomEvent('closeAllModals'))
  }, [])

  // Show keyboard shortcuts help on Cmd/Ctrl + /
  useHotkeys('cmd+/, ctrl+/', (e) => {
    e.preventDefault()
    // Future: Show keyboard shortcuts modal
    console.log('Keyboard shortcuts help')
  }, [])
}
