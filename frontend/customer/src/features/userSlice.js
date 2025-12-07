import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    id:"",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    type: "",
}

export const userSlice = createSlice({
  name: 'user_info',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.id = action.payload.id
      state.first_name = action.payload.first_name
      state.last_name = action.payload.last_name
      state.email = action.payload.email
      state.phone_number = action.payload.phone_number
      state.type= action.payload.type

    },
    unsetUserInfo: (state, action) => {
      state.id = action.payload.id
      state.first_name = action.payload.first_name
      state.last_name = action.payload.last_name
      state.email = action.payload.email
      state.phone_number = action.payload.phone_number
      state.type= action.payload.type
    },
  }
})

export const { setUserInfo, unsetUserInfo } = userSlice.actions

export default userSlice.reducer