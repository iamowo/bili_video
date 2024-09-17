import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import './index.scss'
import { useState, useRef, useEffect } from 'react'
import { uploadVideoInfos, uploadChunks, mergeChunks } from '../../../api/video'
import SparkMD5 from 'spark-md5' // 切片用
import { sendDynamic } from '../../../api/dynamic'  // 上传视频后 发送动态

function Upcenter () {
  const [upindex, setUpindex] = useState(0)  // 0视频   1 漫画

  const params = useParams()
  const uid = params.uid
  const type = params.type

  let filedata = null
  const [upprogress, setProgress] = useState('ready') //' ready uploading infos done
  const [videofile, setVideoFile] = useState(null)
  const [vidcover, setCover] = useState(null)
  const [coverhw, setCoverHw] = useState(true)    // true 宽 >= 高    flase 高 > 宽
  const [coverfile, setCoverfile] = useState('')
  const [videoname, setOldtitle] = useState('')  // 原来title，不可变
  const [titleinp, setTileler] = useState('')   // 标题
  const [introinp, setIntroinp] = useState('')  // 简介
  const [tags, setTags] = useState('')       // 字符传形式的tags
  const [ffalg, setFflag] = useState(true)
  const [atags, setAtags] = useState([])     // tags 的数组形式
  const [maintag, setMaintag] = useState('')  // 主tag  分类
  const [videoduration, setDuration] = useState(0)
  const [vidtype, setVidType] = useState('')
  const [covertype, setCoverType] = useState('')

  const [uppersent, setPersent] = useState('')

  const mtagref = useRef()
  const watchref = useRef()
  const spanref = useRef()

  const [upviewflag, setUpviewflag] = useState(false)  //上传封面页面
  const [maintaglist, setMaintaglist] = useState([
    '日常', '游戏', '音乐', '动漫', '电影', '搞笑', '电视剧', 'VLOG'
  ])

  const canvasref = useRef()

  useEffect(() => {
         
      window.addEventListener('click', (e) => {
          if (e.target.className === 'input2box'||
              e.target.className === 'icon iconfont watchmore' ||
              e.target.className === 'inp2span')
          {
            mtagref.current.style.opacity = "1"
            mtagref.current.style.translate = "0 0"
            watchref.current.style.rotate = '90deg'
          } else if ((mtagref.current != null && !mtagref.current.contains(e.target)) || e.target.className === 'one-main-tag-s') {
            mtagref.current.style.opacity = '0'
            mtagref.current.style.translate = '100vw 0'
            watchref.current.style.rotate = '0deg'
          }
      })
  },[])

  // 添加视频
  const changevideoinp = (e) => {
    // 监察文件格式，判断是不是 视频
    filedata = e.target.files[0]
    if (!filedata.type.includes('video/')) {
      alert('此文件不是视频类型')
      return
    }
    setOldtitle(filedata.name.split(".")[0])
    setTileler(filedata.name.split(".")[0])
    setVideoFile(filedata)  // 视频文件
    setVidType(e.target.files[0].type.split('/')[1])
    // 获取视频时长
    const url = URL.createObjectURL(filedata);
    const filelement = new Audio(url);
    filelement.addEventListener("loadedmetadata", function (_event) {
      let duration = filelement.duration; // 得到视频或音频的时长，单位秒
      // console.log(typeof duration);
      setDuration(Math.floor(duration))
    });
    setProgress('infos')  // 上传步骤
  }

  // 添加封面
  const addcover = (e) => {
    let cover = e.target.files[0]

    if (!cover.type.includes('image/')) {
      alert('此文件不是图片类型')
      return
    }

    const newurl = URL.createObjectURL(cover)
    const newimg = new Image()
    newimg.src = newurl    

    newimg.onload = function () {
      
      const h = parseInt(newimg.height)
      const w = parseInt(newimg.width)
      console.log(w < 960, h < 600);
      console.log(w, h);
      // 第一次检测不到宽高
      if (h !== 0 && w !== 0) {
        if (w < 960 || h < 600) {
          alert('分辨率小于 960 * 120,请重新选择')
          return
        } else {
          console.log('sb===');
          
          if (w >= h) {
            setCoverHw(true)
          } else {
            setCoverHw(false)
          }
          setCoverType(e.target.files[0].type.split('/')[1])
          setCover(newurl)
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

      console.log(canvasref.current);
      const ctx = canvasref.current.getContext('2d')
      ctx.drawImage(newimg)
    }, 100)
    
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
      console.log('111');
      
      // file = e.dataTransfer.files[0]
    } else {
      alert('请选择正确的文件类型')
    }
  }

  const touploadvideo = async (e) => {
    const updata = new FormData()   // 上传视频的信息
    updata.append('title', titleinp)
    updata.append('uid', uid)
    updata.append('intro', introinp)
    updata.append('duration', videoduration)    
    updata.append('covertype', covertype)
    updata.append('cover', coverfile)
    updata.append('maintag', maintag)
    updata.append('othertags', atags)
    const res1 = (await uploadVideoInfos(updata)) // 返回vid
    setProgress('uploading')  // 跳转到上传页面
    if (res1) {
      sendresource(res1)
    } else {
      console.log('failure1');
    }
  }

// -------------
  // 文件切片上传


  // 对文件进行处理,返回buffer数据，hashs值，后缀名，文件名
  const changeBuffer = file => {
    return new Promise(resolve => {
      let fileReader = new FileReader()
      fileReader.readAsArrayBuffer(file)
      fileReader.onload = ev => {
        let buffer = ev.target.result,
            spark = new SparkMD5.ArrayBuffer(),
            HASH,
            suffix;
        spark.append(buffer)
        HASH = spark.end()
        suffix = /\.([a-zA-X0-9]+)$/.exec(file.name)[1];
        resolve({
          buffer,
          HASH,
          suffix,
          filename: `${HASH}.%{suffix}`
        });
      }
    })
  }

  // 分片并发送
  const sendresource = async(vid) => {
    let file = videofile;
    if (!file) return
    // 处理文件
    let {
      HASH,
      suffix,         // 后缀
    } = await changeBuffer(file)

    // 文件切片处理(法二:固定大小 √)
    let max = 1024 * 100,
        count = Math.ceil(file.size / max),
        index = 0,
        index2 = 0,
        chunks = []     // 存储切片用的
    if (count > 100) {
      max = file.size / 100
      count = 100
    }
    while (index < count) {
      chunks.push({
        file: file.slice(index * max, (index + 1) * max),
        filename: `${HASH}_${index + 1}.${suffix}`
      })
      index++
    }
    
    //处理样式
    const clear = () => {
      // flagAni.value = true
      setTimeout(() => {
        window.location.reload();
      }, 1500)
    }

    // 上传成功的处理
    const complate = async () => {
      // 管控进度条
      index2++;
      let progress = Math.floor(index2 / count * 100) + '%'
      console.log('...:', progress);
      // provalue.value = (index2 / count )* 100
      // done3.value.style.width = progress
      setPersent(progress)
      // 没有上传完成
      if (index2 === count) {
        setPersent('100%')
        setProgress('done')

        // 发送动态, 后端直接发送，不用前端在发送
        // const data = {
        // 
        // }
        // const res = await sendDynamic(data)

      }
    }

    let already = []     // 断点续传，获取已经上传的部分
    // 上传每个切片给服务器
    // fname.value = file.name
    let chunknum = 0
    chunks.forEach(async chunk => {
      // 已经上传的无需在上传
      if (already.length > 0 && already.includes(chunk.filename)) {
        complate()
      }
      let fm = new FormData()
      fm.append('vid', parseInt(vid))
      fm.append('uid', uid)
      fm.append('file', chunk.file)
      fm.append('filename', chunk.filename)
      fm.append('chunsnum', count)    // chunks的数量
      fm.append('index', chunknum++)  // 当前下标
      await uploadChunks(fm).then(res => {
        if (res == 200) {
          // 进度
          complate()
          return;
        }
        // return Promise.reject('error')
      }).catch(() => {
        console.log('上传文件失败');
        // ElMessage({
        //   type: 'error'  ,
        //   message: '上传文件失败'
        // })
      })
    })
    
  }

// ----------------------------------

  const settitlea = (e) => {    
    setTileler(e.target.value)
  }

  const setintroa = (e) => {
    setIntroinp(e.target.value)
  }

  const upmore = () => {
    setProgress('ready')
    window.location.reload()
  }

  // const setTgas = (e) => {
  //   if (e.target.value != '') {
  //     console.log(e.target.value);
      
  //     setTags(e.target.value)
  //     const tagnums = e.target.value.split(",")
  //     setAtags(tagnums)
  //   } else {
  //     setTags(null)
  //     setAtags([])
  //   }
  // }

  const entertosplice = (e) => {
    if (e.key === 'Enter') {
      const nword = tags
      setAtags([
        ...atags,
        tags
      ])
      setTags('')
    }
  }

  const deletethis = (e) => {
    const ind = parseInt(e.target.dataset.index)
    setAtags(atags.filter((item, index) => {
      return index !== ind
    }))
  }
  const clickthistag = (e) => {
    const text = e.target.dataset.text
    setMaintag(text)    
  }

  const tocloseupview = (e) => {
    setUpviewflag(false)
  }

  // =============================================
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

  const ltpoint = useRef()  // 左上角点
  const rbpoint = useRef()  // 右下角点
  const img2 = useRef()     // 第二层图片
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
  return (
    <div className="upcenter-allbox">
      <div className="upcenter-box">
        <div className="up-title">
        {
          upprogress === 'ready' &&
          <div className='ready-pro'>
             <div className="one-uptype">
              <Link to={`${uid}/platform/upload/video`}>
                <span>视频投稿</span>
                {
                  upindex === 0 &&
                  <div className="active-btm"></div>
                }
              </Link>
            </div>
            {/* <div className="one-uptype">
              <Link to={`${uid}/platform/upload/mg`}>
                <span>漫画投稿</span>
                {
                  upindex === 1 &&
                  <div className="active-btm"></div>
                }
              </Link>
            </div> */}
          </div>
        }
        {
          upprogress === 'infos' &&
          <span className="upinfos-span">发布视频</span>
        }
        </div>
        <div className="up-conetnt">
          {/* video */}
          {
            type === 'video' && upprogress === 'ready' &&
            <div className="video-uploader">
              <input type="file" className="upvideo-inp" accept="video/*" onChange={changevideoinp}/>
              <span className="text-up-span">上传视频大小不超过3GB~</span>
              <div className="video-uocent">
                上传视频
              </div>
            </div>
          }
          {
            type === 'video' && upprogress === 'uploading' &&
            <div className="uploading-box">
              <span className="pro-text">上传进度: {uppersent}</span>
              <div className="progress-loading-box">
                <div className="plb-done" style={{width: uppersent}}></div>
              </div>
            </div>
          }
          {
            type === 'video' && upprogress === 'infos' &&
            <div className="infos-box-up">
              <div className="had-up-infos">
                <div className="hadupload-box">
                  <div className="hadup-box-line1">{videoname}</div>
                  <div className="hadup-box-line2">
                    <span className="icon iconfont">&#xe616;</span>
                    <span className="hadup-span">已经上传</span>
                  </div>
                </div>
              </div>
              <div className="upbox-title2">基本信息</div>
              <div className="one-upbox3">
                <div className="left-text-spancover">封面</div>
                <div className="right-coverbox">
                  <div className="upmask" onClick={() => setUpviewflag(true)}></div>
                  <span className="icon iconfont">+</span>
                  { 
                    vidcover !== null &&
                    <img src={vidcover} alt="" className="upimg" />                  
                  }
                  <div className="bottom-tow-box">
                    <span className="one-btn-toclick" onClick={() => setUpviewflag(true)}>更改封面</span>
                    <span className="two-mid-line"></span>
                    <span className="one-btn-toclick">封面模板</span>
                  </div>
                </div>
                {
                  upviewflag &&
                  <div className="upcover-view">
                    <div className="upview-box-cover">
                      <div className="ucb-top-title">
                        <div className="one-top-cvb-box">
                          <span className="ucb-span">截取封面</span>
                          <div className="ucb-active-line"></div>
                        </div>
                        <div className="one-top-cvb-box">
                          <span className="ucb-span">上传封面</span>
                          <div className="ucb-active-line"></div>
                        </div>
                        <div className="clode-upbox icon iconfont" onClick={tocloseupview}>&#xe643;</div>
                      </div>
                      <div className="ucb-content">
                          {
                            false ?
                            <div className="ubc-con1"></div>
                            :
                            <div className="ubc-con2">
                              {
                                coverfile === '' ?
                                <div className="uo-box-content"
                                  onDragOver={dragoveronbox}
                                  onDrag={dragfnc}>
                                  <input type="file" className="rightinpfile" accept='image/*' onChange={addcover}/>
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
                                            <input type="file" id="coverinput" className="rightinpfile" accept='image/*' onChange={addcover}/>
                                          </label>
                                        </div>
                                      </div>
                                      <div className="img-suit-part" ref={outbox}>
                                        <div className="mid-sui-box">
                                          <div ref={mainbox} onMouseDown={mianboxdown}
                                            onMouseMove={mainmive} onMouseUp={mainup}
                                          className={coverhw ? "suit-bx wbiggerthenh" : "suit-bx"}>
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
                }
              </div>
              <div className="one-upbox">
                <div className="left-text-span">标题</div>
                <div className="title-out-box">
                  <input type="text" className="rightinp" maxLength={60} onChange={settitlea} value={titleinp}/>
                  <div className="spical-sp1">{titleinp.length} / 60</div>
                </div>
              </div>
              <div className="one-upbox2">
                <div className="left-text-span">简介</div>
                <div className="intro-box">
                  <textarea className='rightinp' onChange={setintroa} value={introinp}></textarea>
                </div>
              </div>
              <div className="one-upbox" style={{marginTop: '30px'}}>
                <div className="left-text-span">分类</div>
                <div className="input-box-main-tag">
                  <div className="input2box">
                    <span className='inp2span' ref={spanref}>{maintag}</span>
                    <div className="icon iconfont watchmore" ref={watchref}>&#xe775;</div>
                  </div>
                    <div className="selectMaintag" ref={mtagref}>
                      <div className="maintag-title">选择主标签</div>
                      <div className="tag-content">
                        <div className="innercontent-up">
                          {
                            maintaglist.map(item =>
                              <div className="one-main-tag-s"
                              data-text={item} key={item}
                              onClick={clickthistag}
                              >{item}</div>
                            )
                          }
                        </div>
                      </div>
                    </div>
                </div>
              </div>
              <div className="one-upbox" style={{marginTop: '30px'}}>
                <div className="left-text-span">tags</div>
                <div className="input-out-box1">
                  {/* <div className="tags-list"
                     style={{opacity: atags.length > 0 && ffalg ? '0' : '1'}}> */}
                     {
                       atags.map((item, index) =>
                         <div className="onetags">
                          <span>{item}</span>
                          <span className="icon iconfont"
                            data-index={index}
                            onClick={deletethis}>&#xe7b7;</span>
                         </div>
                       )                        
                     }
                   {/* </div> */}
                   <input type="text" className="rightinptags" onChange={(e) => setTags(e.target.value)} value={tags}
                     onFocus={() => setFflag(true)}
                     onBlur={() => setFflag(false)}
                     onKeyDown={entertosplice}
                     style={{opacity: atags.length === 0 || ffalg ? '1' : '0'}}
                   />
                  <span className="ss-sp">* 按回车输入tag</span>
                  <span className="ss-sp2">{atags.length} / 10</span>
                </div>
              </div>
              <div className="upsnebtn" onClick={touploadvideo}>上传</div>
            </div>
          }
          {
            type === 'video' && upprogress === 'done' &&
            <div className="done-divbox">
              <span>视频上传完成,等待审核通过~</span>
              <div className="btnline">
                <div className="backtohome">
                  <Link to="/">返回主页</Link>
                </div>
                <div className="onemore" onClick={upmore}>继续上传</div>
              </div>
            </div>
          }
          {
            type === 'mg' &&
            <div className="mg-uploader">mg</div>
          }
        </div>
      </div>
    </div>
  )
}

export default Upcenter