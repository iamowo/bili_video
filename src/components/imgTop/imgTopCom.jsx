import { memo } from 'react'
import './index.scss'
import { Link } from 'react-router-dom'

const ImgTop = memo(() => {
  const userinfo = JSON.parse(localStorage.getItem('userinfo')),
        uid = userinfo.uid
        
  return (
    <div className="imgTopbox">
      <div className="topleft">
        <div className="box1">
          <Link to={'/'}>
            <div className="iconfont">&#xe63d;</div>          
          </Link>
        </div>
        <div className="box1">
          <sapn className="txt">发现</sapn>
        </div>
        <div className="box1">
          <sapn className="txt">分类</sapn>
        </div>
        <div className="box1">
          <sapn className="txt">关注</sapn>
        </div>
      </div>
      <div className="topmid">
        <div className="searchbox-out"></div>
      </div>
      <div className="topright">
        <div className="box1">
          <div className="outb">
            <sapn className="iconfont">&#xe63e;</sapn>
          </div>
        </div>
        <div className="box1">
          <div className="outb">
            <sapn className="iconfont">&#xe63f;</sapn>
          </div>
        </div>
        <div className="box2">
          <div className="outb">
            <div className="roundbox">
              <img src={userinfo.avatar} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default ImgTop