import { useEffect, useRef, useState } from "react"
import { getDyanmciListWidthImg } from "../../../../api/dynamic"
import { useOutletContext, useParams } from "react-router-dom"
import { baseurl } from "../../../../api/index"

function Artical () {
  const context = useOutletContext()
  const hisuid = context.hisuid
  const [imgslist, setImglist] = useState([])

  // const [imgslist1, setImglist1] = useState([])
  // const [imgslist2, setImglist2] = useState([])
  // const [imgslist3, setImglist3] = useState([])
  // const [imgslist4, setImglist4] = useState([])
  // const [imgslist5, setImglist5] = useState([])

  const containspart = useRef()
  const imgrefs = useRef([])   // 获取多个refs


  useEffect(() => {
    const getData = async () => {
      const res = await getDyanmciListWidthImg(hisuid)
      setImglist(res)
      // console.log(res);
      
      // 开发环境下会执行两次， 导致出错
      // for (let i = 0; i < res.length; i++) {       
        // if ((i + 1 ) % 5 === 1) {
        //   setImglist1([
        //     ...imgslist1,
        //     res[i]
        //   ])
        // } else if ((i + 1 ) % 5 === 2) {
        //   setImglist2([
        //     ...imgslist2,
        //     res[i]
        //   ])
        // } else if ((i + 1 ) % 5 === 3) {
        //   setImglist3([
        //     ...imgslist3,
        //     res[i]
        //   ])
        // } else if ((i + 1 ) % 5 === 4) {
        //   setImglist4([
        //     ...imgslist4,
        //     res[i]
        //   ])
        // } else if ((i + 1 ) % 5 === 0) {
        //   setImglist5([
        //     ...imgslist5,
        //     res[i]
        //   ])
        // }
      // }
    }
    getData()
    console.log('sb');
    
    // 一个盒子的宽度
    // 用js 实现 瀑布流， 要获取每个盒子高度 translate()
    // let theWidth = Math.floor((containspart.current.clientWidth - 20 * 4) / 5)
    // console.log(imgrefs.current);
    
  }, [])
  return (
    <div>
      <div className="video-right-title-sss">
        <div>
          <span className="vrt-sp1">图文</span>
        </div>
      </div>
      {
        imgslist.length > 0 ?
        <div>
          <div className="picturecontent" ref={containspart}>
              <div className="one-colume-box">
              {
                imgslist.map( (item, index) => {
                  if ((index + 1) % 5 === 1)
                    return (
                      <div className="one-item-imgs" key={item.id} ref={imgrefs}>
                        <img src={item.imgs[0]} alt="" className="imgs-oneimg" />
                        <div className="div-bottom-img-tite">{item.content}</div>
                      </div>
                    )
                  }
                )
              }
              </div>
              <div className="one-colume-box">
              {
                imgslist.map( (item, index) => {
                  if ((index + 1) % 5 === 2)
                    return (
                      <div className="one-item-imgs" key={item.id} ref={imgrefs}>
                        <img src={item.imgs[0]} alt="" className="imgs-oneimg" />
                        <div className="div-bottom-img-tite">{item.content}</div>
                      </div>
                    )
                  }
                )
              }
              </div>
              <div className="one-colume-box">
              {
                imgslist.map( (item, index) => {
                  if ((index + 1) % 5 === 3)
                    return (
                      <div className="one-item-imgs" key={item.id} ref={imgrefs}>
                        <img src={item.imgs[0]} alt="" className="imgs-oneimg" />
                        <div className="div-bottom-img-tite">{item.content}</div>
                      </div>
                    )
                  }
                )
              }
              </div>
              <div className="one-colume-box">
              {
                imgslist.map( (item, index) => {
                  if ((index + 1) % 5 === 4)
                    return (
                      <div className="one-item-imgs" key={item.id} ref={imgrefs}>
                        <img src={item.imgs[0]} alt="" className="imgs-oneimg" />
                        <div className="div-bottom-img-tite">{item.content}</div>
                      </div>
                    )
                  }
                )
              }
              </div>
              <div className="one-colume-box">
              {
                imgslist.map( (item, index) => {
                  if ((index + 1) % 5 === 0)
                    return (
                      <div className="one-item-imgs" key={item.id} ref={imgrefs}>
                        <img src={item.imgs[0]} alt="" className="imgs-oneimg" />
                        <div className="div-bottom-img-tite">{item.content}</div>
                      </div>
                    )
                  }
                )
              }
              </div>
            </div>
        </div>
        :
        <div className="sls-out2">
          <div className="noresult-img"
            style={{background: `url(${baseurl}/sys/nodata02.png)`,
                                backgroundPosition: 'center 50px',
                                backgroundRepeat: 'no-repeat'}}>
          </div>
        </div>
      }
    </div>
  )
}

export default Artical