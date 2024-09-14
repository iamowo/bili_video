import axios from 'axios'
import { useNavigate } from "react-router-dom"

const baseUrl = 'http://127.0.0.1:8082'

const http = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
  headers: {}
})

// request拦截器
// 请求发送之前在对请求做一些处理
http.interceptors.request.use(
  config => {
    const userinfo = JSON.parse(localStorage.getItem('userinfo'))
    const token = userinfo != null && userinfo !== "" ? userinfo.token : null
    // console.log(config.url + "  " + token);
    // 如果不是登录，注册接口，要带上token    
    if ( token != null && token !== ""
      && config.url !== '/user/login'
      && config.url !== '/user/register'
      // && config.url !== '/user/register'
      // && config.url !== '/video/getAllVideo'
      // && config.url !== '/video/getRandom'
      // && !config.url.includes('/video/getByVid')
      // && !config.url.includes('/comment/getAllComment')
      // 这些后端去拦截
    ) { 
        config.headers.token = token
    }
    return config  // 返回这个配置对象，如果没有返回，这个请求就不会发送出去
  },
  error => {
    return Promise.reject(error)
  }
)



// response拦截器
http.interceptors.response.use(
  response => {    
    let code = response.data.code
    console.log('rsponse code', code);

    if (code === 200) {
      return response.data.data
    } else if (code === 401){
      console.log('token失效');
      // token 失效， 需要重新登录

    } else {
      return response.data
    }
  },
  error => {
    console.log('error...' + error.code);
    if (error.code === 'ERR_BAD_REQUEST') {
      // token 失效
      // 清除原来数据 和 token
      console.log("response error");
      
      // localStorage.removeItem('userinfo')
      // localStorage.removeItem('token')
      
      // window.location.href = "/"
    }
    return Promise.reject(error)
  }
)

export default http
