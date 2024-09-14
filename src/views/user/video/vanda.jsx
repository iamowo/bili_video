import { Link, Outlet } from 'react-router-dom'
import './vanda.scss'
import { useEffect, useState } from 'react'
import { getDyanmciListWidthImg } from "../../../api/dynamic"
import { getVideoByUid } from "../../../api/video"
import { useParams } from 'react-router-dom'

function Videosandartical () {
  const params = useParams()
  const uid = params.uid  

  const [leftindex, setLetIndex] = useState(0)
  const [videonums, setVideonums] = useState(0)
  const [imgnums, setImgnums] = useState(0)

  const tothisone = (e) => {
    const index= e.target.dataset.index || e.target.parentNode.dataset.index
    setLetIndex(parseInt(index))
  }

  useEffect(() => {
    const getData = async () => {
      const res = await Promise.all([getVideoByUid(uid, 0), getDyanmciListWidthImg(uid)])
      console.log('????', res);
      
      setVideonums(res[0].length)
      setImgnums(res[1].length)
    }
    getData()
  }, [])
  return (
    <div className="user-videos">
      <div className="video-left">
        <Link to={`/${uid}/videos`}>
          <div className={leftindex === 0 ? "one-left-contentn olc-active" : "one-left-contentn"}
          data-index = {0}
          onClick={tothisone}>
            <span>视频</span>
            <span>{videonums}</span>
          </div>
        </Link>
        <Link to={`/${uid}/artical`}>
          <div className={leftindex === 1 ? "one-left-contentn olc-active" : "one-left-contentn"}
            data-index = {1}
            onClick={tothisone}>
            <span>图文</span>
            <span>{imgnums}</span>
          </div>
        </Link>
        {/* <div className="div one-left-contentn"></div> */}
      </div>
      <div className="video-right">
        <Outlet />
      </div>
    </div>
  )
}

export default Videosandartical