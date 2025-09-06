import { createSlice } from '@reduxjs/toolkit'
// eslint-disable-next-line import/named

interface authState {
  userInfo: {
    role: string
    username: string
  }
  
}

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const initialState = {
  userInfo: {
    username: '',
    role: ''
  }
  
} as authState

// Then, handle actions in your reducers:
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.userInfo = action.payload
    },
  },
})

export const {login} = authSlice.actions 
export default authSlice.reducer