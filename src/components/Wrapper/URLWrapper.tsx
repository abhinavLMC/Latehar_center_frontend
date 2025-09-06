import { type InputProps } from 'antd'
import React from 'react'

import InputWrapper from './InputWrapper'

const URLWrapper = (props: InputProps): JSX.Element => {
  // eslint-disable-next-line no-unused-vars
  const { children, ...restProps } = props
  return (
    <InputWrapper
      pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
      {...restProps} />
  )
}

export default URLWrapper