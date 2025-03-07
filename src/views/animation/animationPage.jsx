import { useEffect, useState } from 'react'
import Topnav from '../../components/Topnav/Topnav.jsx'
import "./index.scss"

const AnimationPage = () => {
  const [filterlist, setFilterlist] = useState(() => [
    {
      text: '类型', 
      id: 0,
      list: [{id: '00', text: '全部'}, {id: '00', text: '冒险'},
             {id: '00', text: '校园'}, {id: '00', text: '热血'},
             {id: '00', text: '恋爱'}, {id: '00', text: '长篇'},
             {id: '00', text: '恋爱'}, {id: '00', text: '长篇'},
             {id: '00', text: '恋爱'}, {id: '00', text: '长篇'},
             {id: '00', text: '恋爱'}, {id: '00', text: '长篇'},
             {id: '00', text: '恋爱'}, {id: '00', text: '长篇'},
             {id: '00', text: '恋爱'}, {id: '00', text: '长篇'},
             {id: '00', text: '恋爱'}, {id: '00', text: '长篇'},
             {id: '00', text: '恋爱'}, {id: '00', text: '长篇'},
             {id: '00', text: '恋爱'}, {id: '00', text: '长篇'},
             {id: '00', text: '短篇'}
            ]
    },
    {
      text: '地区',
      id: 1,
      list: [{id: '00', text: '全部'}, {id: '00', text: '冒险'},
             {id: '00', text: '校园'}, {id: '00', text: '热血'},
             {id: '00', text: '恋爱'}, {id: '00', text: '长篇'},
             {id: '00', text: '短篇'}]
    },
    {
      text: '日期', 
      id: 2,
      list: [{id: '00', text: '全部'}, {id: '00', text: '冒险'},
             {id: '00', text: '校园'}, {id: '00', text: '热血'},
             {id: '00', text: '恋爱'}, {id: '00', text: '长篇'},
             {id: '00', text: '短篇'}]
    }
  ])
  const [topindex, setTopindex] = useState([0, 0, 0])

  useEffect(() => {
    const getData = async () => {

    }
    getData()
    document.title = '剧集'
  })
  return (
    <div className="animationpage">
      <Topnav />
      <div className="wrap">
        <div className="top-filterbox">
          {
            filterlist.map((item1, i1) =>
            <div className="one-line"
              key={item1.id}
            >
              <div className="left-text">{item1.text}</div>
              <div className="right-cent">
                {
                  item1.list.map((item2, i2) =>
                    <div className={topindex[i1] === i2? "one-type one-type-active" : "one-type"}
                      key={item2.id}
                      onClick={() => {
                        setTopindex()
                      }}
                    >{item2.text}</div>
                  )
                }
              </div>
            </div>
            )
          }
        </div>
        <div className="content-box"></div>
        <div className="totopbox"></div>
      </div>
    </div>
  )
}

export default AnimationPage