import { EMPTY_PLACEHOLDER } from '@constants/AppConstant'
import { Table, type TableProps } from 'antd'
import type { AnyObject } from 'antd/es/_util/type'
import React from 'react'

// type AnyObject = Record<string, unknown>

export interface CustomTableProps<T> extends TableProps<T> {
  size?: 'large' | 'middle' | 'small'
}

const TableWrapper = <T extends AnyObject>(props: CustomTableProps<T>): JSX.Element => {
  const { columns, ...resProps } = props

  const lastIndex = ((columns || []).length - 1);
  const tableColumns = columns?.map((item, index) => {
    return {
      render: (text: string) => text || EMPTY_PLACEHOLDER,
      ...item,
      width: index === lastIndex ? '10%' : item?.width || `20%`,
      ellipsis: item.ellipsis ?? true,
    };
  })
  return <Table<T> {...resProps} columns={tableColumns} className={`common-table-height table-pagination-position ${props.className}`} />
}

export default TableWrapper