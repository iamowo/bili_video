import { useParams } from 'react-router-dom'
import './index.scss'
import { useEffect, useState } from 'react'
import { getLikeinfo } from '../../../api/message'

function Love () {
  const params = useParams()
  const uid = parseInt(params.uid)

  const [liklist, setLikelist] = useState([])

  useEffect(() => {
    const getData = async () => {
      const res = await getLikeinfo(uid)
      setLikelist(res)
      console.log(res);
      
    }
    getData()
  }, [])
  return (
    <div className="totalpage">
      <div className="toptitle">收到的赞</div>
      <div className="message-containt-love">
          {
            liklist.map(item =>
              <div className="one-system-like">
                <img src={item.avatar} alt="" className="left-like-avatar" />
                <div className="right-like-info">
                  <div className="top-like-info">
                    <div className="name-likepsan">{item.name}</div>
                    {
                      <div className="name-textpsan">赞了视频/评论/动态</div>
                    }
                  </div>
                  <div className="bottom-like-info">{item.time.slice(0, 10)}</div>
                </div>
              </div>
            )
          }
      </div>
    </div>
  )
}

export default Love