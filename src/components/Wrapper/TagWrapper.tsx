import { Tag, type TagProps } from 'antd'
import React from 'react'

interface customTagProps extends TagProps {
  label?: string
}

const TagWrapper: React.FC<customTagProps> = (props) => {
  return (
    <Tag {...props}>{props.children}</Tag>
  )
}

export default TagWrapper