import { ButtonWrapper } from '@components/Wrapper';
import Router from 'next/router';
import React from 'react'

interface propTypes {
  backUrl: string;
  children?: React.ReactNode
}
const CancelButton = ({ backUrl, children }: propTypes) => {
  return (
    <ButtonWrapper onClick={() => Router.push(backUrl)}>
      {children || "Cancel"}
    </ButtonWrapper>
  );
};

export default CancelButton