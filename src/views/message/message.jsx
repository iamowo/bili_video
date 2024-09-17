import './index.scss'
import Topnav from '../../components/Topnav/Topnav'
import { Link, Outlet } from 'react-router-dom'
import { useLocation } from "react-router-dom"
import { useEffect, useState } from 'react'
import { baseurl } from '../../api'

function Message () {
  const userinfo = JSON.parse(localStorage.getItem('userinfo'))
  const uid = userinfo.uid
  const locationpath = useLocation();
  const pathname = locationpath.pathname

  const [colorfalg, setColorfalg] = useState(() => {
    if (pathname.includes(`/${uid}/whisper`)) {
      // setColorfalg(0)
      return 0
    } else if (pathname === `/${uid}/replay`) {
      // setColorfalg(1)
      return 1
    } else if (pathname === `/${uid}/at`) {
      // setColorfalg(2)
      return 2
    } else if (pathname === `/${uid}/love`) {
      // setColorfalg(3)
      return 3
    } else if (pathname === `/${uid}/system`) {
      // setColorfalg(4)
      return 4
    } else if (pathname === `/${uid}/config`) {
      // setColorfalg(5)
      return 5
    }
  })

  const click1 = (e) => {    
    if (e.target.tagName === 'LI' || e.target.tagName === 'A') {
      const index = parseInt(e.target.dataset.index || e.target.parentNode.dataset.index)
      setColorfalg(index)
    }
  }

  const click2 = () => {
    setColorfalg(5)
  }

  useEffect(() => {
    document.title= '消息中心'
    document.body.style.background = `url(${baseurl}/sys/whisper_bg.jpg) top / cover no-repeat fixed`
  }, [])
  return (
    <div className="message-view-all">
      <Topnav />
      <div className="container">
        <div className="message-left">
          <div className="ml-title">
            <span className="icon iconfont" style={{color: '#333'}}>&#xe6a4;</span>
            <span className='tit'>消息中心</span>
          </div>
          <ul className="message-typr1" onClick={click1}>
            <Link data-index="0" to={`/${uid}/whisper`}> <li className={colorfalg === 0 ? 'activecolor' : ''} data-index="0">我的消息</li></Link>
            <Link data-index="1" to={`/${uid}/replay`}> <li className={colorfalg === 1 ? 'activecolor' : ''} data-index="1">回复我的</li></Link>
            <Link data-index="2" to={`/${uid}/at`}> <li className={colorfalg === 2 ? 'activecolor' : ''} data-index="2">@ 我的</li></Link>
            <Link data-index="3" to={`/${uid}/love`}> <li className={colorfalg === 3 ? 'activecolor' : ''} data-index="3">收到的赞</li></Link>
            <Link data-index="4" to={`/${uid}/system`}> <li className={colorfalg === 4 ? 'activecolor' : ''} data-index="4">系统通知</li></Link>
          </ul>
          <div className="br-div"></div>
          <div className={colorfalg === 5 ? 'activecolor system-control' : 'system-control'} onClick={click2}>
            <span className="icon iconfont">&#xe602;</span>
            <span><Link to={`/${uid}/config`}>消息设置</Link></span>
          </div>
        </div>
        <div className="message-right">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Message