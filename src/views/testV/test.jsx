import './test.scss'
import message from '../../components/notice/notice'
import { useEffect, useState } from 'react'
import { click } from '@testing-library/user-event/dist/click'
import { getAllVideo, getByVid, getDm } from '../../api/video'
import axios from 'axios'

import { useDispatch, useSelector } from 'react-redux'
import { addOne, addSome, subOne } from '../../store/modules/countStore'
import { addLater } from '../../store/modules/countStore'

import VideoPlayer from '../../components/VideoPlayer/videoplayer'

function Test() {
   // ===================================== videoplayer===========================
  const userinfo = JSON.parse(localStorage.getItem('userinfo'))
  const vid = 153
  const uid = userinfo.uid
  const [dmlist, setDmlist] = useState([]),
        [thisvid, setThisvid] = useState(null)

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
  return (
    <div>
      <div className="text-view">
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
    </div>
  )
}
export default Test