import { createSlice } from "@reduxjs/toolkit";

const countSlice =  createSlice({
  name: 'counter',
  initialState: {
    v: 0
  },
  reducers: {
    addOne: state => {
      state.v += 1
    },
    subOne: state => {
      state.v -= 1
    },
    addSome: (state, action) => {
      state.v += action.payload
    }
  }
})

export const addLater = (num) => (dispatch) =>{
  setTimeout(() => {
    dispatch(addSome(num))
  }, 1000)
}
// 每个 case reducer 函数会生成对应的 Action creators
export const { addOne, subOne, addSome } = countSlice.actions
export default countSlice.reducer