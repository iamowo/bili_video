import "./index2.scss"
import Topnav from "../../components/Topnav/Topnav"
import { useParams } from "react-router-dom"
import { getDynamic, addDynamicLike } from "../../api/dynamic"
import { useEffect, useState } from "react"
import { baseurl } from "../../api"
import Comments from "../../components/comments/comments"

function Dydetail () {
  const params = useParams()
  const userinfo = JSON.parse(localStorage.getItem('userinfo'))
  const uid = parseInt(userinfo !== null ? userinfo.uid: -1)
  const did = parseInt(params.did)
  const [dynamicinfo, setDynamicinfo] = useState()
  const [imgs, setImgs] = useState([])

  const [likes, setLikes] = useState(0),
        [ourcomments, OutComments] = useState(0)

  useEffect(() => {
    document.body.style.background = `url(${baseurl}/sys/bg.png) top / cover no-repeat fixed`
    const getData = async () => {      
      const res = await getDynamic(did, uid)
      console.log('dynamic:', res);
      setDynamicinfo(res)
      document.title = res.name + '动态'      
      setImgs(res.imgs)
      console.log(res.imgs);
      setLikes(res.likes)
    }
    getData()
  }, [])

  const clickLikeDynamic = async () => {
    const data = {
      did: did,
      uid: uid,
      hisuid: dynamicinfo.uid,
      type: 1
    }
    const res = await addDynamicLike(data);
    if (dynamicinfo.liked) {
      // 取消点赞
      setLikes(likes - 1)
      setDynamicinfo({
        ...dynamicinfo,
        liked: false
      })
    } else {
      // 点赞
      if (res) {
        setLikes(likes + 1)
        setDynamicinfo({
          ...dynamicinfo,
          liked: true
        })
      }
    }
  }
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
            </div>
            <div className="dynamic-detail-comments">
              <Comments
                did={did}
                uid={uid}
                hisuid={dynamicinfo?.uid}
                userinfo={userinfo}
                OutComments={OutComments}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="right-con1">
        <div className={dynamicinfo?.liked ? "one-right1 right-active" : "one-right1"}
          onClick={clickLikeDynamic}
        >
          <span className="icon iconfont">&#xe61c;</span>
          <span className="bt-infos">{likes}</span>
        </div>
        <div className="one-right2">
          <span className="icon iconfont">&#xe648;</span>
          <span className="bt-infos">{ourcomments}</span>
        </div>
      </div>
      <div className="right-con2"></div>
    </div>  
  )
}

export default Dydetail