import { useState, useEffect } from "react"
import "./index.scss"
import { getUserData } from "../../../api/user"
import { useParams } from "react-router-dom"

function Uphome () {
  const params = useParams()
  const uid = params.uid
  const [list, setAlist] = useState([])
  const [dayindex, setDyaindex] = useState(0),
        [dayflag, setDayflag] = useState(false),
        [daytitle, setDaytitle] = useState('昨天'),
        [styleindex, setStyleindex] = useState(0)
  useEffect(() => {
    const getData = async () => {
      const res = await getUserData(uid);
      // 解决方案是，将编码改为：\ue700\ue   / &#x 和 \u 是16进制Unicode字符的不同写法。
      setAlist(() => [
        {id: 0, text: '粉丝增长', icons: "\ue603", nums: res.fans},
        {id: 1, text: '播放量', icons: "\ue87c", nums: res.plays},
        {id: 2, text: '评论', icons: "\ue6b3", nums: res.comments},
        {id: 3, text: '弹幕', icons: "\ue666", nums: res.dms},
        {id: 4, text: '点赞', icons: "\ue61c", nums: res.likes},
        {id: 5, text: '分享', icons: "\ue633", nums: res.shares},
        {id: 6, text: '收藏', icons: "\ue60e", nums: res.collects},
        {id: 7, text: '投币', icons: "\ue617", nums: res.icons}
      ])
      
    }
    getData()
  }, [])
  return (
    <div className="uphomepage">
      <div className="up-content-box">
        <div className="up-home-title">
          <div className="lp">近一个月数据</div>
        </div>
        <div className="data-content">
          {
            list.map(item =>
              <div className="one-infos-video" key={item.id}>
                <div className="oiv-line1">
                  <span className="icon iconfont">{item.icons}</span>
                  <span className="oiv-text">{item.text}</span>
                </div>
                <div className="oiv-line2">{item.nums}</div>
              </div>
            )
          }
        </div>
      </div>
      <div className="up-content-box" style={{marginTop: '20px'}}>
        <div className="up-home-title">
          <div className="lp">
            近期收入数据<span>{20}</span>￥
          </div>
          <div className="rp">
            <div className="timespan">时间选择</div>
            <div className="nowstyle"
              onClick={() => setDayflag(true)}
            >
              <span className="sp1">{daytitle}</span>
              <div className={dayflag ? "icon iconfont fontactive" : "icon iconfont"}>&#xe624;</div>
              <div className="append-day-select"
                style={{visibility: dayflag ? 'visible' : 'hidden'}}
              >
                <div className="day1"
                style={{color: dayindex === 0 ? '#00aeec' : '#18191C'}}
                onClick={(e) => {
                  e.stopPropagation()
                  setDyaindex(0)
                  setDayflag(false)
                  setDaytitle('昨天')
                }}>昨天</div>
                <div className="day2"
                style={{color: dayindex === 1 ? '#00aeec' : '#18191C'}}
                onClick={(e) => {
                  e.stopPropagation()
                  setDyaindex(1)
                  setDayflag(false)
                  setDaytitle('近7天')
                }}>近7天</div>
                <div className="day2"
                style={{color: dayindex === 2 ? '#00aeec' : '#18191C'}}
                onClick={(e) => {
                  e.stopPropagation()
                  setDyaindex(2)
                  setDayflag(false)
                  setDaytitle('近30天')
                }}>近30天</div>
                <div className="day2"
                style={{color: dayindex === 3 ? '#00aeec' : '#18191C'}}
                onClick={(e) => {
                  e.stopPropagation()
                  setDyaindex(3)
                  setDayflag(false)
                  setDaytitle('近90天')
                }}>近90天</div>
                <div className="day1"
                style={{color: dayindex === 4 ? '#00aeec' : '#18191C'}}
                onClick={(e) => {
                  e.stopPropagation()
                  setDyaindex(4)
                  setDayflag(false)
                  setDaytitle('全部')
                }}>全部</div>
              </div>

            </div>
          </div>
          </div>
        <div className="data-content2">
          <div className="inncontact">
            <div 
              className={ styleindex === 0 ? "one-infos-video2 v2-active" : "one-infos-video2"}
              onClick={() => setStyleindex(0)}
            >
              <div className="oiv-line1">
                <span className="icon iconfont">&#xe60f;</span>
                <span className="oiv-text">视频收益</span>
              </div>
              <div className="oiv-line2">{12}</div>
            </div>
            <div
              className={ styleindex === 1 ? "one-infos-video2 v2-active" : "one-infos-video2"}
              onClick={() => setStyleindex(1)}
            >
              <div className="oiv-line1">
                <span className="icon iconfont">&#xe69c;</span>
                <span className="oiv-text">充电收益</span>
              </div>
              <div className="oiv-line2">{12}</div>
            </div>
          </div>
          {/* <div className="tubaopart">
            
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default Uphome