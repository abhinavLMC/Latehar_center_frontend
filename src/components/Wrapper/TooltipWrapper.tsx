import type { TooltipProps } from 'antd'
import { Tooltip } from 'antd'
import React from 'react'

const TooltipWrapper: React.FC<TooltipProps> = (props) => {
  return (
    <Tooltip {...props}>
      {props.children}
    </Tooltip>
  )
}

export default TooltipWrapper