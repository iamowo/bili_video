import { useState } from 'react'
import style from './index.module.scss'

function Totop (proprs) {
  const scrollflag = proprs.scrollheight
  const tothetop = () => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    })
  }
  return (
    <div className={style.totop} style={{display: scrollflag ? 'block' : 'none'}}>
      <div className={style.onebox}>
        <span className="icon iconfont">&#xe61b;</span>
        <span>小窗</span>
      </div>
      <div className={style.onebox} onClick={tothetop}>
        <span className="icon iconfont">&#xe628;</span>
        <span>顶部</span>
      </div>
    </div>
  )
}

export default Totop