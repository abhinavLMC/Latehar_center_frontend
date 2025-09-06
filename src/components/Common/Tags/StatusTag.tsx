/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import TagWrapper from '@components/Wrapper/TagWrapper'
import React from 'react'

export const StatusTagWrapper = (status: string, name = '', bgColor = '', color = ''): JSX.Element => {
  const renderTagWrapperForStatus = (statusType: string): JSX.Element | null => {
    switch (statusType) {
      case 'draft':
        return <TagWrapper color={bgColor || '#E6E5EC'}><span style={{ color: color || '#6F728C' }} className='font-11 fw-medium'>{name || 'Draft'}</span></TagWrapper>
      case 'active':
        return <TagWrapper color={bgColor || '#D4EBE4'}><span style={{ color: color || '#058D7D' }} className='font-11 fw-medium'>{name || 'Active'}</span></TagWrapper>
      case 'expired':
        return <TagWrapper color={bgColor || '#FBD9D9'}><span style={{ color: color || '#FE5F55' }} className='font-11 fw-medium'>{name || 'Expired'}</span></TagWrapper>
      case 'closed':
        return <TagWrapper color={bgColor || '#FAECCB'}><span style={{ color: color || '#F2B300' }} className='font-11 fw-medium'>{name || 'Closed'}</span></TagWrapper>
      case 'archived':
        return <TagWrapper color={bgColor || '#EBDBEC'}><span style={{ color: color || '#B06AB3' }} className='font-11 fw-medium'>{name || 'Archived'}</span></TagWrapper>
      default:
        return null
    }
  }
  return (
    <>
      {renderTagWrapperForStatus(status)}
    </>
  )
}

// use case is like below
// import { StatusTagWrapper } from '@components/Common/TagWrappers/StatusTagWrapper'
// {StatusTagWrapper('draft', 'Draft', '', '')}
// {StatusTagWrapper('active', '', 'red', 'black')}