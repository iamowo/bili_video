import { useState } from 'react'
import './scss/home.scss'

const ControlHome = () => {

  const [datalist, setDatalist] = useState([
    {id: 0, text: '用户'},
    {id: 1, text: '视频'},
    {id: 2, text: '动态'},
    {id: 3, text: '图片'},
    {id: 4, text: '漫画'},
    {id: 5, text: '评论'}
  ])

  return (
    <div className="control-home-box">
      <div className="top-line1">
        <div className="date-box">

        </div>
      </div>
      <div className="top-line2">
        <div className="title-line">
          <span>总体数据</span>
        </div>
        <div className="data-content">
          {
            datalist.map(item =>
              <div className="onebox"
                key={item.id}
              >
                <span className="textspan">{item.text}</span>
                <span className="numspan">12</span>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default ControlHome