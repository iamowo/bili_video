import { memo, useEffect, useState } from "react"
import "./Userinfo.scss"
import { baseurl } from "../../api"
import { getByUidFollowed, toFollow, toUnfollow } from "../../api/user"
import message from "../notice/notice"
import { touserspace } from "../../util/fnc"

const Userinfo = memo((props) => {
  const {hisuid, myuid, setClose} = props
  const [hisinfo, setHisinfo] = useState({followed: false})
  useEffect(() => {
    const getData = async () => {
      const res = await getByUidFollowed(hisuid, myuid)
      console.log(res);
      
      setHisinfo(res)
    }
    getData()
  }, [])

  const addoneFollow = async() => {
    if (hisuid === myuid) {
      message.open({type: 'warning', content: '已经关注了自己'})
      return
    }
    await toFollow(hisuid, myuid)
    setHisinfo({
      ...hisinfo,
      followed: true
    })
    // 更新本地信息
    const localinfo = JSON.parseInt(localStorage.getItem('userinfo'))
    localinfo.follows += 1
    localStorage.setItem('userinfo', localinfo)
    message.open({type: 'info', content: '加关注', flag: true})
  }

  const cancleFollow = async(e) => {
    e.stopPropagation()
    await toUnfollow(hisuid, myuid)
    setHisinfo({
      ...hisinfo,
      followed: false
    })
    const localinfo = JSON.parseInt(localStorage.getItem('userinfo'))
    localinfo.follows += 1
    localStorage.setItem('userinfo', localinfo)
    message.open({type: 'info', content: '取消关注', flag: true})
  }

  const sendMessage = (e) => {
    e.stopPropagation()
    const uid1 = parseInt(myuid),
          uid2 = parseInt(hisuid)
    if (uid1 === -1) {
      message.open({ type: 'error', content: '请先登录'})
      return
    }
    if (uid1 === uid2) {
      message.open({type: 'error', content: '不能给自己发私信'})
      return
    }
    window.open(`/${uid1}/whisper/${uid2}`, '_blank')
    setClose({f1: -1, f2: -1, f3: -1})
  }
  return (
    <div className="usernifo-view">
      <div className="uv-bgimg"
        style={{background: `url(${baseurl}/sys/user_space2.jpg)`,
                backgroundPosition: '50% center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover'
              }}
      ></div>
      <div className="uv-info1">
        <div className="useravatarbx">
          <img src={hisinfo?.avatar} alt="" 
            data-uid={hisuid}
            onClick={touserspace}
          />
        </div>
        <div className="right-uinfo">
          <div className="u-name"
            data-uid={hisuid}
            onClick={touserspace}
          >{hisinfo?.name}</div>
          <div className="u-infos">
            <div className="ui-oneb">
              <span className="ui-sp1">{hisinfo?.follows}</span>
              <span className="ui-sp2">关注</span>
            </div>
            <div className="ui-oneb">
              <span className="ui-sp1">{hisinfo?.fans}</span>
              <span className="ui-sp2">粉丝</span>
            </div>
          </div>
        </div>
      </div>
      <div className="uv-info2">{hisinfo?.intro}</div>
      <div className="uv-btn-line">
        {
          hisinfo?.followed ?
          <div className="addfollow canclefollow"
            onClick={cancleFollow}
          >已关注</div>
          :
          <div className="addfollow"
            onClick={addoneFollow}
          >加关注</div>
        }
        <div className="sendmessag-u"
          onClick={sendMessage}
        >发消息</div>
      </div>
    </div>
  )
})

export default Userinfo
