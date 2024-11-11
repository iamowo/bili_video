// npm i @reduxjs/toolkit react-redux

import { configureStore } from "@reduxjs/toolkit";


// 导入子模块reducer
import userReducer from './modules/userStore'
import countSlice from './modules/countStore'

const store = configureStore({
  reducer: {
    countStore: countSlice,
    userStore: userReducer
  }
})

export default store