import { useEffect, useState } from "react"
import '../scss/userspace.scss'
import ImgTop from "../../../components/imgTop/imgTopCom"
import { Outlet, Link } from "react-router-dom"

const ImgUserSpace = () => {
  const [list, setList] = useState([])
  const userinfo = JSON.parse(localStorage.getItem('userinfo')),
        uid = userinfo.uid

  useEffect(() => {
    document.title =   userinfo.name + '的主页'
  }, [])
  
  return (
    <div className="userView">
      <ImgTop />
      <div className="outcontent">
        <div className="content-wrap">
          <div className="userinfo">
            <div className="userleft">
              <div className="line1">
                <div className="imgbox">
                  <img src={userinfo.avatar} alt="" className="useravatar" />
                </div>
                <div className="info1">
                  <div className="nameline">{userinfo.name}</div>
                  <div className="infoline">
                    <span className="sp">0 粉丝</span>
                    <span className="sp">.</span>
                    <span className="sp">0 关注</span>
                  </div>
                </div>
              </div>
              <div className="line2">
                <div className="editorbox">编辑个人信息</div>
              </div>
            </div>
            <div className="userright">
              <div className="randomimgs"></div>
            </div>
          </div>
          <div className="imgboarder">
            <div className="titleline">
              <div className="titleleft">
                <div className="lbox1">
                  <Link to={`/userimg/${uid}`}>收藏夹</Link>
                </div>
                <div className="lbox1">
                  <Link to='collects'>采集</Link>
                </div>
              </div>
              <div className="titleright">
                <div className="rbox1">
                  <span>拖拽排序</span>
                  <span className="iconfont">↓</span>
                </div>
                <div className="rbox1">
                  <span>标准模式</span>
                  <span className="iconfont">↓</span>
                </div>
                <div className="rbox2">
                  <span className="iconfont">↓</span>
                  搜索
                </div>
              </div>
            </div>
            <div className="imgcontent">
              <Outlet
                context={{
                  'uid': uid, 
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImgUserSpace