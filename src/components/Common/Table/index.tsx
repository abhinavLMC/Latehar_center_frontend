import EmptyContent, { type EmptyContentPropsTypes } from '@components/common/Empty/EmptyContent'
import { TableContentLoaderWithProps } from '@components/common/SkeletonLoader/ContentLoader'
import TableWrapper, { type CustomTableProps } from '@components/Wrapper/TableWrapper'
import { type AnyObject } from 'antd/es/_util/type'
import type { TablePaginationConfig } from 'antd/es/table'
import React from 'react'

interface propTypes<RecordType> extends CustomTableProps<RecordType>, EmptyContentPropsTypes {
  loading: boolean
  columnWidth: number[]
  rowHeight?: number
  rowCounts?: number
  commonPagination?: {
    current: number
    total: number
    pageSize: number
  }
}

function CommonTable<T extends AnyObject> ({ loading, dataSource, commonPagination, columnWidth, rowCounts, rowHeight, entity, search, onlyMessage, imageUrl, onClickEmpty, ...props }: propTypes<T>): JSX.Element {
  // console.log(pagination)

  const notFoundContent = {
    emptyText: (
      (loading)
        ? <TableContentLoaderWithProps {...{ columnWidth, rowCounts, rowHeight }} />
        : <div className="mt-3 mb-4 m-auto">
          <EmptyContent {...{ onClickEmpty, entity, search, onlyMessage, imageUrl }} />
        </div>
    )
  }

  // const pageSizerMenu = (
  //   <Menu className="page-number-menu"
  //     selectedKeys={[String(commonPagination?.pageSize)]}
  //     // onClick={onPageSizeChange}
  //     items={[10, 20, 50, 100, 200].map(item => ({
  //       label: item,
  //       key: item,
  //       disabled: (commonPagination?.pageSize === item)
  //     }))
  //     }
  //   />
  // )

  // function pageSizer (total: number, range: [number, number]): JSX.Element {
  //   return (
  //     <div>
  //       <span> Showing {range[0]} - </span>
  //       <DropdownWrapper className="mr-7">
  //         <span className="fw-bold text-secondary cursor-pointer">
  //           {range[1]}
  //           <CaretDownFilled />
  //         </span>
  //       </DropdownWrapper>
  //       of {total} results {Boolean(search) && `with ${search}`}
  //     </div>
  //   )
  // }
  const pageSizer = (total: number, range: [number, number]): React.ReactNode => {
    return (
      <div>
        <span> Showing {range[0]} - {range[1]} </span>
        of {total} results {Boolean(search) && `with ${search}`}
      </div>
    )
  }

  const paginationProps: false | TablePaginationConfig | undefined = Boolean(commonPagination) && {
    position: ['bottomCenter'],
    current: commonPagination?.current,
    total: commonPagination?.total,
    pageSize: commonPagination?.pageSize,
    showTotal: pageSizer,
    showSizeChanger: false
  }

  return (
    <TableWrapper
      dataSource={loading ? [] : dataSource}
      locale={notFoundContent}
      pagination={paginationProps}
      {...props}
    />
  )
}

export default CommonTable