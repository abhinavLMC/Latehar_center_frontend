import EmailWrapper from '@components/Wrapper/EmailWrapper'
import FormItemWrapper from '@components/Wrapper/FormItemWrapper'
import URLInputWrapper from '@components/Wrapper/URLWrapper'
import { Button, Form } from 'antd'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from 'src/store'
import { decrement, increment } from 'src/store/slice/counterSlice'
// import { fetchToDo } from 'src/store/slice/userSlice'

const HomePage = (): JSX.Element => {
  const counter = useSelector((state: RootState) => state.counter)
  // const todos = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    // dispatch(fetchToDo())
  }, [dispatch])

  return (
    <div>
      <h2>{counter.count}</h2>
      <Form layout='vertical'>
        <FormItemWrapper name="url" label="URL: " rules={[
          {
            type: 'url',
            message: 'Enter a valid URL',
            whitespace: true
          }
        ]}>
          <URLInputWrapper />
        </FormItemWrapper>
        <FormItemWrapper name="email" label="Email: " rules={[
          {
            type: 'email',
            message: 'Enter a valid Email',
            whitespace: true
          }
        ]}>
          <EmailWrapper />
        </FormItemWrapper>
      </Form>

      <Button type='primary' onClick={() => dispatch(increment())}>Increment</Button>
      <Button type='primary' danger onClick={() => dispatch(decrement())}>Decrement</Button>
    </div>
  )
}

export default HomePage