import { EMPTY_PLACEHOLDER } from '@constants/AppConstant'
import Link from 'next/link'
import React from 'react'

interface PropTypes {
  fileUrl: string
}

const ViewFileLink = ({fileUrl}: PropTypes) => {
  return (
    fileUrl ? <Link href={fileUrl} target='new'>{fileUrl.split('/').at(-1)}</Link> : EMPTY_PLACEHOLDER
  )
}

export default ViewFileLink