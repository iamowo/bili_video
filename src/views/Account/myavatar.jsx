import './scss/myavatar.scss'
import { Link } from 'react-router-dom'

function AccountAvatar () {
  const userinfo = JSON.parse(localStorage.getItem('userinfo'))
  const uid = userinfo.uid

  return (
    <div className="accountavatar-box">
      <div className="avatar-title">
        <span className="it-span"></span>
        <span className="tt-span">我的头像</span>
      </div>
      <div className="avatar-part">
        <div className="out1box">
          <Link to={`/${uid}/account/avatar/update`}>
            <div className="changeborderbox">更换头像</div>
          </Link>
          <img src={userinfo.avatar} alt="" className="inneravatar" />
        </div>
      </div>
    </div>
  )
}

export default AccountAvatar