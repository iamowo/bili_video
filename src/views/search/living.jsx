import { useState } from 'react'
import './scss/living.scss'
import { Outlet, Link, useParams, useLocation } from 'react-router-dom'

function LivingS () {
  const location = useLocation()

  const [liveindex, setLiveindex] = useState(() => {
    if (location.pathname.includes('/lives/liver/')) {
      return 1
    } else if (location.pathname.includes('/lives/liveroom')) {
      return 2
    } else {
      return 0
    }
  })
  const params = useParams()
  const keyword = params.keyword
  const uid = params.uid != null ? params.uid : null

  const clicktolivetype = (e) => {
    const index = parseInt(e.target.dataset.index)
    setLiveindex(index)
  }
  return (
    <div className="livingspage">
      <div className="res-sort">
          <div className="sort-line">
            <div className="srot-part">
              <Link to={`lives/${keyword}/${uid}`}>
                <div className={liveindex === 0 ? "sort1 sort-active" : "sort1"} data-index={0} onClick={clicktolivetype}>全部</div>
              </Link>
              <Link to={`lives/liver/${keyword}/${uid}`}>
                <div className={liveindex === 1 ? "sort1 sort-active" : "sort1"} data-index={1} onClick={clicktolivetype}>主播</div>
              </Link>
              <Link to={`lives/liveroom/${keyword}/${uid}`}>
                <div className={liveindex === 2 ? "sort1 sort-active" : "sort1"} data-index={2} onClick={clicktolivetype}>直播间</div>
              </Link>
            </div>
          </div>
        </div>
        <div className="liv-part-2">
          <Outlet />
        </div>
    </div>
  )
}

export default LivingS