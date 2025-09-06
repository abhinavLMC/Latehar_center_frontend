import { renderAllDetails } from '@utils/commonFunctions';
import { Row, Col } from 'antd';
import { startCase } from 'lodash';
import React from 'react'
import ViewFileLink from '../ViewDetailsModal/ViewFile';

const RenderDetailsComponent = ({ details, excludeItems }: any) => {
  const result = renderAllDetails(details, excludeItems);

  return (
    <div className="border rounded-2 p-3">
      {Object.entries(result).map(([key, value]) => {
        const displayValue = typeof value === "string" && value.startsWith("https") ? (
          <ViewFileLink fileUrl={value} />
        ) : (
          value
        );
        return (
          <Row className="mb-2" key={key}>
            <Col span={9}>{startCase(key)}</Col>
            <Col span={1}>:</Col>
            <Col span={14}>{displayValue}</Col>
          </Row>
        );
      })}
    </div>
  );
};

export default RenderDetailsComponent;