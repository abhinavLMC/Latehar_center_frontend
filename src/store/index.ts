import { type AnyAction, configureStore, type ThunkDispatch } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'

import counterSlice from './slice/counterSlice'
import menuSlice from './slice/navMenuSlice'
import userInfo from './slice/userSlice'
import themeSlice from './slice/themeSlice'

export const store = configureStore({
  reducer: {
    counter: counterSlice,
    userState: userInfo,
    menu: menuSlice,
    theme: themeSlice
  },
  middleware: [thunk]
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export type AppThunkDispatch = ThunkDispatch<RootState, unknown, AnyAction>