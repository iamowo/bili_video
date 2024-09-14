import { useEffect, useRef, useState } from 'react'
import './index.scss'
import { useNavigate } from 'react-router-dom'
import { getWhisperList, sendImg, sendMessage } from '../../../api/message'
import { type } from '@testing-library/user-event/dist/type'

function Whisper () {
  const navigate = useNavigate()
  const userinfo = JSON.parse(localStorage.getItem('userinfo'))
  const uid = userinfo.uid

  const contentref = useRef()
  const [allcontent, setAllcontent] = useState([])
  const [contentlist, setContentlist] = useState([])  // 当前的对话内容
  const [nowUser, setNowuser] = useState({})
  const [nowindex, setNowindex] = useState(0)
  const [whisperlist, setWhisperlist] = useState([])
  const [contenttext, setText] = useState()
  const [textlength, setLength] = useState(0)

  useEffect(() => {
    const getData = async () => {
      const res = await getWhisperList(uid)
      // console.log(res.whisperlist);
      // console.log('res: ', res.contentlist);
      setAllcontent(res.contentlist)
      setWhisperlist(res.whisperlist)
      setNowuser(res.whisperlist[0])
      setContentlist(res.contentlist[0])
    }
    getData()
    console.log(contentref.current.offsetHeight);

    contentref.current.scrollTop = '700px'
  }, [])
  const tothiswhsper = (e) => {
    const index = parseInt(e.target.dataset.index || e.target.parentNode.dataset.index)
    const uid2 = e.target.dataset.uid2 || e.target.parentNode.dataset.uid2
    navigate(`/${uid}/whisper/${uid2}`)
    // console.log(allcontent[index]);

    setNowindex(index)
    setNowuser(whisperlist[index])
    setContentlist(allcontent[index])
    // 清空输入框
    setText('')
    setLength(0)
  }


  const inputtext = (e) => {
    
    setText(e.target.value)
    setLength(e.target.value.length)
  }

  const tosend = async () => {
    const data = {
      uid1: uid,
      uid2: nowUser.uid2,
      content: contenttext,
      type: 0
    }
    const res = await sendMessage(data)
    
    // 本地更新
    // if (res === 200) {
    //   setText('')
    //   setLength(0)
    //   const temp = {
    //     uid1: uid,
    //     uid2: nowUser.uid2,
    //     content: contenttext,
    //     type: 0,
    //     time: '刚刚'
    //   }
    //   setContentlist([
    //     ...contentlist,
    //     temp
    //   ])
    //   // 更新左侧列表
    //   const nextkist = whisperlist.map((item,index) => {
    //     if (index === nowindex) {
    //       item.content = contenttext
    //       return item
    //     } else {
    //       return item
    //     }
    //   })      
    //   setWhisperlist(nextkist)


      // contentref.current.scroll(0, contentref.current.scrollHeight)      
      // contentref.current.scrollTop = contentref.current.scrollHeight
    // }
    console.log('success');

  }

  const inputimg = async(e) => {
    const file = e.target.files[0]

    const data = new FormData()
    data.append('uid1', uid)
    data.append('uid2', nowUser.uid2)
    data.append('type', 1)
    data.append('img', file)
    data.append('filetype', file.type.split('/')[1])
    const res = await sendImg(data)
    // const temp = {
    //   uid1: uid,
    //   uid2: nowUser.uid2,
    //   type: 1,
    //   time: '刚刚',
    //   content: URL.createObjectURL(file)
    // }
    // if (res === 200) {
    //   setContentlist([
    //     ...contentlist,
    //     temp
    //   ])
    // }
  }
  return (
    <div className="totalpage">
      <div className="toptitle">我的消息</div>
      <div className="message-containt">
        <div className="msgleft">
          <div className="replay-title">最近消息</div>
          <div className="message-list">
            {
              whisperlist.map((item, index) => 
                <div className={nowindex === index ? 'one-message active' : 'one-message'} key={item.id}
                  data-index={index} data-uid2={item.uid2}
                  onClick={tothiswhsper}
                  >
                  <img src={item.avatar} alt="" className="user-avatar" />
                  <div className="user-infos" data-index={index} data-uid2={item.uid2}>
                    <div className="user-username">{item.name}</div>
                    <div className="last-message">{item.lastContent}</div>
                  </div>
                </div>
              )
            }
          </div>
        </div>
        <div className="msgright">
          <div className="right-title">
            <span>{nowUser.name}</span>
          </div>
          <div className="right-content" ref={contentref}>
            <div className="toptopline">没有更多消息了～</div>
            {
              contentlist.map(item =>
                <div className={item.uid2 === uid ?'one-cum' : 'one-cum cum-append'} key={item.id}>
                  <div className="one-avatar">
                    { item.uid2 === uid ?
                      <img src={nowUser.avatar} alt="" className="oneuseravatar" />
                      :
                      <img src={userinfo.avatar} alt="" className="oneuseravatar" />
                      }
                  </div>
                  {
                    item.type === 0 &&
                    <div className="one-texttt">
                      <span>{item.content}</span>
                    </div>
                  }
                  {
                    item.type === 1 &&
                    <div className="imgoutbox">
                      <img src={item.content} alt="" className="oneimg" />
                    </div>
                  }
                </div>
              )
            }
          </div>
          <div className="sned-content">
            <div className="send-top">
              <div><span className="icon iconfont">&#xe8ba;
                <input type="file" className="inputfile" onChange={inputimg}/>
                </span></div>
              <div><span className="icon iconfont">&#xe667;</span></div>
            </div>
            <div className="mid-sendbox">
              <textarea name="" id="" className="sendtaxt" value={contenttext} onChange={inputtext}></textarea>
            </div>
            <div className="bottom-snedbox">
              <span className="numspan">{textlength}/500</span>
              <div className="rightsendbox" onClick={tosend}>发送</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Whisper