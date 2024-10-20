import { useState } from "react"
import Liveroom from "./liveRoom"
import { Link } from "react-router-dom"
import { useParams } from "react-router-dom"

function Liveall () {
  const params = useParams()
  const keyword = params.keyword
  const uid = params.uid != null ? params.uid : null

  const [userlist1, setUserlsit] = useState([
    {'uid': 1},
    {'uid': 2},
    {'uid': 3},
    {'uid': 4}
  ])
  const [livingromm, setLiingroom] = useState([
    {'uid': 1},
    {'uid': 2},
    {'uid': 3},
    {'uid': 4},
    {'uid': 4},
    {'uid': 4},
    {'uid': 4},
  ])
  return (
    <div className="live_room_sp">
      <div className="live-all-title">
        <div className="lat-left">
          <span className="title-live-sp">主播</span>
          <span className="sp-live-all-span">一共255个结果</span>
        </div>
        <Link to={`/lives/liver/${keyword}/${uid}`}>
          <div className="lat-right1">
            <span>查看更多</span>
            <div className="icon iconfont">&#xe775;</div>
          </div>
        </Link>
      </div>
      <div className="liver-content1">
          {
            userlist1.map(item =>
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
      <div className="live-all-title">
        <div className="lat-left">
          <span className="title-live-sp">直播间</span>
          <span className="sp-live-all-span">一共255个结果</span>
        </div>
        <Link to={`/lives/liveroom/${keyword}/${uid}`}>
          <div className="lat-right1">
            <span>查看更多</span>
            <div className="icon iconfont">&#xe775;</div>
          </div>
        </Link>
      </div>
      <div className="liver-content2">
        {
          livingromm.map(item =>
            <div className="one-liveinroom-se">
              <div className="toplive-imgbox"></div>
              <div className="live-title-a">livingroom</div>
              <div className="live-user-a">
                <span className="icon iconfont">&#xe665;</span>
                <span className="live-user-name1">username</span>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Liveall