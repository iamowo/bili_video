import axios from 'axios'


const baseUrl = 'http://127.0.0.1:8082'
const baseUrl2 = 'http://127.0.0.1:3000'

// const baseUrl = 'http://123.57.139.0:8082'
// const baseUrl2 = 'http://123.57.139.0:3000'

export const baseurl = baseUrl
export const baseurl2 = baseUrl2

const http = axios.create({
  baseURL: baseUrl,
  timeout: 15000,
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
      && config.url !== '/user/generateQrCode'
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
    if (code === 200) {
      return response.data.data
    }else {
      return response.data
    }
  },
  error => {
    if (error.response.status === 401) {
      console.log('==token失效==');
      localStorage.removeItem('userinfo')
      localStorage.removeItem('token')
      window.open(baseUrl2 + "/")
      document.location.reload()
    } else {
      console.log('其他错误');
    }
    return Promise.reject(error)
  }
)

export default http