import './pages.scss'
import { useState } from "react"

function Pages () {
  const [pages, setPages] = useState([
    {id: 1},
    {id: 1},
    {id: 1},
    {id: 1},
    {id: 1}
  ])

  return (
    <div className="page-out">
      <div className="changpages">上一页</div>
        {
          pages.map((item, index) => 
            <div className="onepage">{index + 1}</div>
          )
        }
      <div className="changpages">下一页</div>
      <div className="pageinfos">
          <span>一共16页面,跳转到</span>
          <input type="text" className="pageinp" />
          <span>页</span>
      </div>
    </div>
  )
}

export default Pages