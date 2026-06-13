'use client'

interface ContextMenuProps {
  x: number
  y: number
  onArrangeIcons: () => void
  onRefresh: () => void
  onProperties: () => void
  onClose: () => void
}

export default function ContextMenu({
  x,
  y,
  onArrangeIcons,
  onRefresh,
  onProperties,
  onClose,
}: ContextMenuProps) {
  const run = (fn: () => void) => () => {
    onClose()
    fn()
  }

  return (
    <div className="w95-context" style={{ left: x, top: y }} onMouseDown={(e) => e.stopPropagation()}>
      <div className="w95-menu-item" onClick={run(onArrangeIcons)}>
        Arrange Icons
      </div>
      <div className="w95-menu-item" onClick={run(onRefresh)}>
        Refresh
      </div>
      <div className="w95-menu-sep" />
      <div className="w95-menu-item disabled">Paste</div>
      <div className="w95-menu-item disabled">New</div>
      <div className="w95-menu-sep" />
      <div className="w95-menu-item" onClick={run(onProperties)}>
        Properties
      </div>
    </div>
  )
}
