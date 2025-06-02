import '../scss/UserSpace/UserMainVideo.scss'
import Topnav from '../../../components/Topnav/Topnav'
import { useEffect, useReducer, useRef, useState } from 'react'
import { Outlet, Link, useParams, useLocation, useNavigate } from 'react-router-dom'
import { getByUid, getByUidFollowed, toFollow, toUnfollow, updateUserinfo, getSetting } from '../../../api/user'
import { getFavlist } from '../../../api/favlist'
import { getDyanmciListWidthImg } from '../../../api/dynamic'
import { getVideoByUid } from "../../../api/video"
import { getUserVideoList } from "../../../api/videolist"
import userbg from '../../../static/assets/user_space1.jpg'
import userpsace_b2 from '../../../static/assets/userpsace_b2.jpg'
// 顶部nav
function navReducer (state, action) {
  switch(action.type) {
    case 'DYNAMIC':
      return state = 1
    case 'VIDEOS':
      return state = 2
    case 'FAVLIST':
      return state = 3
    case 'CHANNEL':
      return state = 4
    case 'ANIMA':
      return state = 5
    case 'SETTING':
      return state = 6
    default:
      return state = 0
  }
}

function UserMainVideo() {
  // 用reducer 来代替state的topindex
  const [topind, dispatch] = useReducer(navReducer, 0)

  const localinfo = JSON.parse(localStorage.getItem('userinfo'))      // 用户的信息
  const myuid = parseInt(localinfo != null ? localinfo.uid : -1)      // myuid
  const params = useParams()
  const hisuid = parseInt(params.uid)                               // 空间主的uid
  const isme = hisuid === myuid
  const [userinfo, setUserinfo] = useState()                        // 空间作者的信息
  console.log('userinfo, ', userinfo);
  
  const [newintro, setNewintro] = useState("")
  const [keyword, setKeyword] = useState()                          // 搜索视频，动态
  const [usersetting, setUsersetting] = useState()                  // 设置

  const link0 = useRef(),
        link1 = useRef(),
        link2 = useRef(),
        link3 = useRef(),
        link4 = useRef(),
        link5 = useRef(),
        link6 = useRef()

  const location = useLocation()

  const [topindex2 , setTopindex2] = useState(() => {
    if(location.pathname.includes('/fans/follow')) {
      return 1
    } else if(location.pathname.includes('/fans/fan')) {
      return 2
    } else {
      return 0
    }
  })

  const [introfalg, setIntroflag] = useState(false),  // 修改intro
        [upnums, setUpnums] = useState(0),   // 上传视频个数
        [favnums, setFavnums] = useState(0), // 收藏夹个数
        [vlist ,setVlist] = useState(0)   // 视频合计个数
  
  // 顶部导航，主页  动态 。。。。
  const [topindex, setTopindex] = useState(() => {
    if (location.pathname.includes('/dynamic')) {
      return 1
    } else if(location.pathname.includes('/videos')) {
      return 2
    } else if(location.pathname.includes('/favlist')) {      
      return 3
    } else if(location.pathname.includes('/channel')) {
      return 4
    } else if(location.pathname.includes('/anima')) {
      return 5
    } else if(location.pathname.includes('/setting')) {
      return 6
    } else {
      return 0
    }
  })

  useEffect(() => {
    const getData = async () => {
      const nres = await Promise.all([getFavlist(hisuid, -1), getDyanmciListWidthImg(hisuid), getVideoByUid(hisuid, 0), getUserVideoList(hisuid), getSetting(hisuid)])
      setUpnums(nres[1].length + nres[2].length)
      setFavnums(nres[0].length)
      setVlist(nres[3].length)
      setUsersetting(nres[4])
    }
    getData()

    choiseone2(topindex)   // 底部蓝条跳转

    document.body.style.overflowY = 'scroll'   // 防治页面抖动

    const getData2 = async () => {
      const res = await getByUidFollowed(hisuid, myuid)
      console.log('followed info:', res);
      document.title = `${res.name}的个人空间`
      setUserinfo(res);
    }
    if (!isme) {
      getData2()
    } else {
      document.title = `${localinfo.name}的个人空间`
      setUserinfo(localinfo)
      setNewintro(localinfo.intro)
    }
  },[])

  // 更新简介
  const blur1 = async () => {
    const data = new FormData()
    data.append('uid', hisuid)
    data.append('intro', newintro)
    const res = await updateUserinfo(data)
    if (res) {
      userinfo.intro = newintro
      localStorage.setItem('userinfo', JSON.stringify(userinfo))
      setUserinfo(userinfo)
    }
    setIntroflag(false)
  }

  const slider = useRef()
  const slider2 = useRef()
  // 上方标记移动
  useEffect(() => {
    let tar = null
    console.log('tar is===========:', topindex);
    if (topindex === 0) {
      tar = link0.current
    } else if (topindex === 1) {
      tar = link1.current
    } else if (topindex === 2) {
      tar = link2.current
    } else if (topindex === 3) {
      tar = link3.current
    } else if (topindex === 4) {
      tar = link4.current
    } else if (topindex === 5) {
      tar = link5.current
    } else if (topindex === 6) {
      tar = link6.current
    } else {
      return
    }
    
    slider.current.style.width = tar.clientWidth * 0.5 + 'px'
    slider.current.style.left = tar.offsetLeft + tar.clientWidth * 0.1 + 'px'
    setTopindex2(0)
  }, [topindex])

  const choiseone2 = (ind) => {
    const index = parseInt(ind)
    setTopindex(index)
  }

  const ment = (e) => {
    const index= e.target.dataset.index
    if (index != topindex) {
      let tar = null
      if (e.target.className === 'onebotinfos') {
        tar = e.target
      } else {
        tar = e.target.parentNode
      }
      // console.log(tar);
      slider2.current.style.width = tar.clientWidth * 0.5 + 'px'
      slider2.current.style.left = tar.offsetLeft + tar.clientWidth * 0.1 + 'px'
    }
  }

  const mleav = () => {
    console.log(slider.current.offsetLeft);
    
    // slider2.current.style.width = slider.current.style.clientWidth + 'px'
    // slider2.current.style.left = slider.current.getBoundingClientRect().left + 'px'
    
    slider2.current.style.width = slider.current.clientWidth + 'px'
    slider2.current.style.left = slider.current.offsetLeft + 'px'
  }

  // 加关注
  const toaddfollow = async () => {
    const res = await toFollow(hisuid, myuid)    
    if (res === 200) {
      setUserinfo({
        ...userinfo,
        followed: true
      })
    }
  }

  // 取消关注
  const tounfollowhim = async () => {
    const res = await toUnfollow(hisuid, myuid)
    if (res === 200) {
      setUserinfo({
        ...userinfo,
        followed: false
      })
    }
  }

  // 搜索视频动态
  const navigate = useNavigate()
  const tosearch = () => {
    navigate(`/${hisuid}/search/video/${keyword}`)
  }
  
  const entertosearch = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      tosearch()
    }
  }
  return (
    <div className='user-out-bigbox'>
      <Topnav />
      <div className="userspace">
        <div className="usertopinfos">
          <div className="topinfos"
            style={{background: `url(${userbg})`}}>
            <div className="detail-userinfos"
              style={{background: `url(${userpsace_b2})`}}>
              <img src={userinfo?.avatar} alt="" className="user-avatar" />
              <div className="user-tighy-infos">
                <div className="uti-username">
                  <span className="namespan">{userinfo?.name}</span>
                </div>
                {
                  isme ?
                  <div className="uti-changintro"
                    style={{backgroundColor: introfalg ? '#32aeec' : 'transparent',
                      boxShadow: introfalg ? 'inset 0 2px 3px -1px #949994a6' : 'none'
                    }}>
                    <input type="text"
                      className="changintroinput"
                      value={newintro}
                      onChange={(e) => setNewintro(e.target.value)}
                      onFocus={() => setIntroflag(true)}
                      onBlur={blur1}
                      placeholder={newintro}/>
                  </div>
                  :
                  <div className="showintro">{userinfo?.intro}</div>
                }
              </div>
              {
                !isme &&
                <div className="right-three-box">
                  {
                    userinfo?.followed ?
                    <div className='d1-box-rigtb'
                      onClick={tounfollowhim}
                    >已关注</div>
                    :
                    <div className='d2-box-rigtb'
                      onClick={toaddfollow}
                    >加关注</div>
                  }
                  <div className='d1-box-rigtb'
                    onClick={() => window.open(`${myuid}/whisper/${hisuid}`, "target")}
                  >发消息</div>
                  <div className="more-right-div">
                    <span className='icon iconfont'>&#xe653;</span>
                  </div>
                </div>
              }
            </div>
          </div>
          <div className="bottomuserinfos">
            <div className='top-left-opadiv'>
              <div className="btn-slider" ref={slider}></div>
              <div className="btn-slider2" ref={slider2}></div>
              <Link to={`/${hisuid}`}
                ref={link0}
                onClick={() => setTopindex(0)}
                data-index={0}
                onMouseEnter={ment}
                onMouseLeave={mleav}
              >
                <div className={topindex === 0 ?"onebotinfos onebot-active" : "onebotinfos"}
                  data-index={0}>
                  <span className="icon iconfont"
                    style={{color: '#16c092'}}
                  >&#xe64e;</span>
                  <span>主页</span>
                  <div className="bottomflag"></div>
                </div>
              </Link>
              <Link to={`/${hisuid}/dynamic`}
                ref={link1}
                onClick={() => setTopindex(1)}
                data-index={1}
                onMouseEnter={ment}
                onMouseLeave={mleav}
              >
                <div className={topindex === 1 ?"onebotinfos onebot-active" : "onebotinfos"} data-index={1}>
                  <span className="icon iconfont"
                    style={{color: '#fa719a'}}
                  >&#xe620;</span>
                  <span>动态</span>
                  <div className="bottomflag"></div>
                </div>
              </Link>
              <Link to={`/${hisuid}/videos`}
                ref={link2}
                onClick={() => setTopindex(2)}
                data-index={2}
                onMouseEnter={ment}
                onMouseLeave={mleav}
              >
                <div className={topindex === 2 ?"onebotinfos onebot-active" : "onebotinfos"} data-index={2}>
                  <span className="icon iconfont"
                    style={{color: '#1ab6d8'}}
                  >&#xe62e;</span>
                  <span>投稿</span>
                  <span style={{color: '#99a2aa', fontSize: '12px', marginLeft: '3px'}}>{upnums}</span>
                  <div className="bottomflag"></div>
                </div>
              </Link>
              {
                (isme || usersetting?.favlist === 0) &&
                <Link to={`/${hisuid}/favlist`}
                  ref={link3}
                  onClick={() => setTopindex(3)}
                  data-index={3}
                  onMouseEnter={ment}
                  onMouseLeave={mleav}
                >
                  <div className={topindex === 3 ?"onebotinfos onebot-active" : "onebotinfos"} data-index={3}>
                    <span className="icon iconfont"
                      style={{color: '#f29f3f'}}
                    >&#xe630;</span>
                    <span>收藏</span>
                    <span style={{color: '#99a2aa', fontSize: '12px', marginLeft: '3px'}}>{favnums}</span>
                    <div className="bottomflag"></div>
                  </div>
                </Link>
              }
              <Link to={`/${hisuid}/channel`}
                ref={link4}
                onClick={() => setTopindex(4)}
                data-index={4}
                onMouseEnter={ment}
                onMouseLeave={mleav}
              >
                <div className={topindex === 4 ?"onebotinfos onebot-active" : "onebotinfos"} data-index={6}>
                  <span className="icon iconfont"
                    style={{color: '#32aeec'}}
                  >&#xe63a;</span>
                  <span>视频合集</span>
                  <span style={{color: '#99a2aa', fontSize: '12px', marginLeft: '3px'}}>{vlist}</span>
                  <div className="bottomflag"></div>
                </div>
              </Link>
              <Link to={`/${hisuid}/anima`}
                ref={link5}
                onClick={() => setTopindex(5)}
                data-index={5}
                onMouseEnter={ment}
                onMouseLeave={mleav}
              >
                <div className={topindex === 5 ?"onebotinfos onebot-active" : "onebotinfos"} data-index={4}>
                  <span className="icon iconfont"
                    style={{color: '#fd5c4c'}}
                  >&#xe63b;</span>
                  <span>追番列表</span>
                  <div className="bottomflag"></div>
                </div>
              </Link>
              {
                isme &&
                <Link to={`/${hisuid}/setting`}
                  ref={link6}
                  onClick={() => setTopindex(6)}
                  data-index={6}
                  onMouseEnter={ment}
                  onMouseLeave={mleav}
                >
                  <div className={topindex === 6 ?"onebotinfos onebot-active" : "onebotinfos"} data-index={5}>
                    <span className="icon iconfont"
                      style={{color: '#2fcaeb'}}
                    >&#xe631;</span>
                    <span>设置</span>
                    <div className="bottomflag"></div>
                  </div>
                </Link>
              }
              <div className="search-topbox">
                <div className="out-2inputbox">
                  <input type="text"
                    className="search-inspace"
                    placeholder='搜索视频、动态'
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={entertosearch}
                  />
                  <span className="icon iconfont"
                    onClick={tosearch}>&#xe6a8;</span>
                </div>
              </div>
            </div>
            <div className="top-right-opadiv">
              {
                (isme || usersetting?.followlist === 0) ?
                <div className={topindex2 === 1 ? 'tro-div tro-div-active' : 'tro-div'} onClick={() => setTopindex2(1)}>
                  <Link to={`/${hisuid}/fans/follow`}>
                    <span className="sp1">关注数</span>
                    <span className="sp2">{userinfo?.follows}</span>
                  </Link>
                </div>
                :
                <div className='tro-div'>
                    <span className="sp1">关注数</span>
                    <span className="sp2">{userinfo?.follows}</span>
                </div>
              }
              {
                (isme || usersetting?.fanslist === 0) ?
                <div className={topindex2 === 2 ? 'tro-div tro-div-active' : 'tro-div'} onClick={() => setTopindex2(2)}>
                  <Link to={`/${hisuid}/fans/fan`}>
                    <span className="sp1">粉丝数</span>
                    <span className="sp2">{userinfo != null ? userinfo.fans : null}</span>
                  </Link>
                </div>
                :
                <div className='tro-div'>
                  <span className="sp1">粉丝数</span>
                  <span className="sp2">{userinfo?.follows}</span>
              </div>
              }
              <div className='tro-div'>
                <span className="sp1">获赞数</span>
                <span className="sp2">{userinfo != null ? userinfo.likes : null}</span>
              </div>
              <div className='tro-div'>
                <span className="sp1">播放数</span>
                <span className="sp2">{userinfo != null ? userinfo.plays : null}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="suerspace22">
            <Outlet 
              context={{"isme": isme,
                        "usersetting": usersetting,
                        "hisuid": hisuid,
                        "hisinfo": userinfo,
                        "myuid": myuid,
                        "myinfo": localinfo,
                        "setUserinfo": setUserinfo
                      }}
              // 也可以传递数组
            />
        </div>
      </div>
    </div>
  )
}

export default UserMainVideo