import { useState } from "react"
import "./index.scss"

function Replay () {
  const [replaylist, setReplay] = useState([
    {id: 1},
    {id: 2},
    {id: 3},
    {id: 4},
    {id: 5},
  ])
  return (
    <div className="totalpage">
      <div className="toptitle">回复我的</div>
        <div className="relapy-content">
          <div className="repaly-innerbox">
            {
              replaylist.map(item =>
                <div className="one-replay">
                  <div className="left-replay-avatar"></div>
                  <div className="replay-infos">
                    <div className="repaly-name">
                      <span className="replay-namespan">asdas</span>
                      <span className="replay-textspan">回复了我的评论</span>
                    </div>
                    <div className="repaly-content">123123</div>
                    <div className="repaly-infos">
                      <span>12.21:01</span>
                    </div>
                  </div>
                </div>
              )
            }
          </div>
        </div>
    </div>
  )
}

export default Replay