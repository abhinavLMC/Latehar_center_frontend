// eslint-disable-next-line import/named
import { Modal, type ModalProps } from 'antd'
import React from 'react'

// interface heightRef {
//   clientHeight: number
// }

const ModalWrapper = (props: ModalProps): JSX.Element => {
  // const modalHeight = useRef<HTMLDivElement>(null)
  // const [height, setHeight] = useState<number>(0)

  // const clientHeight = (): void => {
  //   setHeight((modalHeight?.current as heightRef)?.clientHeight)
  // }

  return (
    <Modal {...props}>
      <div className={'modal-scrollbar-adjust'}>
        {props.children}
      </div>
    </Modal>
  )
}

export default ModalWrapper