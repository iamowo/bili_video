import { useEffect, useRef, useState } from 'react'
import './audit.scss'
import { getAuditList, oneResult } from '../../api/audit'
import { Link } from 'react-router-dom'

function Audit () {
  const [videolist, setVideolist] = useState([])
  const [onevideo, setOnevideo] = useState()

  const [nopass, setNopass] = useState(false)
  const [nopasstext, setText] = useState()
  const videoref = useRef()
  useEffect(() => {
    const getData = async() => {
      const res = await getAuditList()
      setOnevideo(res[0])
      console.log(res);
      
      setVideolist(res)
    }
    getData()
  }, [])

  const toauditthis = (e) => {
    const index = (e.target.dataset.index || e.target.parentNode.dataset.index)
    setOnevideo(videolist[index])
    console.log(videolist[index]);
    
  }

  const playclick = () => {
    const ref = videoref.current    
    if (ref.paused) {
        ref.play()
    } else {
      ref.pause()
    }
  }

  const passbtn = async () => {
    if (nopass === true) {
      alert('nope')
      return
    }
    const data = {
      vid: onevideo.vid,
      uid: onevideo.uid,
      content: "稿件通过审核",
      title: onevideo.title,
      pass: 1
    }

    const res = await oneResult(data)
    if (res) {
      setVideolist(res)
      setOnevideo(res[0])
    }
  }

  const nopassbtn = async () => {
    const data = {
      vid: onevideo.vid,
      uid: onevideo.uid,
      content: nopasstext,
      title: onevideo.title,
      pass: 2
    }
    const res = await oneResult(data)
    if (res) {
      setVideolist(res)
      setOnevideo(res[0])

      canclebtn()
    }
  }

  const canclebtn = () => {
    setText('')
    setNopass(false)
  }
  return (
    <div className="audit-view">
      <div className="aud-top-out">
        <div className="aud-top">
          <div className="at-left">
            <div className="audlit-top-div">
              <Link to="/">
                <span className='icon iconfont'>&#xe61e;</span>
              </Link>
            </div>
          </div>
          <div className="at-rigth"></div>
        </div>
      </div>
      <div className="work-content">
        <div className="left-content">
          <div className="lc-title">
            <span>审核列表</span>
            <span className="sp-icon-audit">{videolist.length}</span>
          </div>
          <div className="lc-content-box">
            {
              videolist.map((item, index) =>
                <div className="one-audit-video" data-index={index} onClick={toauditthis}>
                  <img src={item.cover} alt="" className="oav-left-avatar" />
                  <div className="oav-right-info" data-index={index}>
                    <div className="toptitle-oav">{item.title}</div>
                    <div className="bottomname" data-index={index}>
                      <div className="btm-box1">{item.name}</div>
                      <div className="btm-box1">{item.time.slice(0, 10)}</div>
                    </div>
                  </div>
                </div>
              )
            }
          </div>
        </div>
        <div className="mid-content">
          <div className="video-player">
            <div className="mask-video-ip"
              onClick={playclick}
            ></div>
            <video ref={videoref} src={onevideo != null ? onevideo.path : null} className="vidres"
              
            ></video>
          </div>
          <div className="control-box"></div>
        </div>
        <div className="right-sp-line-a">
          <div className="right-userinfo-topa">
            <img src={onevideo != null ? onevideo.avatar : null} alt="" className="left-userinfos-avatar" />
            <div className="right-user-otherins">
              <div className="rus-top-name">{onevideo != null ? onevideo.name : null}</div>
              <div className="botm-user-lv">
                <span>UID:{onevideo != null ? onevideo.uid : null}</span>
              </div>
            </div>
          </div>
          <div className="right-content">
            <div className="uplin-tit">视频信息</div>
            <div className="uplin1">
              <div className="sp-line2-leftspan">标题</div>
              <div className="sp-rig-asd">{onevideo != null ? onevideo.title : null}</div>
            </div>
            <div className="uplin1">
              <div className="sp-line2-leftspan">时长</div>
              <div className="sp-rig-asd">{onevideo != null ? onevideo.vidlong : null}</div>
            </div>
            <div className="uplin1">
              <div className="sp-line2-leftspan">简介</div>
              <div className="sp-rig-asd">{onevideo != null ? onevideo.intro : null}</div>
            </div>
            <div className="uplin1">
              <div className="sp-line2-leftspan">上传时间</div>
              <div className="sp-rig-asd">{onevideo != null ? onevideo.time.slice(0, 10) : null}</div>
            </div>
          </div>
          <div className={ nopass ? "right-content2-upl right-content2-upl-active" : "right-content2-upl"}>
            <div className="sned-up-line">
              <div className="passbtn" onClick={passbtn}>通过</div>
              <div className="nopassbtn" onClick={() => setNopass(true)}>不通过</div>
            </div>
            <textarea className='nopass-message' placeholder='未通过原由'
              value={nopasstext}
              onChange={(e) => setText(e.target.value)}></textarea>
            <div className="nopass-message-line">
              <div className="nml-btn1" onClick={canclebtn}>取消</div>
              <div className="nml-btn2" onClick={nopassbtn}>确定</div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Audit