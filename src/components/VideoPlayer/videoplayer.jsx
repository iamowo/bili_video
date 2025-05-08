import "./index.scss"
import { useState, useRef, useEffect, memo, useCallback, useMemo } from "react"
import { getVideoFormList } from "../../api/videolist"
import message from "../notice/notice"
import { baseurl2 } from "../../api"
import { toFollow, toUnfollow } from "../../api/user"
import { updateVideoInfo, sendDm } from "../../api/video"
import { getFavlist, addOneFavlist, addOneVideo } from "../../api/favlist"
import { subthisAnimation, getSeasons, getAnimationByVid, cnacleAnimation } from "../../api/animation"
import { useLocation, useNavigate } from "react-router-dom"
import { debounce } from "../../util/fnc"

const Danmu = memo((props) => {
  const {dmflag, dmList, isPlaying, uid, currentTime } = props;

  // 提取样式逻辑到单独的函数
  const getDanmuStyle = (item, index, isType0) => {
    const baseStyle = {
      animationPlayState: isPlaying ? 'running' : 'paused',
      color: (item.color || "#fff") + '',
      textDecorationLine: (item.uid === uid) ? 'underline' : 'none',
      top: (index % 20 * 25 + 10) + 'px',
      fontSize: '16px'
    };

    if (isType0) {
      baseStyle.display = item.sendtime <= currentTime && item.sendtime + 10 >= currentTime ? "block" : "none";
    }

    return baseStyle;
  };

  // 使用 useMemo 缓存映射结果
  const danmuElements = useMemo(() => {
    if (!dmflag || !Array.isArray(dmList)) {
      return null;
    }

    return dmList.map((item, index) => {
      const isType0 = item.type === 0;
      return (
        <div 
          className="danmu-div"
          key={item.id || `danmu-${index}`}
          style={getDanmuStyle(item, index, isType0)}
          onMouseEnter={(e) => e.target.style.animationPlayState = 'paused'}
          onMouseLeave={(e) => e.target.style.animationPlayState = 'running'}
        >
          {item.text || ""}
        </div>
      );
    });
  }, [dmflag, dmList, isPlaying, uid, currentTime]);

  return (
    <div>
      {danmuElements}
    </div>
  );
});

// const Danmu = memo((props) => {
//   const {dmflag, dmList, isPlaying, uid, currentTime } = props
  
//   return (
//     <div>
//       {
//         dmflag && dmList.map((item, index) =>
//           item.type === 0 ?
//             <div className="danmu-div"
//               key={item.id}
//               style={{animationPlayState: isPlaying ? 'running' : 'paused',
//                     color: (item.color) + '',
//                     textDecorationLine: (item.uid === uid) ? 'underline' : 'none',
//                     top: (index % 20 * 25 + 10) + 'px',
//                     fontSize: '16px',
//                     // display: item.sendtime <= timeprogress && item.sendtime + 10 >= timeprogress ? "block" : "none"
//                     display: item.sendtime <= currentTime && item.sendtime + 10 >= currentTime ? "block" : "none"
//             }}
//             onMouseEnter={(e) =>
//               e.target.style.animationPlayState = 'paused'
//             }
//             onMouseLeave={(e) => 
//               e.target.style.animationPlayState = 'running'                      
//             }
//             >{item.text}</div>
//           :
//             <div className="danmu-div" key={item.id}
//             style={{animationPlayState: isPlaying ? 'running' : 'paused',
//                     color: (item.color) + '',
//                     textDecorationLine: (item.uid === uid) ? 'underline' : 'none',
//                     top: (index % 20 * 25 + 10) + 'px',
//                     fontSize: '16px'
//             }}>{item.text}</div> 
//         )
//       }
//     </div>
//   )
// })

