import { useState } from "react"

function Liveroom () {
  const [allroos, setAllroom] = useState([])
  return (
    <div className="live_room_sp">
      <div className="live-all-title">
        <div className="lat-left">
          <span className="title-live-sp">直播间</span>
          <span className="sp-live-all-span">一共255个结果</span>
        </div>
      </div>
      <div className="liver-content2">
        {
          allroos.map(item =>
            <div className="one-liveinroom-se">
              <div className="toplive-imgbox"></div>
              <div className="live-title-a">纸币鉴名字</div>
              <div className="live-user-a">
                <span className="icon iconfont">&#xe665;</span>
                <span className="live-user-name1">嘻嘻</span>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Liveroom