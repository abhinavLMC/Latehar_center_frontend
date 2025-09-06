import type { CardProps } from 'antd'
import { Card } from 'antd'
import React from 'react'

const CardWrapper: React.FC<CardProps> = (props) => {
  return (
    <Card {...props}>{props.children}</Card>
  )
}

export default CardWrapper