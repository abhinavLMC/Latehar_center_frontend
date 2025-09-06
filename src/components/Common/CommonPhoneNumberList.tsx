import { Form, Select } from 'antd'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

interface propTypes {
  name?: string | []
  width?: number
}

const staticNumberArr = [
  {
    label: '+91',
    value: 91,
    image: 'https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/ID.svg'
  },
  {
    label: '+92',
    value: 92,
    image: 'https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/AC.svg'
  },
  {
    label: '+93',
    value: 93,
    image: 'https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/SCOTLAND.svg'
  },
  {
    label: '+94',
    value: 94,
    image: 'https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/WALES.svg'
  },
  {
    label: '+95',
    value: 95,
    image: 'https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/ID.svg'
  }
]

interface dataType {
  label: string
  value: number
  image?: string
}

const CommonPhoneNumberList = ({ name, width }: propTypes): JSX.Element => {
  const [numberArr, setNumberArr] = useState<dataType[]>([])

  useEffect(() => {
    setNumberArr(staticNumberArr)
  })

  return (
    <Form.Item name={name ?? 'prefix'} noStyle>
      <Select style={{ width: width ?? 70 }}>
        {
          numberArr.map((item) => (
            item.image != null
              ? <Select.Option value={item.value} key={item.value}>
                <Image src={item.image} height={20} width={20} alt={item.label} /> {item.label}
              </Select.Option>
              : <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
          ))
        }
        <Select.Option value="86">+86</Select.Option>
        <Select.Option value="87">+87</Select.Option>
      </Select>
    </Form.Item>
  )
}

export default CommonPhoneNumberList