import './Video.scss'
import Topnav from '../../components/Topnav/Topnav'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { getByVid, updateinfo, getVideoLikely, getDm, sendDm } from '../../api/video'
import { debounce } from '../../util/fnc'
import Totop from '../../components/toTop/totop'
import { getFavlist, addOneVideo, addOneFavlist } from '../../api/favlist'
import { getByUid, getByUidFollowed, toFollow, toUnfollow } from '../../api/user'
import { tovideo, touserspace } from '../../util/fnc'
import { baseurl, baseurl2 } from '../../api'
import { getVideoFormList, getUserListOne } from '../../api/videolist'
import message from '../../components/notice/notice'
import { getSeasons, getAnimationByVid, subthisAnimation, cnacleAnimation } from '../../api/animation'
import Comments from '../../components/comments/comments'
import Donate from '../../components/Donate/donate'
import Userinfo from '../../components/Userinfo/Userinfo'
import icon1static from '../../static/assets/icon1-static.png'
import icon1 from '../../static/assets/icon1.png'
import icon2static from '../../static/assets/icon2-static.png'
import icon2 from '../../static/assets/icon2.png'

function VideoPart (props) {
  const vid = +props.vid
  const userinfo = props.userinfo    // 硬币减之后，父组件更新，子组件信息无法更新
  const uid = props.uid
  const location = useLocation();

  const [timeprogress, setTimeprogress] = useState(0)   // 一直增加的时间
  const [lastwatchednunm, setLswnum] = useState(0)      // 上次观看的时间
  const [wawtchdonefal, setWdone] = useState(0)         // 是否观看完
  // const [thisvid, setThisvid] = useState({})            // video info
  const thisvid = props.thisvid

  const [nowtime ,setNowTime] = useState('00:00')       // time
  const [videoprogress, setProgress] = useState(0)      // progress
  const [loadprogress, setLoadprogress] = useState(0)   // 预加载进度
  const [fullfalg, setFullflag] = useState(false)           // 全屏
  const [clearflag, setClear] = useState(false)         // 清晰度
  const [speedflag, setSpeed] = useState(false)         // 倍速
  const [settingflag, setSettingflag] = useState(false)  // 设置
  const [setting1, setSetting1] = useState(false),       // 循环播放
        [setting2, setSetting2] = useState(false),       // 自动播放下一集
        [setting3, setSetting3] = useState(true)        // 16：9    4：3
   // 改变音量
  const [volumeheight, setVolumeHeight] = useState(100),
        [volumeopen, setVolumeopen] = useState(true),        // 静音 or 打开 声音
        [volumeflag, setVolume] = useState(false)        // 声音控制条
  const [sysflag, setSys] = useState(false)             // 设置
  const [windoflag, setWindoflag] = useState(false)     // 小屏幕
  const [windoflag2, setWindoflag2] = useState(false)   // 网页宽屏
  const [titleflag, setTitleflag] = useState(false)
  const [bottomscrollflag, setBottomScrollflag] = useState(false)
  const [favflag, setFavflag] = useState(false)    // 打开收藏框
  const [favlist, setFavlist] = useState([])             // 收藏夹列表

  const [favchecked, setFavchecked] = useState([])             // 已经选择过的收藏夹
  const [favcheckedold, setFavcheckedold] = useState([])       // 初始收藏夹状态
  const [sendFavfalg, setSendfavfalg] = useState(false)  // 初始收藏夹 ！= 改变后的， 可以提交

  const [iconflag, setIconflag] = useState(false)  //  打开 icon 页面
  const [icons, setIcons] = useState(1)            // 投币个数

  //const [dmlist, setDmlist] = useState([])         // 弹幕列表
  const dmlist = props.dmlist
  const [dmtest, setDmtext] = useState()           // 发送弹幕内容
  const [dmflag, setDmflag] = useState(true)       // 是否打开弹幕

  const playerboxref = useRef()
  const textpart = useRef()                              // 标题ref，判断是都超过宽度
  const favref = useRef()     // 收藏box的ref
  const createref = useRef()  // 新建
  const [newFavtitle, setNewfavtitle] = useState()

  const [vlist, setVlist] = useState([]),                          // 该视频所属的列表
        [vlistindex, setVlistindex] = useState(0)                  // 列表篇中当前播放的视频的index

  const [seasonlist, setSeasonlist] = useState([]),
        [seasonindex, setSeasonindex] = useState(0),
        [chapterlist, setChapterlist] = useState([]),
        [chapterindex, setChapterindex] = useState(0)


  const [taglist, settaglist] = useState([])
  const [littlewindow, setLittlewindow] = useState(false)

  const [animationinfo, setAnimationinfo] = useState({})           // anmation 的信息
  const recommendlist = props.recommendlist
  const upinfo = props.upinfo

  useEffect(() => {
    const getData = async () => {
      const res = (await getByVid(vid, uid))
      console.log('res is:', res);
      
      // 刚开始数据还没加载出来， 无法使用slice
      res.time = (res.time).slice(0, 10) + ' ' + (res.time).slice(11, 16) // 在{ } 中修改会报错
      // setThisvid(res)
      settaglist(res.tags)

      // 弹幕
      // const res2 = await getDm(vid)
      // setDmlist(res2)

      // 视频选集
      const res3 = await getVideoFormList(res.listid)
      for (let i = 0; i < res3.length; i++) {
        if (res3[i].vid === vid) {
          setVlistindex(i + 1)
        }
      }
      console.log('lid:', res.listid);
      console.log('视频集合:', res3);
      
      setVlist(res3)

      const text = res.title      
      const font = '22px PingFang SC'
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      context.font = font;
      const {
        width
      } = context.measureText(text);
      if (width >= textpart.current.clientWidth) {
        setTitleflag(true)
      } else {
        setTitleflag(false)
      }

      const res4 = await getAnimationByVid(vid, uid)
      setAnimationinfo(res4)      

      // animation list 信息
      if (res.aid !== -1 && res.aid != null) {
        console.log('=====================');
        const res5 = await getSeasons(res.aid)
        setSeasonlist(res5)
        console.log('======================res4: ', res5);
        
        for (let i = 0; i < res5.length; i++) {
          for (let j = 0; j < res5[i].length; j++) {
            if (res5[i][j].vid === vid) {
              setSeasonindex(i)
              setChapterindex(j)
              setChapterlist(res5[i])
            }
          }
        }
      }
    }
    getData()
    const distance = playerboxref.current.scrollTop + playerboxref.current.clientHeight
    window.addEventListener('scroll', () => {
      const top = document.body.scrollTop || document.documentElement.scrollTop
      if (top > distance) {
        setBottomScrollflag(true)
      } else {
        setBottomScrollflag(false)
      }
    })
  },[])

  let timer1 = null
  const enter1 = () => {
    if (timer1 !== null) {
      setSpeed(false)
      setVolume(false)
      setSettingflag(false)
      clearTimeout(timer1)
    }
    setClear(true)
  }

  const leave1 = () => {
    timer1 = setTimeout(() => {
      setClear(false)
      timer1 = null
    },500)
  }

  // 倍速
  const enter2 = () => {
    if (timer1 !== null) {
      setClear(false)
      setVolume(false)
      setSettingflag(false)
      clearTimeout(timer1)
    }
    setSpeed(true)
  }

  const leave2 = () => {
    timer1 = setTimeout(() => {
      setSpeed(false)
      timer1 = null
    },500)
  }

  // 音量
  const enter3 = () => {
    if (timer1 !== null) {
      setClear(false)
      setSpeed(false)
      setSettingflag(false)
      clearTimeout(timer1)
    }
    setVolume(true)
  }

  const leave3 = () => {
    timer1 = setTimeout(() => {
      setVolume(false)
      timer1 = null
    },500)
  }

  const enter4 = () => {
    console.log('enter444');
    
    if (timer1 !== null) {
      setClear(false)
      setSpeed(false)
      setVolume(false)
      clearTimeout(timer1)
    }
    setSettingflag(true)
  }

  const leave4 = () => {
    timer1 = setTimeout(() => {
      setSettingflag(false)
      timer1 = null
    },500)
  }

  const [speednum, setSpeednum] = useState(1)
  const changspeed = (e) => {
    console.log(e.target.dataset.sp);
    let num = e.target.dataset.sp - '0'
    setSpeednum(num)
    videoref.current.playbackRate = (num)
  }  

  const changevolume = (e) => {
    const proHeight = 100
    let height = volumeheight
    if (e.target.className === "voice-pro1") {
      height = e.target.getBoundingClientRect().top + proHeight - e.clientY
    } else if (e.target.className === "voice-pro2"){
      height = e.target.parentNode.getBoundingClientRect().top + proHeight - e.clientY
    }
    setVolumeHeight(height)
  }

  useEffect(() => {
    videoref.current.volume = volumeheight * 0.01
  }, [volumeheight])

  // 返回弹幕行
  const [dmlines, setDmlines] = useState(20),
        [freeline, setFreenline] = useState(() => new Array(20).fill(20)),
        [dmcontrolflag, setDmcontrolflag] = useState(false),
        [fontflag, setFontflag] = useState(false),
        [dmfontsize, setDmfontsize] = useState('16px'),
        [dmfontcolor, setDmfontcolor] = useState("#fff")

  const fncline = (i) => {
    console.log('i is: ', i);
    
  }

  const fonttimer = useRef()

  const dmcontrolenter = () => {
    if (fonttimer.current != null) {
      setFontflag(false)
      clearTimeout(fonttimer.current)
      fonttimer.current = null
    }
    setDmcontrolflag(true)
  }

  const dmcontrolleave = () => {
    fonttimer.current = setTimeout(() => {
      setDmcontrolflag(false)
    }, 800)
  }

  const enterfont = () => {
    if (fonttimer.current != null) {
      setDmcontrolflag(false)
      clearTimeout(fonttimer.current)
      fonttimer.current = null
    }
    setFontflag(true)
  }

  const leavefont = () => {
    fonttimer.current = setTimeout(() => {
      setFontflag(false)
    }, 800)
  }

  // 元数据加载完成
  const videoloadedmated = () => {
  // 监听全屏改变事件
  window.addEventListener("fullscreenchange", () => {
    // 全屏时为全屏元素   退出全屏时为null
    const fullelement = document.fullscreenElement      
    if (fullelement !== null && fullfalg === false) {
      setFullflag(true)
    } else if (fullelement === null){
      // 按esc时的情况
      setFullflag(false)
    }
  })
  // 键盘事件
  window.addEventListener("keydown", (e) => {
    let temodmflag = true;
    const k = e.key.toLowerCase()      
    switch (k) {
      case " ":
        e.preventDefault()
        clickvideo()
        break;
      case 'f':
        console.log('全屏');
        fullscreenfnc()
        break;
      case 'd':
        console.log('弹幕');
        setDmflag(!temodmflag)
        break;
      case 'm':
        console.log('静音');
        break;
      case ']':
        console.log('下一集');
        break;
      case '[':
        console.log('上一级');
        break;
      case 'arrowup':
        videoprogresaddnum(5)
        break;
      case 'arrowleft':
        console.log('');
        break;
      case 'arrowright':
        break;
      case 'arrowdown':
        setVolumeHeight(volumeheight - 5)
        break;
      default:
        break;
      }
    
   })
  }

  const videoprogresaddnum = (num) => {
    Promise.resolve().then(() => {
      setVolumeHeight(() => {
        if (num > 0) {
          return volumeheight > 95 ? 100 : volumeheight + 5
        } else {
          return volumeheight < 5 ? 0 : volumeheight - 5
        }
      })
    })
  }

  // 开始拖动
  let dragstart = false,
      starposition = 0,                                       // 鼠标开始的位置
      moveY = 0,                                              // y轴移动的距离
      endpositon = 0,                                         // 结束时y位置
      boxY = 0                                                // 音量距离位置

  const dragstartfnc = (e) => {
    dragstart = true
    starposition = e.clientY
    boxY = 
    console.log('start',starposition);
    document.addEventListener("mouseup", dragend)              // 拖拽结束
    document.addEventListener("mouseover", draging)            // 拖拽结束
  }
  const draging = (e) => {
    if (dragstart) {
      console.log('draging');
      moveY= e.clientX-starposition;
      console.log(moveY);
      
    }
  }

  const dragend = () => {
    dragstart = false
    console.log('dragend');
    document.removeEventListener("mouseup", dragend)
  }

  const videobox = useRef()                                     // 视频区域
  const videoref = useRef()                                     // 视频资源
  // 视频相关函数
  const [loadflag, setLoadflag] = useState(false)               // 加载完成
  const [playflag, setPlayflag] = useState(false)
  const [endflag, setEndflag] = useState(false)                 // 视频结束
  const [vidoopationflag, setVidoopationflag] = useState(true)  // 显示控制栏 true显示 false不显示

  // canplay
  const videoloaded = () => {
    console.log('canplay');
    setLoadflag(true)
  }

  const videoprogressfnc = () => {
    console.log('progressing');

    const duration = videoref.current.duration
    if (duration > 0) {
      for (let i = 0; i <videoref.current.buffered.length; i++) {
        if (videoref.current.buffered.start(videoref.current.buffered.length - 1 - i) < videoref.current.currentTime) {
            const loadpro = (videoref.current.buffered.end(videoref.current.buffered.length - 1 - i) * 100) / duration
            setLoadprogress(loadpro)
          }
      }
    }
    
  }

  // playing 	当音频/视频在因缓冲而暂停或停止后已就绪时触发。
  const videoplating = () => {
    console.log('加载完成playing');
    
  }

  const videoseeking = () => {
    console.log('开始跳跃');
  }

  const videoseeked = () => {
    console.log('end跳跃');
  }

  // play 播放时触发
  const videoplay = () => {
    setPlayflag(true)
  }
  // pause  手动暂停  跳转时加载暂停
  const videopause = () => {
    console.log('pause');  
  }

  // 视频加载等待。当视频由于需要缓冲下一帧而停止，等待时触发
  const videowating = () => {
    console.log('正在缓冲',videoref.current.buffered);
  }
  
  const videoerror = () => {
    // 视频error
    console.log('video error');
    // setLoadflag(false)
  }

  // opupdate 当目前的播放位置已更改时触发。
  const videotimeupdate  = () => {    
    const duration = videoref.current.duration
    const now = videoref.current.currentTime
    setTimeprogress(now)
    // console.log('now: ', now);
    
    setLswnum(now)
    setProgress(now / duration * 100)

    let mm = Math.floor(now / 60) > 10 ? '' + Math.floor(now / 60) : '0' + Math.floor(now / 60)
    let ss = now % 60 > 10 ? '' + Math.floor(now % 60) : '0' + Math.floor(now % 60)
    if (now >= 3600) {
      let hh = Math.floor(now / 3600) > 10 ? '' + Math.floor(now / 3600) : '0' + Math.floor(now/ 3600)
      setNowTime(hh + ":" + mm + ":" + ss)
    } else {
      setNowTime(+ mm + ":" + ss)
    }

  }

  // pleyend  视频播放完
  const playend = () => {
    setEndflag(true)
  }

  const [clicked, setcliceked] = useState(false)  // 播放了视频
  const clicktimer = null             // 双击时不触发单击 1. 定时器  2. 记录点击次数
  const clickvideo = async () => {
    console.log('点击了视频 播放or暂停');
    
    if (clicktimer != null) {
      clearTimeout(clicktimer)
      clicktimer = null
      return
    }
    if (loadflag === true) {
      if (videoref.current.paused) {
        setTimeout(async () => {
          videoref.current.play()
          setPlayflag(true)
          setcliceked(true)
          if (thisvid.lastweatched === 0) {
            const data = {
              uid: userinfo.uid,
              vid: vid,
              type: 0,
              lastwatched: 1,
              done: 0
            }
            const res = await updateinfo(data)
            console.log('res: ', res);
            
            if (res === 0) {
              props.setThisvid({
                ...thisvid,
                plays: thisvid.plays + 1,
                lastwatched: 1
              })
            }
          }
        }, 150)
      } else if (videoref.current.play) {
        videoref.current.pause()
        setPlayflag(false)
      }
    }
  }

  // 双击
  const handledoubleclick = () => {
    fullscreenfnc()
  }

  // 全屏事件
  const fullscreenfnc = () => {   
    if (document.fullscreenEnabled) {      
      if (!fullfalg && document.fullscreenElement === null) {        
        videobox.current.requestFullscreen()
        setFullflag(true)
      } else {        
        if (document.fullscreenElement !== null) {
          document.exitFullscreen()
          setFullflag(false)
        }
      }
    }    
  }
  
  // 移动事件
  const bottomopationTimer = useRef()
  let enterflag = false
  // 鼠标在视频中移动时间
  const mousemoveonmask = () => {
    setVidoopationflag(true)
    if (bottomopationTimer.current != null) {
      clearTimeout(bottomopationTimer.current)
      bottomopationTimer.current = null
      return
    }
    bottomopationTimer.current = setTimeout(() => {
      setVidoopationflag(false)
    }, 2000)
  }

  // mover2
  const mover2 = (e) => {
    e.stopPropagation()
    if (!vidoopationflag) {
      setVidoopationflag(true)
    }
  }

  // 进入底部操作框
  const entervop = () => {
    setVidoopationflag(true)
    clearTimeout(bottomopationTimer.current)
    enterflag = true  
  }

  // 离开底部操作框
  const leaveop = () => {
    enterflag = false
    bottomopationTimer.current = setTimeout(() => {        
      setVidoopationflag(false)
    },2000)
  }

  // 离开视频区域
  const leavevideopart = () => {    
    enterflag = false
    bottomopationTimer.current = setTimeout(() => {        
      setVidoopationflag(false)
    },2000)
  }

  const progressref = useRef()
  // 点击进度条,跳转
  const tothitime = (e) => {
    // 里面有各种位置信息 
    const proLength = progressref.current.clientWidth     // 进度条条宽度
    const clickX = e.clientX                              // 点击位置距离屏幕左侧距离
    const progressrefLeft = progressref.current.getBoundingClientRect().left
    const clickPositon = clickX - progressrefLeft         // 点击位置，距离左侧的距离
    let pro = (clickPositon / proLength)                  // 进度
    const duration = videoref.current.duration
    videoref.current.currentTime = Math.floor(duration * pro)
    if (videoref.current.pause) {
      setTimeout(() => {
        videoref.current.play()
      }, 150)
    }
  }

  // 点赞 投币 收藏 转发
  const clickbtn = async (e) => {
    e.stopPropagation()
    if (userinfo === null) {
      message.open({ type: 'error', content: '请先登录'})
      return;
    }
    console.log(e.target.className, e.target.parentNode.className);
    
    if (e.target.className.includes('onepart') || e.target.parentNode.className.includes('onepart')
        || e.target.className === 'iconbox-a' || e.target.parentNode.className === 'iconbox-a'
    ) {
      const type = parseInt(e.target.dataset.type || e.target.parentNode.dataset.type)      
      if (type === 3) {   // 收藏
        // 获得收藏列表
        const res = await getFavlist(userinfo.uid, vid)
        if (res) {
          setFavlist(res)
          const nums = res.map(item => item.collected)
          setFavchecked(nums)
          setFavcheckedold(nums)

          // window.addEventListener("click", (e) => {
          //   if (favflag === true) {
          //     const tar = e.target      
          //     setTimeout(() => {
          //       if (!favref.current.contains(tar)) {
          //         setFavflag(false)                  
          //       }
          //     },200)
          //   }
          // })
        }
        setFavflag(true)   // 开打收藏box
      } else if (type === 2) {
        // 打开投币页面
        if (thisvid.iconed === false) {
          setIconflag(true)
        } else {
          message.open({ type: 'info', content: '已经投币不能重复~'})
        }
      } else {
        const data = {
          hisuid: thisvid.uid,
          uid: userinfo.uid,
          vid: vid,
          type: type,
          // fid: type === 3 ? 0 : null
        }
        const res = (await updateinfo(data))
        if (res === 1) {
          // 点赞
          if (thisvid.liked === false) {
            props.setThisvid({
              ...thisvid,
              likes: thisvid.likes + 1,
              liked: !thisvid.liked
            })
            message.open({ type: 'info', content: '点赞', flag: true})
          } else {
            props.setThisvid({
              ...thisvid,
              likes: thisvid.likes - 1,
              liked: !thisvid.liked
            })
            message.open({ type: 'info', content: '取消点赞', flag: true})
          }
        }
        // else if (res === 3) {
        //   setThisvid({
        //     ...thisvid,
        //     favorites: thisvid.favorites + 1,
        //     faved: !thisvid.faved
        //   })
        // }
        else if (res === 4){
          // 分享
          // http://localhost:3000/video/84
          // let content = 'http://localhost:3000' + location.pathname
          let content = "[" + thisvid.title + "] " + baseurl2 + location.pathname

          var aux = document.createElement("input"); 
          aux.setAttribute("value", content); 
          document.body.appendChild(aux); 
          aux.select();
          document.execCommand("copy"); 
          document.body.removeChild(aux);
          props.setThisvid({
            ...thisvid,
            shares: thisvid.shares + 1 
          })
          message.open({type: 'info', content: '已复制链接到剪切板', flag: true})
        }
      }
    }
  }

// 关闭页面是触发
  window.addEventListener('beforeunload', async() => {
    // document.addEventListener('visibilitychange', async() => {
      // 如果播放了视频，更新数据， 否则不用
        if (clicked) {
          const data = {
            uid: userinfo.uid,
            vid: vid,
            type: 0,
            lastwatched: videoref.current.currentTime,
            done: wawtchdonefal
          }
          await updateinfo(data)
        }
        return
  })

  const switchfnc = () => {
    switch (speednum) {
      case 2.0:
        return <span>2.0</span>
      case 1.5:
        return <span>1.5</span>
      case 1.25:
        return <span>1.25</span>
      case 1:
        return <span>倍速</span>
      case 0.75:
        return <span>0.75</span>
      case 0.5:
        return <span>0.5</span>
      default:
        return <span>倍速</span>
    }
  }
  
  const [titlestyle, setTitlestyle] = useState(false)
  const opentitle = () => {
    setTitlestyle(!titlestyle)    
  }

  const clicktag = (e) => {
    if (e.target.className === 'onetag' || e.target.className === 'onetag onetagsp') {
      console.log('233');
      
    }
  }

  // 选择这个收藏夹
  const choivethisfavlist = (e) => {

    const index = parseInt(e.target.dataset.index || e.target.parentNode.dataset.index)
    const fid = parseInt(e.target.dataset.fid || e.target.parentNode.dataset.fid)
    
    const newarray = favchecked.map((item, ind) => {
      if (ind === index) {
        return !item
      } else {
        return item
      }
    })    
    setFavchecked(newarray)

    console.log(newarray);
    console.log(favcheckedold);
    
    // 收藏夹发生了改变
    let changflag = false
    for (let i = 0; i < newarray.length; i++) {
      if (newarray[i] !== favcheckedold[i]) {
        changflag = true
        break
      }
    }
    if (changflag === true) {
      setSendfavfalg(true)        // 发生了改变
    } else {
      setSendfavfalg(false)
    }
    
  }

  const [sahreflag, setShareflag] = useState(true)
  const [createflag, setCreateflag] = useState(true)
  const createbox = useRef()

  const clickcreatebox = (e) => {    
    // if (createbox.current.contains(e.target)) {
    //   console.log('no');
    // } else {
    //   setCreateflag(true)
    // }
  }

  // 新建收藏夹
  const tocreatenewfav = async () => {
    const title = newFavtitle
    console.log(title);
    const res = await addOneFavlist(uid, title, 0)
    if (res) {
      setFavlist(res)
    }
    setCreateflag(true)  // 关闭新建框
    setNewfavtitle('')
  }

  // 收藏
  const tofavoriteone = async () => {
    if (sendFavfalg) {
      let num = 0
      const checked = favlist.map((item, index) => {
        if (favchecked[index] === favcheckedold[index]) {
          return 0        // 不改变
        } else if (favchecked[index] === true && favcheckedold[index] === false) {
          num += 1
          return 1    // 收藏
        } else if (favchecked[index] === false && favcheckedold[index] === true){
          num -= 1
          return -1         // 取消收藏
        }
      })
      const fids = favlist.map(item => item.fid)
      const data = {
        uid: userinfo.uid,
        fids: fids,
        type: checked,
        vid: vid
      }
      console.log(data);
      const res = await addOneVideo(data)
      if (res) {
        message.open({ type: 'info', content: num > 0 ? '添加收藏' : '取消收藏', flag: true})
        closefavbox()  // 关闭收藏页面
        props.setThisvid({
          ...thisvid,
          favorites: thisvid.favorites + num,
          faved: !thisvid.faved
        })
      }
    } else {
      message.open({ type: 'warning', content: '未选择收藏夹'})
    }
  }

  // 关闭收藏页面
  const closefavbox = () => {
    setFavflag(false)
    // 清除数据
    setSendfavfalg(false)
    setFavchecked([])
    setCreateflag(true)  // 关闭新建框
  }

  // 确认投币
  const snedconbtn = async () => {
    if (userinfo.icons >= icons) {
      const data = {
        uid: userinfo.uid,
        vid: vid,
        icons: icons,
        type: 2,
        // fid: type === 3 ? 0 : null
      }
      const res = await updateinfo(data)
      if (res) {
        props.setThisvid({
          ...thisvid,
          icons: thisvid.icons + icons,
          iconed: true               // 投币不能撤回
        })
      }
      // 更新视频信息

     // 子传父 更新用户信息
      props.updateuser()
      setIconflag(0)
      message.open({ type: 'info', content: '已投币~', falg: true})
    } else {
      setIconflag(0)
      message.open({ type: 'error', content: '剩余硬币不足'})
    }
  }

  const tothiskeyword = (e) => {
    const index = parseInt(e.target.dataset.index)
    const w = e.target.dataset.word
    if (index === 0) {
      window.open(`/channels/${w}`, '_blank')
    } else {
      window.open(`/all/${w}/${uid}`, '_blank')
    }
  }

  // 关闭 创建新收藏夹
  const toclosecreate = (e) => {
    if (createflag === false) {
      console.log(e.target);
      
      const tar = e.target
      if (tar.className !== 'box11-d12' &&
        tar.className !== 'createnewfav') {
        setCreateflag(true)
      }
    }
  }

  const tosendm = async () => {
    if (uid === -1) {
      message.open({ type: 'error', content: '请先登录'})
      return
    }
    if (dmflag) {
      if (dmtest === '' || dmtest === null) {
        message.open({ type: 'error', content: '输入内容为空'})
        return
      }
      const data = {
        text: dmtest,
        uid: uid,
        vid: vid,
        sendtime: timeprogress,
        color: dmfontcolor,
        type: 0,
      }
      const res = await sendDm(data)
      console.log(data);
      
      if (res) {
        console.log('send dm successfuly');
        props.setDmlist(res)
        setDmtext("")
      }
    }
  }

  // 上一个视频
  const navigate = useNavigate()
  const prvvideo = () => {
    navigate(`/video/${vlist[vlistindex - 2].vid}`)
    document.location.reload()
  }

  // 下一个视频
  const nextvideo = () => {
    navigate(`/video/${vlist[vlistindex].vid}`)
    document.location.reload()
  }

  const prvanima = () => {
    let prvtVid = chapterlist[chapterindex - 1].vid
    navigate(`/video/${prvtVid}`)
    document.location.reload()
  }

  const nextanima = () => {
    let nextVid = chapterlist[chapterindex + 1].vid
    navigate(`/video/${nextVid}`)
    document.location.reload()
  }

  // 重播
  const replayvideo = (e) => {
    e.stopPropagation()
    videoref.current.currentTime = 0;
    videoref.current.play()
    setEndflag(false)
  }

  useEffect(() => {
    console.log('???', endflag);
    
  },[endflag])
  // 关注
  const tofollowuser = async (e) => {
    e.stopPropagation()
    const uid2 = parseInt(e.target.dataset.uid2)
    if (uid === -1 || uid === null) {
      message.open({ type: 'error', content: '请先登录'})
      return
    }
    if (uid === uid2) {
      message.open({ type: 'info', content: '已经关注了自己'})
      return
    }
    const res = await toFollow(uid2, uid)
    props.setUpinfo({
      ...upinfo,
      followed: true
    })
    props.setUserinfo({
      ...props.userinfo,
      follows: props.userinfo.follows + 1
    })
    props.userinfo.follows = props.userinfo.follows + 1
    localStorage.setItem('userinfo', JSON.stringify(props.userinfo))
    message.open({type: 'info', content: '已关注', flag: true})
  }

  // 取消关注
  const canclefollowuser = async (e) => {
    e.stopPropagation()
    if (uid === -1) {
      message.open({ type: 'error', content: '请先登录'})
      return
    }
    const uid2 = e.target.dataset.uid2
    const res = await toUnfollow(uid2, uid)
    props.setUpinfo({
      ...upinfo,
      followed: false,
    })
    props.setUserinfo({
      ...props.userinfo,
      follows: props.userinfo.follows - 1
    })
    props.userinfo.follows = props.userinfo.follows - 1
    localStorage.setItem('userinfo', JSON.stringify(props.userinfo))
    message.open({type: 'info', content: '取消关注', flag: true})
  }

  const tosunanima = async (aid) => {
    const res = await subthisAnimation(uid, aid)
    if (res) {
      setAnimationinfo({
        ...animationinfo,
        liked: true
      })
      message.open({type: 'info', content: '已追番', flag: true})
    }
  }

  const tounsubanima = async (aid) => {
    const res = await cnacleAnimation(uid, aid)
    if (res) {
      setAnimationinfo({
        ...animationinfo,
        liked: false
      })
      message.open({type: 'info', content: '取消追番', flag: true})
    }
  }
  return (
    <>
      <Totop 
        scrollheight={bottomscrollflag}
      />
      <div className="topinfovid">
        <div className={titlestyle ? "top-all-part stybe-topbox" : "top-all-part stybe-topbox2"}>
          <div className="titlelin">
            <div className="textpart" ref={textpart}>
              { thisvid.title }</div>
            <div className="noreicon" style={{rotate: titlestyle ? '180deg' : '0deg'}} onClick={opentitle}>
              { titleflag &&
                <span className="icon iconfont">&#xe624;</span>            
              }
            </div>
          </div>
          <div className="infosline">
            <div className="infodiv">
              <span className="icon iconfont" style={{fontSize: '13px'}}>&#xe6b8;</span>
              <span className="infonums">{thisvid.plays}</span>
            </div>
            <div className="infodiv">
              <span className="icon iconfont">&#xe666;</span>
              <span className="infonums">{ thisvid.danmus }</span>
            </div>
            <div className="infodiv">
              <span className="infonums">{ thisvid.time }</span>
            </div>
            <div className="infodiv">
              <span className="icon iconfont" style={{color: "red"}}>&#xe69f;</span>
              <span className="infonums">未经授权,禁止转载</span>
            </div>
          </div>
        </div>
      </div>
      <div className={props.widthscreen ? "playerbox playerbox-active" : "playerbox"}
        ref={playerboxref}
        // style={{width: props.widthscreen ? '1495px' : '100%',
        //         height: props.widthscreen ? '824px' : 'fit-content'}}
        >
        <div className="videobox" ref={videobox}
        // style={{height: props.widthscreen ? '768px' : '600px'}}
        >
            <div className="loadingsp" style={{display: playflag ? 'none' : 'flex'}}>
              <div className='lltext'>加载中</div>
              <div className="rightanima">
                <div className='icon iconfont nb1'>&#xec1e;</div>
                <div className='icon iconfont nb2'>&#xec1e;</div>
                <div className='icon iconfont nb3'>&#xec1e;</div>
                <div className='icon iconfont nb4'>&#xec1e;</div>
              </div>
          </div>
          <div className="vodepinnerbox">
            <video
              src={thisvid != null ? thisvid.path : null}
              ref={videoref}
              onCanPlay={videoloaded}
              onProgress={videoprogressfnc}
              onTimeUpdate={videotimeupdate}
              onPlaying={videoplating}
              // onSeeking={videoseeking}
              // onSeeked={videoseeked}
              onWaiting={videowating}
              onEnded={playend}
              onPlay={videoplay}
              onPause={videopause}
              onError={videoerror}
              onLoadedMetadata={videoloadedmated}
              className='videosrc'>
            </video>
          </div>
          {
            !playflag &&
            <span className="pausespan icon iconfont">&#xe6ab;</span>
          }
          <div className="vide-mask-over"
            onMouseMove={mousemoveonmask}
            onClick={clickvideo}
            onDoubleClick={handledoubleclick}
            onMouseLeave={leavevideopart}
            >
              {
                endflag &&
                <div className="end-view"
                  onClick={replayvideo}
                >
                  <div className="video-end-box">
                    <div className="userinfo-line">
                      <div className="recom-img-box">
                        <img src={upinfo.avatar} alt="" className="user-reco-avatar"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(`/${upinfo?.uid}`, "blank")
                          }}
                        />
                      </div>
                      <div className="reco-info2">
                        <div className="reco-user-name">
                          <span
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(`/${upinfo?.uid}`, "blank")
                            }}
                          >
                          {upinfo?.name}
                          </span>
                        </div>
                        {
                          upinfo?.followed ?
                          <div className="reco-sub-btn spbtnfollow"
                            data-uid2={upinfo?.uid}
                            onClick={canclefollowuser}
                          >取消关注</div>
                          :
                          <div className="reco-sub-btn"
                            data-uid2={upinfo?.uid}
                            onClick={tofollowuser}
                          >+ 关注</div>
                        }
                      </div>
                      <div className="remo-right-info">
                        <div className="repaly-box">
                          <div className="iconbox-a"
                            onClick={replayvideo}
                          >
                            <span className="icon iconfont">&#xe615;</span>
                            <span className="icon-text-sp">重播</span>
                          </div>
                        </div>
                        <div className="onter-icons"
                          onClick={clickbtn}
                        >
                          <div className="iconbox-a"
                            data-type="1"
                            style={{color: thisvid?.liked ? '#32aeec' : '#fff'}}
                          >
                            <span className="icon iconfont">&#xe61c;</span>
                            <span className="icon-text-sp">点赞</span>
                          </div>
                          <div className="iconbox-a"
                            data-type="2"
                            style={{color: thisvid?.iconed ? '#32aeec' : '#fff'}}
                          >
                            <span className="icon iconfont">&#xe617;</span>
                            <span className="icon-text-sp">投币</span>
                          </div>
                          <div className="iconbox-a"
                            data-type="3"
                            style={{color: thisvid?.faved ? '#32aeec' : '#fff'}}
                          >
                            <span className="icon iconfont">&#xe630;</span>
                            <span className="icon-text-sp">收藏</span>
                          </div>
                          <div className="iconbox-a"
                            data-type="4"
                          >
                            <span className="icon iconfont">&#xe633;</span>
                            <span className="icon-text-sp">转发</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="recommend-box">
                      <div className="remoccend-title">相关推荐</div>
                      <div className="recom-videos">
                        {
                          recommendlist.map(item =>
                            <div className="one-reco-video"
                              key={item.vid}
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(`/video/${item.vid}`, "_blank")
                              }}
                            >
                              <img src={item.cover} alt="" className="recommend-cover" />
                              <div className="vidoebox-mask"></div>
                              <div className="reco-titlebox">{item.cover}</div>
                            </div>
                          )
                        }
                      </div>
                    </div>
                  </div>
                </div>
              }
              {
                dmflag && dmlist.map((item, index) =>
                  item.type === 0 ?
                    <div className="danmu-div"
                      key={item.id}
                      style={{animationPlayState: playflag ? 'running' : 'paused',
                            color: (item.color) + '',
                            textDecorationLine: (item.uid === uid) ? 'underline' : 'none',
                            top: (index % 20 * 25 + 10) + 'px',
                            fontSize: '16px',
                            display: item.sendtime <= timeprogress && item.sendtime + 10 >= timeprogress ? "block" : "none"
                    }}
                    onMouseEnter={(e) =>
                      e.target.style.animationPlayState = 'paused'
                    }
                    onMouseLeave={(e) => 
                      e.target.style.animationPlayState = 'running'                      
                    }
                    >{item.text}</div>
                  :
                    <div className="danmu-div" key={item.id}
                    style={{animationPlayState: playflag ? 'running' : 'paused',
                            color: (item.color) + '',
                            textDecorationLine: (item.uid === uid) ? 'underline' : 'none',
                            top: (index % 20 * 25 + 10) + 'px',
                            fontSize: '16px'
                    }}>{item.text}</div> 
                )
              }
          </div>
          {/* 视频控制 */}
          {
            !endflag &&
            <div className="topmask"
              style={{opacity: vidoopationflag ? '1' : '0'}}
            ></div>
          }
          <div
            className={fullfalg ? "videobottomcof videobottomcof-active" : "videobottomcof"}
            style={{opacity: vidoopationflag ? '1' : '0'}}
            onMouseMove={mover2}
            onMouseEnter={entervop}
            onMouseLeave={leaveop}
            >
            <div className="progressbox"
              ref={progressref}
              onClick={tothitime}
            >
              <div className="loadprogress"
                onClick={tothitime}
                style={{width: loadprogress + "%"}}
              ></div>
              <div className="done-box"
                onClick={tothitime}
                style={{width: videoprogress + '%'}}
              ></div>
            </div>
            <div className="videoopationbox">
              <div className="vidconleft">
                {
                  vlist.length > 0 && vlistindex - 1 > 0 &&
                  <div className="out111">
                    <div className="leftinnerspan icon iconfont"
                      style={{rotate: '-180deg'}}
                      onClick={prvvideo}
                    >&#xe609;</div>
                  </div>
                }
                {
                  chapterlist.length > 0 && chapterindex  > 0 &&
                  <div className="out111">
                    <div className="leftinnerspan icon iconfont"
                      style={{rotate: '-180deg'}}
                      onClick={prvanima}
                    >&#xe609;</div>
                  </div>
                }
                {
                  playflag ?
                  <span className="icon iconfont"
                    onClick={clickvideo}
                  >&#xea81;</span>
                  :
                  <span className="icon iconfont"
                    onClick={clickvideo}
                  >&#xe60f;</span>
                }
                {
                  vlist.length > 0 && vlistindex < vlist.length &&
                    <div className="nextvideo icon iconfont"
                      onClick={nextvideo}
                    >&#xe609;</div>
                }
                {
                  chapterlist.length > 0 && chapterindex < chapterlist.length - 1 &&
                    <div className="nextvideo icon iconfont"
                      onClick={nextanima}
                    >&#xe609;</div>
                }
                <span className="timerspan">
                  {nowtime} / {thisvid.vidlong}
                </span>
              </div>
              <div className="mid-dm-box">
                {
                  fullfalg &&
                  <div className="mid-dm">
                    <div className="danmuopen icon iconfont" onClick={() => setDmflag(!dmflag)}>&#xe61f;
                      {
                        dmflag ?
                        <div className="innericon icon iconfont">&#xe69e;</div>
                        :
                        <div className="innericon2 icon iconfont">&#xe7b7;</div>
                      }
                    </div>
                    <div className="danmuopen icon iconfont">
                      <span className='icon iconfont'
                        onMouseEnter={dmcontrolenter}
                        onMouseLeave={dmcontrolleave}
                      >&#xe60d;</span>
                      {
                        dmcontrolflag &&
                        <div className="fontcontrol-box"
                          onMouseEnter={dmcontrolenter}
                          onMouseLeave={dmcontrolleave}
                        >
                          <div className="con-box-title1">弹幕字体大小</div>
                          <input type="range" className="changfont" />
                            <div className="con-box-title1">弹幕速度</div>
                          <input type="range" className="changfont" />
                            <div className="con-box-title1">弹幕行数</div>
                          <input type="range" className="changfont" />
                        </div> 
                      }
                    </div>
                    <div className="danmusnedbox">
                      {
                        dmflag &&
                        <div className="leftfonts">
                          <span className='icon iconfont'
                            onMouseEnter={enterfont}
                            onMouseLeave={leavefont}
                          >&#xe64d;</span>
                        </div>
                      }
                      {
                        fontflag &&
                        <div className="dmfontcontrol-box"
                          onMouseEnter={enterfont}
                          onMouseLeave={leavefont}
                        >
                          <div className="tit-line1">
                            <span>颜色</span>
                            <div className="colorbox"
                              style={{backgroundColor: dmfontcolor + ""}}
                            ></div>
                          </div>
                          <input type="text" className="inpcolor"
                            value={dmfontcolor}
                            onChange={(e) => setDmfontcolor(e.target.value)}
                          />
                        </div>
                      }
                      {
                        dmflag ?
                        <input type="text" className="inputdanmu"
                          value={dmtest}
                          onChange={(e) => {
                            e.preventDefault()
                            setDmtext(e.target.value)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {tosendm()}
                          }}
                        placeholder='发一条弹幕吧~'/>
                        :
                        <div className="dm-close-box">弹幕已关闭</div>
                      }
                      <div className={dmflag ? "rightbtn" : "rightbtn notsend"} onClick={tosendm}>发送</div>
                    </div>
                  </div>
                }
              </div>
              <div className="vidconright">
                <div className='outtbox'>
                  <div className='textspan' onMouseEnter={enter1} onMouseLeave={leave1}>清晰度</div>
                  {clearflag && 
                    <div className="appendbox1"  onMouseEnter={enter1} onMouseLeave={leave1}>
                      <div className="onevv">1080P 高清</div>
                      <div className="onevv">720P 高清</div>
                      <div className="onevv">360P 流畅</div>
                    </div>
                  }
                </div>
                <div className='outtbox outbox2'>
                  <div className='textspan'
                    onMouseEnter={enter2}
                    onMouseLeave={leave2}>
                      { 
                        switchfnc(speednum)
                      }
                    </div>
                  {
                    speedflag && 
                    <div className="appendbox2" 
                      onMouseEnter={enter2}
                      onMouseLeave={leave2}
                      onClick={changspeed}
                      >
                      <div className="onevv" data-sp='2.0'>2.0x</div>
                      <div className="onevv" data-sp='1.5'>1.5x</div>
                      <div className="onevv" data-sp='1.25'>1.25x</div>
                      <div className="onevv" data-sp='1.0'>1.0x</div>
                      <div className="onevv" data-sp='0.75'>0.75x</div>
                      <div className="onevv" data-sp='0.5'>0.5x</div>
                    </div>
                  }
                </div>
                <div className='outtbox'>
                  {
                    volumeopen ?
                    <span className='icon iconfont sp11'
                      onMouseEnter={enter3}
                      onMouseLeave={leave3}
                      onClick={() => {
                        setVolumeopen(false)
                        videoref.current.volume = 0
                      }}
                    >&#xea11;</span>
                    :
                    <span className='icon iconfont sp12'
                      onMouseEnter={enter3}
                      onMouseLeave={leave3}
                      onClick={() => {
                        setVolumeopen(true)
                        videoref.current.volume = (volumeheight * 0.01)
                      }}
                      >&#xea0f;</span> 
                  }
                  {
                    volumeflag && 
                      <div className="appendbox3"
                        onMouseEnter={enter3}
                        onMouseLeave={leave3}
                        onClick={changevolume}
                    >
                      <div className="voicenum">{volumeheight}</div>
                      <div className="voiceprogress">
                        <div className="voice-pro1">
                          <div className="voice-pro2"
                            style={{height: `${volumeheight}%`}}
                          >
                            <div className="drag-btn"
                              onMouseDown={dragstartfnc}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </div>
                <div className='outtbox'>
                  <span className='icon iconfont sp21'
                    onMouseEnter={enter4}
                    onMouseLeave={leave4}
                  >&#xe602;</span>
                  {
                    settingflag &&
                    <div className="appendbox4"
                      onMouseEnter={enter4}
                      onMouseLeave={leave4}
                    >
                      <div className="one-setting-line">
                        <span className="settingtext">循环播放</span>
                        <div className={setting1 ? "changebox changebox-active" : "changebox"}
                          onClick={() => setSetting1(!setting1)}
                        >
                          <div className="one-switch-box"></div>
                        </div>
                      </div>
                      <div className="one-setting-line">
                        <span className="settingtext">连续播放</span>
                        <div className={setting2 ? "changebox changebox-active" : "changebox"}
                          onClick={() => setSetting2(!setting2)}
                        >
                          <div className="one-switch-box"></div>
                        </div>
                      </div>
                      <div className="one-setting-line">
                        <div className={setting3 ? "one-ssbox one-ssbox-active" : "one-ssbox"}
                          onClick={() => setSetting3(!setting3)}
                        >16:9</div>
                        <div className={!setting3 ? "one-ssbox one-ssbox-active" : "one-ssbox"}
                          onClick={() => setSetting3(!setting3)}
                        >4:3</div>
                      </div>
                    </div>
                  }
                </div>
                <div className='appnedtext1 outtbox'>
                  <span className='icon iconfont sp31'
                    onClick={() => setLittlewindow(!littlewindow)}
                  >&#xe61b;</span>
                </div>
                <div className='appnedtext2 outtbox'>
                  <div className='icon iconfont sp41'
                    onClick={props.onChnageWidth}>&#xe61a;</div>
                </div>
                <div className='appnedtext3 outtbox'>
                  {
                    false ?
                    <div onClick={fullscreenfnc} className='icon iconfont sp51'>&#xe7bc;</div>
                    :
                    <div onClick={fullscreenfnc} className='icon iconfont sp52'>&#xe68a;</div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="videoconbox">
          {/* <div className="conleft">已经装填{thisvid.danmus}条弹幕</div> */}
          <div className="conleft">已经装填{dmlist.length}条弹幕</div>
          <div className="conright">
            <div className="danmuopen icon iconfont" onClick={() => setDmflag(!dmflag)}>&#xe61f;
              {
                dmflag ?
                <div className="innericon icon iconfont">&#xe69e;</div>
                :
                <div className="innericon2 icon iconfont">&#xe7b7;</div>
              }
            </div>
            <div className="danmuopen icon iconfont">
              <span className='icon iconfont'
                onMouseEnter={dmcontrolenter}
                onMouseLeave={dmcontrolleave}
              >&#xe60d;</span>
              {
                dmcontrolflag &&
                <div className="fontcontrol-box"
                  onMouseEnter={dmcontrolenter}
                  onMouseLeave={dmcontrolleave}
                >
                  <div className="con-box-title1">弹幕字体大小</div>
                  <input type="range" className="changfont" />
                    <div className="con-box-title1">弹幕速度</div>
                  <input type="range" className="changfont" />
                    <div className="con-box-title1">弹幕行数</div>
                  <input type="range" className="changfont" />
                </div> 
              }
            </div>
            <div className="danmusnedbox">
              {
                dmflag &&
                <div className="leftfonts">
                  <span className='icon iconfont'
                    onMouseEnter={enterfont}
                    onMouseLeave={leavefont}
                  >&#xe64d;</span>
                </div>
              }
              {
                fontflag &&
                <div className="dmfontcontrol-box"
                  onMouseEnter={enterfont}
                  onMouseLeave={leavefont}
                >
                  <div className="tit-line1">
                    <span>颜色</span>
                    <div className="colorbox"
                      style={{backgroundColor: dmfontcolor + ""}}
                    ></div>
                  </div>
                  <input type="text" className="inpcolor"
                    value={dmfontcolor}
                    onChange={(e) => setDmfontcolor(e.target.value)}
                  />
                </div>
              }
              {
                dmflag ?
                <input type="text" className="inputdanmu"
                  value={dmtest}
                  onChange={(e) => setDmtext(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {tosendm()}
                  }}
                placeholder='发一条弹幕吧~'/>
                :
                <div className="dm-close-box">弹幕已关闭</div>
              }
              <div className={dmflag ? "rightbtn" : "rightbtn notsend"} onClick={tosendm}>发送</div>
            </div>
          </div>
        </div>
      </div>
      <div className="videoinfos"
        onClick={clickbtn}
      >
        <div className="onepart likeicon"
          data-type="1"
          style={{color: thisvid.liked ? '#32AEEC' : '#61666D'}}
          >
          <span className="icon iconfont" style={{fontSize: '35px'}}>&#xe61c;</span>
          <span className='optext'>{thisvid != null ? thisvid.likes : null}</span>
        </div>
        <div className="onepart iconicon"
          data-type="2"
          style={{color: thisvid.iconed ? '#32AEEC' : '#61666D'}}
        >
          <span className="icon iconfont" style={{fontSize: '37px', translate: '0 3px'}}>&#xe617;</span>
          <span className='optext'>{thisvid != null ? thisvid.icons : null}</span>
        </div>
        <div className="onepart subicon"
          data-type="3"
          style={{color: thisvid.faved ? '#32AEEC' : '#61666D'}}
        >
          <span className="icon iconfont">&#xe630;</span>
          <span className='optext'>{thisvid != null ? thisvid.favorites : null}</span>
        </div>
        <div className="onepart shareicon"
          data-type="4"
          style={{width: 'fit-content'}}
          onMouseEnter={() => setShareflag(false)}
          onMouseLeave={() => setShareflag(true)}
          >
          <span className="icon iconfont">&#xe633;</span>
          {
            sahreflag ?
            <span className='optext'>{thisvid.shares}</span>
            :
            <span className="optext">点击复制链接</span>
          }
          
        </div>
      </div>
      {
        // 投币页面
        iconflag &&
        <div className="icon-view">
          <div className="mid-iconbox">
            <div className="icon-toptitle">
              <div className="mid-text-icon">
                <span className="txt-span1">给UP投</span>
                <span className="text-nums">{icons}</span>
                <span className="txt-span1">硬币</span>
              </div>
              <div className="icon-close-span icon iconfont" onClick={() => setIconflag(false)}>&#xe643;</div>
            </div>
            <div className="icon-content">
              <div className={icons === 1 ? "one-content left-icon-one icon-active" : "one-content left-icon-one"}
                style={{background: `url(${icon1static})`, backgroundSize: '120px',
                  backgroundPosition: '20px 20px', backgroundRepeat: 'no-repeat'}}
                onClick={() => setIcons(1)}>
                  <span className="iconnum-span" style={{color: icons === 1 ? '#32AEEC' : '#9499A0'}}>1硬币</span>
                  <div className="inner-box-img">
                    <img src={`${icon1}`} alt="" className="activeimh"
                      style={{opacity: icons === 1 ? '1' : '0'}}/>
                  </div>
              </div>
              <div className={icons === 2 ? "one-content icon-active" : "one-content"}
                style={{background: `url(${icon2static})`, backgroundSize: '120px',
                  backgroundPosition: '20px 20px', backgroundRepeat: 'no-repeat'}}
                onClick={() => setIcons(2)}>
                  <span className="iconnum-span" style={{color: icons === 2 ? '#32AEEC' : '#9499A0'}}>2硬币</span>
                  <div className="inner-box-img">
                    <img src={`${icon2}`} alt="" className="activeimh"
                      style={{opacity: icons === 2 ? '1' : '0'}}/>
                  </div>
              </div>
            </div>
            <div className="icon-bottom-line">
              <div className="icon-sned-btn" onClick={snedconbtn}>确定</div>
              <span className='icon-bottom-span'>经验值+10</span>
            </div>
          </div>
        </div>
      }
      {
        // 收藏页面
        favflag &&
        <div className="favorite-view">
          <div className="view-center-box" ref={favref}
            onClick={toclosecreate}>
            <div className="fvcvb-topline">
              <span>添加到收藏夹</span>
              <div className="icon iconfont" onClick={closefavbox}>&#xe643;</div>
            </div>
            <div className="fvcvb-content">
              <div className="fav-list-box">
                {
                  favlist.map((item, index) =>
                  <label className={createflag ? "one-favorite-list" : "one-favorite-list one-favlist-nowallot"}
                    key={item.fid}
                    data-index={index}
                    data-fid={item.fid}
                    // ⭐ 用click 的话 会执行两次   ？？？？？
                    onMouseUp={choivethisfavlist}>   
                    <div className="left-cehedbox" data-index={index} data-fid={item.fid}>
                      <input type="checkbox" className="onechecked" id={item.fid}
                        hidden
                        value={favchecked[index]}
                      />
                      <div className={favchecked[index] ? 'activebox11 icon iconfont': "icon iconfont"}>&#xe616;</div>
                    </div>
                    <div className="right-fainfobox" data-index={index} data-fid={item.fid}>
                      <span className='sp1'>{item.title}</span>
                      <span className='sp2'>{item.nums}</span>
                    </div>
                  </label>
                  )
                }
              </div>
              <div className="create-one-fav">
                {
                  createflag ?
                  <div className="box11-d11" ref={createref} onClick={() => setCreateflag(false)}>
                    <div className="cof-d1">+</div>
                    <div className="cof-d2">新建收藏夹</div>
                  </div>
                  :
                  <div className="box11-d12" ref={createbox} onClick={clickcreatebox}>
                    <input type="text" className="createnewfav" foucs placeholder='最多输入20个字'
                      onChange={(e) => setNewfavtitle(e.target.value)}
                    />
                    <div className="cof-d3" onClick={tocreatenewfav}>新建</div>
                  </div>
                }
              </div>
            </div>
            <div className="fvcvb-bottomline">
              <div className={sendFavfalg ? "sendfvb-active fvcvb-closebtn" : "fvcvb-closebtn"} onClick={tofavoriteone}>确定</div>
            </div>
          </div>
        </div>
      }
      {
        thisvid.aid !== -1 ?
        <div className="intro-animation-box">
          <img src={animationinfo?.cover} alt="" className="left-animation-civer" />
          <div className="right-animation-iinfos">
            <div className="ani-title">
              <span className="ani-title-span">{animationinfo?.title}</span>
              {
                animationinfo.liked ?
                <div className="follow-ani-box">
                  <span className="icon iconfont"
                    onClick={() => tounsubanima(animationinfo.aid)}
                  >&#xe644; 已追番</span>
                </div>
                :
                <div className="follow-ani-box follow-tofollow">
                  <span className='icon iconfont'
                    onClick={() => tosunanima(animationinfo.aid)}
                  >&#xe630; 追番</span>
                </div>
              }
            </div>
            <div className="ani-info">
              <div className="one-info">{animationinfo?.plays}播放</div>
              <div className="one-info">{animationinfo?.dms}弹幕</div>
              <div className="one-info">{animationinfo?.subs}追番</div>
            </div>
            <div className="ani-taginfo">一共{animationinfo?.chapters}集</div>
            <div className="ani-intro">简介:{animationinfo?.intro}</div>
          </div>
        </div>
        :
        <div>
          {
            thisvid.intro != null &&
            <div className="vidintro">
              <span className="text">{thisvid.intro}</span>
              <div className="intromore">更多</div>
            </div>
          }
          <div className="vid-tags" onClick={clicktag}>
            {
              taglist.map((item, index) =>
                <div key={index} className="onetag"
                  data-index={index} data-word={item} onClick={tothiskeyword}>{item}
                {
                  index === 0 &&
                  <span className="icon iconfont mtagicon">&#xe632;</span>
                }
                </div>
              )
            }
          </div>
        </div>
      }
      {
        littlewindow &&
        <div className="window-video">
          <video className="video2"
            src={thisvid != null ? thisvid.path : null}
            ref={videoref}
            onCanPlay={videoloaded}
            onProgress={videoprogressfnc}
            onTimeUpdate={videotimeupdate}
            onPlaying={videoplating}
            // onSeeking={videoseeking}
            // onSeeked={videoseeked}
            onWaiting={videowating}
            onEnded={playend}
            onPlay={videoplay}
            onPause={videopause}
            onError={videoerror}
            onLoadedMetadata={videoloadedmated}
          ></video>
          <span className="closevspan icon iconfont">&#xe6bf;</span>
          {
            playflag ?
            <span className="playvbtn icon iconfont"
              onClick={clickvideo}
            >&#xe6ab;</span>
            :
            <span className="playvbtn icon iconfont"
              onClick={clickvideo}
            >&#xe6ac;</span>
          }
        </div>
      }
    </>
  )
}

