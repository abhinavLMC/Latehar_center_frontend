import type { InputProps } from 'antd'
import { Input } from 'antd'
import React from 'react'

const InputWrapper: React.FC<InputProps> = (props) => {
  return (
    <Input {...props} />
  )
}

export default InputWrapper