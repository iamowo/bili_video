import { useState } from 'react';
import './login.scss'
import { login, register } from '../../api/user';
import { useDispatch } from 'react-redux';
import { setuserinfo } from '../../store/modules/userStore'  // redux方法

function Login (props) {
  // console.log(props.login);
  const dispatch = useDispatch()
  const [flag1, setFlag1] = useState(0)

  const [inp11, setInp11] = useState('')
  const [inp12, setInp12] = useState('')

  const [inp21, setInp21] = useState('')
  const [inp22, setInp22] = useState('')
  const [inp23, setInp23] = useState('')
  const [inp24, setInp24] = useState('')

  const [inp31, setInp31] = useState('')
  const [inp32, setInp32] = useState('')
  const [inp33, setInp33] = useState('')
  const [useravatar, setUseravatar] = useState()   // 头像文件
  const [uavatar, setUavatar] = useState('')   // 头像url
  const tologin = async() => {
    const loginData = {
      account: inp11,
      password: inp12
    }    
    // 有了响应拦截器之后就不用写.data.data 了
    const res = await login(loginData)
    console.log('登录成功:', JSON.stringify(res));
    
    if (res) {
      // login success
      // dispatch(setuserinfo(res))
      localStorage.setItem('userinfo', JSON.stringify(res))
      localStorage.setItem('token', res.token)
      // props.closeLogin()
      setTimeout(() => {
      // window.location.reload()
        document.location.reload()
      }, 300)
    } else {
      // login failure
      console.log('failure');
    }
        
  }

  const kendonwtologin = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      tologin()
    }
    
  }
  const loginandregister = async () => {
    if (inp22 !== inp23) {
      alert('密码不一致')
      return
    }
    if (inp12 === "" && inp22 === "" && inp23 === "") {
      alert('请输入完整内容')
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
      alert("头像文件格式错误")
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
          <span className='icon iconfont' onClick={() => props.closeLogin()}>
            x
          </span>
        </div>
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