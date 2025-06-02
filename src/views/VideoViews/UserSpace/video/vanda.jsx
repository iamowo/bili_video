import { Link, Outlet, useOutletContext } from 'react-router-dom'
import '../../scss/UserSpace/vanda.scss'
import { useEffect, useState } from 'react'
import { getDyanmciListWidthImg } from "../../../../api/dynamic"
import { getVideoByUid } from "../../../../api/video"
import { useParams } from 'react-router-dom'

function Videosandartical () {
  const context = useOutletContext()

  const myinfo = context.myinfo,
        myuid = parseInt(context.myuid)

  const hisinfo = context.hisinfo,
        hisuid = parseInt(context.hisuid),
        setUserinfo = context.setUserinfo
  const isme = context.isme

  const [leftindex, setLetIndex] = useState(0)
  const [videonums, setVideonums] = useState(0)
  const [imgnums, setImgnums] = useState(0)

  const tothisone = (e) => {
    const index= e.target.dataset.index || e.target.parentNode.dataset.index
    setLetIndex(parseInt(index))
  }

  useEffect(() => {
    const getData = async () => {
      const res = await Promise.all([getVideoByUid(hisuid, 0), getDyanmciListWidthImg(hisuid)])
      console.log('????', res);
      
      setVideonums(res[0].length)
      setImgnums(res[1].length)
    }
    getData()
  }, [])
  return (
    <div className="user-videos">
      <div className="video-left">
        <Link to={`/${hisuid}/videos`}>
          <div className={leftindex === 0 ? "one-left-contentn olc-active" : "one-left-contentn"}
          data-index = {0}
          onClick={tothisone}>
            <span>视频</span>
            <span>{videonums}</span>
          </div>
        </Link>
        <Link to={`/${hisuid}/artical`}>
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
        <Outlet
          context={{"hisuid" : hisuid}}
        />
      </div>
    </div>
  )
}

export default Videosandartical