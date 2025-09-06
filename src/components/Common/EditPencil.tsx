import { EditOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import React, { MouseEvent, PropsWithChildren } from "react";

interface PropTypes {
  children?: React.ReactNode;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

const EditPencil = ({children, ...restProps}: PropTypes) => {
  return (
    <div className="cursor-pointer" {...restProps}>
      <Tooltip title="Edit">{children ? children : <EditOutlined />}</Tooltip>
    </div>
  );
};

export default EditPencil;
