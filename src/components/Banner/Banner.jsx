import "./Banner.scss"
import { baseurl } from "../../api"
import { useRef, useState, memo, useEffect } from "react"

const Banner = memo((props)=> {
    const { playflag, bannerlist, listLength } = props    
    console.log('props: ', props);
    
    const [nindex, setNindex] = useState(0),
          nindexRef = useRef(0)
    const [oneBannerinfo, setOneinfo] = useState(bannerlist)
    const timer = useRef(null)

    useEffect(() => {
      startAutoPlay()
      return () => {
        stopAutoPlay()
      }
    }, [])

    // 更新
    useEffect(() => {
      nindexRef.current = nindex
    }, [nindex])

    // 开启轮播
    const startAutoPlay = () => {
      timer.current = setInterval(toright, 5000)
    }

    // 停止轮播
    const stopAutoPlay = () => {
      if (timer.current) {
        clearInterval(timer.current)
        timer.current = null
      }
    }
  
    const toleft = () => {
      setNindex((nindexRef.current - 1) % listLength)
    }

    const toright = () => {
      setNindex((nindexRef.current + 1) % listLength)
    }
  
    const tothispoint = (e) => {
      const now = parseInt(e.target.dataset.ind || e.target.parentNode.dataset.ind)    
      setNindex(now)
    }
    
    const menter = () => {
      console.log('enter');
      stopAutoPlay()
    }
  
    const mleave = () => {
      console.log('leave');
      startAutoPlay()
    }
    
    const clicclickthis = (id, type) => {
      console.log(id, type);
    }

    return (
      <div className="bannerout">
        <div className="bannerinner"
          onMouseEnter={menter}
          onMouseLeave={mleave}>
          <div className="onebannerimg">
            <div className="imgpart">
              <div className="imgs-out-box"
              style={{translate: -100 * nindex + '% 0px'}}>
                {
                  bannerlist.map((item, index) =>
                    <img key={item.id}
                      src={item.cover}
                      alt=""
                      className="thisbannerimg"
                      onClick={() => clicclickthis(item.targetId, item.type)}
                    />
                  )
                }
              </div>
            </div>
            <div className="btinfo"
              style={{background: `${bannerlist[nindex]?.bgc}`}}
            >
              <div className="infosline">
                <div className="lp">
                  <div className="tp"
                    onClick={() => clicclickthis(bannerlist[nindex].targetId, bannerlist[nindex].type)}
                  >{bannerlist[nindex]?.title}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="lipart">
            <ul className="ul-a">
              {
                bannerlist.map((item, index) =>
                  <li key={index}
                      className={index === nindex ? 'oneli li-active' : 'oneli'}
                      data-ind={index}
                      onClick={tothispoint}>
                    <div className='li-innerbox'></div>
                  </li>
                )
              }
            </ul>
          </div>
          <div className="rp">
            <div className="tol icon iconfont" onClick={toleft} style={{rotate: '-180deg'}}>&#xe775;</div>
            <div className="tor icon iconfont" onClick={toright}>&#xe775;</div>
          </div>
        </div>
      </div>
    )
  }
)

export default Banner