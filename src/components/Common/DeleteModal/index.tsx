import { postRequest } from '@api/preference/RequestService'
import { ButtonWrapper, ModalWrapper } from '@components/Wrapper'
import { type Dispatch, type ReactNode, type SetStateAction, useState } from 'react'

const DeleteModal = ({ children, toggleDeleteModal, setToggleDeleteModal, title, nextEndpoint, callBack, payload }: DeleteModalPropTypes): JSX.Element => {

  const [isLoading, setIsLoading] = useState(false)

  async function deleteStageApiCall (): Promise<void> {
    await postRequest(nextEndpoint, payload ?? null).then((resp) => {
      if ((resp as unknown as { data: { success: boolean } })?.data?.success) {
        setToggleDeleteModal(false)
        setIsLoading(false)
        void callBack()
      }
    })
  }

  const handleDeleteClick = (): void => {
    setIsLoading(true)
    void deleteStageApiCall()
  }

  return (
    <ModalWrapper
      centered
      open={toggleDeleteModal}
      title={title}
      onCancel={() => { setToggleDeleteModal(false) }}
      footer={(
        <div>
          <ButtonWrapper
            html-type="submit"
            type='primary'
            onClick={() => { handleDeleteClick() }}
            loading={isLoading}
          >
            {'Delete'}
          </ButtonWrapper>
          <ButtonWrapper
            className="modal-close-btn"
            onClick={() => { setToggleDeleteModal(false) }}
          >
            {'Cancel'}
          </ButtonWrapper>
        </div>
      )}
    >
      <div>
        {children}
      </div>
    </ModalWrapper>
  )
}

interface DeleteModalPropTypes {
  children: ReactNode
  toggleDeleteModal: boolean
  setToggleDeleteModal: Dispatch<SetStateAction<boolean>>
  title: string
  nextEndpoint: string
  callBack: () => Promise<void>
  payload?: Record<string, unknown>
}

export default DeleteModal