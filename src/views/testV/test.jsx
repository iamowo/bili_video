import './test.scss'
import message from '../../components/notice/notice'
import { useEffect, useRef, useState } from 'react'
import { click } from '@testing-library/user-event/dist/click'
import { getAllVideo, getByVid, getDm } from '../../api/video'
import axios from 'axios'

import { useDispatch, useSelector } from 'react-redux'
import { addOne, addSome, subOne } from '../../store/modules/countStore'
import { addLater } from '../../store/modules/countStore'

import VideoPlayer from '../../components/VideoPlayer/videoplayer.jsx.bak'

function Test() {
   // ===================================== videoplayer===========================
  const userinfo = JSON.parse(localStorage.getItem('userinfo'))
  const vid = 153
  const uid = userinfo.uid
  const [dmlist, setDmlist] = useState([]),
        [thisvid, setThisvid] = useState(null)
  const videoRef = useRef(null)

  useEffect(() => {
    const getData = async () => {
      console.log('233333===============');
      const res = await Promise.all([getByVid(vid, uid), getDm(vid)]) 
      console.log("res: ", res);
      setThisvid(res[0])
      setDmlist(res[1])
    }
    console.log('asdasdasd');
    
    getData()
  },[])

  const clickTimeout = useRef(null);
  const clickCount = useRef(0);
   const handleClick2 = () => {
    clickCount.current += 1;
    
    if (clickCount.current === 1) {
      clickTimeout.current = setTimeout(() => {
        // 单击处理
        if (clickCount.current === 1) {
          console.log('单击事件');
        }
        clickCount.current = 0;
      }, 200);
    } else if (clickCount.current === 2) {
      // 双击处理
      clearTimeout(clickTimeout.current);
       console.log('双击事件');
      clickCount.current = 0;
    }
  };

  const handleClick = () => {
    if (clickTimeout.current != null) {
      clearTimeout(clickTimeout.current)
      console.log('双击');
      return
    }
    clickTimeout.current = setTimeout(() => {
      console.log('单击');
    }, 200)
  }

  return (
    <div>
      {/* <div className="text-view">
        <view className="v1box">
          <div className="load-box"></div>
          <div className="load-box2"></div>
          <div className="load-box3"></div>
        </view>
      </div>
      <div
        style={{margin: '40px 0'}}
      >================================================================================</div>
      <VideoPlayer 
        userinfo={userinfo}
        thisvid={thisvid}
        vid={vid}
        uid={uid}
        dmlist={dmlist}
        setDmlist={setDmlist}
      />
      <div
        style={{margin: '40px 0'}}
      >================================================================================</div>
      <div className="clickbox"
        onClick={handleClick}
      >
      </div>
      <div
        style={{margin: '40px 0'}}
      >================================================================================</div> */}
    </div>
  )
}
export default Test
