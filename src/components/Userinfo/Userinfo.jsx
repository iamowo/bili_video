import { memo, useEffect, useState } from "react"
import "./Userinfo.scss"
import { baseurl } from "../../api"
import { getByUidFollowed } from "../../api/user"

const Userinfo = memo((props) => {
  const {hisuid, myuid, setClose} = props
  const [hisinfo, setHisinfo] = useState()
  useEffect(() => {
    const getData = async () => {
      const res = await getByUidFollowed(hisuid, myuid)
      setHisinfo(res)
    }
    getData()
  }, [])

  const addFollow = async() => {
    setHisinfo({
      ...hisinfo,
      followed: true
    })
    const res = await getByUidFollowed(hisuid, myuid)
  }

  const cancleFollow = async() => {
    setHisinfo({
      ...hisinfo,
      followed: false
    })
    const res = await getByUidFollowed(hisuid, myuid)
  }

  const sendMessage = () => {
    setClose({f1: -1, f2: -1})
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
          <img src={hisinfo?.avatar} alt="" />
        </div>
        <div className="right-uinfo">
          <div className="u-name">{hisinfo?.name}</div>
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
          <div className="addfollow"
            onClick={addFollow}
          >加关注</div>
          :
          <div className="addfollow canclefollow"
            onClick={cancleFollow}
          >已关注</div>
        }
        <div className="sendmessag-u"
          onClick={sendMessage}
        >发消息</div>
      </div>
    </div>
  )
})

export default Userinfo
