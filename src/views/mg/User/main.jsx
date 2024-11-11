import "./User.scss"
import { useEffect, useState } from "react"

function UserMain() {
  const [userinfo, setUserinfo] = useState(JSON.parse(localStorage.getItem('userinfo')))

  useEffect(() => {
    document.title = userinfo.name + '的个人空间'
  }, [])
  return (
    <div className="content-view">
      <div className="content-title-user">
        <span className="tt-span">账户信息</span>
      </div>
      <div className="user-infos-user">
        <div className="left-avatar">
          <img src={userinfo.avatar} alt="" className="user-avatar-user" />
        </div>
        <div className="right-infos">
          <div className="name-user-line">{userinfo.name}</div>
          <div className="name-others-line">uid: {userinfo.uid}</div>
        </div>
      </div>
    </div>
  )
}

export default UserMain