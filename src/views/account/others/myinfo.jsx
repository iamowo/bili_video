import './myinfo.scss'

function AccountInfo () {
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
            <input type="text" className="inp1" />
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
            <textarea type="text" className="inp2" />
          </div>
        </div>
        <div className="one-line-inp" style={{marginBottom: '60px'}}>
            <div className="left-text">生日:</div>
            <div className="right-input">
              <input type="text" className="inp3" />
            </div>
          </div>
          <div className="send-infobox-line">
            <div className="send-infobox">保存</div>
          </div>
      </div>
    </div>
  )
}

export default AccountInfo