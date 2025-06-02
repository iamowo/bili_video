import { useEffect, useState } from "react"
import "../../scss/UserSpace/fff.scss"
import { Outlet, Link, useLocation, useOutletContext } from "react-router-dom"
import { getFollow, getFans } from "../../../../api/user"


function FollowAndFan () {
  const context = useOutletContext(),
        hisuid = context.hisuid,
        isme = context.isme

  const location = useLocation()
  
  const [leftindexf, setLeftindexf] = useState(() => {
    if (location.pathname.includes("/fans/follow")) {
      console.log('0000');
      
      return 0
    } else if (location.pathname.includes("/fans/fan")) {
      console.log('11111');
      
      return 1
    }
  })
  const [fans, setFans] = useState(0)             // 粉丝数
  const [follows, settFollows] = useState(0)      // 关注数
  const [userlist, setUserlist] = useState([])    // 粉丝 or 关注 的用户列表

  useEffect(() => {    
    const getData = async () => {
      const res = await Promise.all([getFollow(hisuid, 0, 0, ""), getFans(hisuid, 0, 0, "")]) 
      settFollows(res[0].len)      
      setFans(res[1].len)
    }
    getData()
  },[])

  // 这样才能被监听到 // Outlet 原因
  useEffect(() => {
    setLeftindexf(() => {
      if (location.pathname.includes("/fans/follow")) {
        return 0
      } else if (location.pathname.includes("/fans/fan")) {        
        return 1
      }
    })
  },[location.pathname])
  return (
    <div className="faf-view">
      <div className="fan-left">
      <Link to={`/${hisuid}/fans/follow`}>
          <div className={leftindexf === 0 ? "one-left-contentn olc-active" : "one-left-contentn"}
          data-index = {0}
          onClick={() => setLeftindexf(0)}>
            <span>关注</span>
            <span>{follows}</span>
          </div>
        </Link>
        <Link to={`/${hisuid}/fans/fan`}>
          <div className={leftindexf === 1 ? "one-left-contentn olc-active" : "one-left-contentn"}
            data-index = {1}
            onClick={() => setLeftindexf(1)}>
            <span>粉丝</span>
            <span>{fans}</span>
          </div>
        </Link>
      </div>
      <div className="fan-right">
        <Outlet
          context={{"hisuid": hisuid,
                    "isme": isme
                  }}
        />
      </div>
    </div>
  )
}

export default FollowAndFan