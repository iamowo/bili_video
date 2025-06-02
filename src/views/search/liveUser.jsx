import { useState } from "react"

function Liveuser () {
  const [alluserlist, setAlluserlist] = useState([])

  return (
    <div className="live_user_sp">
      <div className="live-all-title">
          <div className="lat-left">
            <span className="title-live-sp">主播</span>
            <span className="sp-live-all-span">一共255个结果</span>
          </div>
        </div>
        <div className="liver-content1">
          {
            alluserlist.map(item =>
              <div className="one-user-serach-box">
                <img src="" alt="" className="ousb-leftavatar" />
                <div className="ousb-rightinfo">
                  <div className="ousbr-name">{'sb1'}</div>
                  <div className="ousbr-infos icon iconfont">{12}粉丝&#xec1e;{}个视频</div>
                  {
                    true ?
                    <div className="ousbr-subornot">+ 关注</div>
                    :
                    <div className="ousbr-dountsub">已关注</div>
                  }
                </div>
              </div>
            )
          }
      </div>
    </div>
  )
}

export default Liveuser