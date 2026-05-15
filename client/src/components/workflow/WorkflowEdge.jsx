import { memo } from 'react'
import { BaseEdge, getSmoothStepPath, getBezierPath } from '@xyflow/react'

/**
 * Custom edge with:
 *  - idle: thin dim line
 *  - active (source done):  green→amber gradient + traveling particle
 *  - running (source done, target running): amber dashed flow + particle
 *  - error: red dashed
 */
function WorkflowEdgeImpl({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) {
  const isCrossLane = Math.abs(sourceY - targetY) > 80
  const [edgePath] = isCrossLane
    ? getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, borderRadius: 18 })
    : getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, curvature: 0.25 })

  const flow = data?.flow || 'idle' // idle | active | running | error

  let stroke = '#2A3045'
  let strokeWidth = 1.5
  let dashArray
  let className = ''

  if (flow === 'active') {
    stroke = `url(#edge-gradient-${id})`
    strokeWidth = 2
  } else if (flow === 'running') {
    stroke = '#FF9F43'
    strokeWidth = 2
    className = 'flow-edge-running'
  } else if (flow === 'error') {
    stroke = '#F43F5E'
    strokeWidth = 2
    dashArray = '6 4'
  }

  const showParticle = flow === 'running' || flow === 'active'

  return (
    <>
      {/* Gradient definition for active edges */}
      {flow === 'active' && (
        <defs>
          <linearGradient id={`edge-gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FF9F43" stopOpacity="0.95" />
          </linearGradient>
        </defs>
      )}

      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke,
          strokeWidth,
          strokeDasharray: dashArray,
          transition: 'stroke-width 0.3s ease',
        }}
        className={className}
      />

      {/* Traveling particle along the path */}
      {showParticle && (
        <>
          <circle r="3" fill={flow === 'running' ? '#FF9F43' : '#10B981'}>
            <animateMotion
              dur="1.4s"
              repeatCount="indefinite"
              path={edgePath}
              rotate="auto"
            />
          </circle>
          {/* Glow halo */}
          <circle
            r="6"
            fill={flow === 'running' ? '#FF9F43' : '#10B981'}
            opacity="0.25"
          >
            <animateMotion
              dur="1.4s"
              repeatCount="indefinite"
              path={edgePath}
            />
          </circle>
        </>
      )}
    </>
  )
}

export const WorkflowEdge = memo(WorkflowEdgeImpl)
