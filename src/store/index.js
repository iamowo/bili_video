// npm i @reduxjs/toolkit react-redux
import { configureStore } from "@reduxjs/toolkit";


// 导入子模块reducer
import userReducer from './modules/userStore'

const store = configureStore({
  reducer: {
    userinfo: userReducer
  }
})

export default store