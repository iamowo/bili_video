import "./scss/oneboarder.scss"
import ImgTop from "../../components/imgTop/imgTopCom"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const ImgBorder = () => {
  const params = useParams(),
        boardid = params.boardid;
  const [imglist, setImglist] = useState([]),
        [tranalateList, setTranslateList] = useState([])

  useEffect(() => {
    const getData = async () => {
      const res = await Promise.all([])
    }
    getData()
  }, [])
  return (
    <div>
      <ImgTop />
      <div className="boardView">
        <div className="contentwrap">
          <div className="topbox">
            <div className="topline1">
              <div className="topleft">name</div>
              <div className="topright">
                <div className="oneeditorbox">1</div>
                <div className="oneeditorbox">2</div>
                <div className="oneeditorbox">3</div>
              </div>
            </div>
            <div className="topline2">
              <div className="useravatar"></div>
              <span className="username">2333</span>
            </div>
          </div>
          <div className="boardinfo">
            <div className="infoleft">
              <div className="leftbox1">
                <span className="sp1">收集</span>
                <span className="sp2">1</span>
              </div>
              <div className="leftbox1">
                <span className="sp1">被关注</span>
                <span className="sp2">1</span>
              </div>
            </div>
            <div className="inforight">
              <div className="rightbox">
                search
              </div>
              <div className="rightbox">
                <span className="sp1">排序</span>
                <span className="iconfont">1</span>
              </div>
              <div className="rightbox">
                <span className="sp1">视图</span>
                <span className="iconfont">1</span>
              </div>
            </div>
          </div>
          <div className="imgs-content">
            <div className="oneimg">1</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImgBorder