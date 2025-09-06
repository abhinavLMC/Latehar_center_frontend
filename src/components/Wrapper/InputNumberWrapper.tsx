import type { InputNumberProps } from 'antd'
import { InputNumber } from 'antd'
import React from 'react'

const InputNumberWrapper = (props: InputNumberProps): JSX.Element => {
  // eslint-disable-next-line no-unused-vars
  const { children, ...restProps } = props
  return <InputNumber className="w-100" controls={false} {...restProps} />;
}

export default InputNumberWrapper