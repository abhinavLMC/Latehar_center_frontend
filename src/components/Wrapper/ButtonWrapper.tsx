import type { ButtonProps } from 'antd'
import { Button } from 'antd'
import React from 'react'

interface CustomButtonProps extends ButtonProps {
  label?: string
}

const ButtonWrapper: React.FC<CustomButtonProps> = (props) => {
    // if (props?.loading) return;
  return (
    <Button {...props}>{props.children}</Button>
  )
}

export default ButtonWrapper