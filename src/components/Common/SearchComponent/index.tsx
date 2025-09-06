import { SearchOutlined } from '@ant-design/icons'
import { FormItemWrapper, InputWrapper } from '@components/Wrapper'
import { debounce } from 'lodash'
import React, { useCallback } from 'react'
import useDevice from 'src/hook/useDevice'

interface PropTypes {
  setSearch?: (param: string) => void;
  placeholder?: string
}

const SearchComponent = ({ setSearch, placeholder }: PropTypes): JSX.Element => {

  const { componentSize } = useDevice()
  // debounce setState value for search api call
  const onSearch = useCallback(debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target?.value?.trim()
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    setSearch && setSearch(value)
  }, 800), []) as React.ChangeEventHandler<HTMLInputElement>

  return (
    <FormItemWrapper rules={[{ min: 3 }]} className="me-md-2 mb-0">
      <InputWrapper
        prefix={<SearchOutlined />}
        placeholder={placeholder || "Search..."}
        size={componentSize}
        onChange={onSearch}
        allowClear
      />
    </FormItemWrapper>
  );
}

export default SearchComponent