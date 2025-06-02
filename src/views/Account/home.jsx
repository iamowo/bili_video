import { useState } from 'react'
import './scss/home.scss'
import { useParams } from 'react-router-dom'


function AccountHome () {
  const params = useParams()
  const uid = params.uid
  const [userinfo, setUserinfo] = useState(() => JSON.parse(localStorage.getItem('userinfo')))
  const [flag1, setFlag1] = useState(false)
  const [flag2, setFlag2] = useState(false)
  const [flag3, setFlag3] = useState(false)

  return (
    <div className="accounthome-box">
      <div className="user-account-info">
        <img src={userinfo.avatar} alt="" className="us-avatar" />
        <div className="ua-right-info">
          <div className="uname-acc">{userinfo.name}</div>
          <div className="ua-mang-infos">
            <div className="lv-box">
              LV{userinfo.lv}
              <div className="up-tangle"></div>
              <div className="down-tangle"></div>
            </div>
            <div className="lv-progress">
              <div className="done-lv-pro"></div>
            </div>
            <span className="lv-numtext">{userinfo.exp} / 23333</span>
          </div>
          <div className="ua-otherinfo">
            <span className="icon iconfont">&#xe617;</span>
            <span className="text-rigth-span">{1}</span>
          </div>
        </div>
      </div>
      <div className="every-day-mission">
        <div className="edm-innerbox">
          <div className="one-edm-item">
            {
              flag1 ?
              <div className="done-box icon iconfont">&#xe616;</div>
              :
              <div className="undone-box">
                <span className="sp1">5</span>
                <span className="sp2">EXP</span>
              </div>
            }
            <div className="mid-title">每日登录</div>
            {
              flag1 ?
              <div className="spnn1">以获得5经验</div>
              :
              <div className="spann2">未完成</div>
            }
          </div>
          <div className="span-dem-line"></div>
          <div className="one-edm-item">
          {
              flag2 ?
              <div className="done-box icon iconfont">&#xe616;</div>
              :
              <div className="undone-box">
                <span className="sp1">5</span>
                <span className="sp2">EXP</span>
              </div>
            }
            <div className="mid-title">每日观看视频</div>
            {
              flag2 ?
              <div className="spnn1">以获得5经验</div>
              :
              <div className="spann2">未完成</div>
            }
          </div>
          <div className="span-dem-line"></div>
          <div className="one-edm-item">
          {
              flag3 ?
              <div className="done-box icon iconfont">&#xe616;</div>
              :
              <div className="undone-box">
                <span className="sp1">5</span>
                <span className="sp2">EXP</span>
              </div>            
          }
            <div className="mid-title">每日投币</div>
            {
              flag3 ?
              <div className="spnn1">以获得5经验</div>
              :
              <div className="spann2">未完成</div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountHome