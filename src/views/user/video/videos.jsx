import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getVideoByUid } from "../../../api/video"

function Videos () {
  const params = useParams()
  const uid = params.uid  
  const [videolist, setVideolist] = useState([])
  const [videostyle, setVideostyle] = useState(0)
  const [videostyle2, setVideostyle2] = useState(0)

  useEffect(() => {
    const getData = async () => {
      const res = await getVideoByUid(uid, 0)
      console.log(res);
      setVideolist(res)
    }

    getData()
  },[])

  return (
    <div>
      <div className="video-right-title-sss">
        <div>
          <span className="vrt-sp1">视频</span>
          <span className="sort1">最新发布</span>
          <span className="sort1">最多播放</span>
          <span className="sort1">最多收藏</span>
        </div>
        <div className="plyall">播放全部</div>
      </div>
      <div className="selectline2">
        <div>
          <span className="sptext">全部</span>
          <span className="numsp">12</span>
        </div>
        <div>
          <span className="sptext">生活</span>
          <span className="numsp">12</span>
        </div>
        <div>
          <span className="sptext">游戏</span>
          <span className="numsp">12</span>
        </div>
      </div>
      <div className="user-videopart">
        {
          videolist.map(item => 
            <div className="one-uservideo-video" key={item.uid}>
              <img src={item.cover} alt="" className="video-cover" />
              <div className="video-title">{item.title}</div>
              <div className="vidoe-infos">
                <div className="vi-btn-info">
                  <span className="icon iconfont" style={{scale: '0.8'}}>&#xe6b8;</span>
                  <span>{item.plays}</span>
                </div>
                <div className="vi-btn-info">
                  <span className="icon iconfont">&#xe666;</span>
                  <span>{item.danmus}</span>
                </div>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Videos