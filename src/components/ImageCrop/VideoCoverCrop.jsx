import "./style/videocover.scss"
import message from "../notice/notice"
import { useState, useRef } from "react"
import { fileToBase64 } from "../../util/fnc"

const VdieoCoverCrop = (props) => {
  const {upcovertype, setUpcovertype, tocloseupview, 
        coverfile, setCoverfile, vidcover, setCover,
        videofile, setVideoFile} = props
  const [coveerhw, setCoverHw] = useState(true),  // true 宽 >= 高    flase 高 > 宽
        [covertype, setCoverType] = useState('')   // 上传封面的文件类型

  const [showimg, setShowimg] = useState() // 预览图片
  const outbox = useRef()   // 图片框
  const [imgwidth, setImgwidth] = useState()  // 图片宽度
  const [imgheight, setImgheight] = useState()  // 图片高度

  const mainbox = useRef()  // 剪裁框
  const [boxwidth, setBoxwidth] = useState()
  const [boxheight, setBoxheight] = useState()
  const [oldtop ,setOldtop] = useState()     // 剪裁框原来距离上边距离
  const [oldLeft ,setOldleft] = useState()

  const [mouseflag, setMouseflag] = useState(false)
  const [oldx, setX] = useState()  // 鼠标原来x的位置
  const [oldy, setY] = useState() 

  const ltpoint = useRef()  // 左上角点
  const rbpoint = useRef()  // 右下角点
  const img2 = useRef()     // 第二层图片

  const canvasref = useRef()

  const mainmive = (e) => {
    if (mouseflag) {
      const x = e.clientX - oldx       // 鼠标x轴移动距离
      const y = e.clientY - oldy      
      const left = mainbox.current.offsetLeft  // 框距离左边距离
      
      const movex = Math.floor(oldLeft + x)  // 向左移动距离


      if (left >= 0 && left <= imgwidth - boxwidth) {
        mainbox.current.style.left =  movex + 'px'

        // const a = mainbox.current.offsetTop + 'px'
        // const b = imgwidth - boxwidth + 'px'
        // const c = mainbox.current.clientHeight + 'px'
        // const d = left + 'px'
        // img2.current.style.clip = `rect(${a}, ${b}, ${c} ,${d})`
      }
    }
  }

  const mainup = () => {
    setMouseflag(false)
  }
  
  // 自己添加封面（将图片转化为base64格式）
  const addcover = (e) => {
    let cover = e.target.files[0]
    if (!cover.type.includes('image/')) {
      message.open({type: 'warning', content: '此文件不是图片类型'})
      return
    }

    const newurl = URL.createObjectURL(cover)
    const newimg = new Image()
    newimg.src = newurl    

    newimg.onload = function () {
      const h = parseInt(newimg.height)
      const w = parseInt(newimg.width)
      console.log(w < 480, h < 300);
      console.log(w, h);
      // 第一次检测不到宽高
      if (h !== 0 && w !== 0) {
        if (w < 480 || h < 300) {
          // alert("分辨率小于 480 * 300,请重新选择")
          message.open({type: 'warning', content: '分辨率小于 480 * 300,请重新选择', falg: true})
          return
        } else {
          if (w >= h) {
            setCoverHw(true)
          } else {
            setCoverHw(false)
          }
          setCoverType(e.target.files[0].type.split('/')[1])
          // 转base64
          fileToBase64(cover).then(res => {
            // console.log('base 64:', res);
            setCover(res)
          }).catch(e => {
            message.open({type: 'warning', content: '更换失败', flag: true})
            return
          })
          // setCover(newurl)
          setCoverfile(cover)
        }
      }
    }
    setTimeout(() => {
      newimg.onload()        // 图片加载完成
      // 设置剪切范围
      // const w = mainbox.current.clientWidth + 'px'
      // const h = mainbox.current.clientHeight + 'px'
      // img2.current.style.clip = `rect(0, ${w}, ${h} ,0)`
      // console.log(canvasref.current);
      // const ctx = canvasref.current.getContext('2d')
      // ctx.drawImage(newimg)
    }, 100)
    
  }

  const mianboxdown = (e) => {    
    e.preventDefault()  // 阻止拖拽

    setImgwidth(outbox.current.clientWidth)
    setImgheight(outbox.current.clientHeight)

    setBoxwidth(mainbox.current.clientWidth)
    setBoxheight(mainbox.current.clientHeight)

    setOldtop(mainbox.current.offsetTop)
    setOldleft(mainbox.current.offsetLeft)

    setX(e.clientX)
    setY(e.clientY)

    setMouseflag(true)

    if (mainbox.current.offsetLeft < 0) {
        mainbox.current.style.left = '0px'
    }
    if (mainbox.current.offsetLeft > imgwidth - boxwidth) {
      mainbox.current.style.left = imgwidth - boxwidth + 'px'
      
    }
  }

  const dragoveronbox = (e) => {
    // 阻止事件冒泡
    e.stopPropagation();
    // 阻止默认事件（与drop事件结合，阻止拖拽文件在浏览器打开的默认行为）
    e.preventDefault();
  }
  
  const dragfnc = (e) => {
    // 阻止事件冒泡
    e.stopPropagation();
    // 阻止默认事件（与dragover事件结合，阻止拖拽文件在浏览器打开的默认行为）
    e.preventDefault();
    // 获取拖拽上传的文件（files是个数组 此处默认限制只能上传一个）
    console.log('获取拖拽上传的文件---',e.dataTransfer.files[0]);
    if(e.dataTransfer.files[0].type.includes('video/')) {      
      // file = e.dataTransfer.files[0]
    } else {
      message.open({type: 'warning', content: '请选择正确的文件类型'})
      return
    }
  }
  return (
    <div className="upcover-view">
      <div className="upview-box-cover">
        <div className="ucb-top-title">
          <div className={upcovertype === 0 ? "one-top-cvb-box one-top-cvb-box-active" : "one-top-cvb-box"}
            onClick={() => setUpcovertype(0)}
          >
            <span className="ucb-span">截取封面</span>
            <div className="ucb-active-line"></div>
          </div>
          <div className={upcovertype === 1 ? "one-top-cvb-box one-top-cvb-box-active" : "one-top-cvb-box"}
            onClick={() => setUpcovertype(1)}
          >
            <span className="ucb-span">上传封面</span>
            <div className="ucb-active-line"></div>
          </div>
          <div className="clode-upbox icon iconfont"
            onClick={tocloseupview}
          >&#xe643;</div>
        </div>
        <div className="ucb-content">
            {
              upcovertype === 0 ?
              <div className="ubc-con1">
                <div className="cutpicture-box">
                  <div className="suit-imgbox">
                    <div className="left-changebox">
                      <div className="let-top-text">
                        <span className="ltt">拖拽选框裁剪</span>
                        <div className="ltt2">
                          <label for="coverinput" className='outlabel'>
                            <span className="iconsp icon iconfont">&#xe614; 更换封面</span>
                            <input type="file" id="coverinput" className="rightinpfile" accept='image/*'
                              onChange={addcover}
                            />
                          </label>
                        </div>
                      </div>
                      <div className="img-suit-part" ref={outbox}>
                        <div className="mid-sui-box">
                          <div ref={mainbox}
                            onMouseDown={mianboxdown}
                            onMouseMove={mainmive}
                            onMouseUp={mainup}
                            className={coveerhw ? "suit-bx wbiggerthenh" : "suit-bx"}
                          >
                            <div className="ltpoint" ref={ltpoint}></div>
                            <div className="lbpoint"></div>
                            <div className="rtpoint"></div>
                            <div className="rbpoint" ref={rbpoint}></div>
                            <div className="tline"></div>
                            <div className="rline"></div>
                            <div className="bline"></div>
                            <div className="lline"></div>
                          </div>
                          <img src={vidcover} alt="" className="suit-innerimg2" ref={img2}/>
                          <img src={vidcover} alt="" className="suit-innerimg" />
                        </div>
                      </div>
                      <div className="bottom-imginfos">
                        <span>已截取分辨率: 12 * 20</span>
                      </div>
                    </div>
                    <div className="right-showbox">
                      <div className="rs-tilte">封面预览</div>
                      <div className="yuanlanbox">
                        <img src={vidcover} alt="" className="inner-yulan" />
                      </div>
                    </div>
                  </div>
                  <div className="other-video-img"></div>
                  <div className="done-line">
                    <div className="dl-box1">使用模板封面</div>
                    <div className="dl-box2"
                      onClick={() => tocloseupview }
                    >完成</div>
                  </div>
                </div>
              </div>
              :
              <div className="ubc-con2">
                {
                  videofile === null ?
                  <div className="uo-box-content"
                    onDragOver={dragoveronbox}
                    onDrag={dragfnc}>
                    <input type="file"
                      className="rightinpfile"
                      accept='image/*'
                      onChange={addcover}
                    />
                    <span className="ubc-text">点击上传图片</span>
                  </div>
                  :
                  <div className="cutpicture-box">
                    <div className="suit-imgbox">
                      <div className="left-changebox">
                        <div className="let-top-text">
                          <span className="ltt">拖拽选框裁剪</span>
                          <div className="ltt2">
                            <label for="coverinput" className='outlabel'>
                              <span className="iconsp icon iconfont">&#xe614; 更换封面</span>
                              <input type="file" id="coverinput" className="rightinpfile" accept='image/*'
                                onChange={addcover}
                              />
                            </label>
                          </div>
                        </div>
                        <div className="img-suit-part" ref={outbox}>
                          <div className="mid-sui-box">
                            <div ref={mainbox}
                              onMouseDown={mianboxdown}
                              onMouseMove={mainmive}
                              onMouseUp={mainup}
                              className={coveerhw ? "suit-bx wbiggerthenh" : "suit-bx"}
                            >
                              <div className="ltpoint" ref={ltpoint}></div>
                              <div className="lbpoint"></div>
                              <div className="rtpoint"></div>
                              <div className="rbpoint" ref={rbpoint}></div>
                              <div className="tline"></div>
                              <div className="rline"></div>
                              <div className="bline"></div>
                              <div className="lline"></div>
                            </div>
                            <img src={vidcover} alt="" className="suit-innerimg2" ref={img2}/>
                            <img src={vidcover} alt="" className="suit-innerimg" />
                          </div>
                        </div>
                        <div className="bottom-imginfos">
                          <span>已截取分辨率: 12 * 20</span>
                        </div>
                      </div>
                      <div className="right-showbox">
                        <div className="rs-tilte">封面预览</div>
                        <div className="yuanlanbox">
                          <canvas className='canvasref' ref={canvasref}></canvas>
                          {/* <img src="" alt="" className="inner-yulan" /> */}
                        </div>
                      </div>
                    </div>
                    <div className="done-line">
                      <div className="dl-box1">使用模板封面</div>
                      <div className="dl-box2">完成</div>
                    </div>
                  </div>
                }
              </div>
            }
        </div>
      </div>
    </div>
  )
}

export default VdieoCoverCrop