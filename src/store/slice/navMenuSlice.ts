// import { getRequest } from '@api/preference/RequestService'
import sidenavData from '@constants/menuData.json'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface menuState {
  data: Array<{
    key: string
    path: string
    title: string
    icon: string
    breadcrumb: boolean
    notification: string
    pagemenu?: {
      key: string
      title: string
      path: string
      breadcrumb: boolean
    } | undefined
  }>
  loading: boolean
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function delay (ms: number) {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })
}

// First, create the thunk
export const fetchSideNav = createAsyncThunk(
  'menu/fetch-menu',
  // eslint-disable-next-line @typescript-eslint/require-await
  async () => {
    // const response = await getRequest('api/menu')
    // return response.data

    // wait a 2-second delay
    await delay(2000)
    return sidenavData as unknown as menuState['data']
  }
)

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const initialState = {
  data: [{
    key: '',
    path: '',
    title: '',
    icon: '',
    breadcrumb: false,
    notification: ''
  }],
  loading: true
}

// Then, handle actions in your reducers:
const sideNavMenu = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    // standard reducer logic, with auto-generated action types per reducer
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSideNav.pending, (state) => {
      // Add sidenav to the state array
      state.loading = true
    })
    builder.addCase(fetchSideNav.fulfilled, (state, action) => {
      state.data = action.payload
      state.loading = false
    })
    builder.addCase(fetchSideNav.rejected, (state) => {
      state.loading = false
      state.data = []
    })
  }
})

export default sideNavMenu.reducer