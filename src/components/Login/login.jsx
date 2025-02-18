import { useEffect, useState, useRef } from 'react';
import './login.scss'
import { login, register, findAccount, generateQrCode } from '../../api/user';
import { useDispatch } from 'react-redux';
import { setuserinfo } from '../../store/modules/userStore'  // redux方法
import message from '../notice/notice';
import QRCode from "react-qr-code";

function Login (props) {
  // console.log(props.login);
  const dispatch = useDispatch()
  const [flag1, setFlag1] = useState(0)

  // 登录
  const [inp11, setInp11] = useState(''),
        [inp12, setInp12] = useState('')

  // 注册：账号信息
  const [inp21, setInp21] = useState(''),
        [inp22, setInp22] = useState(''),
        [inp23, setInp23] = useState('')

  // 注册： 基本信息
  const [inp31, setInp31] = useState(''),
        [inp32, setInp32] = useState(''),
        [inp33, setInp33] = useState(''),
        [useravatar, setUseravatar] = useState(),   // 头像文件
        [uavatar, setUavatar] = useState('')   // 头像url

  const [qrcodetext, setQrcodetext] = useState()

  useEffect(() => {
    const getData = async () => {      
      const res = await generateQrCode()
      setQrcodetext(res)
    }
    getData()
  },[])
  // 登录
  const tologin = async() => {
    const loginData = {
      account: inp11,
      password: inp12
    }    
    // 有了响应拦截器之后就不用写.data.data 了
    const res = await login(loginData)
    console.log(res);
    
    // console.log('登录成功:', JSON.stringify(res));
    if (res === 0) {
      message.open({ type: 'error', content: '没有此账号', flag: true})
    } else if (res === 1) {
      message.open({ type: 'error', content: '密码错误', flag: true})
    } else {
      // login success
      // dispatch(setuserinfo(res))
      localStorage.setItem('userinfo', JSON.stringify(res))
      localStorage.setItem('token', res.token)
      // props.closeLogin()
      setTimeout(() => {
      // window.location.reload()
        document.location.reload()
      }, 300)
    }   
  }

  // 回车登录 login
  const kendonwtologin = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      tologin()
    }
  }

  // 注册
  const loginandregister = async () => {
    if (inp21 === "" || inp22 === "" || inp23 === "") {
      message.open({ type: 'warning', content: '请填写完整信息'})
      return
    }
    if (inp22 !== inp23) {
      message.open({ type: 'warning', content: '密码不一致'})
      return
    }
    const res = await findAccount(inp21)
    // console.log('res======', res);
    if (res === 201) {
      message.open({ type: 'warning', content: '此账号已存在', flag: true})      
      return
    }
    setFlag1(2)
  }

  // 不填写个人信息
  const registerbtn1 = async () => {
    const data = new FormData()
    data.append('account', inp21)
    data.append('password', inp22)
    data.append('type', 0)
    const res = await register(data)
    
    if (res === 100) {
      console.log("registe success");
      const loginData = {
        account: inp21,
        password: inp23
      }  
      const res2 = await login(loginData)
      if (res2) {
        // login success
        // dispatch(setuserinfo(res))
        localStorage.setItem('userinfo', JSON.stringify(res2))
        localStorage.setItem('token', res2.token)
        // props.closeLogin()
        setTimeout(() => {
         // window.location.reload()
          document.location.reload()
        }, 300)
      }
    } else if (res === 101) {
      console.log('已经存在');
      
    }
  }

  // 注册时添加头像
  const addavatar = (e) => {
    const file = e.target.files[0]
    const filetype = file.type
    if (!filetype.includes('image/')) {
      console.log("请选择图片格式文件");
      return
    }
    setUavatar(URL.createObjectURL(file))
    setUseravatar(file)
    
  }

  // 填写个人信息
  const registerbtn2 = async () => {
    if (!useravatar.type.includes("image/")) {
      message.open({ type: 'error', content: '头像文件格式错误'})
      return
    }

    const data = new FormData()
    data.append('account', inp21)
    data.append('password', inp22)
    data.append('avatarfile', useravatar)
    data.append('name', inp31)
    data.append('intro', inp32)
    data.append('birthday', inp33)
    data.append('type', 1)
    data.append('filetype', useravatar.type.split("/")[1])
    const res = await register(data)

    if (res === 100) {
      console.log("registe success");
      const loginData = {
        account: inp21,
        password: inp23
      }  
      const res2 = await login(loginData)
      if (res2) {
        // login success
        // dispatch(setuserinfo(res))
        localStorage.setItem('userinfo', JSON.stringify(res2))
        localStorage.setItem('token', res2.token)
        // props.closeLogin()
        setTimeout(() => {
          // window.location.reload()
          document.location.reload()
        }, 300)
      }
    } else if (res === 101) {
      console.log('已经存在');
      
    }
  }
  return (
    <div className="login-page">
      <div className="center-box" style={{top: flag1 === 0 ? '50%': '-100%'}}>
        <div className="top-lin-close">
          <span className='icon iconfont' onClick={() => props.closeLogin()}>&#xe66a;</span>
        </div>
        <div className="logincontent">
          <div className="qrcodelogin">
            <div className="txtline">
              <span>扫码登录</span>
            </div>
            <div className='qrbox'>
              <QRCode
                value={qrcodetext || ''}
                size={160}
              />  
            </div>
          </div>
          <div className="accountlogin">
            <div className="title-line2">账号登录</div>
            <div className="loginboxx">
              <div className="top-loginbox">
                <span>账号</span>
                <input type="text" className="inp11" onChange={(e) => setInp11(e.target.value)} value={inp11}/>
              </div>
              <div className="bottom-loginbox">
              <span>密码</span>
              <input type="password" className="inp12" onChange={(e) => setInp12(e.target.value)} value={inp12} onKeyDown={kendonwtologin}/>
              </div>
            </div>
            <div className="btline-opation">
              <div className="left-register" onClick={() => setFlag1(1)}>注册</div>
              <div className="right-login" onClick={tologin}>登录</div>
            </div>
          </div>
        </div>
      </div>
      <div className="registerbox" style={{top: flag1 === 1 ? "50%" : "150%"}}>
        <div className="top-lin-close">
          <span className='icon iconfont' onClick={() => setFlag1(0)}>x</span>
        </div>
        <div className="title-line2">注册</div>
        <div className="loginboxx">
          <div className="top-loginbox">
            <span>账号</span>
            <input type="text" className="inp21" onChange={(e) => setInp21(e.target.value)} value={inp21}/>
          </div>
          <div className="top-loginbox">
            <span>密码</span>
            <input type="password" className="inp22" onChange={(e) => setInp22(e.target.value)} value={inp22}/>
          </div>
          <div className="bottom-loginbox">
            <span>确认密码</span>
            <input type="password" className="inp23" onChange={(e) => setInp23(e.target.value)} value={inp23}/>
          </div>   
        </div>
        <div className="btline-opation">
          <div className="right-login" onClick={loginandregister}>注册</div>
        </div>
      </div>
      <div className="registeringo-box" style={{top: flag1 === 2 ? "50%" : "150%"}}>
        <div className="top-lin-close">
          <span className='icons' onClick={registerbtn1}>
            跳过
          </span>
        </div>
        <div className="title-line2">基本信息</div>
        <div className="register-info-content">
          <div className="top-loginbox">
            <span>昵称</span>
            <input type="text" className="inp21" onChange={(e) => setInp31(e.target.value)} value={inp31}/>
          </div>
          <div className="top-loginbox">
            <span>简介</span>
            <input type="text" className="inp22" onChange={(e) => setInp32(e.target.value)} value={inp32}/>
          </div>
          <div className="top-loginbox">
            <span>生日</span>
            <input type="text" className="inp22" onChange={(e) => setInp33(e.target.value)} value={inp33}/>
          </div>  
        </div>
        <div className="avatar-box-reg">
          <div className="abr-text">头像</div>
          <div className="right-add-avatar">
            <span className='icon iconfont'>&#xe643;</span>
            {
              uavatar !== '' &&
              <img src={uavatar} alt="" className="avatar-add-img" />
            }
            <input type="file" className='navatar' accept='image/*' onChange={addavatar}/>
          </div>
        </div>
        <div className="btline-opation">
          <div className="right-login" onClick={registerbtn2}>登录</div>
        </div>
      </div>
    </div>
  )
}

export default Login