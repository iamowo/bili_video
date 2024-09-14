import './Video.scss'
import Topnav from '../../components/Topnav/Topnav'
import { useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { getByVid, updateinfo, getVideoLikely, getDm, sendDm } from '../../api/video'
import { debounce } from '../../util/fnc'
import { addComment, deleteComment, getAllComment } from '../../api/comment'
import Totop from '../../components/toTop/totop'
import { getFavlist, addOneVideo, addOneFavlist } from '../../api/favlist'
import { useLocation } from 'react-router-dom'
import Notice from '../../components/notice/notice'
import { getByUid, getByUidFollowed, toFollow, toUnfollow } from '../../api/user'
import { tofollow, canclefollow, tovideo, touserspace } from '../../util/fnc'

function VideoPart (props) {
  const vid = props.vid
  // const userinfos = JSON.parse(localStorage.getItem('userinfo')) ? 
  //       JSON.parse(localStorage.getItem('userinfo')) : null
  // const [userinfo, setUserinfo] = useState(() => userinfos)

  const userinfo = props.userinfo    // 硬币减之后，父组件更新，子组件信息无法更新
  const uid = parseInt(userinfo !== null && userinfo !== '' ? userinfo.uid : -1)
  const location = useLocation();

  const [timeprogress, setTimeprogress] = useState(0)
  const [lastwatchednunm, setLswnum] = useState(0)
  const [wawtchdonefal, setWdone] = useState(0)
  const [thisvid, setThisvid] = useState({})            // video info
  const [nowtime ,setNowTime] = useState('00:00')       // time
  const [videoprogress, setProgress] = useState(0)      // progress
  const [loadprogress, setLoadprogress] = useState(0)   // 预加载进度
  const [fullfalg, setFullflag] = useState(false)           // 全屏
  const [clearflag, setClear] = useState(false)         // 清晰度
  const [speedflag, setSpeed] = useState(false)         // 倍速
  const [volumeflag, setVolume] = useState(true)        // 声音
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

  const [dmlist, setDmlist] = useState([])         // 弹幕列表
  const [dmtest, setDmtext] = useState()           // 发送弹幕内容
  const [dmflag, setDmflag] = useState(true)       // 是否打开弹幕

  const playerboxref = useRef()
  const textpart = useRef()                              // 标题ref，判断是都超过宽度
  const favref = useRef()     // 收藏box的ref
  const createref = useRef()  // 新建
  const [newFavtitle, setNewfavtitle] = useState()

  let timer1 = null
  const enter1 = () => {
    if (timer2 != null) {
      setSpeed(false)
    }

    if (timer1 != null) {
      clearTimeout(timer1)
    }
    setClear(true)
  }

  const leave1 = () => {
    timer1 = setTimeout(() => {
      setClear(false)
      timer1 = null
    },800)
  }

  // 倍速
  let timer2 = null
  const enter2 = () => {
    if (timer1 != null) {
      setClear(false)
    }

    if (timer2 != null) {
      clearTimeout(timer2)
      timer2 = null
    }
    setSpeed(true)
  }

  const leave2 = () => {
    timer2 = setTimeout(() => {
      setSpeed(false)
    },800)
  }

  const [speednum, setSpeednum] = useState(1)
  const changspeed = (e) => {
    console.log(e.target.dataset.sp);
    let num = e.target.dataset.sp - '0'
    setSpeednum(num)
    videoref.current.playbackRate = (num)
  }

  // 音量事件
  const toopenvolume = () => {
    setVolume(true)
    videoref.current.volume = 0.5
  }

  const toclosevolume = () => {
    setVolume(false)
    videoref.current.volume = 0
  }
  
  const videobox = useRef() // 视频区域
  const videoref = useRef() // 视频资源
  // 视频相关函数
  const [loadflag, setLoadflag] = useState(false)  // 加载完成
  const [playflag, setPlayflag] = useState(false)
  const [vidoopationflag, setVop] = useState(true)  // 显示控制栏 true显示 false不显示

  // canplay
  const videoloaded = () => {
    // console.log('canplay');
    setLoadflag(true)
  }

  // playing 	当音频/视频在因缓冲而暂停或停止后已就绪时触发。
  const videoplating = () => {
    // console.log('playing');
    
  }

  // play 播放时触发
  const videoplay = () => {
    setPlayflag(true)
    
  }
  // pause  手动暂停  跳转时加载暂停
  const videopause = () => {
    // console.log('pause');  
  }

  const videowating = () => {
    // console.log('wating');
  }
  
  const videoerror = () => {
    // 跳转加载
    setLoadflag(false)
    
  }
  // progress 当浏览器正在下载音频/视频时触发。

  // opupdate 当目前的播放位置已更改时触发。
  const playing  = () => {    
    // console.log('progress');
    
    const duration = Math.floor(videoref.current.duration)
    const now = Math.floor(videoref.current.currentTime)
    setTimeprogress(now)
    // console.log('now: ', now);
    
    setLswnum(now)
    // setProgress((now / duration).toFixed(2) * 100)
    setProgress(now / duration * 100)

    let mm = Math.floor(now / 60) > 10 ? '' + Math.floor(now / 60) : '0' + Math.floor(now / 60)
    let ss = now % 60 > 10 ? '' + Math.floor(now % 60) : '0' + now % 60
    if (now >= 3600) {
      let hh = Math.floor(now / 3600) > 10 ? '' + Math.floor(now / 3600) : '0' + Math.floor(now/ 3600)
      setNowTime(hh + ":" + mm + ":" + ss)
    } else {
      setNowTime(+ mm + ":" + ss)
    }
    // if (duration > 0) {
    //   for (let i = 0; i < videoref.current.buffered.length; i++) {
    //     // 寻找当前时间之后最近的点
    //     if (videoref.current.buffered.start(videoref.current.buffered.length - 1 - i) < videoref.current.currentTime) {
    //       let bufferedLength = ((videoref.current.buffered.end(videoref.current.buffered.length - 1 - i) + now )/ duration) * 100 +"%";
    //       // console.log(bufferedLength)
    //       // let res = ((now + bufferedLength)/ duration).toFixed(2) * 100
    //       setLoadprogress(bufferedLength)
    //       break;
    //   }
    //   }
    // }
  }

  // pleyend  视频播放完
  const playend = () => {
    setWdone(1);
    // console.log('endddd');
  }

  const [clicked, setcliceked] = useState(false)  // 播放了视频
  const clicktimer = null         // 双击时不触发单击 1. 定时器  2. 记录点击次数
  const clickvideo = async () => {
    if (clicktimer != null) {
      clearTimeout(clicktimer)
      clicktimer = null
      return
    }
    if (loadflag === true) {
      if (videoref.current.paused) {
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
            console.log('xxxx0000xxx');
            setThisvid({
              ...thisvid,
              plays: thisvid.plays + 1,
              lastwatched: 1
            })
          }
        }
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
      if (!window.screenTop && !window.screenY) {
        videobox.current.requestFullscreen()
      } else {
        document.exitFullscreen() 
      }
      setFullflag(!fullfalg)
    }
  }
  // 移动事件
  let timer = null
  let enterflag = false
  const mousemovefnc = () => {
    setVop(true)
    if (enterflag === false) {
      if (timer != null) {
        clearTimeout(timer)
      } else {        
        timer = setTimeout(() => {        
          setVop(false)
        },2000)
      }
    } else {
      setTimeout(() => {
        clearTimeout(timer)
        timer = null
      },100)
      return
    }
  }

  // 底部操作框
  const entervop = () => {
    setVop(true)
    enterflag = true  
  }

  const leaveop = () => {
    enterflag = false
    timer = setTimeout(() => {        
      setVop(false)
    },2000)
  }

  const leavevideopart = () => {    
    setVop(false)    
    if (timer != null) {
      clearTimeout(timer)
      timer = null
    }
  }

  const tothitime = (e) => {
    // 里面有各种位置信息  
    let bounds = e.target.getBoundingClientRect();
    const targetWidth = bounds.width // 宽度
    const postion = e.clientX - bounds.left
    let pro = (postion / targetWidth)
    videoref.current.currentTime =  Math.floor(videoref.current.duration * pro)
    // console.log('weizhi: ',pro);
  }

  // 点赞 投币 收藏 转发
  const clickbtn = async (e) => {
    if (userinfo === null) {
      alert('请先登录')
      return;
    }
    if (e.target.className === 'onepart' || e.target.parentNode.className === 'onepart') {
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
          alert('已投币~')
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
            setThisvid({
              ...thisvid,
              likes: thisvid.likes + 1,
              liked: !thisvid.liked
            })
          } else {
            setThisvid({
              ...thisvid,
              likes: thisvid.likes - 1,
              liked: !thisvid.liked
            })
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
          let content = 'http://localhost:3000' + location.pathname

          var aux = document.createElement("input"); 
          aux.setAttribute("value", content); 
          document.body.appendChild(aux); 
          aux.select();
          document.execCommand("copy"); 
          document.body.removeChild(aux);
          setThisvid({
            ...thisvid,
            shares: thisvid.shares + 1 
          })
        }
      }
    }
  }

  const [taglist, settaglist] = useState([])
  useEffect(() => {
    const getData = async () => {
      const res = (await getByVid(vid, uid))
      console.log('???', res);
      
      res.time = (res.time).slice(0, 10) + ' ' + (res.time).slice(11, 16) // 在{ } 中修改会报错
      setThisvid(res)

      // 弹幕
      const res2 = await getDm(vid)
      setDmlist(res2)

      document.title = `${res.title}`
      
      settaglist(res.tags)

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
        console.log('success'); 
        closefavbox()  // 关闭收藏页面
        setThisvid({
          ...thisvid,
          favorites: thisvid.favorites + num,
          faved: !thisvid.faved
        })
      }
    } else {
      alert('未选择收藏夹')
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
        setThisvid({
          ...thisvid,
          icons: thisvid.icons + icons,
          iconed: true               // 投币不能撤回
        })
      }
      // 更新视频信息

     // 子传父 更新用户信息
      props.updateuser()

      setIconflag(0)
    } else {
      setIconflag(0)
      alert('硬币不够')
    }
  }

  const tothiskeyword = (e) => {
    const index = parseInt(e.target.dataset.index)
    const w = e.target.dataset.word
    if (index === 0) {

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
      alert('login please')
      return
    }
    if (dmflag) {
      if (dmtest === '' || dmtest === null) {
        alert('输入为空')
        return
      }
      const data = {
        text: dmtest,
        uid: uid,
        vid: vid,
        sendtime: timeprogress,
        color: '#fff',
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
          <div className="vodepinnerbox"
            onMouseMove={debounce(mousemovefnc, 10)}
            // onMouseLeave={leavevideopart}
            >
            <video src={thisvid != null ? thisvid.path : null} preload='true'
              onCanPlay={videoloaded}
              onTimeUpdate={playing}
              onPlaying={videoplating}
              onEnded={playend}
              onPlay={videoplay}
              onPause={videopause}
              onWaiting={videowating}
              onError={videoerror}
              ref={videoref}
              className='videosrc'>
            </video>
          </div>
          {
            !playflag &&
            <span className="pausespan icon iconfont">&#xe6ab;</span>
          }
          <div className="vide-mask-over"
            onClick={clickvideo}
            onDoubleClick={handledoubleclick}
            >
              {
                dmlist.map((item, index) =>
                  <div className="danmu-div" key={item.id}
                    style={{animationPlayState: playflag && timeprogress >=(item.sendtime) ? '' : 'paused',
                            color: (item.color) + '',
                            textDecorationLine: (item.uid === uid) ? 'underline' : 'none',
                            top: (index % 10 * 20 + 5) + 'px'
                    }}>{item.text}</div>
                )
              }
          </div>
          {/* 视频控制 */}
          <div className={fullfalg ? "videobottomcof videobottomcof-active" : "videobottomcof"}
            // style={{opacity: vidoopationflag ? '1' : '0'}}
            onMouseEnter={entervop}
            onMouseLeave={leaveop}
            >
            <div className="progressbox" onClick={tothitime}>
              <div className="loadprogress" style={{width: loadprogress}}></div>
              <div className="done-box" style={{width: videoprogress + '%'}}></div>
            </div>
            <div className="videoopationbox">
              <div className="vidconleft">
                {
                  true &&
                  <div className="out111">
                    <div className="leftinnerspan icon iconfont" style={{rotate: '-180deg'}}>&#xe609;</div>
                  </div>
                }
                {
                  playflag ?
                  <span className="icon iconfont" onClick={clickvideo}>&#xea81;</span>
                  :
                  <span className="icon iconfont" onClick={clickvideo}>&#xe60f;</span>
                }
                {true && <div className="icon iconfont">&#xe609;</div>}
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
                    <div className="danmuopen icon iconfont">&#xe60d;</div>
                    <div className="danmusnedbox">
                      {
                        dmflag &&
                        <div className="leftfonts icon iconfont">&#xe64d;</div>
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
                    volumeflag ?
                    <span className='icon iconfont sp11' onClick={toclosevolume}>&#xea11;</span>
                    :
                    <span className='icon iconfont sp12' onClick={toopenvolume}>&#xea0f;</span> 
                  }
                  {
                    false && 
                    <div className="appendbox3">
                      <div className="voicenum">12%</div>
                      <div className="voiceprogress">
                        
                      </div>
                    </div>
                  }
                </div>
                <div className='outtbox'>
                  <span className='icon iconfont sp21'>&#xe602;</span>
                </div>
                <div className='outtbox'>
                  <span className='icon iconfont sp31'>&#xe61b;</span>
                </div>
                <div className='outtbox'>
                  <div className='icon iconfont sp41'
                    onClick={props.onChnageWidth}>&#xe61a;</div>
                </div>
                <div className='outtbox'>
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
            <div className="danmuopen icon iconfont">&#xe60d;</div>
            <div className="danmusnedbox">
              {
                dmflag &&
                <div className="leftfonts icon iconfont">&#xe64d;</div>
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
      <div className="videoinfos" onClick={clickbtn}>
        <div className="onepart" data-type="1" style={{color: thisvid.liked ? '#32AEEC' : '#61666D'}}>
          <span className="icon iconfont"  style={{fontSize: '35px'}}>&#xe61c;</span>
          <span className='optext'>{thisvid != null ? thisvid.likes : null}</span>
        </div>
        <div className="onepart"  data-type="2" style={{color: thisvid.iconed ? '#32AEEC' : '#61666D'}}>
          <span className="icon iconfont" style={{fontSize: '37px', translate: '0 3px'}}>&#xe617;</span>
          <span className='optext'>{thisvid != null ? thisvid.icons : null}</span>
        </div>
        <div className="onepart"  data-type="3" style={{color: thisvid.faved ? '#32AEEC' : '#61666D'}}>
          <span className="icon iconfont">&#xe630;</span>
          <span className='optext'>{thisvid != null ? thisvid.favorites : null}</span>
        </div>
        <div className="onepart"  data-type="4"
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
                style={{background: 'url(http://127.0.0.1:8082/sys/icon1-static.png)', backgroundSize: '120px',
                  backgroundPosition: '20px 20px', backgroundRepeat: 'no-repeat'}}
                onClick={() => setIcons(1)}>
                  <span className="iconnum-span" style={{color: icons === 1 ? '#32AEEC' : '#9499A0'}}>1硬币</span>
                  <div className="inner-box-img">
                    <img src={'http://127.0.0.1:8082/sys/icon1.png'} alt="" className="activeimh"
                      style={{opacity: icons === 1 ? '1' : '0'}}/>
                  </div>
              </div>
              <div className={icons === 2 ? "one-content icon-active" : "one-content"}
                style={{background: 'url(http://127.0.0.1:8082/sys/icon2-static.png)', backgroundSize: '120px',
                  backgroundPosition: '20px 20px', backgroundRepeat: 'no-repeat'}}
                onClick={() => setIcons(2)}>
                  <span className="iconnum-span" style={{color: icons === 2 ? '#32AEEC' : '#9499A0'}}>2硬币</span>
                  <div className="inner-box-img">
                    <img src={'http://127.0.0.1:8082/sys/icon2.png'} alt="" className="activeimh"
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
                    <input type="checkbox" className="onechecked" id={item.fid} hidden/>
                      <span className={favchecked[index] ? 'activebox icon iconfont': "icon iconfont"}>&#xe616;</span>
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
                      onChange={(e) => setNewfavtitle(e.target.value)}/>
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
              data-idnex={index} data-word={item} onClick={tothiskeyword}>{item}
            {
              index === 0 &&
              <span className="icon iconfont mtagicon">&#xe632;</span>
            }
            </div>
          )
        }
      </div>
    </>
  )
}

function CommentPart (props) {
  const vid = props.vid
  // const userinfos = JSON.parse(localStorage.getItem('userinfo'))
  // const [userinfo, setUserinfo] = useState(() => userinfos)

  const [thisvid, setThisvid] = useState()


  const userinfo = props.userinfo
  const uid = parseInt(userinfo !== null && userinfo !== '' ? userinfo.uid : -1)


  const [commentType, setCommentType] = useState(1)
  const [commentlist, setCommentlist] = useState([])
  const [commentArray, setCommentarray] = useState([])
  // 评论框flag
  const [commentflag, setCommentflag] = useState(false)
  const sendpart = useRef()
  const sendpart2 = useRef()
  const [commentshowone ,setShowOne] = useState(false)  // 翻滚显示下面的评论

  const [commentcontent, setContnet] = useState('')
  const [commentcontent2, setContnet2] = useState('')
  const [sendable, setSendbale] = useState(false)
  const [sendable2, setSendbale2] = useState(false)

  // comment
  const nipcontent1 = useRef()
  const nipcontent12 = useRef()
  const nipcontent2 = useRef()
  const inputcomemnt = (e) => {
    setContnet(e.target.value)
    if (e.target.value.length > 0) {
      setSendbale(true)
    } else {
      setSendbale(false)
    }
  }

  const sendcomment = async () => {
    if (userinfo === null) {
      alert('请先登录')
      return;
    }
    if (sendable === true) {
      const data = {
        uid: userinfo.uid,
        vid: vid,
        content: commentcontent,
        topid: 0,
        fid: 0,
        hisuid: thisvid.uid
      }
      const res = (await addComment(data))
      if (res === 200) {
        // 清除
        setSendbale(false)
        setCommentflag(false)
        setContnet('')                          // 清除输入框中内容
        if (nipcontent1.current != null) nipcontent1.current.value = ''            // 顶部的
        if (nipcontent12.current != null) nipcontent12.current.value = ''            // 底部的的
        // 更新数据
        const data2 = {
          uid: userinfo.uid,
          vid: vid,
          content: commentcontent,
          topid: 0,
          fid: 0,
          time: '刚刚',
          avatar: userinfo.avatar,
          name: userinfo.name
        }
        setCommentlist([
          ...commentlist,
          data2
        ])
        alert('success')
      }
    } else {
      alert('内容不能为空')
    }
  }

  // 回复评论 二级
  const [replaydata, setReplaydata] = useState({})
  const toreplaycomment = async (e) => {
    const index = parseInt(e.target.dataset.index)
    const newarrya = commentArray.map((item, tindex) => {
      if (tindex === index) {
        return true
      } 
      return false
    })    
    setCommentarray(newarrya)
    
    const data = {
      topid: e.target.dataset.topid,
      fid: e.target.dataset.fid,
      fname: e.target.dataset.name
    }
    setReplaydata(data)
  }

  const inputcomemnt2 = (e) => {
    setContnet2(e.target.value)
    if (e.target.value.length > 0) {
      setSendbale2(true)
    } else {
      setSendbale2(false)
    }
  }

  const sendcomment2 = async () => {
    if (sendable2 === true) {
      const data = {
        uid: userinfo.uid,
        vid: vid,
        content: commentcontent2,
        topid: replaydata.topid,   // 最顶层， 一级id
        fid: replaydata.fid,        // 二级id， 回复的评论的id
        hisuid: thisvid.uid,
        // name: userinfo.name,
        // avatar: userinfo.avatar,
        // fname: replaydata.fname
      }
      const res = (await addComment(data))
      if (res === 200) {
        setSendbale2(false)
        setCommentflag(false)
        setContnet2('') 

        const data2 = {
          uid: userinfo.uid,
          vid: vid,
          content: commentcontent2,
          topid: 1,   // 最顶层， 一级id
          fid: 2,        // 二级id， 回复的评论的id
          name: userinfo.name,
          avatar: userinfo.avatar,
          time: '刚刚',
          fname: replaydata.fname
        }
        if (nipcontent2.current != null) nipcontent2.current.value = ''            // bottom的
        setCommentlist([
          ...commentlist,
          data
        ])
        alert('replay success')
      } else {
        alert('replay failure')
      }
    } else {
      alert('内容不能为空')
    }
  }

  // 删除评论
  const todeletecomment = async (e) => {
    const id = parseInt(e.target.dataset.id)
    const topid = parseInt(e.target.dataset.topid)

    // 如果是一级评论
    if (parseInt(e.target.dataset.topid) === 0) {
      setCommentlist(
        commentlist.filter(item =>
          item.id !== id
        )
      )
    } else {
      for (let i = 0; i < commentlist.length; i++) {
        if (parseInt(e.target.dataset.topid) === commentlist[i].id) {
          const newone = commentlist.map(item => {
            if (item.id === topid) {
              commentlist[i].lists = (commentlist[i].lists).filter(item => item.id !== id )  // 新的数组（其中更新的一个）
              return commentlist[i]
            } else {
              return commentlist[i]
            }
          })
          console.log('...', newone);          
          // 替换
          setCommentlist(newone)
        }
      }
    }
    const res = (await deleteComment(id, vid))
    if (res === 200) {
      alert('delete success')
    } else {
      alert('failure')
    }
  }

  useEffect(() => {
    const getData = async () => {      
      const res = await getAllComment(vid)
      setCommentlist(res)      
      console.log('all comment is:', res);
      
      setCommentarray(new Array(res.length).fill(false))

      const res2 = await getByVid(vid, uid)
      
      setThisvid(res2)
    }
    getData()

    window.addEventListener('scroll', scrollfnc)
    return () => {
      window.removeEventListener('scroll', scrollfnc)
    }
    },[])

    const cilckfnc = (e) => {      
      if (!(sendpart.current).contains(e.target)) {
        setCommentflag(false)
        window.removeEventListener('click', cilckfnc)        
      }
    }

    const cilckfnc2 = (e) => {      
      if (!(sendpart2.current).contains(e.target)) {
        setCommentflag(false)
        window.removeEventListener('click', cilckfnc2)        
      }
    }

    const scrollfnc = (e) => {
      const top = document.body.scrollTop || document.documentElement.scrollTop
      const distance = sendpart.current.offsetTop
      setShowOne(top > distance ? true : false);
    }
  return (
    <>
    <div className="commetnbox">
      <div className="commenttitle">
        <div className="cmt1">
          <h2>评论</h2>
          <span style={{fontSize: '14px'}}>{commentlist.length}</span>
        </div>
        <div className="cmt2">
          <span onClick={() => setCommentType(1)} style={{color: commentType === 1 ? '#18191C' : '#9499A0'}}>最热</span>
          <div></div>
          <span onClick={() => setCommentType(2)}  style={{color: commentType === 2 ? '#18191C' : '#9499A0'}}>最新</span>
        </div>
      </div>
      {/* 顶部一级评论 */}
      <div className="vidsendbox" ref={sendpart}>
        <div className="snetext">
          <div className="avatarpart">
            <img src={userinfo != null ? userinfo.avatar : null} alt="" className="useravatarcom" />
          </div>
          <div className="rightppp">
            <div className="rightcommentpart" style={{backgroundColor: commentflag ? '#FFF' : '#F1F2F3'}}> 
              <textarea name="" id="" className="comtextarea"
                onFocus={() => {
                  setCommentflag(true)
                  window.addEventListener('click', cilckfnc)
                }}
                onChange={inputcomemnt}
                ref={nipcontent1}
                placeholder='写点什么吧~'
              ></textarea>
            </div>
            { 
              commentflag &&
              <div className="sendbtn">
                <div className="leftconfss">
                  <span className="icon iconfont">标签</span>
                </div>
                <div className="rightsends"
                onClick={sendcomment}
                style={{backgroundColor: sendable ? '#32AEEC' : '#00AEEC80'}}
                >发布</div>
              </div>
            }
          </div>
        </div>
      </div>
      { 
        commentlist.map((item, index) =>
          <div className="oneusercomment" key={item.id}>
            <div className="onecm">
              <div className="ocmla">
                <img src={item.avatar} alt=""  className='onecmavatar'/>
              </div>
              <div className="firsetcm">
                {/* 一级评论 */}
                <div className="onerpart">
                  <span className="cmname">{item.name}</span>
                </div>
                <div className="commentcontent">
                  <span className="firstcon">
                  {item.content}
                  </span>
                </div>
                <div className="eommentinfos">
                  <span>{() => item.time.slice(0, 10)}</span>
                  <div className="liseli">
                    <span className='icon iconfont'>&#xe61c;</span>
                    <span className='likenum'>{item.likes}</span>
                  </div>
                  {
                    // 先要登录才能回复
                    userinfo != null && item.uid === userinfo.uid ?
                    <span className='cmback'
                      data-id={item.id}
                      data-topid={item.topid}
                      onClick={todeletecomment}>删除</span>
                    :
                    <span className='cmback'
                      data-id={item.id}
                      data-fid={item.uid}
                      data-topid={item.id}
                      data-name={item.name}
                      data-index={index}
                      onClick={toreplaycomment}
                    >回复</span>
                  }
                </div>
                { 
                  item.lists != null ?
                    item.lists.map((item2) =>
                      <div className="secondcomments" key={item2.id}>
                        <div className="onesecondcomment">
                          <div className="leftpartsceavatar">
                            <img src={item2.avatar} alt="" className="secondavatar" />
                          </div>
                          <div className="rightusercomment-a">
                            <div className="rightcommentscrond">
                              <span className="secondname">{item2.name}</span>
                              <span className="secondcontent">
                                <span className="text11" style={{color: '#9499A0'}}>
                                  回复{item2.fname} :
                                </span>
                                {item2.content}
                              </span>
                            </div>
                            <div className="secondcommentinfos">
                              <span>{item.time.slice(0, 10)}</span>
                              <div className="liseli">
                                <span className='icon iconfont'>&#xe61c;</span>
                                <span className='likenum'>{item2.likes}</span>
                              </div>
                              {
                                userinfo != null && item2.uid === userinfo.uid ?
                                <span className='cmback'
                                  data-id={item2.id}
                                  data-topid={item2.topid}   // 获取，两者不一样
                                  onClick={todeletecomment}>删除</span>
                                :
                                <span className='cmback'
                                  data-id={item2.id}
                                  data-fid={item2.uid}
                                  data-topid={item.id}    // 设置父id
                                  data-name={item2.name}
                                  data-index={index}
                                  onClick={toreplaycomment}
                                >回复</span>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  :
                  null
                }
                {
                  item.lists != null && item.listslength > 2 &&
                  <div className="watchmore">
                    <span>共{item.listslength}条评论,</span>
                    <span className='watchmoreclick'>点击查看</span>
                  </div>
                }
                {
                  // 二级评论
                  // item.openflag &&
                  commentArray[index] === true &&
                  <div className="replaybox">
                    <div className="snetext">
                      <div className="avatarpart">
                        <img src={userinfo != null ? userinfo.avatar : null} alt="" className="useravatarcom" />
                      </div>
                      <div className="rightppp">
                        <div className="rightcommentpart"> 
                          <textarea name="" id="" className="comtextarea"
                            onChange={inputcomemnt2}
                            vlaue={commentcontent2}
                            placeholder={'回复@ ' + replaydata.fname + ' :'}
                          ></textarea>
                        </div>
                        <div className="sendbtn">
                          <div className="leftconfss">
                            <span className="icon iconfont">标签</span>
                          </div>
                          <div className="rightsends"
                          onClick={sendcomment2}
                          style={{backgroundColor: sendable2 ? '#32AEEC' : '#00AEEC80'}}
                          >发布</div>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        )
      }
      </div>
      {
        // 底部一级评论
        commentshowone &&
        <div className="sendbox2bottom" ref={sendpart2}>
          <div className="snetext">
              <div className="avatarpart">
                <img src={userinfo != null ? userinfo.avatar : null} alt="" className="useravatarcom" />
              </div>
              <div className="rightppp">
               <div className="rightcommentpart" style={{backgroundColor: commentflag ? '#FFF' : '#F1F2F3'}}> 
                  <textarea name="" id="" className="comtextarea"
                    onFocus={() => {
                      setCommentflag(true)
                      window.addEventListener('click', cilckfnc2)
                    }}
                    onChange={inputcomemnt}
                    vlaue={commentcontent}
                    ref={nipcontent12}
                    placeholder='写点什么吧~'
                  ></textarea>
                </div>
                { commentflag &&
                  <div className="sendbtn">
                    <div className="leftconfss">
                      <span className="icon iconfont">标签</span>
                    </div>
                    <div className="rightsends"
                    onClick={sendcomment}
                    style={{backgroundColor: sendable ? '#32AEEC' : '#00AEEC80'}}
                    >发布</div>
                  </div>
                }
              </div>
            </div>
        </div>
      }
    </>
  )
}

function RightPart (props) {
  const vid = props.vid
  const userinfo = props.userinfo
  const uid = parseInt(userinfo != null ? userinfo.uid : -1)
  
  const [thisvid, setThisvid] = useState({})
  const [videouser, setVideouser] = useState()
  const [videolist, setVideolist] = useState([])
  const [upinfo, setUpinfo] = useState()

  const rigtbox = useRef()
  const recommendref = useRef()

  const [dmlist, setDmlist] = useState([])         // 弹幕列表

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
  const [chapters, setChapters] = useState([
    {id: 1, title: '1'},
    {id: 5, title: '1'},
    {id: 4, title: '1'},
    {id: 3, title: '1'},
    {id: 2, title: '1'},
    {id: 6, title: '1'},
    {id: 7, title: '1'},
  ])  // 分集

  useEffect(() => {
    const getData = async () => {
      const res = await Promise.all([getByVid(vid, uid), getVideoLikely(vid), getDm(vid)])
      console.log(res);
      
      const upuid = res[0].uid
      
      const res2 = await getByUidFollowed(upuid, uid)
      console.log('作者信息:', res2);
      setUpinfo(res2)
      // 弹幕

      setThisvid(res[0])
      setVideolist(res[1])
      setDmlist(res[2])
    }
    getData()
    // 不让数据变化
    // setDistance(recommendref.current.offsetTop - recommendref.current.clientHeight)
    
    window.addEventListener('scroll', () => {
      let distance = recommendref.current.offsetTop
      const top = document.body.scrollTop || document.documentElement.scrollTop
      // console.log(recommendref.current.offsetTop,"   ",top);
      // console.log('scrolling....');
      
      if (distance<= top) {
        setScrollflag(true)
      } else {        
        setScrollflag(false)
      }
    })
  },[])

  // 发私信
  const towhisper = (e) => {
    if (uid === -1) {
      alert('login please')
      return
    }
    const uid1 = uid
    const uid2 = e.target.dataset.uid
    // navigator(`/${uid1}/whisper/uid2`)
    window.open(`/${uid1}/whisper/${uid2}`, '_blank')
  }

  const tofollowuser = async (e) => {
    const uid2 = parseInt(e.target.dataset.uid2)
    console.log('xxx', uid, uid2);
    
    if (uid === -1 || uid === null) {
      alert('请先登录')
      return
    }
    if (uid === uid2) {
      alert('不能关注自己')
      return
    }
    const res = await toFollow(uid2, uid)
    setUpinfo({
      ...upinfo,
      followed: true
    })
  }

  const canclefollowuser = async (e) => {
    if (uid === -1) {
      return
      alert('请先登录')
    }
    const uid2 = e.target.dataset.uid2
    const res = await toUnfollow(uid2, uid)
    setUpinfo({
      ...upinfo,
      followed: false
    })
  }
  return (
    <>
    <div className="upinfosbox">
      <div className="leftuserinfoavatar">
        <img src={upinfo != null ? upinfo.avatar : null} alt="" className="upsavatar" />
      </div>
      <div className="irghtupinfos">
        <div className="upname">
          <span className="namespan">{upinfo != null ? upinfo.name : null}</span>
          <span className="messafespan icon iconfont" data-uid={upinfo != null ? upinfo.uid : null} onClick={towhisper}>&#xe6b9; 发消息</span>
        </div>
        <div className="upintro">{upinfo != null ? upinfo.userintro : null}</div>
        <div className="uprotate">
          <div className="donate">充电</div>
          { 
            (upinfo != null ? upinfo.followed : false) ?
            <div className="hadsuni iconfont icon" data-uid2={upinfo != null ? upinfo.uid : null} onClick={canclefollowuser}>&#xe976; 已关注</div>
            :
            <div className="sunthisup icon iconfont" data-uid2={upinfo != null ? upinfo.uid : null} onClick={tofollowuser}>&#xe643; 关注</div>
          }
        </div>
      </div>
    </div>
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
          <div className="onedanmu">
            <div className="times">{item.sendtime}</div>
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
      false &&
        <div className="playlist">
          <div className="playlist-title">
            <div>
              <span className="pt-span1">播放列表</span>
              <span className="pt-span2">(1/10)</span>
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
            <div>1</div>
            <div>2</div>
          </div>
          <div className="videolist-content">
            <div className={ true ? "one-videolist-vide vc-active" : "one-videolist-vide" }>
              <span className="video-name">阿松大</span>
              <span className="video-time">12:21</span>
            </div>
          </div>
        </div>
    }
    {
      // 选集  番剧 电视剧。。。
      true &&
      <div className="seasionlist">
        <div className="anima-title">
          <div>
            <span className="s1-span">正片</span>
          </div>
        </div>
        <div className="anima-line2">
            <div className="one-seasion">第一季</div>
        </div>
        <div className="seasion-nums">
          {
            chapters.map((item, index) => 
              <div className="one-div-chapter">{index + 1}</div>
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
          videolist.map(item =>
            <div className="onevideo" key={item.vid}>
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
  const params = useParams()
  const vid = params.vid
  const userinfos = JSON.parse(localStorage.getItem('userinfo'))
  const [userinfo, setUserinfo] = useState(() => userinfos)  // 未登录时null
  const uid = parseInt(userinfo != null ? userinfo.uid : -1)

  const [widthscreen, setWidth] = useState(false)
  const changwidth = () => {    
    setWidth(!widthscreen)
  }

  const updateuser = async () => {
    console.log('硬币减一');
    
    const res2 = await getByUid(userinfo.uid)
    localStorage.setItem('userinfo', JSON.stringify(res2))
    setUserinfo(res2)
  }
  return (
    <div className="video-box">
      <Notice 
        type={'success'}
        content={'xixi'}
      />
      <Topnav />
      <div className="video-inner">
        <div className="vid-leftp">
          <VideoPart
            vid={vid}
            userinfo={userinfo}
            onChnageWidth={changwidth}
            widthscreen={widthscreen}
            updateuser={updateuser}
          />
          <CommentPart
            vid={vid}
            userinfo={userinfo}
          />
        </div>
        <div className="vid-rightpp">
            <RightPart
              vid={vid}
              userinfo={userinfo}
              widthscreen={widthscreen}
            />
        </div>
      </div>
    </div>
  )
}

export default Video