import './index.scss'
import Topnav from '../../components/Topnav/Topnav'
import { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

function Account () {
  const userinfo = JSON.parse(localStorage.getItem('userinfo'))
  const uid = userinfo.uid

  const location = useLocation()
  console.log(location);
  
  const [leftindex, setLetindex] = useState(() => {
    if (location.pathname === `/${uid}/account/home`) return 0
    else if (location.pathname === `/${uid}/account/info`) return 1
    else return 2
  })

  useEffect(() => {
    document.body.style.backgroundColor= '#ffffff'
  },[])

  const clickthis = (e) => {
    const index = parseInt(e.target.dataset.index || e.target.parentNode.dataset.index)
    setLetindex(index)
  }
  return (
    <div className="account-out-box">
      <Topnav />
      <div className="aob-main">
        <div className="imgtopbox">
          <div className="img-l"></div>
          <div className="img-innerbox"
            style={{background: 'url(http://127.0.0.1:8082/sys/rl_top.png) repeat-x'}}
          ></div>
          <div className="img-l"></div>
        </div>
        <div className="account-main-box">
          <div className="amb-left">
            <div className="acc-top-title">个人中心</div>
            <Link to={`/${uid}/account/home`}>
              <div className={leftindex === 0 ? "acc-one-box acc-active" : "acc-one-box"}
                data-index={0}
                onClick={clickthis}>
                <div className="acc-left-icon iocn iconfont"></div>
                <span className="text-span" style={{letterSpacing: '15px'}}>首页</span>
              </div>
            </Link>
            <Link to={`/${uid}/account/info`}>
              <div className={leftindex === 1 ? "acc-one-box acc-active" : "acc-one-box"}
                data-index={1}
                onClick={clickthis}>
                <div className="acc-left-icon iocn iconfont"></div>
                <span className="text-span">个人信息</span>
              </div>
            </Link>
            <Link to={`/${uid}/account/avatar/set`}>
              <div className={leftindex === 2 ? "acc-one-box acc-active" : "acc-one-box"}
                data-index={2}
                onClick={clickthis}>
                <div className="acc-left-icon iocn iconfont"></div>
                <span className="text-span">我的头像</span>
              </div>
            </Link>
            <Link to={`/${uid}`}>
              <div className="acc-box2 icon iconfont">个人空间  &#xe775;</div>
            </Link>
          </div>
          <div className="amb-right">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account