import type { SpaceProps } from 'antd'
import { Space } from 'antd'
import React from 'react'

interface customRadioProps extends SpaceProps {
  label?: string
}

const RadioWrapper: React.FC<customRadioProps> = (props) => {
  return (
    <Space {...props}>{props.children}</Space>
  )
}

export default RadioWrapper