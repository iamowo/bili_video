import "./Banner.scss"
import { baseurl } from "../../api"
import { useRef, useState, memo, useEffect } from "react"
import { getBanner } from "../../api/banner"

const Banner = memo((props)=> {
    const playflag = props.playflag
    const [nindex, setNindex] = useState(0)
    const [bannerlist, setBanner] = useState([]),
          [oneBannerinfo, setOneinfo] = useState()
    const timer = useRef(null)

    useEffect(() => {
      const getData = async () => {
        const res = await getBanner()
        setBanner(res)
        setOneinfo(res[0])
      }
      getData()
      timer.current = setInterval(() => {
        toright()
      }, 2000)
    }, [])
  
    const toleft = () => {
      if (nindex === 0) {
        setNindex(bannerlist.length - 1);
      } else {
        setNindex(nindex - 1)
      }
    }

    const toright = () => {
      if (nindex === bannerlist.length - 1) {
        setNindex(0);
      } else {        
        setNindex(nindex + 1)
      }
    }
  
    const tothispoint = (e) => {
      const now = parseInt(e.target.dataset.ind || e.target.parentNode.dataset.ind)    
      setNindex(now)
    }
    
    useEffect(() => {
      console.log('nindex:', nindex);
      setOneinfo(bannerlist[nindex])
    }, [nindex])

    const menter = () => {
      console.log('enter============');
      clearTimeout(timer.current)
      timer.current = null
    }
  
    const mleave = () => {
      timer.current = setInterval(() => {
        toright()
      }, 2000)
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
            <div className="btinfo">
              <div className="infosline">
                <div className="lp">
                  <div className="tp"
                    onClick={() => clicclickthis(oneBannerinfo.targetId, oneBannerinfo.type)}
                  >{oneBannerinfo?.title}</div>
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