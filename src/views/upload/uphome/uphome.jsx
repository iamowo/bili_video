import { useState } from "react"
import "./index.scss"

function Uphome () {
  const [list, setAlist] = useState([
    {id: 1, text: '粉丝增长', icons: ""},
    {id: 1, text: '播放量', icons: ""},
    {id: 1, text: '评论', icons: ""},
    {id: 1, text: '弹幕', icons: ""},
    {id: 1, text: '点赞', icons: ""},
    {id: 1, text: '分享', icons: ""},
    {id: 1, text: '收藏', icons: ""},
    {id: 1, text: '投币', icons: ""}
  ])
  return (
    <div className="uphomepage">
      <div className="up-content-box">
        <div className="up-home-title">近期数据</div>
        <div className="data-content">
          {
            list.map(item =>
              <div className="one-infos-video" key={item.id}>
                <div className="oiv-line1">
                  <span className="icon iconfont">{item.icons}</span>
                  <span className="oiv-text">{item.text}</span>
                </div>
                <div className="oiv-line2">12</div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Uphome