const VideoPlayer = memo((props) => {  
  const { vid, uid, videoInfo, setVideoInfo,
          userinfo, setUserinfo, upinfo, 
          widthscreen, setWidthScreen,
          recommendlist, dmList, setDmList, updateuser,
          setUpinfo } = props  
  const location = useLocation();
  const playerboxRef = useRef()
  const videoRef = useRef(null),
        hiddenVideoRef = useRef(null); // 隐藏视频（用于捕获）
  const playerRef = useRef(null)
  const videoBoxRef = useRef(null)
  const progressRef = useRef(null),
        [isDragging, setIsDragging] = useState(false) // 视频进度条是否正在拖动
  const volumeRef = useRef(null),
       [isVolumeDragging, setIsVolumeDragging] = useState(false) // 视频进度条是否正在拖动
  const previewRef = useRef(null)
  const canvasRef = useRef(null)
  const bottomTimer = useRef(null)
  const moveTimer = useRef(false)
  const debounceTimer = useRef(null) // 防抖定时器
  const executeCallback = useRef(true) // 跟踪是否需要执行回调
  const bottomFlag = useRef(false) // 是都在底部操作栏
  const rightConTimmer = useRef(null) // 清晰度 音量 ...
  const volumeTimer = useRef(null)
  const fontTimer = useRef()
  const createbox = useRef()
  const firstPlay = useRef(false) // 第一次播放
  const clickTimer = useRef(null), // 双击时不触发单击 1. 定时器  2. 记录点击次数
        lastClickTime = useRef(0), // 记录上一次点击时间
        clickPending = useRef(false); // 是否正在等待第二次点击
  const favref = useRef()     // 收藏box的ref
  const createref = useRef()  // 新建
  const [tripleSpeedShow, setTripleSpeedShow] = useState(false),
        tsTimer = useRef(null) // 持续按右键键1s，三倍速播放
  const isSeeking = useRef(false) // 跳转状态变量
  const [capturedImage, setCapturedImage] = useState(null) // 当前帧数图片
  const [isLoading, setIsLoading] = useState(false)               // 加载完成
  const [isPlaying, setIsPlaying] = useState(false)               // 是否在播放
  const [isEnded, setIsEnded] = useState(false)                 // 视频结束
  const [showControls, setShowControls] = useState(true)  // 显示底部控制栏
  const [timeprogress, setTimeprogress] = useState(0)   // 一直增加的时间
  const [lastwatchednunm, setLswnum] = useState(0)      // 上次观看的时间
  const [wawtchdonefal, setWdone] = useState(0)         // 是否观看完
  const [currentTime ,setCurrentTime] = useState(0)       // 当前视频时间
  const [duration, setDuration] = useState(0)             //时长
  const [progress, setProgress] = useState(0)       // 视频进度条
  const [buffered, setBuffered] = useState(0)       // 缓冲
  const [isFullscreen, setIsFullscreen] = useState(false)           // 全屏
  const [rightShow, setRightShow] = useState(0) // 1 清晰度 2 倍速 3 音量 4 设置
  const [playbackRate, setPlaybackRate] = useState(1),      // 倍速
        rateList = [
          {text: '2.0X', rate: 2},
          {text: '1.5X', rate: 1.5},
          {text: '1.25X', rate: 1.25},
          {text: '1X', rate: 1},
          {text: '0.5X', rate: 0.5},
        ]
  const [setting1, setSetting1] = useState(false),       // 循环播放
        [setting2, setSetting2] = useState(false),       // 自动播放下一集
        [setting3, setSetting3] = useState(true)        // 16：9    4：3

  const [volume, setVolume] = useState(100),           // 音量大小
        [isMuted, setIsMuted] = useState(false),      // 静音 or 打开 声音
        [volumeChangeShow, setVolumeChangeShow] = useState(false)

  // 进度条交互
  const [hoverTime, setHoverTime] = useState(0),  // 悬浮时间
        [showPreview, setShowPreview] = useState(false),  // 预览图
        [previewPosition, setPreviewPosition] = useState(0),  // 预览图位置
        [isHovering, setIsHovering] = useState(false);

  const [sahreflag, setShareflag] = useState(true)
  const [createflag, setCreateflag] = useState(true)
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

  const [dmText, setDmtext] = useState("")           // 发送弹幕内容
  const [dmflag, setDmflag] = useState(true)       // 是否打开弹幕
  const [newFavtitle, setNewfavtitle] = useState()
  const [vlist, setVlist] = useState([]),                          // 该视频所属的列表
        [vlistindex, setVlistindex] = useState(0)                  // 列表篇中当前播放的视频的index
  const [seasonlist, setSeasonlist] = useState([]),
        [seasonindex, setSeasonindex] = useState(0),
        [chapterlist, setChapterlist] = useState([]),
        [chapterindex, setChapterindex] = useState(0)
  const [littlewindow, setLittlewindow] = useState(false)
  const [animationinfo, setAnimationinfo] = useState({})           // anmation 的信息


  // 获取数据
  useEffect(() => {
    const getData = async () => {      
      const res = videoInfo
      // 刚开始数据还没加载出来， 无法使用slice
      res.time = res?.time?.slice(0, 10) + ' ' + res?.time.slice(11, 16) // 在{ } 中修改会报错
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
        const res5 = await getSeasons(res.aid)
        setSeasonlist(res5)        
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
    // videoInfo 非空 非null
    if (videoInfo != null && Object.keys(videoInfo).length === '{}') {
      getData()
    }
  },[videoInfo])

  // 初始化视频元数据
  useEffect(() => {
    const video = videoRef.current;
    const distance = playerboxRef.current.scrollTop + playerboxRef.current.clientHeight // 滚动距离
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    // const handleProgress = () => {
    //   console.log('progressing...');

    //   if (video.buffered.length > 0) {
    //     const bufferedEnd = video.buffered.end(video.buffered.length - 1);
    //     const bufferedPercent = (bufferedEnd / video.duration) * 100;
    //     setBuffered(bufferedPercent);
    //   }
    // };

    const handleProgress = () => {
      const video = videoRef.current;
      if (video.buffered.length > 0) {
        let bufferedEnd = 0;
        // 找到包含当前时间的缓冲区间
        for (let i = 0; i < video.buffered.length; i++) {
          if (video.currentTime >= video.buffered.start(i) && 
              video.currentTime <= video.buffered.end(i)) {
            bufferedEnd = video.buffered.end(i);
            break;
          }
        }
        // 如果没有找到，使用最后一个缓冲区间
        if (bufferedEnd === 0 && video.buffered.length > 0) {
          bufferedEnd = video.buffered.end(video.buffered.length - 1);
        }
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
      console.log('seeking...');
      setIsLoading(true);
    };

    const handleSeeked = () => {
      console.log('seeked...');
      setIsLoading(false);
      isSeeking.current = false;
    };

    const handleEnded = () => {
      setIsEnded(true)
    }

    const scrollFnc = () => {
      const top = document.body.scrollTop || document.documentElement.scrollTop
      if (top > distance) {
        setBottomScrollflag(true)
      } else {
        setBottomScrollflag(false)
      }
    }

    // 关闭页面是触发
    const updateInfo = async () => {
      // 如果播放了视频，更新数据， 否则不用
      if (firstPlay.current) {
        const data = {
          uid: userinfo.uid,
          vid: vid,
          type: 0,
          lastwatched: videoRef.current.currentTime,
          done: wawtchdonefal
        }
        await updateVideoInfo(data)
      }
      return
    }

    const handleError = () => {
      setIsLoading(false);
      message.error({content: '视频加载失败', flag: true});
    };

    document.addEventListener("scroll", scrollFnc)
    document.addEventListener("beforeunload", updateInfo)
    // 获取时长
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    // 获取资源
    video.addEventListener("progress", handleProgress);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("seeking", handleSeeking);
    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("ended", handleEnded);
    video.addEventListener('error', handleError);

    return () => {
      document.removeEventListener("scroll", scrollFnc)
      document.removeEventListener("beforeunload", updateInfo)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("progress", handleProgress);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("seeking", handleSeeking);
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, []);

  // 键盘事件处理
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      e.stopPropagation(); // 阻止事件冒泡
      if (isFullscreen && key === "escape") {
        e.preventDefault();
        setIsFullscreen(false)
        return; // 直接返回，不执行任何操作
      }
      switch (key) {
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
        case "k":
          e.preventDefault()
          setWidthScreen(!widthscreen)
          break;
        case "m":
          e.preventDefault();
          handleMulted()
          break;
        // 左箭头后退5秒
        case "arrowleft":
          e.preventDefault();
          skipTime(-5);
          if (!isPlaying) {
            togglePlay();
          }
          break;
        // 右箭头前进5秒
        case "arrowright":
          e.preventDefault();
          if (!tsTimer.current) { // 避免重复设置
            tsTimer.current = setTimeout(() => {
              setTripleSpeedShow(true);
              videoRef.current.playbackRate = 3;
            }, 1000);
          }
          break;
        // 上箭头增加5%音量
        case "arrowup":
          e.preventDefault();
          skipVolume(10)
          break;
        // 下箭头减少5%音量
        case "arrowdown":
          e.preventDefault();
          skipVolume(-10)
          break;
        default:
          break;
      }
    };
    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      switch (key) {
        case 'arrowright':
          e.preventDefault();
          clearTimeout(tsTimer.current);
          tsTimer.current = null;
          if (tripleSpeedShow) {
            videoRef.current.playbackRate = 1
            setTripleSpeedShow(false)
          } else {
            skipTime(5);
            if (!isPlaying) {
              togglePlay();
            }
          }
          break;
        default:
          break;
      }
    }
    // 添加事件监听，使用capture阶段捕获 注意第三个参数true
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      if(tsTimer.current) {
        clearTimeout(tsTimer.current)
        tsTimer.current = null;
      }
    };
  }, [isFullscreen, volume, isPlaying, widthscreen, tripleSpeedShow]);

  // 时间进退
  const skipTime = (seconds) => {
    if (isSeeking.current) return;
    
    const video = videoRef.current;
    const newTime = video.currentTime + seconds;
    
    // 确保时间在有效范围内
    if (newTime < 0) {
      video.currentTime = 0;
    } else if (newTime > video.duration) {
      video.currentTime = video.duration;
    } else {
      isSeeking.current = true;
      video.currentTime = newTime;
    }
  };

  // 音量加减
  const skipVolume = (num) => {
    setVolumeChangeShow(true)
    if(volumeTimer.current != null) {
      clearTimeout(volumeTimer.current)
      volumeTimer.current = null
    }
    volumeTimer.current = setTimeout(() => {
      setVolumeChangeShow(false)
    }, 1000);

    const video = videoRef.current;
    let v = Math.floor(video.volume.toFixed(2) * 100 + num)
    if (num > 0 && isMuted) {
      setIsMuted(false)
    }
    if (v > 100) {
      v = 100
    } else if (v <= 0) {
      v = 0
      setIsMuted(true)
    }
    video.volume = v * 0.01;
    setVolume(v)
  };

  // 静音处理
  const handleMulted = () => {
    const video = videoRef.current
    if (isMuted) {
      video.volume = volume * 0.01
      setVolume(volume)
      setIsMuted(false)
    } else {
      video.volume = 0
      setIsMuted(true)
    }
  }

  const enterRightController = (type) => {
    if (rightConTimmer.current !== null) {
      clearTimeout(rightConTimmer.current)
      rightConTimmer.current = null
    }
    setRightShow(type + 0)
  }

  const leaveRightController = (type) => {
    rightConTimmer.current = setTimeout(() => {
      setRightShow(0)
      rightConTimmer.current = null
    }, 500)
  }

  // 播放速率切换
  const changePlaybackRate = (rate) => {
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    // 清除
    bottomTimer.current = setTimeout(() => {
      setShowControls(false)
    }, 2000)
    setRightShow(0)
  };

  // 改变音量========================================
  // 鼠标按下
  const handleVolumeDown = (e) => {
    e.stopPropagation()
    setIsVolumeDragging(true);
  
    // 计算点击位置的百分比
    const progressBar = volumeRef.current;
    const rect = progressBar.getBoundingClientRect();
        console.log(e.clientY, rect.bottom);
    const clickPosition = rect.bottom - e.clientY;
    const percentage = Math.floor((clickPosition / rect.height) * 100)
    if (isMuted && percentage > 0) {
      setIsMuted(false)
    }
    if(percentage <= 0) {
      setIsMuted(true)
      videoRef.current.volume = 0
    }
    // 设置缓冲条和进度条位置
    setVolume(percentage)
    videoRef.current.volume = percentage * 0.01
  }

  const handleVolumeMove = useCallback((e) => {
    if (isVolumeDragging) {
      const progressBar = volumeRef.current;
      const rect = progressBar.getBoundingClientRect();
      
      let clickPositionY = rect.bottom - e.clientY;
      clickPositionY = Math.max(0, Math.min(rect.height, clickPositionY));
      const percentage = Math.floor((clickPositionY / rect.height) * 100)
      if (isMuted && percentage > 0) {
        setIsMuted(false)
      }
       if(percentage <= 0) {
        setIsMuted(true)
        videoRef.current.volume = 0
      }
      setVolume(percentage)
      videoRef.current.volume = percentage * 0.01
    }
  }, [isVolumeDragging]);

  useEffect(() => {
    // 鼠标抬起
    const handleMouseUp = (e) => {
      setIsVolumeDragging(false);
    };

    document.addEventListener('mousemove', handleVolumeMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleVolumeMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleVolumeMove]);

  // 返回弹幕行
  const [dmlines, setDmlines] = useState(20),
        [freeline, setFreenline] = useState(() => new Array(20).fill(20)),
        [dmcontrolflag, setDmcontrolflag] = useState(false),
        [fontflag, setFontflag] = useState(false),
        [dmfontsize, setDmfontsize] = useState('16px'),
        [dmfontcolor, setDmfontcolor] = useState("#fff")

  const dmcontrolenter = () => {
    if (fontTimer.current != null) {
      setFontflag(false)
      clearTimeout(fontTimer.current)
      fontTimer.current = null
    }
    setDmcontrolflag(true)
  }

  const dmcontrolleave = () => {
    fontTimer.current = setTimeout(() => {
      setDmcontrolflag(false)
    }, 800)
  }

  const enterfont = () => {
    if (fontTimer.current != null) {
      setDmcontrolflag(false)
      clearTimeout(fontTimer.current)
      fontTimer.current = null
    }
    setFontflag(true)
  }

  const leavefont = () => {
    fontTimer.current = setTimeout(() => {
      setFontflag(false)
    }, 800)
  }

  // 格式化时间显示
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

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

  // 延迟播放/暂停 全屏/推出全屏
  const togglePlayClick = () => {
    const now = Date.now();
    const isDoubleClick = now - lastClickTime.current < 300; // 300ms 内算双击

    lastClickTime.current = now; // 更新点击时间

    if (isDoubleClick) {
      // 如果是双击：
      // 1. 取消之前的单击定时器
      if (clickTimer.current) {
        clearTimeout(clickTimer.current);
        clickTimer.current = null;
      }
      // 2. 执行双击逻辑（全屏）
      toggleFullscreen();
      clickPending.current = false; // 重置状态
    } else {
      // 如果是单击：
      clickPending.current = true; // 标记为等待第二次点击
      clickTimer.current = setTimeout(() => {
        if (clickPending.current) {
          // 如果 300ms 内没有第二次点击，执行单击逻辑（播放/暂停）
          togglePlay();
          clickPending.current = false;
        }
        clickTimer.current = null;
      }, 300); // 300ms 后判定为单击
    }
  }

  // 播放/暂停(立即)
  const togglePlay = async () => {
    // 第一次播放点击之后，如果没有其它操作下方控制栏消失
    if (!firstPlay.current) {
      firstPlay.current = true
      moveTimer.current = setTimeout(() => {
        setShowControls(false)
      }, 2000)
      // 更新视频信息
      if (videoInfo.lastweatched === 0) {
        const data = {
          uid: userinfo.uid,
          vid: vid,
          type: 0,
          lastwatched: 1,
          done: 0
        }
        const res = await updateVideoInfo(data)
        console.log('res: ', res);
        if (res === 0) {
          console.log('第一次次观看，播放加一');
          setVideoInfo({
            ...videoInfo,
            plays: videoInfo.plays + 1,
            lastwatched: 1
          })
        }
      }
    }
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
  }

  // 当前帧数图片
  const generateImg = (time) => {
    const video = hiddenVideoRef.current;
    const canvas = canvasRef.current;
    video.currentTime = time;
    console.log('video2: ', video.readyState);
    // 尚未加载完成    
    if (!video || video.readyState < 2) {      
      return;
    }
    
    const onSeeked = () => {
      // 设置canvas尺寸
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // 绘制当前帧到canvas
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // 将canvas转换为图片URL
      try {
        const imageURL = canvas.toDataURL('image/png');
        setCapturedImage(imageURL);
      } catch (err) {
        console.error("捕获帧错误:", err);
      }
      video.removeEventListener('seeked', onSeeked);
    };
    
    video.addEventListener('seeked', onSeeked);
  };
  
  // 处理全屏变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenElement =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;

      setIsFullscreen(!!fullscreenElement);

      // if (!fullscreenElement && videoBoxRef.current) {
      //   if (widthscreen) {
      //     videoBoxRef.current.style.height = "516px";
      //   } else {
      //     videoBoxRef.current.style.height = "421px";
      //   }
      // }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  // 小窗模式
  const changePip = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
      setLittlewindow(!littlewindow)
    } catch (error) {
      message.error({content: '小窗模式启动失败', flag: true})
    }
  }

  // 全屏切换
  const toggleFullscreen = useCallback(() => {   
    if (!isFullscreen) {
      if (videoBoxRef.current.requestFullscreen) {
        videoBoxRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoBoxRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.mozRequestFullScreen) {
        videoBoxRef.current.mozRequestFullScreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoBoxRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  }, [isFullscreen])
  
  // 底部操作栏==========================================================
  // 鼠标在视频中移动时间
  /**
   * 于 JavaScript 闭包和定时器的异步特性导致的
   * 当 mouseMoveOnMask 执行时，它创建了一个定时器，这个定时器会在 3 秒后执行回调函数。
    如果在 3 秒内调用了 moveBottomControl，虽然你清除了 moveTimer.current，
    但是定时器的回调函数可能已经被放入事件队列中等待执行。
    clearTimeout 只能阻止尚未执行的定时器，不能取消已经在事件队列中等待执行的回调。
    解决方案: 你需要添加一个标志来阻止回调函数的执行：
    executeCallback
   */
  // const mouseMoveOnMask = () => {
  //   if (!bottomFlag.current) {
  //     executeCallback.current = true;

  //     setShowControls(true)
  //     if (moveTimer.current != null) {
  //       clearTimeout(moveTimer.current)
  //       moveTimer.current = null
  //     }
  //     moveTimer.current = setTimeout(() => {
  //       if (executeCallback.current) {
  //         setShowControls(false);
  //       }
  //     }, 3000);
  //   }
  // }

  const mouseMoveOnMask = () => {
    if (!bottomFlag.current) {
      setShowControls(true); // 立即显示控制栏
      executeCallback.current = true;

      // 清除之前的防抖和隐藏定时器
      clearTimeout(debounceTimer.current);
      clearTimeout(moveTimer.current);

      // 设置防抖：300ms 后（鼠标停止移动）才启动 3 秒隐藏定时器
      debounceTimer.current = setTimeout(() => {
        moveTimer.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }, 300); // 防抖延迟 300ms
    }
  };

  // const mouseMoveOnMask = debounce(() => {
  //   if (!bottomFlag.current) {
  //     executeCallback.current = true;
  //     setShowControls(true);
  //     if (moveTimer.current) {
  //       clearTimeout(moveTimer.current);
  //     }
  //     // 设置新的 moveTimer（3秒后隐藏控制栏）
  //     moveTimer.current = setTimeout(() => {
  //       if (executeCallback.current) {
  //         setShowControls(false);
  //       }
  //     }, 3000);
  //   }
  // }, 500);

  // 离开视频区域
  const leaveVideoPart = () => {
    setShowControls(false)
    if (moveTimer.current) {
      clearTimeout(moveTimer.current);
      moveTimer.current = null;
    }
    if (bottomTimer.current) {
      clearTimeout(bottomTimer.current);
      bottomTimer.current = null;
    }
  }

  // 进入底部操作框
  const moveBottomControl = () => {
    bottomFlag.current = true
    executeCallback.current = false // 阻止回调函数执行
    if (debounceTimer.current != null) {
      clearTimeout(debounceTimer.current)
      debounceTimer.current = null
    }
    if (bottomTimer.current != null) {
      clearTimeout(bottomTimer.current)
      bottomTimer.current = null
    }
    if (moveTimer.current != null) {
      clearTimeout(moveTimer.current)
      moveTimer.current = null
    }
    setShowControls(true)
  }

  // 离开底部操作框
  const leaveBottomControl = () => {
    bottomFlag.current = false
    bottomTimer.current = setTimeout(() => {
      setShowControls(false)
    }, 3000)
  }

  // 进度条===================================================
  const enterBottomProgress = () => {
    setIsHovering(true)
  }

  const leaveBottomProgress = () => {
    setShowPreview(false);
    setIsHovering(false)
  }

  // 鼠标按下
  const handleProgressDown = (e) => {
    setIsDragging(true);
  
    // 计算点击位置的百分比
    const progressBar = progressRef.current;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = (clickPosition / rect.width) * 100;

    // 设置缓冲条和进度条位置
    setBuffered(Math.min(100, Math.max(0, percentage)));
    setProgress(Math.min(100, Math.max(0, percentage)));
  }

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      const progressBar = progressRef.current;
      const rect = progressBar.getBoundingClientRect();
      
      // 计算鼠标X坐标相对于进度条的位置
      let clickPositionX = e.clientX - rect.left;
      
      // 限制在进度条范围内（0到宽度）
      clickPositionX = Math.max(0, Math.min(rect.width, clickPositionX));
      
      const percentage = (clickPositionX / rect.width) * 100;
      
      // 更新缓冲条和进度条位置
      setBuffered(Math.min(100, Math.max(0, percentage)));
      setProgress(Math.min(100, Math.max(0, percentage)));
    }
    // 预览图
    const progressBar = progressRef.current;
    const rect = progressBar.getBoundingClientRect();
    const positon = e.clientX - rect.left;
    const percent = positon / rect.width;
    setHoverTime(percent * duration);
    setPreviewPosition(positon);
    setShowPreview(true);
    generateImg(hoverTime)
    // setHoverPosition(positon)
  }, [isDragging]);

  // const handleMouseMove = useCallback(debounce((e) => {
  //   if (isDragging && !isSeeking.current) {
  //     const progressBar = progressRef.current;
  //     const rect = progressBar.getBoundingClientRect();
      
  //     let clickPositionX = e.clientX - rect.left;
  //     clickPositionX = Math.max(0, Math.min(rect.width, clickPositionX));
      
  //     const percentage = (clickPositionX / rect.width) * 100;
  //     setBuffered(Math.min(100, Math.max(0, percentage)));
  //     setProgress(Math.min(100, Math.max(0, percentage)));
      
  //     // 预览图
  //     const percent = clickPositionX / rect.width;
  //     setHoverTime(percent * duration);
  //     setPreviewPosition(clickPositionX);
  //     setShowPreview(true);
  //     generateImg(percent * duration);
  //   }
  //   // 预览图
  //   const progressBar = progressRef.current;
  //   const rect = progressBar.getBoundingClientRect();
  //   const positon = e.clientX - rect.left;
  //   const percent = positon / rect.width;
  //   setHoverTime(percent * duration);
  //   setPreviewPosition(positon);
  //   setShowPreview(true);
  //   generateImg(hoverTime)

  // }, 100), [isDragging, duration]);

  // 添加全局鼠标移动和抬起事件监听
  useEffect(() => {
    // 鼠标抬起
    // const handleMouseUp = (e) => {
    //   if (isDragging) {
    //     const video = videoRef.current;
    //     const progressBar = progressRef.current;
    //     const rect = progressBar.getBoundingClientRect();
    //     const clickPosition = e.clientX - rect.left;
    //     const progressBarWidth = rect.width;
    //     const seekTime = (clickPosition / progressBarWidth) * video.duration;
    //     video.currentTime = seekTime;
    //     setProgress((seekTime / video.duration) * 100);
    //     if (!isPlaying) {
    //       togglePlay()
    //     }
    //     setIsDragging(false);
    //   }
    // };

    const handleMouseUp = (e) => {
      if (isDragging) {
        const video = videoRef.current;
        const progressBar = progressRef.current;
        const rect = progressBar.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        const progressBarWidth = rect.width;
        const seekTime = (clickPosition / progressBarWidth) * video.duration;
        video.currentTime = seekTime;
        
        // 更新缓冲状态
        if (video.buffered.length > 0) {
          const bufferedEnd = video.buffered.end(video.buffered.length - 1);
          const bufferedPercent = (bufferedEnd / video.duration) * 100;
          setBuffered(bufferedPercent);
        }
        
        setProgress((seekTime / video.duration) * 100);
        if (!isPlaying) {
          togglePlay()
        }
        setIsDragging(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove]);

  // 视频信息====================================================
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
        if (videoInfo.iconed === false) {
          setIconflag(true)
        } else {
          message.open({ type: 'info', content: '已经投币不能重复~'})
        }
      } else {
        const data = {
          hisuid: videoInfo.uid,
          uid: userinfo.uid,
          vid: vid,
          type: type,
          // fid: type === 3 ? 0 : null
        }
        const res = (await updateVideoInfo(data))
        if (res === 1) {
          // 点赞
          if (videoInfo.liked === false) {
            console.log('1111: ',typeof(setVideoInfo));
            
            setVideoInfo({
              ...videoInfo,
              likes: videoInfo.likes + 1,
              liked: !videoInfo.liked
            })
            message.open({ type: 'info', content: '点赞', flag: true})
          } else {
            setVideoInfo({
              ...videoInfo,
              likes: videoInfo.likes - 1,
              liked: !videoInfo.liked
            })
            message.open({ type: 'info', content: '取消点赞', flag: true})
          }
        }
        // else if (res === 3) {
        //   setVideoInfo({
        //     ...videoInfo,
        //     favorites: videoInfo.favorites + 1,
        //     faved: !videoInfo.faved
        //   })
        // }
        else if (type === 4){
          // 分享
          // http://localhost:3000/video/84
          // let content = 'http://localhost:3000' + location.pathname
          let content = "[" + videoInfo.title + "] " + baseurl2 + location.pathname

          var aux = document.createElement("input"); 
          aux.setAttribute("value", content); 
          document.body.appendChild(aux); 
          aux.select();
          document.execCommand("copy"); 
          document.body.removeChild(aux);
          setVideoInfo({
            ...videoInfo,
            shares: videoInfo.shares + 1 
          })
          message.open({type: 'info', content: '已复制链接到剪切板', flag: true})
        }
      }
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
        setVideoInfo({
          ...videoInfo,
          favorites: videoInfo.favorites + num,
          faved: !videoInfo.faved
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
      const res = await updateVideoInfo(data)
      if (res) {
        setVideoInfo({
          ...videoInfo,
          icons: videoInfo.icons + icons,
          iconed: true               // 投币不能撤回
        })
      }
      // 更新视频信息

     // 子传父 更新用户信息
      updateuser()
      setIconflag(0)
      message.open({ type: 'info', content: '已投币~', flag: true})
    } else {
      setIconflag(0)
      message.open({ type: 'error', content: '剩余硬币不足'})
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

  // 发送弹幕
  const toSendDm = async () => {
    if (uid === -1) {
      message.open({ type: 'warning', content: '请先登录'})
      return
    }
    if (dmflag) {
      if (dmText === '' || dmText === null) {
        message.open({ type: 'warning', content: '输入内容为空'})
        return
      }
      const data = {
        text: dmText,
        uid: uid,
        vid: vid,
        // sendtime: timeprogress,
        sendtime: currentTime,
        color: dmfontcolor,
        type: 0,
      }
      // 返回带最新的list
      const res = await sendDm(data)
      if (res) {
        setDmtext("")
        setVideoInfo({
          ...videoInfo,
          danmus: videoInfo.danmus + 1
        })
        setDmList(res)
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
    setIsEnded(false)
  }

  useEffect(() => {
    console.log('???', isEnded);
    
  },[isEnded])
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
    setUpinfo({
      ...upinfo,
      followed: true
    })
    setUserinfo({
      ...userinfo,
      follows: userinfo.follows + 1
    })
    userinfo.follows = userinfo.follows + 1
    localStorage.setItem('userinfo', JSON.stringify(userinfo))
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
    setUpinfo({
      ...upinfo,
      followed: false,
    })
    setUserinfo({
      ...userinfo,
      follows: userinfo.follows - 1
    })
    userinfo.follows = userinfo.follows - 1
    localStorage.setItem('userinfo', JSON.stringify(userinfo))
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
    <div className={`playerbox ${widthscreen ? "playerbox-active" : ""}`}
      ref={playerboxRef}
    >
      <div className="videobox"
        onMouseMove={mouseMoveOnMask}
        onMouseLeave={leaveVideoPart}
        ref={videoBoxRef}
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
        <div className={`pili-player ${isFullscreen ? 'fullscreen' : ''}`}
          ref={playerRef}
        >
          <video
            src={videoInfo?.path}
            ref={videoRef}
            controls={false} // 禁用原生控件
            tabIndex="0"
            // style={{ height: isFullscreen ? "100vh" : "100%" }}
          />
        </div>
        {
          !isPlaying &&
          <span className="pausespan icon iconfont">&#xe6ab;</span>
        }
        <div className="vide-mask-over"
          onClick={togglePlayClick}
        >
          {
            tripleSpeedShow &&
            <div className="triplespeedbox">三倍速播放中</div>
          }
          {
            volumeChangeShow &&
            <div className="volumechangebox">
              {
                isMuted ?
                <span className="iconfont">&#xe67e;</span>
                :
                <span className="iconfont">&#xe67a;</span>
              }
              <span>{volume}%</span>
            </div>
          }
          {
            isEnded &&
            <div className="end-view"
              onClick={replayvideo}
            >
              <div className="video-end-box">
                <div className="userinfo-line">
                  <div className="recom-img-box">
                    <img src={upinfo?.avatar} alt="" className="user-reco-avatar"
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
                        style={{color: videoInfo?.liked ? '#32aeec' : '#fff'}}
                      >
                        <span className="icon iconfont">&#xe61c;</span>
                        <span className="icon-text-sp">点赞</span>
                      </div>
                      <div className="iconbox-a"
                        data-type="2"
                        style={{color: videoInfo?.iconed ? '#32aeec' : '#fff'}}
                      >
                        <span className="icon iconfont">&#xe617;</span>
                        <span className="icon-text-sp">投币</span>
                      </div>
                      <div className="iconbox-a"
                        data-type="3"
                        style={{color: videoInfo?.faved ? '#32aeec' : '#fff'}}
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
                      recommendlist?.map(item =>
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
          <div className="dm-container">
            <Danmu
              dmflag={dmflag}
              dmList={dmList}
              isPlaying={isPlaying}
              uid={uid}
              currentTime={currentTime}
            />
          </div>
        </div>
        {/* 预览图 */}
        <video 
          ref={hiddenVideoRef}
          scr={videoInfo?.path}
          style={{ display: 'none' }}
          crossOrigin="anonymous" // 绘制帧图片时候跨域
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {
         isHovering &&
          <div
            className={`preview-thumbnail`}
            ref={previewRef}
            style={{ left: `${previewPosition}px` }}
          >
            <div className="preview-image">
              <img 
                src={capturedImage} 
                alt="Captured frame" 
              />
            </div>
            <div className="preview-time">{formatTime(hoverTime)}</div>
          </div>
        }
        {/* 顶部信息控制 */}
        {
          !isEnded &&
          <div className="topmask"
            style={{opacity: showControls ? '1' : '0'}}
          >
            <div className="topline">
              <span>{videoInfo?.title}</span>
            </div>
          </div>
        }
        {/* 视频底部控制 */}
        <div
          className={`videobottomcof ${ isFullscreen ? "full-active" : ""}`}
          style={{opacity: showControls ? '1' : '0'}}
          onMouseMove={moveBottomControl}
          onMouseLeave={leaveBottomControl}
          >
          <div className="progress-bar"
            ref={progressRef}
            onMouseDown={handleProgressDown}
            onMouseEnter={enterBottomProgress}
            onMouseLeave={leaveBottomProgress}
          >
            <div className="buffered" style={{width: `${buffered}%`}}></div>
            <div className="progress" style={{width: `${progress}%`}}></div>
             {isHovering && (
                <>
                  <div 
                    className="triangle top" 
                    style={{ left: `${previewPosition}px` }}
                  ></div>
                  <div 
                    className="triangle bottom" 
                    style={{ left: `${previewPosition}px` }}
                  ></div>
                  <div 
                    className="hover-indicator" 
                    style={{ left: `${previewPosition}px` }}
                  ></div>
                </>
              )}
          </div>
          <div className="videoopationbox">
            <div className="vidconleft">
              {
                vlist.length > 0 && vlistindex - 1 > 0 &&
                <div className="out111">
                  <div className="leftinnerspan icon iconfont"
                    onClick={prvvideo}
                  >&#xf078;</div>
                </div>
              }
              {
                chapterlist.length > 0 && chapterindex  > 0 &&
                <div className="out111">
                  <div className="leftinnerspan icon iconfont"
                    onClick={prvanima}
                  >&#xf078;</div>
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
                {formatTime(currentTime)} / {formatTime(duration)}
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
                        value={dmText}
                        onChange={(e) => setDmtext(e.target.value)}
                        onKeyDown={(e) => {
                          e.stopPropagation()
                          if (e.key === 'Enter') {toSendDm()}
                        }}
                        onKeyUp={(e) => {
                          e.stopPropagation()
                        }}
                      placeholder='发一条弹幕吧~'/>
                      :
                      <div className="dm-close-box">弹幕已关闭</div>
                    }
                    <div className={dmflag ? "rightbtn" : "rightbtn notsend"} onClick={toSendDm}>发送</div>
                  </div>
                </div>
              }
            </div>
            <div className="vidconright">
              <div className='outtbox'>
                <div className='textspan' 
                  onMouseEnter={() => enterRightController(1)} 
                  onMouseLeave={() => leaveRightController(1)}
                >清晰度</div>
                {rightShow === 1 && 
                  <div className="clear-append" 
                    onMouseEnter={() => enterRightController(1)} 
                    onMouseLeave={() => leaveRightController(1)}
                  >
                    <div className="onevv">1080P 高清</div>
                    <div className="onevv">720P 高清</div>
                    <div className="onevv">360P 流畅</div>
                  </div>
                }
              </div>
              <div className='outtbox outbox2'>
                <div className='textspan'
                  onMouseEnter={() => enterRightController(2)} 
                  onMouseLeave={() => leaveRightController(2)}
                >
                  { 
                    <span>{playbackRate === 1 ? '倍速' : playbackRate}</span>
                  }
                  </div>
                {
                  rightShow === 2 && 
                  <div className="rate-append" 
                    onMouseEnter={() => enterRightController(2)} 
                    onMouseLeave={() => leaveRightController(2)}
                  >
                    {
                      rateList.map(item =>
                        <div className="onevv"
                          onClick={() => changePlaybackRate(item.rate)}
                        >{item.text}</div>
                      )
                    }
                  </div>
                }
              </div>
              <div className='outtbox'>
                  <span className='icon iconfont sp11'
                    onMouseEnter={() => enterRightController(3)} 
                    onMouseLeave={() => leaveRightController(3)}
                    onClick={handleMulted}
                  >
                    {
                      isMuted ?
                      <span>&#xe67e;</span>
                      :
                      <span>&#xe67a;</span>
                    }
                  </span>
              
          
                {
                  rightShow === 3 && 
                    <div className="volume-append"
                     onMouseEnter={() => enterRightController(3)} 
                      onMouseLeave={() => leaveRightController(3)}
                      // onClick={changeVolume}
                  >
                    <div className="voicenum">
                      {
                        isMuted ?
                        <span>0</span>
                        :
                        <span>{volume}</span>
                      }
                    </div>
                    <div className="volumebox"
                      ref={volumeRef}
                      onMouseDown={handleVolumeDown}
                    >
                      <div className="volumebar">
                        <div className="volumeprogress"style={{height: `${volume}%`}}>
                        {/* <div className="drag-btn"></div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
              <div className='outtbox'>
                <span className='iconfont sp-setting'
                  onMouseEnter={() => enterRightController(4)} 
                  onMouseLeave={() => leaveRightController(4)}
                >&#xe680;</span>
                {
                  rightShow === 4 &&
                  <div className="setting-append"
                    onMouseEnter={() => enterRightController(4)} 
                    onMouseLeave={() => leaveRightController(4)}
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
              {/* 画中画 */}
              <div className='appnedtext1 outtbox'>
                <span className='icon iconfont sp31'
                  // onClick={() => setLittlewindow(!littlewindow)}
                  onClick={changePip}
                >&#xe61b;</span>
              </div>
              {/* 宽屏 */}
              <div className='appnedtext2 outtbox'>
                <div className='icon iconfont sp41'
                  onClick={() => setWidthScreen(!widthscreen)}>&#xe61a;</div>
              </div>
              {/* 全屏 */}
              <div className='appnedtext3 outtbox'>
                {
                  isFullscreen ?
                  <div onClick={toggleFullscreen} className='icon iconfont sp52'>&#xe68a;</div>
                  :
                  <div onClick={toggleFullscreen} className='icon iconfont sp51'>&#xe7bc;</div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="videoconbox">
        {/* <div className="conleft">已经装填{videoInfo.danmus}条弹幕</div> */}
        <div className="conleft">已经装填{dmList.length}条弹幕</div>
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
                value={dmText}
                onChange={(e) => setDmtext(e.target.value)}
                onKeyDown={(e) => {
                  e.stopPropagation()
                  if (e.key === 'Enter') {toSendDm()}
                }}
                onKeyUp={(e) => {
                  e.stopPropagation()
                }}
              placeholder='发一条弹幕吧~'/>
              :
              <div className="dm-close-box">弹幕已关闭</div>
            }
            <div className={dmflag ? "rightbtn" : "rightbtn notsend"} onClick={toSendDm}>发送</div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default VideoPlayer