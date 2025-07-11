import './scss/VideoPage.scss'
import Topnav from '../../components/Topnav/Topnav'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { memo, useEffect, useRef, useState } from 'react'
import { getByVid, updateVideoInfo, getVideoLikely, getDm, sendDm } from '../../api/video'
import { debounce } from '../../util/fnc'
import Totop from '../../components/toTop/totop'
import { getFavlist, addOneVideo, addOneFavlist } from '../../api/favlist'
import { getByUid, getByUidFollowed, toFollow, toUnfollow } from '../../api/user'
import { tovideo, touserspace, quickSort } from '../../util/fnc'
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
import VideoPlayer from '../../components/VideoPlayer/videoplayer'

const VideoPart = memo((props) => {
  // widthscreen 宽屏模式
  const { vid, userinfo, uid, setDmList, dmList, videoInfo,
          widthscreen, setWidthScreen, logined, setVideoInfo, setUpinfo, setUserinfo, updateuser } = props
  
  const location = useLocation();
  const [titleflag, setTitleflag] = useState(false)
  const [bottomscrollflag, setBottomScrollflag] = useState(false)
  const [favflag, setFavflag] = useState(false)    // 打开收藏框
  const [favlist, setFavlist] = useState([])             // 收藏夹列表

  const [favchecked, setFavchecked] = useState([])             // 已经选择过的收藏夹
  const [favcheckedold, setFavcheckedold] = useState([])       // 初始收藏夹状态
  const [sendFavfalg, setSendfavfalg] = useState(false)  // 初始收藏夹 ！= 改变后的， 可以提交

  const [iconflag, setIconflag] = useState(false)  //  打开 icon 页面
  const [icons, setIcons] = useState(1)            // 投币个数

  const [dmtest, setDmtext] = useState()           // 发送弹幕内容
  const [dmflag, setDmflag] = useState(true)       // 是否打开弹幕

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
      const text = videoInfo.title
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
      if (videoInfo.aid !== -1 && videoInfo.aid != null) {
        const res5 = await getSeasons(videoInfo.aid)
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
    if (videoInfo != null) {
      getData()
    }
  },[videoInfo])

  // 返回弹幕行
  const [dmlines, setDmlines] = useState(20),
        [freeline, setFreenline] = useState(() => new Array(20).fill(20)),
        [dmcontrolflag, setDmcontrolflag] = useState(false),
        [fontflag, setFontflag] = useState(false),
        [dmfontsize, setDmfontsize] = useState('16px'),
        [dmfontcolor, setDmfontcolor] = useState("#fff")

  const videoRef = useRef()                                     // 视频资源
  // 视频相关函数
  const [littleWindow, setLittleWindow] = useState(false)

  // 播放视频
  const togglePlay = async () => {
  }

  // 点赞 投币 收藏 转发
  // const doSomethingToVideo = async (type) => {
  //   if (userinfo === null) {
  //     message.open({ type: 'error', content: '请先登录'})
  //     return;
  //   }
  //   console.log(e.target.className, e.target.parentNode.className);
    
  //   if (e.target.className.includes('onepart') || e.target.parentNode.className.includes('onepart')
  //       || e.target.className === 'iconbox-a' || e.target.parentNode.className === 'iconbox-a'
  //   ) {
  //     const type = parseInt(e.target.dataset.type || e.target.parentNode.dataset.type)      
  //     if (type === 3) {   // 收藏
  //       // 获得收藏列表
  //       const res = await getFavlist(userinfo.uid, vid)
  //       if (res) {
  //         setFavlist(res)
  //         const nums = res.map(item => item.collected)
  //         setFavchecked(nums)
  //         setFavcheckedold(nums)

  //         // window.addEventListener("click", (e) => {
  //         //   if (favflag === true) {
  //         //     const tar = e.target      
  //         //     setTimeout(() => {
  //         //       if (!favref.current.contains(tar)) {
  //         //         setFavflag(false)                  
  //         //       }
  //         //     },200)
  //         //   }
  //         // })
  //       }
  //       setFavflag(true)   // 开打收藏box
  //     } else if (type === 2) {
  //       // 打开投币页面
  //       if (videoInfo.iconed === false) {
  //         setIconflag(true)
  //       } else {
  //         message.open({ type: 'info', content: '已经投币不能重复~'})
  //       }
  //     } else {
  //       const data = {
  //         hisuid: videoInfo.uid,
  //         uid: userinfo.uid,
  //         vid: vid,
  //         type: type,
  //         // fid: type === 3 ? 0 : null
  //       }
  //       const res = (await updateVideoInfo(data))
  //       if (res === 1) {
  //         // 点赞
  //         if (videoInfo.liked === false) {
  //           props.setVideoInfo({
  //             ...videoInfo,
  //             likes: videoInfo.likes + 1,
  //             liked: !videoInfo.liked
  //           })
  //           message.open({ type: 'info', content: '点赞', flag: true})
  //         } else {
  //           props.setVideoInfo({
  //             ...videoInfo,
  //             likes: videoInfo.likes - 1,
  //             liked: !videoInfo.liked
  //           })
  //           message.open({ type: 'info', content: '取消点赞', flag: true})
  //         }
  //       }
  //       // else if (res === 3) {
  //       //   setVideoInfo({
  //       //     ...videoInfo,
  //       //     favorites: videoInfo.favorites + 1,
  //       //     faved: !videoInfo.faved
  //       //   })
  //       // }
  //       else if (res === 4){
  //         // 分享
  //         // http://localhost:3000/video/84
  //         // let content = 'http://localhost:3000' + location.pathname
  //         let content = "[" + videoInfo.title + "] " + baseurl2 + location.pathname

  //         var aux = document.createElement("input"); 
  //         aux.setAttribute("value", content); 
  //         document.body.appendChild(aux); 
  //         aux.select();
  //         document.execCommand("copy"); 
  //         document.body.removeChild(aux);
  //         props.setVideoInfo({
  //           ...videoInfo,
  //           shares: videoInfo.shares + 1 
  //         })
  //         message.open({type: 'info', content: '已复制链接到剪切板', flag: true})
  //       }
  //     }
  //   }
  // }

  const doSomethingToVideo = async (t) => {
    if (!logined) {
      message.open({ type: 'warning', content: '请先登录'})
      return;
    }
    const type = parseInt(t)
    const data = {
      hisuid: videoInfo.uid,
      uid: userinfo.uid,
      vid: vid,
      type: type,
      // fid: type === 3 ? 0 : null
    }
    if (type === 1) {
        // 点赞
        if (videoInfo.liked === false) {
          props.setVideoInfo({
            ...videoInfo,
            likes: videoInfo.likes + 1,
            liked: !videoInfo.liked
          })
          message.open({ type: 'info', content: '点赞', flag: true})
        } else {
          props.setVideoInfo({
            ...videoInfo,
            likes: videoInfo.likes - 1,
            liked: !videoInfo.liked
          })
          message.open({ type: 'info', content: '取消点赞', flag: true})
        }
    } if (type === 2) {
      // 打开投币页面
      if (videoInfo.iconed === false) {
        setIconflag(true)
      } else {
        message.open({ type: 'info', content: '已经投币不能重复~'})
      }
    } else if (type === 3) {   // 收藏
      // 获得收藏列表
      const res = await getFavlist(userinfo.uid, vid)
      if (res) {
        setFavlist(res)
        const nums = res.map(item => item.collected)
        setFavchecked(nums)
        setFavcheckedold(nums)
      }
      setFavflag(true)   // 开打收藏box
    } else if (type === 4){
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
      props.setVideoInfo({
        ...videoInfo,
        shares: videoInfo.shares + 1 
      })
      message.open({type: 'info', content: '已复制链接到剪切板', flag: true})
    }
    updateVideoInfo(data);
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
        props.setVideoInfo({
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
        props.setVideoInfo({
          ...videoInfo,
          icons: videoInfo.icons + icons,
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

  // 关注
  const toFollowUser = async (e) => {
    e.stopPropagation()
    const uid2 = parseInt(e.target.dataset.uid2)
    if (logined) {
      if (uid === uid2) {
        message.open({ type: 'info', content: '不能关注自己'})
      } else {
        message.open({ type: 'error', content: '请先登录'})
      }
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
    <div>
      <Totop 
        scrollheight={bottomscrollflag}
      />
      <div className="topinfovid">
        <div className={titlestyle ? "top-all-part stybe-topbox" : "top-all-part stybe-topbox2"}>
          <div className="titlelin">
            <div className="textpart" ref={textpart}>
              { videoInfo.title }</div>
            <div className="noreicon" style={{rotate: titlestyle ? '180deg' : '0deg'}} onClick={opentitle}>
              { titleflag &&
                <span className="icon iconfont">&#xe624;</span>            
              }
            </div>
          </div>
          <div className="infosline">
            <div className="infodiv">
              <span className="icon iconfont" style={{fontSize: '13px'}}>&#xe6b8;</span>
              <span className="infonums">{videoInfo?.plays}</span>
            </div>
            <div className="infodiv">
              <span className="icon iconfont">&#xe666;</span>
              <span className="infonums">{ videoInfo?.danmus }</span>
            </div>
            <div className="infodiv">
              <span className="infonums">{ videoInfo.time ? `${videoInfo.time.slice(0, 10)}   ${videoInfo.time.slice(11,22)}` : 'xx:xx' }</span>
            </div>
            {/* <div className="infodiv">
              <span className="icon iconfont" style={{color: "red"}}>&#xe69f;</span>
              <span className="infonums">未经授权,禁止转载</span>
            </div> */}
          </div>
        </div>
      </div>
      <div className="player-bot-box">
        <VideoPlayer 
          userinfo={userinfo}
          videoInfo={videoInfo}
          setVideoInfo={setVideoInfo}
          setUserinfo={setUserinfo}
          upinfo={upinfo}
          setUpinfo={setUpinfo}
          updateuser={updateuser}
          vid={vid}
          uid={uid}
          dmList={dmList}
          setDmList={setDmList}
          widthscreen={widthscreen}
          setWidthScreen={setWidthScreen}
        />
      </div>
      <div className="videoinfos">
        <div className="onepart likeicon"
          onClick={() => doSomethingToVideo(1)}
          style={{color: videoInfo.liked ? '#32AEEC' : '#61666D'}}
          >
          <span className="icon iconfont" style={{fontSize: '35px'}}>&#xe61c;</span>
          <span className='optext'>{videoInfo != null ? videoInfo.likes : null}</span>
        </div>
        <div className="onepart iconicon"
          onClick={() => doSomethingToVideo(2)}
          style={{color: videoInfo.iconed ? '#32AEEC' : '#61666D'}}
        >
          <span className="icon iconfont" style={{fontSize: '37px', translate: '0 3px'}}>&#xe617;</span>
          <span className='optext'>{videoInfo != null ? videoInfo.icons : null}</span>
        </div>
        <div className="onepart subicon"
          onClick={() => doSomethingToVideo(3)}
          style={{color: videoInfo.faved ? '#32AEEC' : '#61666D'}}
        >
          <span className="icon iconfont">&#xe630;</span>
          <span className='optext'>{videoInfo != null ? videoInfo.favorites : null}</span>
        </div>
        <div className="onepart shareicon"
          onClick={() => doSomethingToVideo(4)}
          style={{width: 'fit-content'}}
          onMouseEnter={() => setShareflag(false)}
          onMouseLeave={() => setShareflag(true)}
          >
          <span className="icon iconfont">&#xe633;</span>
          {
            sahreflag ?
            <span className='optext'>{videoInfo.shares}</span>
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
                      onKeyDown={(e) => {
                        e.stopPropagation()                        
                        if (e.key === 'Enter') {
                          setNewfavtitle(e.target.value)}
                      }}
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
        videoInfo?.aid + 0 !== -1 ?
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
            videoInfo.intro != null &&
            <div className="vidintro">
              <span className="text">{videoInfo.intro}</span>
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
            src={videoInfo != null ? videoInfo.path : null}
            ref={videoRef}
          ></video>
          <span className="closevspan icon iconfont">&#xe6bf;</span>
          {
            littleWindow ?
            <span className="playvbtn icon iconfont"
              onClick={togglePlay}
            >&#xe6ab;</span>
            :
            <span className="playvbtn icon iconfont"
              onClick={togglePlay}
            >&#xe6ac;</span>
          }
        </div>
      }
    </div>
  )
})

const RightPart = memo((props) => {
  const {vid, userinfo, uid, upinfo, dmList, setDmList,
    setUpinfo, setUserinfo, videoInfo, logined, widthscreen
  } = props
  // const vid = +props.vid
  // const userinfo = props.userinfo  // 我的个人信息
  // const uid = props.uid            // myuid
  // f1 0 头像   f1 1 名字

  const [userinfoflag, setUserinfoflag] = useState({f1: -1, f2: -1, f3: -1})
  const [recommendlist, setRecommendlist] = useState([])          // 推荐列表
  const [vlist, setVlist] = useState([]),                          // 该视频所属的列表
        [vlistindex, setVlistindex] = useState(0),                  // 列表篇中当前播放的视频的index
        [allplays, setAllpalys] = useState(0),                      // 列表视频总播放量
        [listname, setListname] = useState("")                       // 视频列表的信息
  const [seasonlist, setSeasonlist] = useState([]),
        [seasonindex, setSeasonindex] = useState(0),
        [chapterlist, setChapterlist] = useState([]),
        [chapterindex, setChapterindex] = useState(0)
  const [isAscending, setIsAscending] = useState(true), // 是否升序
        [sortFlag, setSortFlag] = useState(0)
  const [donateflag, setDonateflag] = useState(false)
  const recommendref = useRef()
  const [playalongflag, setPlayaloneflag] = useState(false)   // 连续播放标志
  const [openList, setOpenList] = useState(false)
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

      // 推荐
      setRecommendlist(res[1])

      if (res[0].aid !== -1 && res[0].aid != null) {
        const res5 = await getSeasons(res[0].aid)
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
  const toFollowUser = async (e) => {
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
    }, 300)
  }

  // 排序dmlist
  const sortList = (field, ascending) => {
    console.log(field, ascending);
    const sortlist = quickSort(dmList, field, ascending)
    console.log(sortlist);
    setDmList(sortlist)
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
              onClick={toFollowUser}>&#xe643; 关注</div>
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
      style={{height: openList ? '656px' : "44px",
              marginTop: widthscreen ? '590px' : '0'}}>
      <div className="danmulisttop"  onClick={() => {
        setOpenList(!openList)
        setSortFlag(0)
      }}>
        <div className="danmlistleft">
          <span>弹幕列表</span>
          <span className='iconfont'>&#xe653;</span>
        </div>
        <div className={`danmlistright iconfont ${openList ? 'danmlistright-active' : ''}`}>&#xe624;</div>
      </div>
      <div className="lists">
        <div className="listop">
          <div className="times"
            onClick={() => {
              setSortFlag(1)
              setIsAscending(!isAscending)
              sortList('typetime', !isAscending)
            }}
          >
            <span>时间</span>
            {
              sortFlag === 1 &&
              <div className={`iconfont ${isAscending ? 'spin' : ''}`}>&#xe624;</div>
            }
          </div>
          <div className="contents"
            onClick={() => {
              setSortFlag(2)
              setIsAscending(!isAscending)
              sortList('text', !isAscending)
            }}
          >
            <span>弹幕内容</span>
            {
              sortFlag === 2 &&
              <div className={`iconfont ${isAscending ? 'spin' : ''}`}>&#xe624;</div>
            }          </div>
          <div className="sendtimes"
            onClick={() => {
              setSortFlag(3)
              setIsAscending(!isAscending)
              sortList('item', !isAscending)
            }}
          >
            <span>发送时间</span>
            {
              sortFlag === 3 &&
              <div className={`iconfont ${isAscending ? 'spin' : ''}`}>&#xe624;</div>
            }          </div>
        </div>
        {
          dmList.map(item =>
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
      videoInfo != null && videoInfo.listid !== -1 &&
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
      videoInfo?.aid !== -1 &&
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
})

const VideoPage = () => {  
  const params = useParams()
  const vid = params.vid
  const userinfos = JSON.parse(localStorage.getItem('userinfo'))
  const [userinfo, setUserinfo] = useState(() => userinfos)         // 未登录时null, 用户的信息
  const uid = parseInt(userinfo != null ? userinfo.uid : -1),
        logined = uid !== -1;
  const [widthscreen, setWidthScreen] = useState(false)             // 宽屏模式
  const [recommendlist, setRecommendlist] = useState([])            // 相关推荐视频
  const [videoInfo, setVideoInfo] = useState({})                        // 视频信息
  const [dmList, setDmList] = useState([])                          // 弹幕列表, 视频部分和右侧列表要用
  const [upinfo, setUpinfo] = useState()                            // up主的信息
  useEffect(() => {
    const getData = async () => {
      const res = await Promise.all([getByVid(vid, uid), getDm(vid), getVideoLikely(vid)])
      // console.log('1: ', res[0]);
      const res2 = await getByUidFollowed(res[0].uid, uid)
      setUpinfo(res2)                          // up主的信息
      setVideoInfo(res[0])
      document.title = `${res[0].title}`
      setDmList(res[1])
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
        <div className="twopart-box">
          <div className="vid-leftp">
            <VideoPart
              vid={vid}
              uid={uid}
              userinfo={userinfo}
              setUserinfo={setUserinfo}
              setWidthScreen={setWidthScreen}
              widthscreen={widthscreen}
              updateuser={updateuser}
              videoInfo={videoInfo}
              setVideoInfo={setVideoInfo}
              dmList={dmList}
              setDmList={setDmList}
              recommendlist={recommendlist}
              upinfo={upinfo}
              setUpinfo={setUpinfo}
              logined={logined}
            />
            <Comments
              vid={vid}
              uid={uid}
              hisuid={videoInfo != null ? videoInfo.uid : null}
              userinfo={userinfo}
              commentType = {0}
              logined={logined}
            />
          </div>
          <div className="vid-rightpp">
              <RightPart
                vid={vid}
                uid={uid}
                dmList={dmList}
                setDmList={setDmList}
                videoInfo={videoInfo}
                userinfo={userinfo}
                setUserinfo={setUserinfo}
                widthscreen={widthscreen}
                upinfo={upinfo}
                setUpinfo={setUpinfo}
                logined={logined}
              />
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPage