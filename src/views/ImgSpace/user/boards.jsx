import { useEffect, useState } from "react"
import "../scss/boards.scss"
import { useOutletContext } from "react-router-dom"
import { getAllBoards } from "../../../api/imgs"

const BoradsComponents = () => {
  const [boardlist, setBoardlist] = useState([]),
        [displaystyle, setStyle] = useState(true)
  const context = useOutletContext(),
        uid = context.uid
  useEffect(() => {
    const getData = async () => {
      const res = await Promise.all([getAllBoards(uid)])
      console.log(res);
      
      setBoardlist(res[0])
    }
    getData()
  }, [])
  
  return (
    <div className="allboardview">
      <div className="b-lines">
        <div className="onebox">全部</div>
        <div className="onebox">全部</div>
        <div className="onebox">全部</div>
      </div>
      <div className="boards-con">
        <div className="one-board">
          <div className="innerboximg">
            <div className="imgbox">
              <div className="addbox">
                <span>+</span>
              </div>
            </div>
            <div className="ingobox">
              <div className="titleline">创建收藏夹</div>
              <div className="infol">创建你的收藏夹</div>
            </div>
          </div>
        </div>
        {
          boardlist.map(item => 
            <div className="one-board"
              key={item.id}
            >
              <div className="innerboximg">
                <div className="imgbox">
                  <div className="imgcoverbox">
                    <div className="editorimgbox">
                      <div className="iconfont icon1">&#xe685;</div>
                      <span className="spp"></span>
                      <div className="iconfont icon2">&#xe658;</div>
                    </div>
                  </div>
                  <div className="box1">
                    <img src={item.coverlist[0]} alt="" className="b1img" />
                  </div>
                  <div className="box2">
                    <div className="imgbox2">
                      <img src={item.coverlist[1]} alt="" className="b2img" />
                    </div>
                    <div className="imgbox2">
                      <img src={item.coverlist[2]} alt="" className="b2img" />
                    </div>
                  </div>
                </div>
                <div className="ingobox">
                  <div className="titleline">{item.title}</div>
                  <div className="infol">{item.collects}采集 {item.likes}关注</div>
                </div>
              </div>
            </div>
          )
        }
      </div>
      <div className="noemoeline">没有更多了~</div>
    </div>
  )
}

export default BoradsComponents
