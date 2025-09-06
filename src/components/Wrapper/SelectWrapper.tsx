import type { SelectProps } from 'antd'
import { Select } from 'antd'
import React from 'react'

interface customSelectProps extends SelectProps {
  dummy?: string
}
interface CustomOptionProps {
  title?: string
  disabled?: boolean
  className?: string
  value: string | number | null
  children?: React.ReactNode
}

function SelectWrapper (props: customSelectProps): JSX.Element {
  const {children, ...restProps} = props
  return (
    <Select
      getPopupContainer={(triggerNode) => triggerNode.parentElement}
      optionLabelProp="label"
      optionFilterProp='label'
      showSearch
      allowClear
      placement="bottomRight"
      {...restProps}
    >
      {children}
    </Select>
  );
}

function Option (props: CustomOptionProps): JSX.Element {
  return (
    <Select.Option {...props}>
      {props.children}
    </Select.Option>
  )
}

SelectWrapper.Option = Option

export default SelectWrapper