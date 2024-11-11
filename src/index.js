import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from "react-router-dom";

import './static/font/iconfont.css'
import router from './router';
import store from './store';           // redux 的根store
import { Provider } from 'react-redux';

const root = ReactDOM.createRoot(document.getElementById('root'));

// 严格模式（Strict Mode）,在开发模式下，React 的严格模式会故意使组件重新渲染两次

root.render(
  // <React.StrictMode>
  //   {/* <App /> */}
  //   <Provider store={store}>
  //     <RouterProvider router={router} />
  //   </Provider>
  // </React.StrictMode>
  
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
