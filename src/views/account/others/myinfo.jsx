import { useEffect, useState } from 'react'
import './myinfo.scss'
import { useParams } from 'react-router-dom'
import { getByUid, updateUserinfo } from '../../../api/user'
import message from '../../../components/notice/notice'

function AccountInfo () {
  const params = useParams()
  const uid = params.uid
  const [userinfo, setUserinfo] = useState(() => JSON.parse(localStorage.getItem('userinfo')))

  const [newname, setNewname] = useState(userinfo.name)
  const [newintro, setNewintro] = useState(userinfo.intro)
  const [newBir, setNewbir] = useState(userinfo.birthday)

  const tosend = async () => {
    if (newname === "" && newintro === "" && newBir === "") {
      message.open({type: 'warning', content: '没有更新信息'})
      return
    }
    const data = new FormData()
    data.append('uid', uid)
      data.append('name', newname)
      data.append('intro', newintro)
      data.append('birthday', newBir)
    const res = await updateUserinfo(data)
    if (res) {
      userinfo.name = newname
      userinfo.intro = newintro
      userinfo.birthday = newBir
      localStorage.setItem('userinfo', JSON.stringify(userinfo))
      setUserinfo(userinfo)
      // 清空输入
      message.open({type: 'info', content: '个人信息已更新', flag: true})
    }
  }
  return (
    <div className="accountinfo-box">
      <div className="inff-title">
        <span className="it-span"></span>
        <span className="tt-span">个人信息</span>
      </div>
      <div className="chang-account-box">
        <div className="one-line-inp">
          <div className="left-text">昵称:</div>
          <div className="right-input">
            <input type="text"
              className="inp1"
              value={newname}  
              onChange={(e) => setNewname(e.target.value)}
              placeholder={newname}
            />
            <span className="ps-span">注: 修改一次昵称需要花费6个硬币</span>
          </div>
        </div>
        <div className="one-line-inp">
          <div className="left-text">UID:</div>
          <span className="ps-span">{userinfo.uid}</span>
        </div>
        <div className="one-line-inp">
          <div className="left-text">我的签名:</div>
          <div className="right-input">
            <textarea
              type="text"
              className="inp2"
              onChange={(e) => setNewintro(e.target.value)}
              value={newintro}
              placeholder={newintro}
            />
          </div>
        </div>
        <div className="one-line-inp" style={{marginBottom: '60px'}}>
            <div className="left-text">生日:</div>
            <div className="right-input">
              <input type="text"
                className="inp3"
                value={newBir}
                onChange={(e) => setNewbir(e.target.value)}
                placeholder={newBir}
              />
            </div>
          </div>
          <div className="send-infobox-line">
            <div className="send-infobox" onClick={tosend}>保存</div>
          </div>
      </div>
    </div>
  )
}

export default AccountInfo