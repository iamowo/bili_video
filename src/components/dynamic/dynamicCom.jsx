import './dynamic.scss'

// 动态组件
function DynamicCom () {
  return (
    <div className="onedynamic">
      <div className="dy-left-box">
        <img src="" alt="" className="dy-useravatar" />
      </div>
      <div className="dy-right-box">
        <div className="dy-toptitle">
          <div className="dy-top1">阿松大</div>
          <div className="dy-top2">12.01</div>
        </div>
        <div className="dy-onecontentbox">
          <div className="dy-text">123123</div>
          <div className="dy-imgs">
            <img src="" alt="" className="dy-imgs-oneimg" />
          </div>
          <div className="dy-infos">
            <div className="dy-oneinfos-opation">
              <span className="icon iconfont">1</span>
              <span>转发</span>
            </div>
            <div className="dy-oneinfos-opation">
              <span className="icon iconfont">1</span>
              <span>8</span>
            </div>
            <div className="dy-oneinfos-opation">
              <span className="icon iconfont">1</span>
              <span>25</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DynamicCom