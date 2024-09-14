import { useEffect, useState } from 'react'
import './index.scss'
import { Link, Outlet, useParams } from 'react-router-dom'

function Upload () {
  const userinfo = JSON.parse(localStorage.getItem('userinfo'))
  const params = useParams()
  const uid = params.uid;
  const [moreflag, setMflag] = useState(false)

  const [leftindex, setLeftindex] = useState(0)
  useEffect(() => {
    document.title = '创作中心'
  })
  return (
    <div className="upload-allpage">
      <div className="ap-top-nav">
        <div className="contnetnbox">
          <span className="up-icon">创作中心</span>
          <Link to="/">
            <span className="icon iconfont">&#xe62f; 首页</span>
          </Link>
        </div>
        <div className="contnetnbox">
          <img src={userinfo.avatar} alt="" className="up-avatar" />
          <div className="br-span-line"></div>
          <Link to={`/${uid}/whisper`}>
            <span className="icon iconfont">信件</span>          
          </Link>
        </div>
      </div>
      <div className="ap-bottom-contnet">
        <div className="ua-left">
          <Link to={`/${uid}/platform/upload/video`}  onClick={() => setLeftindex(0)}>
            <div className="upload-btn">
              <span className="icon iconfont">投稿</span>
            </div>
          </Link>
          {
            userinfo.permissions >= 1 &&
              <Link to={`/${uid}/platform/upvideo2`}  onClick={() => setLeftindex(0)}>
              <div className="upload-btn">
                <span className="icon iconfont">上传</span>
              </div>
            </Link>
          }
          <Link to={`/${uid}/platform/home`} onClick={() => setLeftindex(1)}>
            <div className="one-opation-u">
              <div className="ll-a">
                <span className={ leftindex === 1 ? "icon iconfont iconactive" :"icon iconfont"}>&#xe64e; <span>首页</span></span></div>
            </div>
          </Link>
          <div className="out-box" style={{height: moreflag ? '122px' : '46px'}}>
            <div className="one-opation-u" onClick={() => setMflag(!moreflag)} >
              <div className="ll-a">
                <span className="icon iconfont">&#xe605;</span>
                内容管理
              </div>
              <div className="icon iconfont rotateicon" style={{rotate: '0deg', fontSize: '14px'}}>&#xe775;</div>
            </div>
            <Link to={`/${uid}/platform/manager/video`} onClick={() => setLeftindex(2)}>
              <div className={ leftindex === 2 ? "moere-up-box moere-up-box-active" :"moere-up-box"}>视频稿件</div>
            </Link>
            <div className="moere-up-box">漫画稿件</div>
          </div>
        </div>
        <div className="ua-rightcontent">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Upload