import { useEffect, useRef, useState } from 'react'
import './index.scss'
import { useNavigate, useParams } from 'react-router-dom'
import { getWhisperList, sendImg, sendMessage, getWhisperConent } from '../../../api/message'
import { type } from '@testing-library/user-event/dist/type'
import { getByUid } from '../../../api/user'

function Whisper () {
  const navigate = useNavigate()
  const userinfo = JSON.parse(localStorage.getItem('userinfo'))
  const uid = userinfo.uid                  // myuid
  const params = useParams()
  const hisuid = parseInt(params.hisuid != null ? params.hisuid : -1)  // 聊天人的uid, hisuid != -1 的话，新建聊天，先查看表中有无,没有的话要新建
  
  const contentref = useRef()
  const [contentlist, setContentlist] = useState([])  // 当前的对话内容
  const [nowUser, setNowuser] = useState({})          // 当前对话用户
  const [nowindex, setNowindex] = useState(0)         // 左侧 index
  const [whisperlist, setWhisperlist] = useState([])  // 左侧聊天列表
  const [contenttext, setText] = useState("")         // 输入聊天
 
  useEffect(() => {
    const getData = async () => {
      const res = await getWhisperList(uid)
      console.log(res);
      
      setWhisperlist(res)     // 左侧聊天列表
      if (hisuid !== -1) {
        let exitFlag = -1        
        for (let i = 0; i < res.length; i++) {
          console.log(hisuid,  res[i].uid2);
          if (res[i].uid2 === hisuid) {
            exitFlag = i
            break
          }
        }
        console.log('exit flag', exitFlag);
        
        if (exitFlag === -1) {
          // 不存在这个聊天
          const userinfo = await getByUid(hisuid)
          const data = {
            uid2: userinfo.uid,
            avatar: userinfo.avatar,
            name: userinfo.name,
            lastContent: ''
          }
          setWhisperlist([
            ...res.slice(0, 0),
            data,
            ...res.slice(0)
          ])
          setNowuser(data)    // 新添加的
          setContentlist([])
        } else {
          // 存在这个聊天
          setNowuser(res[exitFlag])
          const res3 = await getWhisperConent(uid, res[exitFlag].uid2)
          setContentlist(res3)
          setNowuser(res[exitFlag])
        }        
      } else {
        // 选择第一个聊天
        const huid = parseInt(res.length > 0 ? res[0].uid2 : -1)
        if (huid !== -1) {
          // 聊天列表不为空
          const res2 = await getWhisperConent(uid, huid)
          setNowuser(res[0])
          setContentlist(res2)
        }
      }
      console.log('222');
      
    }
    getData()

    setTimeout(() => {
      console.log('111');
      
    }, 100)
  }, [])

  useEffect(() => {
    // 监听内容列表，内容列表发生改变，就拉到最新的
    contentref.current.scrollTo(0, contentref.current.scrollHeight);
  }, [contentlist])

  // 切换对话
  const tothiswhsper = async (e) => {    
    const index = parseInt(e.target.dataset.index || e.target.parentNode.dataset.index)
    const uid2 = e.target.dataset.uid2 || e.target.parentNode.dataset.uid2
    console.log('xx', index, uid2);

    navigate(`/${uid}/whisper/${uid2}`)
    
    setNowindex(index)
    setNowuser(whisperlist[index])
    const res = await getWhisperConent(uid, uid2)
    setContentlist(res)
    setText('')
  }

  // 发送信息
  const tosend = async () => {
    if (contenttext.length > 0) {
      const data = {
        uid1: uid,
        uid2: nowUser.uid2,
        content: contenttext,
        type: 0
      }
      const res = await sendMessage(data)
      if (res) {
        const res2 = await getWhisperConent(uid, nowUser.uid2)
        setContentlist(res2)
        setText("")
        // 聊天列表重新排序
        setNowuser(whisperlist[nowindex])
        setNowindex(0)
        whisperlist[nowindex].lastContent = contenttext    // 更新lastContent
        const temp = whisperlist[nowindex]
        whisperlist[nowindex] = whisperlist[0]
        whisperlist[0] = temp
        setWhisperlist(whisperlist)
      }
    } else {
      alert('输入为空')
    }
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
  }

  // 回车发送消息
  const entertosend = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      tosend()
    }
  }

  // 发送图片
  const inputimg = async(e) => {
    const file = e.target.files[0]
    const data = new FormData()
    data.append('uid1', uid)
    data.append('uid2', nowUser.uid2)
    data.append('type', 1)
    data.append('img', file)
    data.append('filetype', file.type.split('/')[1])
    const res = await sendImg(data)
    if (res) {
      const res2 = await getWhisperConent(uid, nowUser.uid2)
      setContentlist(res2)
      // 重新排序
      setNowuser(whisperlist[nowindex])
      setNowindex(0)
      whisperlist[nowindex].lastContent = '图片'    // 更新lastContent
      const temp = whisperlist[nowindex]
      whisperlist[nowindex] = whisperlist[0]
      whisperlist[0] = temp
      setWhisperlist(whisperlist)
      setText("")
    }
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
          <div className="right-content"
            ref={contentref}>
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
              <textarea name="" id="" className="sendtaxt" value={contenttext}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={entertosend}  
              ></textarea>
            </div>
            <div className="bottom-snedbox">
              <span className="numspan">{contenttext.length}/500</span>
              <div className={contenttext.length > 0 ? "rightsendbox send-able-btn" : "rightsendbox"} onClick={tosend}>发送</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Whisper