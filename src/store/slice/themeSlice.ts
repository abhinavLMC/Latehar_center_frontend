import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { ActionType } from '@utils/allTypes';
import type { ThemeConfig } from 'antd';

// Define the initial state using that type
const initialState: ThemeConfig = {
    token: {
        fontSize: 16,
        colorPrimary: '#1677ff',
        // colorLink: 'red'
        // colorTextBase: '#eee'
        // borderRadius: 20
      },
}

export const themeSlice = createSlice({
  name: 'counter',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    color: (state, action: PayloadAction<string>) => {
      if (state.token != null) {
         state.token.colorPrimary = action.payload
      }
    },
  }
})

export const { color } = themeSlice.actions

export default themeSlice.reducer