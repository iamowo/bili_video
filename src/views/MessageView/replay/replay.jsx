import { useEffect, useState } from "react"
import "./index.scss"
import { getReplayComment } from "../../../api/comment"
import { useParams } from "react-router-dom"

function Replay () {
  const params = useParams()
  const uid = params.uid

  const [replaylist, setReplay] = useState([])

  useEffect(() => {
    const getData = async () => {
      const res = await getReplayComment(uid);
      console.log(res);
      
      setReplay(res)
    }
    getData()
  },[])
  return (
    <div className="totalpage">
      <div className="toptitle">回复我的</div>
        <div className="relapy-content">
          <div className="repaly-innerbox">
            {
              replaylist.map(item =>
                <div className="one-replay">
                  <div className="left-replay-avatar">
                    <img src={item.avatar} alt="" className="userava-replay" />
                  </div>
                  <div className="replay-infos">
                    <div className="repaly-name">
                      <span className="replay-namespan">{item.name}</span>
                      <span className="replay-textspan">回复了我的
                        {
                          item.type === 0 &&
                          <span>视频</span>
                        }
                        {
                          item.type === 1 &&
                          <span>动态</span>
                        }
                        {
                          item.type === 2 &&
                          <span>评论</span>
                        }
                      </span>
                    </div>
                    <div className="repaly-content">{item.content}</div>
                    <div className="repaly-infos">
                      <span>{item.time.slice(0, 10)}</span>
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