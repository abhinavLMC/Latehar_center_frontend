import type { RadioProps } from 'antd'
import { Radio } from 'antd'
import React from 'react'

interface customRadioProps extends RadioProps {
  label?: string
}

const RadioWrapper: React.FC<customRadioProps> = (props) => {
  return (
    <Radio {...props}>{props.children}</Radio>
  )
}

export default RadioWrapper