import { ButtonWrapper } from '@components/Wrapper';
import React from 'react'

interface propTypes {
  loading: boolean;
  children?: React.ReactNode;
}

const SubmitButton = ({ loading=false, children, ...restProps }: propTypes) => {
  return (
    <ButtonWrapper loading={loading} htmlType="submit" type="primary" {...restProps}>
      {children || "Save"}
    </ButtonWrapper>
  );
};

export default SubmitButton

