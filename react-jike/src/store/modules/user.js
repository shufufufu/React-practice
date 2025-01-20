import { createSlice } from "@reduxjs/toolkit";
import { request } from "@/utils/request";
import{setToken,getToken} from "@/utils"
const userStore = createSlice({
  name: "user",
  initialState: {
    user: getToken() ||'',
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload
      setToken(action.payload)
    }, 
  }
})

const { setUser } = userStore.actions

const userReducer = userStore.reducer

const fetchLogin = (loginForm) => {
  return async (dispatch) => {
    const res = await request.post("/authorizations", loginForm)
    dispatch(setUser(res.data.token))
  }
}

export { setUser , fetchLogin}

export default userReducer