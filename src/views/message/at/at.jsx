import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getAtinfo } from '../../../api/message'
import { HeightLightKw } from '../../../util/fnc'

function At () {
  const params = useParams()
  const uid = params.uid

  const [atlist, setAtlist] = useState([])

  useEffect(() => {
    const getData = async () => {
      const res = await getAtinfo(uid);
      console.log(res);
      setAtlist(res)
    }
    getData()
  },[])
  return (
    <div className="totalpage">
      <div className="toptitle">@我的</div>
        <div className="relapy-content">
          <div className="repaly-innerbox">
            {
              atlist.map(item =>
                <div className="one-replay">
                  <div className="left-replay-avatar">
                    <img src={item.avatar} alt="" className="userava-replay" />
                  </div>
                  <div className="replay-infos">
                    <div className="repaly-name">
                      <span className="replay-namespan">{item.name}</span>
                      <span className="replay-textspan"
                      >在
                        {
                          item.type === 0 &&
                          <span>视频
                            <span
                              className='at-infotitle'
                              onClick={() => window.open(`/video/${item.vid}`, '_blank')}
                            >{item.attitle}</span>
                          </span>
                        }
                        {
                          item.type === 1 &&
                          <span>动态</span>
                        }
                        {
                          item.type === 2 &&
                          <span>评论</span>
                        }
                        @了你
                      </span>
                    </div>
                    {/* <div className="repaly-content"></div> */}
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

export default At