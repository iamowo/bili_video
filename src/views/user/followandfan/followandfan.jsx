import { useEffect, useState } from "react"
import "./index.scss"
import { Outlet, Link, useParams } from "react-router-dom"
import { getFollow, getFans } from "../../../api/user"


function FollowAndFan () {
  const params = useParams()
  const uid = params.uid  
  
  const [leftindexf, setLeftindexf] = useState(0)
  const [fans, setFans] = useState(0)
  const [follows, settFollows] = useState(0)

  const [userlist, setUserlist] = useState([])

  useEffect(() => {
    const getData = async () => {
      const res = await getFollow(uid)
      settFollows(res.length)
      
      const res2 = await getFans(uid)
      setFans(res2.length)
    }
    getData()
  },[])
  return (
    <div className="faf-view">
      <div className="fan-left">
      <Link to={`/${uid}/fans/follow`}>
          <div className={leftindexf === 0 ? "one-left-contentn olc-active" : "one-left-contentn"}
          data-index = {0}
          onClick={() => setLeftindexf(0)}>
            <span>关注</span>
            <span>{follows}</span>
          </div>
        </Link>
        <Link to={`/${uid}/fans/fan`}>
          <div className={leftindexf === 1 ? "one-left-contentn olc-active" : "one-left-contentn"}
            data-index = {1}
            onClick={() => setLeftindexf(1)}>
            <span>粉丝</span>
            <span>{fans}</span>
          </div>
        </Link>
      </div>
      <div className="fan-right">
        <Outlet />
      </div>
    </div>
  )
}

export default FollowAndFan