import { SearchOutlined } from '@ant-design/icons';
import { type InputRef, type TableColumnType, Input } from 'antd';
import { FilterDropdownProps } from 'antd/es/table/interface';
import React, { useRef } from 'react'

interface DataType {
  [key: string]: string | number;
}

type DataIndex = keyof DataType;

const useSearchHook = () => {
    const searchInput = useRef<InputRef>(null);

    const handleSearch = (
      selectedKeys: string[],
      confirm: FilterDropdownProps['confirm'],
      dataIndex: DataIndex
    ) => {
      confirm();
    };
  
    const getColumnSearchProps = (dataIndex: DataIndex, extraObject?: DataIndex, searchName?: string): TableColumnType<DataType> => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            ref={searchInput}
            placeholder={`Search ${searchName || dataIndex}...`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            style={{ marginBottom: 8, display: 'block' }}
            addonAfter={<SearchOutlined className='primary-color' onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)} />}
          />
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined className={filtered ? 'primary-color' : 'text-dark'} />
      ),
      onFilter: (value: any, record: any) => {
        let result: string | number | undefined;
      
        if (extraObject && dataIndex) {
          result = record?.[extraObject]?.[dataIndex];
        } else {
          result = record?.[dataIndex];
        }
      
        if (result != null) {
          return result.toString().toLowerCase().includes((value as string).toLowerCase());
        }
      
        return false;
      },
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      }
            
        
  });
  return {getColumnSearch: (val: DataIndex, extraVal?: DataIndex, searchName?: string) => getColumnSearchProps(val, extraVal, searchName)}
}

export default useSearchHook