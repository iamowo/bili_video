import { useEffect, useState } from "react"
import ImgTop from "../../components/imgTop/imgTopCom"
import './scss/detail.scss'
import { useParams, useNavigate, useOutletContext } from "react-router-dom"
import { getOneById } from "../../api/imgs"

const ImgDetail = () => {
  const params = useParams(),
        navigate = useNavigate(),
        imgid = params.imgid
  const context = useOutletContext()
  console.log(context);
  
  const [imginfo, setImginfo] = useState([]),
        [comments, setComments] = useState([])
  const userinfo = JSON.parse(localStorage.getItem('userinfo')),
        uid = userinfo?.uid

  useEffect(() => {
    const getData = async () => {
      const res = await Promise.all([getOneById(imgid, uid)])
      setImginfo(res[0])
      // setComments(res[1])
    }
    document.title = '图片详情'
    getData()
  }, [])

  const goback = () => {
    context.setDetailflag(false)
    navigate(-1)
  }
  return (
    <div className="detailbox">
      <div className="backbox"
        onClick={() => goback()}
      >
        <sapn className="iconfont">&#xe600;</sapn>
        <span>返回</span>
      </div>
      <div className="bgbox">
        <div className="img-wrap">
          <div className="imgbox">
            <img src={imginfo.path} alt="" />
          </div>
        </div>
        <div className="bottom-box"></div>
      </div>
    </div>
  )
}

export default ImgDetail