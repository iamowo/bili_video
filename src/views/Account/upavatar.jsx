import { useState } from 'react'
import { Link } from 'react-router-dom'
import './scss/upavatar.scss'

function Upavatar () {
  const userinfo = JSON.parse(localStorage.getItem('userinfo'))
  const uid = userinfo.uid
  const [myavatar, setAvatar] = useState(() => userinfo.avatar)
  const [mfile, setMfile] = useState(null)
  const changavatar = (e) => {
    const file = e.target.files[0]
    setMfile(file)
  }

  return (
    <div className="upavatar-part1">
      <div className="top-cahnge-tiele">
        <Link to={`/${uid}/account/avatar/set`}>我的头像</Link>
        <span className="icon iconfont">&#xe775;</span>
         更换头像
      </div>
      <div className="chang-avatar-box">
        <div className="avatar-left-out">
          <img src={myavatar} alt="" className="let-now-avatrar"/>
          {
            mfile === null ?
            <span className="lna-sp">当前头像</span>
            :
            <span className="lna-sp">预览头像</span>
          }
        </div>
        <span className="sp-line-sp1"></span>
        <div className="avat-tbox">
        {
          mfile === null ?
          <div className="chang-text-box">
            <span>更换头像</span>
          <input type="file" className="changeava" 
            onChange={changavatar} accept='image/*'
          />
          </div>
          :
          <div className="out-11-box">
            <div className="chang-sp-box1">
              <div className="chap">

              </div>
            </div>
            <span className="ps-title-s icon iconfont">&#xe614; 重新选择
            <input type="file" className="changeava" 
              onChange={changavatar} accept='image/*'
            />
            </span>
          </div>
          
        }
        </div>
      </div>
      <div className="update-queding-btn">更新</div>
    </div>
  )
}

export default Upavatar