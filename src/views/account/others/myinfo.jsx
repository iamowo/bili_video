import { useEffect, useState } from 'react'
import './myinfo.scss'
import { useParams } from 'react-router-dom'
import { getByUid, updateUserinfo } from '../../../api/user'

function AccountInfo () {
  const params = useParams()
  const uid = params.uid
  const [userinfo, setUserinfo] = useState(() => JSON.parse(localStorage.getItem('userinfo')))

  const [newname, setNewname] = useState('')
  const [newintro, setNewintro] = useState('')
  const [newBir, setNewbir] = useState('')

  useEffect(() => {
    // setNewname(userinfo.name)
    // setNewintro(userinfo.intro)
    // setNewbir(userinfo.birthday)
  }, [])

  const tosend = async () => {
    if (newname === "" || newintro === "" || newBir === "") {
      alert('没有更新信息')
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
              placeholder={userinfo.name}
            />
            <span className="ps-span">注: 修改一次昵称需要花费6个硬币</span>
          </div>
        </div>
        <div className="one-line-inp">
          <div className="left-text">UID:</div>
          <span className="ps-span">123</span>
        </div>
        <div className="one-line-inp">
          <div className="left-text">我的签名:</div>
          <div className="right-input">
            <textarea
              type="text"
              className="inp2"
              onChange={(e) => setNewintro(e.target.value)}
              value={newintro}
              placeholder={userinfo.intro}
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
                placeholder={userinfo.birthday}
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