import { createSlice } from '@reduxjs/toolkit'
export const userSlice = createSlice({
  name: 'user',
  initialState: {
    accessToken: '',
    refreshToken: '',
  },
  reducers: {
    signIn: (state, action) => {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
    },
  },
})

export const { signIn } = userSlice.actions
export default userSlice.reducer