function RightPart (props) {
  console.log('right part...');
  
  const vid = +props.vid
  const userinfo = props.userinfo  // 我的个人信息
  const uid = props.uid            // myuid
  // f1 0 头像   f1 1 名字
  const [userinfoflag, setUserinfoflag] = useState({f1: -1, f2: -1, f3: -1})
  const [thisvid, setThisvid] = useState({})
  const [videouser, setVideouser] = useState()
  const [recommendlist, setRecommendlist] = useState([])          // 推荐列表
  // const [upinfo, setUpinfo] = useState()                          // up主的信息
  const upinfo = props.upinfo                                     // up主的信息
  const [videoinfo, setVideoinfo] = useState()                    // 视频信息

  const [vlist, setVlist] = useState([]),                          // 该视频所属的列表
        [vlistindex, setVlistindex] = useState(0),                  // 列表篇中当前播放的视频的index
        [allplays, setAllpalys] = useState(0),                      // 列表视频总播放量
        [listname, setListname] = useState("")                       // 视频列表的信息

  const [seasonlist, setSeasonlist] = useState([]),
        [seasonindex, setSeasonindex] = useState(0),
        [chapterlist, setChapterlist] = useState([]),
        [chapterindex, setChapterindex] = useState(0)

  const [donateflag, setDonateflag] = useState(false)

  const rigtbox = useRef()
  const recommendref = useRef()

  // const [dmlist, setDmlist] = useState([])         // 弹幕列表
  const dmlist = props.dmlist

  const [playalongflag, setPlayaloneflag] = useState(false)   // 连续播放标志
  // 弹幕列表flag
  const [danmulistflag, setDanmulist] = useState(true)
  const handleList = () => {
    setDanmulist(!danmulistflag)
    console.log(danmulistflag);
  }

  const [scrollflag, setScrollflag] = useState(false)
  // const [distance, setDistance] = useState()     // 推荐视频距离顶部的距离
  // if (scrollflag === true) {
  //   setDistance(recommendref.current.offsetTop - recommendref.current.clientHeight)
  // }

  const [seasions, setSeasion] = useState([])   // 分季
  const [chapters, setChapters] = useState([])  // 分集

  useEffect(() => {
    const getData = async () => {
      const res = await Promise.all([getByVid(vid, uid), getVideoLikely(vid)])
      // console.log(res);
      setVideoinfo(res[0])
      const upuid = res[0].uid     // 作者的uid

      const res3 = await getVideoFormList(res[0].listid)
      let tempnums = 0
      for (let i = 0; i < res3.length; i++) {
        tempnums += res3[i].plays
        if (res3[i].vid === vid) {
          setVlistindex(i + 1)
        }
      }
      setAllpalys(tempnums)
      setVlist(res3)

      if (res[0].listid !== -1 && res[0].listid != null) {
        const res4 = await getUserListOne(res[0].listid)
        console.log(res4);
        setListname(res4.title)
      }

      // const res2 = await getByUidFollowed(upuid, uid)
      // console.log('作者信息:', res2);
      // setUpinfo(res2)

      // 弹幕
      setThisvid(res[0])
      setRecommendlist(res[1])
      // setDmlist(res[2])

      if (res[0].aid !== -1 && res[0].aid != null) {
        console.log('=====================');
        const res5 = await getSeasons(res[0].aid)
        setSeasonlist(res5)
        console.log('=========res4: ', res5);
        
        for (let i = 0; i < res5.length; i++) {
          for (let j = 0; j < res5[i].length; j++) {
            if (res5[i][j].vid === vid) {
              setSeasonindex(i)
              setChapterindex(j)
              setChapterlist(res5[i])
            }
          }
        }
      }
    }
    getData()
    // 不让数据变化
    // setDistance(recommendref.current.offsetTop - recommendref.current.clientHeight)
    if (recommendref != null) {
      document.addEventListener('scroll', () => {
        let distance = recommendref?.current.offsetTop
        const top = document.body.scrollTop || document.documentElement.scrollTop
        // console.log(recommendref.current.offsetTop,"   ",top);
        // console.log('scrolling....');
        
        if (distance<= top) {
          setScrollflag(true)
        } else {        
          setScrollflag(false)
        }
      })
    }
  },[])

  // 发私信
  const towhisper = (e) => {
    if (uid === -1) {
      message.open({ type: 'error', content: '请先登录'})
      return
    }
    const uid1 = parseInt(uid)
    const uid2 = parseInt(e.target.dataset.uid)
    if (uid1 === uid2) {
      message.open({type: 'error', content: '不能给自己发私信'})
      return
    }
    // navigator(`/${uid1}/whisper/uid2`)
    window.open(`/${uid1}/whisper/${uid2}`, '_blank')
  }

  // 关注
  const tofollowuser = async (e) => {
    const uid2 = parseInt(e.target.dataset.uid2)
    if (uid === -1 || uid === null) {
      message.open({ type: 'error', content: '请先登录'})
      return
    }
    if (uid === uid2) {
      message.open({ type: 'info', content: '已经关注了自己'})
      return
    }
    const res = await toFollow(uid2, uid)
    props.setUpinfo({
      ...upinfo,
      followed: true
    })
    props.setUserinfo({
      ...props.userinfo,
      follows: props.userinfo.follows + 1
    })
    props.userinfo.follows = props.userinfo.follows + 1
    localStorage.setItem('userinfo', JSON.stringify(props.userinfo))
    message.open({type: 'info', content: '已关注', flag: true})
  }

  // 取消关注
  const canclefollowuser = async (e) => {
    if (uid === -1) {
      message.open({ type: 'error', content: '请先登录'})
      return
    }
    const uid2 = e.target.dataset.uid2
    const res = await toUnfollow(uid2, uid)
    props.setUpinfo({
      ...upinfo,
      followed: false,
    })
    props.setUserinfo({
      ...props.userinfo,
      follows: props.userinfo.follows - 1
    })
    props.userinfo.follows = props.userinfo.follows - 1
    localStorage.setItem('userinfo', JSON.stringify(props.userinfo))
    message.open({type: 'info', content: '取消关注', flag: true})
  }

  const navigate = useNavigate()
  const tothisvideo = (e) => {
    const vid = e.target.dataset.vid || e.target.parentNode.dataset.vid
    navigate(`/video/${vid}`)
    document.location.reload()
  }
  
  const time_userinfo = useRef(null)
  const enterUserinfo = (index) => {
    if (time_userinfo.current != null) {
      clearTimeout(time_userinfo.current)
    }
    setUserinfoflag({f1: index, f2: -1, f3: -1})
  }

  const leaveUserinfo = () => {
    time_userinfo.current = setTimeout(() => {
      setUserinfoflag({f1: -1, f2: -1, f3: -1})
      time_userinfo.current = null
    }, 800)
  }
  return (
    <>
    <div className="upinfosbox">
      <div className="leftuserinfoavatar">
        <img src={upinfo?.avatar} alt="" className="upsavatar" 
          data-uid={upinfo?.uid}
          onClick={touserspace}
          onMouseEnter={() => enterUserinfo(0)}
          onMouseLeave={leaveUserinfo}
        />
        {
          userinfoflag.f1 === 0 &&
          <div className="ui-append"
            style={{position: "absolute", left: "-150px", top: '85px', zIndex: '3'}}
            onMouseEnter={() => enterUserinfo(0)}
            onMouseLeave={leaveUserinfo}
          >
            <Userinfo
              hisuid={upinfo?.uid}
              myuid={uid}
              setClose={setUserinfoflag}
            />
          </div>
        }
      </div>
      <div className="irghtupinfos">
        <div className="upname">
          <span className="namespan">
            <span
              data-uid={upinfo?.uid}
              onClick={touserspace}
            >{upinfo?.name}</span>
            {
            false &&
            <div className="ui-append"
              style={{position: "absolute", left: "-150px", top: '85px'}}
              // onMouseEnter={() => enterUserinfo(index, -1, 1)}
              // onMouseLeave={leaveUserinfo}
            >
              <Userinfo
                hisuid={upinfo?.uid}
                myuid={uid}
                // setClose={setUserinfoflag}
              />
            </div>
          }
          </span>
          <span className="messafespan icon iconfont"
            data-uid={upinfo?.uid}
            onClick={towhisper}
          >&#xe6b9; 发消息</span>
        </div>
        <div className="upintro">{upinfo?.intro}</div>
        <div className="uprotate">
          <div className="donate icon iconfont"
            onClick={() => setDonateflag(true)}
          >&#xe69c; 充电</div>
          { 
            (upinfo != null ? upinfo.followed : false) ?
            <div className="hadsuni iconfont icon"
              data-uid2={upinfo != null ? upinfo.uid : null}
              onClick={canclefollowuser}>&#xe976; 已关注</div>
            :
            <div className="sunthisup icon iconfont"
              data-uid2={upinfo != null ? upinfo.uid : null}
              onClick={tofollowuser}>&#xe643; 关注</div>
          }
        </div>
      </div>
    </div>
    {
      donateflag &&
      <div className="donate-view">
        <div className="donate-blank"
          onClick={() => setDonateflag(false)}
        ></div>
        <Donate 
          setDonateflag={setDonateflag}
          upinfo={upinfo}
        />
      </div>
    }
    <div className="danmulist"
      style={{height: danmulistflag ? '44px' : '656px', marginTop: props.widthscreen ? '855px' : '0'}}>
      <div className="danmulisttop"  onClick={handleList}>
        <div className="danmlistleft">
          <span>弹幕列表</span>
          <span className='icon iconfont'>&#xe653;</span>
        </div>
        <div className="danmlistright icon iconfont">&#xe624;</div>
      </div>
      <div className="lists">
        <div className="listop">
          <div className="times">时间</div>
          <div className="contents">弹幕内容</div>
          <div className="sendtimes">发送时间</div>
        </div>
        {
          dmlist.map(item =>
          <div className="onedanmu"
            key={item.id}
          >
            <div className="times">{item.typetime}</div>
            <div className="contents">{item.text}</div>
            <div className="sendtimes">{item.time.slice(0, 10)}</div>
          </div>
          )
        }
      </div>
      <div className="bottominfos">查看历史弹幕</div>
    </div>
    {
      // 视频列表
      videoinfo != null && videoinfo.listid !== -1 &&
        <div className="playlist">
          <div className="playlist-title">
            <div>
              <span className="pt-span1">{listname}</span>
              <span className="pt-span2">({vlistindex} / {vlist.length})</span>
            </div>
            <div>
              <span className="pt-span2">自动连播</span>
              <div className={ playalongflag ? "playalong-btn plb-active" : "playalong-btn" }
                onClick={() => setPlayaloneflag(!playalongflag)}>
                <div className="changbtn-inner"></div>
              </div>
            </div>
          </div>
          <div className="pt-infos">
            <div className='otdiv1'>总播放量: {allplays}</div>
            {/* <div>订阅列表</div> */}
          </div>
          <div className="videolist-content">
            {
              vlist.map((item, index) =>
                <div key={item.vid}
                  className={ vlistindex === index + 1 ? "one-videolist-vide vc-active" : "one-videolist-vide" }
                  data-vid={item.vid}
                  onClick={tothisvideo}
                >
                  <span className="video-name">{item.title}</span>
                  <span className="video-time">{item.vidlong}</span>
                </div>
              )
            }
          </div>
        </div>
    }
    {
      // 选集  番剧 电视剧。。。
      videoinfo != null && videoinfo.aid !== -1 &&
      <div className="seasionlist">
        <div className="anima-title">
          <div>
            <span className="s1-span">正片</span>
          </div>
        </div>
        <div className="anima-line2">
          {
            seasonlist.map((item, index) => 
              <div className={seasonindex === index ? "one-seasion season-active" : "one-seasion"}
                key={item.id}
                onClick={() => {
                  setSeasonindex(index)
                  setChapterlist(seasonlist[index])
                }}
              >第{index + 1}季</div>
            )
          }
        </div>
        <div className="seasion-nums">
          {
            chapterlist.map((item, index) =>
                <div className={chapterindex === index ? "one-div-chapter chapter-active" : "one-div-chapter"}
                  key={item.id}
                  onClick={() => {
                    navigate(`/video/${item.vid}`)
                    document.location.reload()
                  }}
                >{index + 1}</div>
            )
          }
        </div>
      </div>
    }
    <div className="recommendlist" ref={recommendref}>
      {/* positon 变为 fixed 定位基准发生改变， 原来width = 100% ，宽度会发生改变 ⭐ */}
      <div className="video-outter-box" style={{position: scrollflag ? 'fixed' : 'relative',
        width: scrollflag ? '692px' : '100%',
        top: scrollflag ? '80px' : '0',
        }}>
        {
          recommendlist.map(item =>
            <div className="onevideo"
              key={item.vid}
            >
              <div className="recom-video-box">
                <div className="timebox">{item.vidlong}</div>
                <img src={item.cover} alt="" className="leftvideoimg"
                data-vid={item.vid}
                onClick={tovideo}
                />
              </div>
              <div className="revideoinfos">
                <div className="revidtitle"
                  data-vid={item.vid}
                  onClick={tovideo}
                >{item.title}</div>
                <div className="vidupname"
                  data-uid={item.uid}
                  onClick={touserspace}
                >
                  <span className="icon iconfont">&#xe665;</span>
                  <span>{item.name}</span>
                </div>
                <div className="vidoereminfo">
                  <div>
                    <span className="icon iconfont" style={{fontSize: '15px'}}>&#xe6b8;</span>
                    <span>{item.plays}</span>
                  </div>
                  <div>
                    <span className="icon iconfont">&#xe666;</span>
                    <span>{item.danmus}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </div>
    </div>
    </>
  )
}

function Video () {
  console.log('top father...');
  
  const params = useParams()
  const vid = params.vid
  const userinfos = JSON.parse(localStorage.getItem('userinfo'))
  const [userinfo, setUserinfo] = useState(() => userinfos)         // 未登录时null, 用户的信息
  const uid = parseInt(userinfo != null ? userinfo.uid : -1)
  const [widthscreen, setWidth] = useState(false)
  const [recommendlist, setRecommendlist] = useState([])            // 相关推荐视频
  const changwidth = () => {    
    setWidth(!widthscreen)
  }

  const [thisvid, setThisvid] = useState({})                        // 视频信息
  const [dmlist, setDmlist] = useState([])                          // 弹幕列表, 视频部分和右侧列表要用
  const [upinfo, setUpinfo] = useState()                            // up主的信息
  useEffect(() => {
    const getData = async () => {
      const res = await Promise.all([getByVid(vid, uid), getDm(vid), getVideoLikely(vid)])
      // console.log('1: ', res[0]);
      const res2 = await getByUidFollowed(res[0].uid, uid)
      setUpinfo(res2)                          // up主的信息
      setThisvid(res[0])
      document.title = `${res[0].title}`
      setDmlist(res[1])
      setRecommendlist(res[2])
    }
    getData()
  }, [])

  const updateuser = async () => {
    console.log('硬币减一');
    const res2 = await getByUid(userinfo.uid)
    localStorage.setItem('userinfo', JSON.stringify(res2))
    setUserinfo(res2)
  }
  return (
    <div className="video-box">
      <Topnav />
      <div className="video-inner">
        <div className="vid-leftp">
          <VideoPart
            vid={vid}
            uid={uid}
            userinfo={userinfo}
            setUserinfo={setUserinfo}
            onChnageWidth={changwidth}
            widthscreen={widthscreen}
            updateuser={updateuser}
            thisvid={thisvid}
            setThisvid={setThisvid}
            dmlist={dmlist}
            setDmlist={setDmlist}
            recommendlist={recommendlist}
            upinfo={upinfo}
            setUpinfo={setUpinfo}
          />
          <Comments
            vid={vid}
            uid={uid}
            hisuid={thisvid != null ? thisvid.uid : null}
            userinfo={userinfo}
            commentType = {0}
          />
        </div>
        <div className="vid-rightpp">
            <RightPart
              vid={vid}
              uid={uid}
              dmlist={dmlist}
              userinfo={userinfo}
              setUserinfo={setUserinfo}
              widthscreen={widthscreen}
              upinfo={upinfo}
              setUpinfo={setUpinfo}
            />
        </div>
      </div>
    </div>
  )
}

export default Video