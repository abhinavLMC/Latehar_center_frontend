/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { FrownOutlined } from '@ant-design/icons'
import { Col, Row } from 'antd'
import React from 'react'

import NextImage from '../../NextImage'
import styles from './style.module.css'

export interface EmptyContentPropsTypes {
  entity?: string
  onlyMessage?: string
  onClickEmpty?: () => void
  search?: string
  className?: string
  imageUrl?: string
  icon?: React.ReactElement
}

function EmptyContent ({ entity, onClickEmpty, search, onlyMessage, imageUrl, icon, className }: EmptyContentPropsTypes): JSX.Element {
  return (
    <>
      <Row>
        {(onlyMessage != null && onlyMessage.length > 0)
          ? (
            <Col span={24} className={className ?? 'text-center'}>
              <div className={`${styles['container-for-empty']}`}>
                {icon != null ? <div className={styles.emptyIcon}>{icon}</div> : imageUrl != null ? <NextImage alt={imageUrl} src={imageUrl} width={30} height={30} className={styles.emptyImage} /> : <FrownOutlined className={`${styles['empty-icon']}`} /> }
                <span className={`${styles['empty-message-text']}`}>{onlyMessage}</span>
              </div>
            </Col>)
          : (
            <>
              {(!search)
                ? <Col span={24} className={className ?? 'text-center'}>
                  <div className={`${styles['container-for-empty']}`}>
                    {icon != null ? <div className={styles.emptyIcon}>{icon}</div> : imageUrl != null ? <NextImage alt={imageUrl} src={imageUrl} width={30} height={30} className={styles.emptyImage} /> : <FrownOutlined className={`${styles['empty-icon']}`} /> }
                    {(onClickEmpty != null)
                      ? <span className={`${styles['empty-message-text']}`}>You’ve not added {entity},
                        <span role='presentation' className='theme-color cursor-pointer ml-1' onClick={onClickEmpty}>
                          click here
                        </span> to add </span>
                      : <span className={`${styles['empty-message-text']}`}> There is no <span className='theme-color'>{entity}</span> information added! </span>
                    }
                  </div>
                </Col>
                : <Col span={24} className={className ?? 'text-center'}>
                  <div className={`${styles['container-for-empty']}`}>
                    {icon != null ? <div className={styles.emptyIcon}>{icon}</div> : imageUrl != null ? <NextImage alt={imageUrl} src={imageUrl} width={30} height={30} className={styles.emptyImage} /> : <FrownOutlined className={`${styles['empty-icon']}`} /> }
                    <span className={`${styles['empty-message-text']}`}> No results were found matching <span className='theme-color'>`{search}`</span> </span>
                  </div>
                </Col>
              }
            </>)}
      </Row>
    </>
  )
}

export default EmptyContent