import { useEffect, useState } from 'react'
import './index.scss'
import { getSysinfo } from '../../../api/message'
import { useParams } from 'react-router-dom'

function Whisper () {
  const params = useParams()
  const uid = parseInt(params.uid)

  const [messagelist, setMessagelist] = useState([])

  useEffect(() => {
    const getData = async () => {
      const res = await getSysinfo(uid)
      setMessagelist(res)
    }
    getData()
  }, [])
  return (
    <div className="totalpage">
      <div className="toptitle">消息设置</div>
        <div className="message-containt-sysinfo">
          {
            messagelist.map(item =>
              <div className="one-system-message">
                <div className="osm-title">
                  <div className="osm-title-sp1">{item.title}</div>
                  <div className="osm-title-sp2">{item.time.slice(0, 10)}</div>
                </div>
                <div className="osm-content">{item.content}</div>
              </div>
            )
          }
      </div>
    </div>
  )
}

export default Whisper