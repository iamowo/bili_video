import "./index2.scss"
import Topnav from "../../components/Topnav/Topnav"
import { useParams } from "react-router-dom"
import { getDynamic } from "../../api/dynamic"
import { useEffect, useState } from "react"
import { baseurl } from "../../api"

function Dydetail () {
  const params = useParams()
  const uid = parseInt(params.uid != null ? params.uid : -1)
  const did = parseInt(params.did)
  const [dynamicinfo, setInfo] = useState()
  const [imgs, setImgs] = useState([])

  useEffect(() => {
    document.body.style.background = `url(${baseurl}/sys/bg.png) top / cover no-repeat fixed`
    const getData = async () => {
      const res = await getDynamic(did)
      console.log(res);
      setInfo(res)
      document.title = res.name + '动态'      

      setImgs(res.imgs)
      console.log(res.imgs);
    }
    getData()
  }, [])
  return (
    <div className="dyout">
      <Topnav />
      <div className="dydetail-box">
        <div className="dunamic-content">
          <div className="top-contains">
            {
              imgs.length === 1 &&
              <div className="one-img-conetneimg">
                <img src={imgs[0]} alt="" className="this-img" />
              </div>
            }
            <div className="top-avatar">
              <img src={dynamicinfo!=null ? dynamicinfo.avatar : null} alt="" className="ta-left-avatar" />
              <div className="ta-right-infos">
                <div className="title-bba-dy1">{dynamicinfo!=null ? dynamicinfo.name : null}</div>
                <div className="title-bba-dy2">{dynamicinfo!=null ? dynamicinfo.time.slice(0, 10) : null}</div>
              </div>
              <img src={ baseurl + "/sys/topimg.webp"} alt="" className="right-topimg" />
              <div className="more-div">
                <span className="icon iconfont">&#xe653;</span>
              </div>
            </div>
            <div className="dynamic-content-box">
              <div className="dynamic-content-text">{dynamicinfo!=null ? dynamicinfo.content : null}</div>
              {
                imgs.length > 1 &&
                <div className="dynamic-content-imgs">
                  {
                    dynamicinfo.imgs.map(item =>
                      <img src={item} alt="" className="one-img" />
                    )
                  }
                </div>
              }
            </div>
            <div className="bt-line1">
              <div className="one-select-box">
                <span>评论{1}</span>
              </div>
              <div className="one-select-box">
                <span>点赞{1}</span>
              </div>
            </div>
            <div className="show-content">
              <div className="line-select-type">
                <span className="sp-s1">最新</span>
                <span className="line-sp1"></span>
                <span className="sp-s1">最热</span>
              </div>
              <div className="send-box1">
                <img src="" alt="" className="left-sbimg" />
                <div className="right-sb"></div>
              </div>
              <div className="comments-box">

              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="right-con1">
        <div className="one-right1">
          <span className="icon iconfont">&#xe61c;</span>
          <span className="bt-infos">{12}</span>
        </div>
        <div className="one-right1">
          <span className="icon iconfont">&#xe648;</span>
          <span className="bt-infos">{12}</span>
        </div>
      </div>
      <div className="right-con2"></div>
    </div>  
  )
}

export default Dydetail