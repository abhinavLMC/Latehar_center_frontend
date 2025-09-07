import { MenuOutlined, SearchOutlined } from '@ant-design/icons';
import { TableContentLoaderWithProps } from '@components/Common/SkeletonLoader/ContentLoader';
import ViewDetailsModal from '@components/Common/ViewDetailsModal';
import DynamicPageLayout from '@components/DynamicPageLayout';
import { CardWrapper, DropdownWrapper, TableWrapper } from '@components/Wrapper';
import { WORKFORCE_MANAGEMENT, EMPTY_PLACEHOLDER, pageNameArray } from '@constants/AppConstant';
import { TableProps, Button, Dropdown, Input, message } from 'antd';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { useGetRequestHandler } from 'src/hook/requestHandler';
import useDevice from 'src/hook/useDevice';
import usePermission from 'src/hook/usePermission';
import { fetchCenterId } from '@utils/centerIdHandler';



interface DataType {
  blood_group: string;
  external_id: string;
  abhaNumber: string;
  contactNumber: string;
  dateOfBirthOrAge: string;
  driverId: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  gender: string;
  healthCardNumber: string;
  id: string;
  idProof: string;
  idProof_doc: string;
  idProof_number: string;
  localAddress: string;
  localAddressDistrict: string;
  localAddressState: string;
  name: string;
  photographOfDriver: string;
}

const CenterUser = () => {
  const { tableScroll } = useDevice();
  const { canEdit, canCreate } = usePermission(pageNameArray[1]);

  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchColumn, setSearchColumn] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>('');

  // 🔹 Modified function to include center_id in payload
  const getTableData = async (searchParams?: Record<string, string>) => {
    setLoading(true);
    try {
      // 🔹 Fetch center ID
      const centerId = await fetchCenterId();
      
      // 🔹 Create payload with center_id
      const payload = {
        ...searchParams, // Include any search parameters
        center_id: centerId, // Add center_id to payload
      };

      const response = await fetch('api/searchWorkforce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), // Send the payload with center_id
      });
      
      const result = await response.json();
      
      if (result.status) {
        // 🔹 Handle the new response structure with searchInfo
        if (result.data.drivers) {
          setData(result.data.drivers);
          // Optional: Log search info for debugging
          console.log('Search Info:', result.data.searchInfo);
        } else {
          // Fallback for old response structure
          setData(result.data);
        }
        
        if (!searchParams) {
          message.success('Fetched latest records.');
        }
      } else {
        setData([]);
        message.warning(result.message || 'No records found.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch latest records when the page loads
  useEffect(() => {
    getTableData(); // ✅ This will now include center_id
  }, []); 

  const handleSearch = (dataIndex: string, value: string) => {
    setSearchColumn(dataIndex);
    setSearchText(value);
    // 🔹 Pass search parameters with center_id
    getTableData({ [dataIndex]: value });
  };

  const resetSearch = () => {
    setSearchColumn(null);
    setSearchText('');
    // 🔹 Reset will also include center_id
    getTableData();
  };
  const getItem = (obj: DataType) => {
    return {
      items: [
        canEdit
          ? {
              key: "edit",
              label: "Edit",
              onClick: () =>
                Router.push(
                  `${WORKFORCE_MANAGEMENT}/update-workforce-${obj.id}`
                ),
            }
          : null,
        {
          key: "view",
          label: (
            <ViewDetailsModal
              label="View Details"
              // title="Admin User"
              viewData={{
                "LMC ID": obj?.external_id || EMPTY_PLACEHOLDER,
                Name: obj?.name || EMPTY_PLACEHOLDER,
                "Abha Number": obj?.abhaNumber || EMPTY_PLACEHOLDER,
                "Contact Number": obj?.contactNumber || EMPTY_PLACEHOLDER,
                "Date Of Birth": obj?.dateOfBirthOrAge || EMPTY_PLACEHOLDER,
                "Attachment Of Patient":
                  obj?.photographOfDriver || EMPTY_PLACEHOLDER,
                "Emergency Contact Name":
                  obj?.emergencyContactName || EMPTY_PLACEHOLDER,
                "Emergency Contact No.":
                  obj?.emergencyContactNumber || EMPTY_PLACEHOLDER,
                Gender: obj?.gender || EMPTY_PLACEHOLDER,
                "Health Card Number":
                  obj?.healthCardNumber || EMPTY_PLACEHOLDER,
                "Blood Group": obj?.blood_group || EMPTY_PLACEHOLDER,
                "ID Proof": obj?.idProof || EMPTY_PLACEHOLDER,
                "ID Proof Number": obj?.idProof_number || EMPTY_PLACEHOLDER,
                "Attachment Of ID": obj?.idProof_doc || EMPTY_PLACEHOLDER,
                "Local Address": obj?.localAddress || EMPTY_PLACEHOLDER,
                "Local Address District":
                  obj?.localAddressDistrict || EMPTY_PLACEHOLDER,
                "Local Address State":
                  obj?.localAddressState || EMPTY_PLACEHOLDER,
              }}
            />
          ),
        },
        {
          key: "family-historu",
          label: "Family History",
          onClick: () =>
            Router.push(
              `${WORKFORCE_MANAGEMENT}/update-workforce-${obj.id}/family-history`
            ),
        },
        {
          key: "personal-history",
          label: "Personal History",
          onClick: () =>
            Router.push(
              `${WORKFORCE_MANAGEMENT}/update-workforce-${obj.id}/personal-history`
            ),
        },
      ],
    };
  };

  const renderSearchColumn = (dataIndex: string, title: string) => {
    const isSearchActive = searchColumn === dataIndex;
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{title}</span>
        <SearchOutlined
          style={{ cursor: 'pointer', marginLeft: 8 }}
          onClick={() => setSearchColumn(isSearchActive ? null : dataIndex)}
        />
        {isSearchActive && (
          <Input.Search
            placeholder={`Search ${title}`}
            style={{ marginLeft: 8, width: 200, transition: 'all 0.3s' }}
            onSearch={(value) => handleSearch(dataIndex, value)}
            enterButton
          />
        )}
      </div>
    );
  };

  const columns: TableProps<DataType>['columns'] = [
    {
      title: renderSearchColumn('external_id', 'LMC ID'),
      dataIndex: 'external_id',
      key: 'external_id',
    },
    {
      title: renderSearchColumn('name', 'Name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: renderSearchColumn('healthCardNumber', 'Health Card'),
      dataIndex: 'healthCardNumber',
      key: 'healthCardNumber',
    },
    {
      title: renderSearchColumn('abhaNumber', 'Abha Number'),
      dataIndex: 'abhaNumber',
      key: 'abhaNumber',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <DropdownWrapper menu={getItem(record)}>
          <MenuOutlined />
        </DropdownWrapper>
      ),
    },
  ];

  const ButtonComp = canCreate && (
    <Button
      type="primary"
      size="large"
      onClick={() => Router.push('/workforce-management/add-workforce')}
    >
      Add Patient
    </Button>
  );

  return (
    <CardWrapper>
      <DynamicPageLayout
        ActionComp={ButtonComp}
        MainComp={
          <>
            {loading ? (
              <TableContentLoaderWithProps
                rowHeight={70}
                columnWidth={[10, '2', 20, '2', 15, '2', 15, '2', 15, '2', 12]}
              />
            ) : (
              <TableWrapper
                className="mt-3"
                columns={columns}
                dataSource={data}
                scroll={tableScroll}
                rowKey={(record) => record.id || record.external_id}
              />
            )}
          </>
        }
      />
    </CardWrapper>
  );
};

export default CenterUser;
