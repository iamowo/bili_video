import "./index.scss"
import { useState, useRef, useEffect } from "react"
import { getVideoFormList } from "../../api/videolist"
import message from "../notice/notice"
import { baseurl2 } from "../../api"
import { toFollow, toUnfollow } from "../../api/user"
import { updateinfo, sendDm } from "../../api/video"
import { getFavlist, addOneFavlist, addOneVideo } from "../../api/favlist"
import { subthisAnimation, getSeasons, getAnimationByVid, cnacleAnimation } from "../../api/animation"
import { useLocation, useNavigate } from "react-router-dom"

const VideoPlayer = (props) => {  
  const { vid, userinfo, uid, thisvid, upinfo, 
          setThisvid, recommendlist, dmlist, setDmlist, 
          windoflag2, setWindoflag2, onChnageWidth } = props
  const location = useLocation();

  const videoRef = useRef(null)
  const videobox = useRef(null)                                     // 视频区域
  // 视频相关函数
  const [loadflag, setLoadflag] = useState(false)               // 加载完成
  const [isPlaying, setIsPlaying] = useState(false)             // 播放状态
  const [endflag, setEndflag] = useState(false)                 // 视频结束
  const [vidoopationflag, setVidoopationflag] = useState(true)  // 显示控制栏 true显示 false不显示
  const [timeprogress, setTimeprogress] = useState(0)   // 一直增加的时间
  const [lastwatchednunm, setLswnum] = useState(0)      // 上次观看的时间
  const [wawtchdonefal, setWdone] = useState(0)         // 是否观看完
  const [isLoading, setIsLoading] = useState(false)     // 是否加载
  const [nowtime ,setNowTime] = useState('00:00')       // 当前时间
  const [buffered, setBuffered] = useState(0)           // 
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0)           // 视频时长
  const [videoprogress, setProgress] = useState(0)      // progress
  const [loadprogress, setLoadprogress] = useState(0)   // 预加载进度
  const [isFullscreen, setIsFullscreen] = useState(false)       // 全屏flag
  const [clearflag, setClear] = useState(false)         // 清晰度flag
  const [speedflag, setSpeed] = useState(false)         // 倍速
  const [settingflag, setSettingflag] = useState(false)  // 设置
  const [setting1, setSetting1] = useState(false),       // 循环播放
        [setting2, setSetting2] = useState(false),       // 自动播放下一集
        [setting3, setSetting3] = useState(true)         // 16：9    4：3
   // 改变音量
  const [volume, setVolume] = useState(100),
        [isMuted, setIsMuted] = useState(true),        // 静音 or 打开 声音
        [volumeflag, setVolumeflag] = useState(false)        // 声音控制条
  const [sysflag, setSys] = useState(false)             // 设置
  const [windoflag, setWindoflag] = useState(false)     // 小屏幕
  const [bottomscrollflag, setBottomScrollflag] = useState(false)
  const [favflag, setFavflag] = useState(false)         // 打开收藏框
  const [favlist, setFavlist] = useState([])             // 收藏夹列表

  const [favchecked, setFavchecked] = useState([])             // 已经选择过的收藏夹
  const [favcheckedold, setFavcheckedold] = useState([])       // 初始收藏夹状态
  const [sendFavfalg, setSendfavfalg] = useState(false)  // 初始收藏夹 ！= 改变后的， 可以提交

  const [iconflag, setIconflag] = useState(false)  //  打开 icon 页面
  const [icons, setIcons] = useState(1)            // 投币个数

  const [dmtest, setDmtext] = useState()           // 发送弹幕内容
  const [dmflag, setDmflag] = useState(true)       // 是否打开弹幕

  const playerboxref = useRef()
  const favref = useRef()     // 收藏box的ref
  const createref = useRef()  // 新建
  const [newFavtitle, setNewfavtitle] = useState()

  const [vlist, setVlist] = useState([]),                          // 该视频所属的列表
        [vlistindex, setVlistindex] = useState(0)                  // 列表篇中当前播放的视频的index

  const [seasonlist, setSeasonlist] = useState([]),
        [seasonindex, setSeasonindex] = useState(0),
        [chapterlist, setChapterlist] = useState([]),
        [chapterindex, setChapterindex] = useState(0)
  const [littlewindow, setLittlewindow] = useState(false)
  const [animationinfo, setAnimationinfo] = useState({})           // anmation 的信息

  // 初始化视频元数据
  useEffect(() => {
    const video = videoRef.current;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const bufferedPercent = (bufferedEnd / video.duration) * 100;
        setBuffered(bufferedPercent);
      }
    };

    const handleWaiting = () => {
      // setIsLoading(true);
      // Only show loading if video has started playing
      if (!video.paused) {
        setIsLoading(true);
      }
    };

    const handlePlaying = () => {
      setIsLoading(false);
    };

    const handleSeeking = () => {
      setIsLoading(true);
    };

    const handleSeeked = () => {
      setIsLoading(false);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("progress", handleProgress);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("seeking", handleSeeking);
    video.addEventListener("seeked", handleSeeked);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("progress", handleProgress);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("seeking", handleSeeking);
      video.removeEventListener("seeked", handleSeeked);
    };
  }, []);

  // 获取数据
  useEffect(() => {
    const getData = async () => {      
      const res = thisvid
      // 刚开始数据还没加载出来， 无法使用slice
      res.time = res?.time?.slice(0, 10) + ' ' + res?.time?.slice(11, 16) // 在{ } 中修改会报错
      // 视频选集
      const res3 = await getVideoFormList(res.listid)
      for (let i = 0; i < res3.length; i++) {
        if (res3[i].vid === vid) {
          setVlistindex(i + 1)
        }
      }
      setVlist(res3)
      const res4 = await getAnimationByVid(vid, uid)
      setAnimationinfo(res4)      
      // animation list 信息
      if (res.aid !== -1 && res.aid != null) {
        // console.log('=====================');
        const res5 = await getSeasons(res.aid)
        setSeasonlist(res5)
        // console.log('======================res4: ', res5);
        
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
    // thisvid 非空 非null
    if (thisvid != null && Object.keys(thisvid).length === '{}') {
      getData()
    }
  },[thisvid])

  // 
  useEffect(() => {
    const distance = playerboxref.current.scrollTop + playerboxref.current.clientHeight
    window.addEventListener('scroll', () => {
      const top = document.body.scrollTop || document.documentElement.scrollTop
      if (top > distance) {
        setBottomScrollflag(true)
      } else {
        setBottomScrollflag(false)
      }
    })
  }, [])

  // 更新进度条
  useEffect(() => {
    const video = videoRef.current;

    const handleTimeUpdate = () => {
      if (!isNaN(video.duration)) {
        const progress = (video.currentTime / video.duration) * 100;
        setProgress(progress);
        setCurrentTime(video.currentTime);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  // 控制栏显示/隐藏逻辑
  // useEffect(() => {
  //   const resetControlsTimeout = () => {
  //     clearTimeout(controlsTimeoutRef.current);

  //     if (!isHoveringControls) {
  //       setShowControls(true);
  //       controlsTimeoutRef.current = setTimeout(() => {
  //         setShowControls(false);
  //       }, 3000);
  //     }
  //   };

  //   const player = playerRef.current;
  //   player.addEventListener("mousemove", resetControlsTimeout);

  //   return () => {
  //     player.removeEventListener("mousemove", resetControlsTimeout);
  //     clearTimeout(controlsTimeoutRef.current);
  //   };
  // }, [isHoveringControls]);

  // 键盘事件处理
  useEffect(() => {
    console.log("当前全屏", isFullscreen);

    const handleKeyDown = (e) => {
      const video = videoRef.current;

      const key = e.key.toLowerCase();
      if (isFullscreen && key === "escape") {
        e.preventDefault();
        e.stopPropagation(); // 阻止事件冒泡
        return; // 直接返回，不执行任何操作
      }

      switch (key) {
        case "escape":
          e.preventDefault();
          break;

        case "[":
          break;

        case "]":
          break;
        // 全屏切换
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;

        // 空格键播放/暂停
        case " ":
          e.preventDefault(); // 防止页面滚动
          togglePlay();
          break;

        // 左箭头后退5秒
        // case "arowleft":
        //   e.preventDefault();
        //   skip(-5);
        //   if (!isPlaying) {
        //     togglePlay();
        //   }
        //   break;

        // 右箭头前进5秒
        // case "arrowright":
        //   e.preventDefault();
        //   skip(5);
        //   // 长按1秒后3倍速播放
        //   if (!e.repeat) {
        //     const timer = setTimeout(() => {
        //       if (e.key === "arrowRight") {
        //         changePlaybackRate(3);
        //       }
        //     }, 1000);

        //     // 清理定时器
        //     const handleKeyUp = () => {
        //       clearTimeout(timer);
        //       changePlaybackRate(1); // 恢复正常速度
        //       document.removeEventListener("keyup", handleKeyUp);
        //     };

        //     document.addEventListener("keyup", handleKeyUp);
        //   } else {
        //     if (!isPlaying) {
        //       togglePlay();
        //     }
        //   }
        //   break;

        // 上箭头增加5%音量
        case "ArrowUp":
          e.preventDefault();
          const newVolumeUp = Math.min(volume + 0.05, 1);
          video.volume = newVolumeUp;
          setVolumeflag(newVolumeUp);
          setIsMuted(false);
          break;

        // 下箭头减少5%音量
        case "ArrowDown":
          e.preventDefault();
          const newVolumeDown = Math.max(volume - 0.05, 0);
          video.volume = newVolumeDown;
          setVolumeflag(newVolumeDown);
          setIsMuted(newVolumeDown === 0);
          break;

        default:
          break;
      }
    };

    // 添加事件监听，使用capture阶段捕获 注意第三个参数true
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen, volume, isPlaying]);

  let timer1 = null
  const enter1 = () => {
    if (timer1 !== null) {
      setSpeed(false)
      setVolumeflag(false)
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
      setVolumeflag(false)
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
    setVolumeflag(true)
  }

  const leave3 = () => {
    timer1 = setTimeout(() => {
      setVolumeflag(false)
      timer1 = null
    },500)
  }

  const enter4 = () => {
    console.log('enter444');
    
    if (timer1 !== null) {
      setClear(false)
      setSpeed(false)
      setVolumeflag(false)
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
    videoRef.current.playbackRate = (num)
  }  

  const changevolume = (e) => {
    const proHeight = 100
    let height = volume
    if (e.target.className === "voice-pro1") {
      height = e.target.getBoundingClientRect().top + proHeight - e.clientY
    } else if (e.target.className === "voice-pro2"){
      height = e.target.parentNode.getBoundingClientRect().top + proHeight - e.clientY
    }
    setVolume(height)
  }

  useEffect(() => {
    videoRef.current.volume = volume * 0.01
  }, [volume])

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

  // // 元数据加载完成
  // const videoloadedmated = () => {
  // // 监听全屏改变事件
  // window.addEventListener("fullscreenchange", () => {
  //   // 全屏时为全屏元素   退出全屏时为null
  //   const fullelement = document.fullscreenElement      
  //   if (fullelement !== null && isFullscreen === false) {
  //     setIsFullscreen(true)
  //   } else if (fullelement === null){
  //     // 按esc时的情况
  //     setIsFullscreen(false)
  //   }
  // })
  // // 键盘事件
  // window.addEventListener("keydown", (e) => {
  //   let temodmflag = true;
  //   const k = e.key.toLowerCase()      
  //   switch (k) {
  //     case " ":
  //       e.preventDefault()
  //       togglePlay()
  //       break;
  //     case 'f':
  //       console.log('全屏');
  //       fullscreenfnc()
  //       break;
  //     case 'd':
  //       console.log('弹幕');
  //       setDmflag(!temodmflag)
  //       break;
  //     case 'm':
  //       console.log('静音');
  //       break;
  //     case ']':
  //       console.log('下一集');
  //       break;
  //     case '[':
  //       console.log('上一级');
  //       break;
  //     case 'arrowup':
  //       videoprogresaddnum(5)
  //       break;
  //     case 'arrowleft':
  //       console.log('');
  //       break;
  //     case 'arrowright':
  //       break;
  //     case 'arrowdown':
  //       setVolume(volume - 5)
  //       break;
  //     default:
  //       break;
  //     }
    
  //  })
  // }

  const videoprogresaddnum = (num) => {
    Promise.resolve().then(() => {
      setVolume(() => {
        if (num > 0) {
          return volume > 95 ? 100 : volume + 5
        } else {
          return volume < 5 ? 0 : volume - 5
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

  // canplay
  const videoloaded = () => {
    console.log('canplay');
    setLoadflag(true)
  }

  const videoprogressfnc = () => {
    console.log('progressing');

    const duration = videoRef.current.duration
    if (duration > 0) {
      for (let i = 0; i <videoRef.current.buffered.length; i++) {
        if (videoRef.current.buffered.start(videoRef.current.buffered.length - 1 - i) < videoRef.current.currentTime) {
            const loadpro = (videoRef.current.buffered.end(videoRef.current.buffered.length - 1 - i) * 100) / duration
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
    setIsPlaying(true)
  }
  // pause  手动暂停  跳转时加载暂停
  const videopause = () => {
    console.log('pause');  
  }

  // 视频加载等待。当视频由于需要缓冲下一帧而停止，等待时触发
  const videowating = () => {
    console.log('正在缓冲',videoRef.current.buffered);
  }
  
  const videoerror = () => {
    // 视频error
    console.log('video error');
    // setLoadflag(false)
  }

  // opupdate 当目前的播放位置已更改时触发。
  const videotimeupdate  = () => {    
    const duration = videoRef.current.duration
    const now = videoRef.current.currentTime
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
  // 播放/暂停
  const togglePlay = () => {
    const video = videoRef.current;

    if (video.paused) {
      video.play().catch((e) => {
        setIsLoading(true);
      });
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };
  // 播放old
  // const togglePlay = async () => {
  //   console.log('点击了视频 播放or暂停');
    
  //   if (clicktimer != null) {
  //     clearTimeout(clicktimer)
  //     clicktimer = null
  //     return
  //   }
  //   if (loadflag === true) {
  //     if (videoRef.current.paused) {
  //       setTimeout(async () => {
  //         videoRef.current.play()
  //         setIsPlaying(true)
  //         setcliceked(true)
  //         if (thisvid.lastweatched === 0) {
  //           const data = {
  //             uid: userinfo.uid,
  //             vid: vid,
  //             type: 0,
  //             lastwatched: 1,
  //             done: 0
  //           }
  //           const res = await updateinfo(data)
  //           console.log('res: ', res);
            
  //           if (res === 0) {
  //             props.setThisvid({
  //               ...thisvid,
  //               plays: thisvid.plays + 1,
  //               lastwatched: 1
  //             })
  //           }
  //         }
  //       }, 150)
  //     } else if (videoRef.current.play) {
  //       videoRef.current.pause()
  //       setIsPlaying(false)
  //     }
  //   }
  // }

   // 格式化时间显示
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };


  // 双击
  const handledoubleclick = () => {
    fullscreenfnc()
  }

  // 全屏事件
  const fullscreenfnc = () => {   
    if (document.fullscreenEnabled) {      
      if (!isFullscreen && document.fullscreenElement === null) {        
        videobox.current.requestFullscreen()
        setIsFullscreen(true)
      } else {        
        if (document.fullscreenElement !== null) {
          document.exitFullscreen()
          setIsFullscreen(false)
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
    const duration = videoRef.current.duration
    videoRef.current.currentTime = Math.floor(duration * pro)
    if (videoRef.current.pause) {
      setTimeout(() => {
        videoRef.current.play()
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
            lastwatched: videoRef.current.currentTime,
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
        setDmlist(res)
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
    videoRef.current.currentTime = 0;
    videoRef.current.play()
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
    <div className={props.widthscreen ? "playerbox playerbox-active" : "playerbox"}
      ref={playerboxref}
      // style={{width: props.widthscreen ? '1495px' : '100%',
      //         height: props.widthscreen ? '824px' : 'fit-content'}}
      >
      <div className="videobox" ref={videobox}
      // style={{height: props.widthscreen ? '768px' : '600px'}}
      >
          <div className="loadingsp" style={{display: isPlaying ? 'none' : 'flex'}}>
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
            ref={videoRef}
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
          !isPlaying &&
          <span className="pausespan icon iconfont">&#xe6ab;</span>
        }
        <div className="vide-mask-over"
          onMouseMove={mousemoveonmask}
          onClick={togglePlay}
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
                    style={{animationPlayState: isPlaying ? 'running' : 'paused',
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
                  style={{animationPlayState: isPlaying ? 'running' : 'paused',
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
          className={isFullscreen ? "videobottomcof videobottomcof-active" : "videobottomcof"}
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
                isPlaying ?
                <span className="icon iconfont"
                  onClick={togglePlay}
                >&#xea81;</span>
                :
                <span className="icon iconfont"
                  onClick={togglePlay}
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
                {nowtime} / {thisvid?.vidlong}
              </span>
            </div>
            <div className="mid-dm-box">
              {
                isFullscreen &&
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
                  isMuted ?
                  <span className='icon iconfont sp11'
                    onMouseEnter={enter3}
                    onMouseLeave={leave3}
                    onClick={() => {
                      setIsMuted(false)
                      videoRef.current.volume = 0
                    }}
                  >&#xea11;</span>
                  :
                  <span className='icon iconfont sp12'
                    onMouseEnter={enter3}
                    onMouseLeave={leave3}
                    onClick={() => {
                      setIsMuted(true)
                      videoRef.current.volume = (volume * 0.01)
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
                    <div className="voicenum">{volume}</div>
                    <div className="voiceprogress">
                      <div className="voice-pro1">
                        <div className="voice-pro2"
                          style={{height: `${volume}%`}}
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
                  onClick={onChnageWidth}>&#xe61a;</div>
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
  )
}

export default VideoPlayer