import { Outlet, Link, useParams, useLocation } from "react-router-dom"
import "./User.scss"
import Mgtopnav from "../../../components/mgTop/Topnav"
import { useState } from "react"

function Usermg() {
  const location = useLocation()
  const params = useParams()
  const userinfo = JSON.parse(localStorage.getItem('userinfo')),
        uid = userinfo?.uid
  const [leftindex, setLeftindex] = useState(() =>{
    if (location.pathname.includes("/userspace/favorite")) {
      return 1
    } else if (location.pathname.includes("/userspace/history")) {
      return 2
    } else {
      return 0
    }
  })
  return (
    <div>
      <Mgtopnav />
      <div className="user-view">
        <div className="user-content">
          <div className="left-user-select">
            <Link to={`/userspace/${uid}`}
              onClick={() => setLeftindex(0)}
            >
              <div className={leftindex === 0  ? "left-one left-one-active" : "left-one"}>账户信息</div>            
            </Link>
            <Link to={`/userspace/${uid}/favorite`}
              onClick={() => setLeftindex(1)}
            >
              <div className={leftindex === 1  ? "left-one left-one-active" : "left-one"}>我的收藏</div>            
            </Link>
            <Link to={`/userspace/${uid}/history`}
              onClick={() => setLeftindex(2)}
            >
              <div className={leftindex === 2  ? "left-one left-one-active" : "left-one"}>阅读历史</div>            
            </Link>
          </div>
          <div className="rigth-conetn">
            <Outlet
              context={{uid: uid}}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Usermg