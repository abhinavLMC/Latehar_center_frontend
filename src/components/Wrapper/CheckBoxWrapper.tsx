import type { CheckboxProps } from 'antd'
import { Checkbox } from 'antd'
import React from 'react'

interface customCheckboxProps extends CheckboxProps {
  label?: string
}

const CheckBoxWrapper: React.FC<customCheckboxProps> = (props) => {
  return (
    <Checkbox {...props}>{props.children}</Checkbox>
  )
}

export default CheckBoxWrapper