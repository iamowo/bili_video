import { useState, useRef, useEffect, memo } from 'react'
import './index.scss'
import { useLocation } from 'react-router-dom'
import { debounce } from '../../util/fnc'
import { Link, useNavigate } from 'react-router-dom'
import { touserspace, HeightLightKw } from '../../util/fnc'
import { useSelector, useDispatch } from 'react-redux'   // 使用redux
import { setuserinfo } from '../../store/modules/userStore'  // redux方法
import Login from '../Login/login'
import { getByUid, login } from '../../api/user'
import { getHistory, getHomeHistory, searchKw, getHomeDynamic } from '../../api/video'
import { getMainTag } from '../../api/tag'
import { tovideo } from '../../util/fnc'
import { getFavlist, getOneList } from '../../api/favlist'
import { baseurl, baseurl2 } from '../../api'
import message from '../notice/notice'
import { getAllKeyword, addKeyword, deleteKeyword, deleteAllKeyword, getHotRanking } from '../../api/search'
import VIP from '../vip/VIP'
import toplogo from '../../static/assets/bpbg.png'

// 类形式的组件
// class Topnav extends Component {

// }

const Topnav = memo((props) => {
  // console.log('重现渲染了TOPNAV');
  
  // 路由跳转之后数据 消失
  // const dispatch = useDispatch()   // 更待store需要用到
  //const { userinfo } = useSelector(state => state.userinfo)
  const { closemid } = props
  const [userinfo, setUserinfos] = useState(() => JSON.parse(localStorage.getItem('userinfo')))
  const isLodinged = userinfo != null, // 是否登录
        uid = parseInt(userinfo != null && userinfo !== '' ? userinfo.uid : -1) // uid
  const logined = uid !== -1  
  const [rightAppendShow, setRightAppendShow] = useState(0) // 右侧详情 1 头像 2 消息 3 动态....
  const rightTimer = useState(null)
  
  const bgimg = [
    baseurl + '/sys/a1.webp',
    baseurl + '/sys/a2.webp',
    baseurl + '/sys/a3.webp',
    baseurl + '/sys/a4.webp',
    baseurl + '/sys/a5.webp',
    baseurl + '/sys/a6.webp',
    baseurl + '/sys/a7.webp',
    baseurl + '/sys/a8.webp',
    baseurl + '/sys/a9.webp',
    baseurl + '/sys/a10.webp',
    baseurl + '/sys/a11.webp',
    baseurl + '/sys/a12.webp',
    baseurl + '/sys/a13.webp',
    baseurl + '/sys/a14.webp',
    baseurl + '/sys/a15.webp',
    baseurl + '/sys/a16.webp',
    baseurl + '/sys/a17.webp',
    baseurl + '/sys/a18.webp'
  ]

  const [loginfla, setLoginflag] = useState(false)  // 登录flag
  const navigate = useNavigate()
  const location = useLocation()
  // 滚动事件 , 设置一个state后，要用事件更改值，不能直接更改 ⭐
  const [active, setActive] = useState(() => 
    location.pathname === '/' ||  location.pathname.includes('/rank/') || location.pathname.includes('/channels/')
    ? false : true)
  const [showBg, setShowBg] = useState(active)            // 是否显示顶部背景图
  const [classifys, setClassifys] = useState([]),
        [showClassify, setShowClassify] = useState(false) // 顶部‘首页’hover详情

  const [focusflag, setFocusflag] = useState(false),      // 搜索框append
        [hoslist, setHotlist] = useState(),               // 热搜 10条
        [keywordresult, setKyresult] = useState([]),      // kw的搜索结果
        [oldkeywords, setOldkeywords] = useState([])      // 本地存储关键词

  const searchRef = useRef() 

  const [dyanmiclist, setDynamicList] = useState([])      // 动态
  const [favlist, setFavlist] = useState([])              // 收藏夹
  const [favindex, setFavindex] = useState(0)           
  const [favonesum, setFavonesum] = useState([])          // 数量
  const [hisList, setHislist] = useState([])              // 历史记录
  const [hisindex, setHisindex] = useState(0)             // 0 视频  1 直播
  const [vipbuyflag, setVipblyflag] = useState(false)
  useEffect(() => {
    // 本地有数据
    const getData = async () => {      
      const res = await Promise.all([getHomeDynamic(uid, 0), getAllKeyword(uid),
                                    getHotRanking(), getMainTag(0, 0)])
      setDynamicList(res[0])
      setOldkeywords(res[1])
      setHotlist(res[2].slice(0, 10))
      const temp =  res[3].filter(item =>
        item.type !== 1
      )
      setClassifys(temp)
    }
    if (!logined) {
      // 未登录
      const token = JSON.parse(localStorage.getItem('token'))
      if (token === '' || token === null) {
        localStorage.removeItem('userinfo')
      } else {
        console.log(token);
      }
    } else {
      console.log('已经登录');
      getData()
    }
  },[])

  // 关闭search-append
  const closeMidAppend = (e) => {
    // searchRef 刚加载出来直接使用会报错
    setTimeout(() => {
      const tar = e.target
      if (!searchRef?.current?.contains(tar)) {
        setFocusflag(false)
      }
    },100)
  }

  //
  const scrfnc = () => {
    const sheight = document.body.scrollTop || document.documentElement.scrollTop
    if (sheight > 64) {
      setActive(true)
    } else {
      setActive(false)
    }
  }
  if (location.pathname === '/') {                            // 获得当前路由
    // 停止滑动之后才出现，影像观感
    // window.addEventListener('scroll', debounce(scrfnc, 100))
    window.addEventListener('scroll', scrfnc)
  }

  const [keyword, setKeyword] = useState('')
  const changinput1 = async (e) => {
    const newValue = e?.target?.value
    setKeyword(newValue)
    if (newValue !== '') {
      // 搜索结果
      const res = await searchKw(newValue)
      setKyresult(res)
    }
    if (newValue.length === 0) {
      setKyresult([])
    }
  }

  // 清除搜索揭露
  const clearWord = () => {
    setKeyword('')
  }

  // 搜索
  const tosearch = async () => {
    if (uid === -1 || uid === null) {
      message.open({ type: 'error', content: '请先登录'})
      return
    }
    if (keyword.length <= 0) {
      message.open({ type: 'error', content: '搜索内容不能为空'})
      return
    }

    const res = await addKeyword(uid, keyword)         // 添加hot——keyword
    if (res) {
      const res2 = await getAllKeyword(uid)
      setOldkeywords(res2)
    }
    const url = `/all/${keyword}/${uid}`
      // navigate(`/all/keyword/${uid}`)
    window.open(url, "_blank")
  }

  // 回车搜索
  const entertosearch = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      tosearch()
    }
  }

  // 进入右侧单个项目
  const enterRightItem = async (type) => {
    const tp = type + 0
    if (rightTimer.current != null) {
      clearTimeout(rightTimer.current)
      rightTimer.current = null
    }
    setRightAppendShow(tp)
    if (tp === 3) {

    } else if (tp === 4) {
      const res = await getFavlist(uid, -1)
      setFavlist(res)
      const res2 = await getOneList(res[0].fid, 0, null)
      setFavonesum(res2)
    } else if (tp === 5) {
      const res = await getHomeHistory(uid, 0, 20, 20)
      setHislist(res ? res : [])
      // setHislist(res ? res : [])
    }
  }

  const leaveRightItem = () => {
    // console.log('leave');
    rightTimer.current = setTimeout(() => {
      setRightAppendShow(0)
    }, 300)
  }

  const inpfocus = () => {
    // 关键词记录
    // const oldkeywords = JSON.parse(localStorage.getItem('keywords'))
    // setOldkeywords(oldkeywords)
    setFocusflag(true)
  }

  // 监听foucusflag
  useEffect(() => {
    if (focusflag) {
      //  关闭搜索框的append
      window.addEventListener('click', closeMidAppend)
    } else {
      window.removeEventListener('click', closeMidAppend)
    }
  }, [focusflag])

  // 关闭登录页面
  const colseLogin = () => {    
    setLoginflag(false)
  }

  // 退出登录
  const logoutbtn = () => {
    navigate("/")
    localStorage.clear()
    window.location.reload()
  }

  // 通过历史关键词搜索
  const tothiskeyword = (kw) => {
    const url = `/all/${kw}/${uid}`
    // navigate(`/all/keyword/${uid}`)
    window.open(url, "_blank")
  }

  // 通过搜索结果，点击打开
  const tothiskeyword2 = (e) => {
    const kw = e.target.dataset.keyword
    const url = `/all/${kw}/${uid}`
    window.open(url, "_blank")
  }
  // 清除全部搜索历史
  const clearallkeyword = async () => {
    await deleteAllKeyword(uid)
    setOldkeywords([])
  }

  // 清除一个搜索记录关键词
  const clearthiskeyword = async (kid) => {
    await deleteKeyword(kid)
    // 更新界面
    setOldkeywords(oldkeywords.filter(item => item.kid !== kid))
  }

  // 选择收藏夹
  const changefavlist = async (e) => {
    const index = parseInt(e.target.dataset.index || e.target.parentNode.dataset.index)
    const fid = parseInt(e.target.dataset.fid || e.target.parentNode.dataset.fid)
    // console.log('fix :', fid);
    setFavindex(index)
    const res = await getOneList(fid, 0, null)
    setFavonesum(res)
    // console.log(res);
    
  }

  const rightToDirect = (tp) => {
    const type = tp + 0
    if (isLodinged) {
      if (type === 1) {window.open(`/${uid}/whisper`, '_blank')}
      else if (type === 2) {window.open(`/dynamicM/${uid}`, '_blank')}
      else if (type === 3) {window.open(`/${uid}/favlist`, '_blank')}
      else if (type === 4) {window.open(`/watched/${uid}`, '_blank')}
      else if (type === 5) {window.open(`/${uid}/platform/upload/video`, "_blank")}
    } else {
      if (type !== 0) {
        message.open({ type: 'warning', content: '请先登录'})
      }
      setLoginflag(true) 
    }
  }

  const tothisitem = (value, type) => {
    window.open(`/channels/${value}`)
  }

  const hovertimer = useRef(null)
  const enterfnc = () => {
    if (hovertimer.current != null) {
      clearTimeout(hovertimer.current)
    }
    setShowClassify(true)
  }

  const leavefnc = () => {
    hovertimer.current = setTimeout(() => {
      setShowClassify(false)
    },500)
  }

  return (
    <div className="toppart" >
      { loginfla &&
        <Login 
          loging={loginfla}
          closeLogin={colseLogin}
        /> 
      }
      <div className={active ? "topnav" : "topnav topnavactive"}>
          <div className="leftp">
            <div className="oneitem"
              onMouseEnter={enterfnc}
              onMouseLeave={leavefnc}
            >
              <Link to="/">
                {
                  active ?
                  <img src={baseurl + "/sys/picon.png"} alt="" className="logo-img" />
                  :
                  <span className='icon2 icon iconfont'>&#xe604;</span>
                }
                <span className='txtsp'>首页</span>
                {
                  active &&
                  <div className='moreic'>
                    <div className={showClassify ? "iconfont rotate1" : "iconfont"}>&#xe624;</div>
                  </div>
                }
              </Link>
              {
                active && showClassify &&
                <div className="home-append"
                  onMouseEnter={enterfnc}
                  onMouseLeave={leavefnc}
                >
                  <div className="item-box">
                    {
                      classifys.map(item =>
                        <div className="oneitem-classify"
                          onClick={() => tothisitem(item.value, item.type)}
                        >{item.value}</div>
                      )
                    }
                  </div>
                </div>
              }
            </div>
            <div className="oneitem">
              <span className='moveanimation'>
                <Link to={`/animationpage/${uid}`} target='blank'>番剧</Link>
              </span>
            </div>
            <div className="oneitem">
              <span className='moveanimation'>
                <Link to={`/img`} target='blank'>图片</Link>
              </span>
            </div>
            <div className="oneitem">
              <span className="moveanimation">
                {/* ⭐如果用windos。open打开新页面，新页面中没有localstorage中的数据 */}
                <Link to={'/manga'} target='_blank'>漫画</Link>
              </span>
            </div>
            <div className="oneitem">
              <span className='moveanimation'>
                <Link to={`/img`} target='blank'>会员购</Link>
              </span>
            </div>
            <div className="oneitem">
              <span className='moveanimation'>
                <Link to={`/img`} target='blank'>音乐</Link>
              </span>
            </div>
          </div>
          <div className="midp" 
            ref={searchRef}
              style={{display: closemid !== null && closemid !== undefined && closemid ? 'none' : 'block'}}
            >
            <div className="out-midbox"
            style={{height: focusflag? '380px' : '40px',
              backgroundColor: focusflag ? '#fff' : '#E3E5E7D5',
              border: focusflag ? '1px solid #f1f3f7' : '0',
              boxShadow: focusflag ? '0 2px 4px #00000014' : 'none'}}>
              <div className="om-line1">
                <div className="inp-out">
                  <input type="text" className="search"
                    style={{backgroundColor: focusflag ? '#f1f2f3' : 'transparent'}}
                    value={keyword}
                    onChange={changinput1}
                    onKeyDown={entertosearch}
                    onFocus={inpfocus}
                    // onBlur={inpblur}
                    />
                  {
                    keyword !== '' &&
                    <span className="icon1 icon iconfont" onClick={clearWord}>&#xe7b7;</span>
                  }
                </div>
                <div className="rightbox">
                  <span className="icon2 icon iconfont" onClick={tosearch}>&#xe6a8;</span>
                </div>
              </div>
              {
                focusflag &&
                <div className="mid-append">
                  {
                    keyword.length > 0 ?
                    <div>
                      {
                        keywordresult.map(item =>
                          <div className="one-keyword-reslut"
                            key={item}
                            data-keyword={item}
                            onClick={tothiskeyword2}
                            >
                              <span dangerouslySetInnerHTML={{__html: HeightLightKw(item, keyword, "span", 0)}}></span>
                            </div>
                        )
                      }
                    </div>
                    :
                    <div>
                      {
                        oldkeywords.length > 0 &&
                        <div className="append-mid-innerbox">
                          <div className="mid-appedn-title">
                            <span className="left-span1-title">搜索历史</span>
                            <span className="right-span1-title" onClick={clearallkeyword}>清除</span>
                          </div>
                          <div className="mid-append-content">
                            {
                              oldkeywords.map((item, index) =>
                                <div className="onehis" key={item.kid}>
                                  <sapn className="icon iconfont" onClick={() => clearthiskeyword(item.kid)}>&#xe7b7;</sapn>
                                  <span className="inner-tt-cont" onClick={() => tothiskeyword(item.keyword)}>{item.keyword}</span>
                                </div>
                              )
                            }
                          </div>
                        </div>
                      }
                      <div className="hotsort-box">pilipili热搜</div>
                      <div className="hot-box">
                        {
                          hoslist.map((item, index) =>
                            <div className="onehot-box"
                              key={item}
                              onClick={() => tothiskeyword(item)}
                              >
                              <span style={{marginRight: '10px'}}>{index + 1}</span>
                              {item}
                            </div>
                          )
                        }
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
          <div className="rightp">
            <div className="onetiem1">
              {
                userinfo === null ?
                <div className="login-box"
                  onClick={() => rightToDirect(0)}
                >登录</div>
                :
                <img src={userinfo.avatar} alt="" className='useravatar'
                  data-uid={userinfo.uid}
                  style={{scale: rightAppendShow === 1 ? '2' : '1', translate: rightAppendShow === 1 ? '-10px 35px' : '0 0'}}
                  onMouseEnter={() => enterRightItem(1)} 
                  onMouseLeave={leaveRightItem}
                  onClick={touserspace}
                />
              }
              {
                rightAppendShow === 1 && userinfo !== null &&
                <div className="avatarappend"
                  onMouseEnter={() => enterRightItem(1)} 
                  onMouseLeave={leaveRightItem}
                >
                  <div className="namediv">{userinfo.name}</div>
                  <span className="lvdiv">lv{userinfo.lv}</span>
                  <div className="icons">
                      <span>硬币:</span>
                      <span>{userinfo.icons}</span>
                  </div>
                  <div className="infodiv">
                    <div className="onediv"
                      onClick={() => window.open(`/${uid}/fans/follow`, "_blank")}
                    >
                      <div className="number">{userinfo.follows}</div>
                      <div className="text">关注</div>
                    </div>
                    <div className="onediv"
                      onClick={() => window.open(`/${uid}/fans/fan`, "_blank")}
                    >
                      <div className="number">{userinfo.fans}</div>
                      <div className="text">粉丝</div>
                    </div>
                    <div className="onediv"
                      onClick={() => window.open(`/dynamicM/${uid}`, "_blank")}
                    >
                      <div className="number">{userinfo.dynamics}</div>
                      <div className="text">动态</div>
                    </div>
                  </div>
                  <div className="vipbox1"
                    style={{backgroundImage: `url(${baseurl}/sys/month-grade-bg.png)`}}
                  >
                    {
                      true ?
                      <div className='vipb1'
                        onClick={() => setVipblyflag(true)}
                      >
                        <span className='sp1-vip'>购买会员</span>
                        <span className='sp2-vip'>解锁更多服务</span>
                      </div>
                      :
                      <div>
                        233
                      </div>
                    }
                  </div>
                  <div className="otherdiv">
                    <Link to={`/${uid}/account/home`} target='_blank'>
                      <div className="othleftp">
                        <span className="icon iconfont">&#xe603;</span>
                        <span className='text'>个人中心</span>
                      </div>
                      <div className="spinicon iconfont icon">&#xe637;</div>
                    </Link>
                  </div>
                  <div className="otherdiv">
                    <Link to={`/${uid}/platform/upload/video`}>
                      <div className="othleftp">
                        <span className="icon iconfont">&#xe604;</span>
                        <span className='text'>投稿中心</span>
                      </div>
                      <div className="spinicon iconfont icon">&#xe637;</div>
                    </Link>
                  </div>
                  {
                    userinfo.permissions >= 1 &&
                      <div className="otherdiv">
                      <Link to={`/audit`} target='_blank'>
                        <div className="othleftp">
                          <span className="icon iconfont" style={{color: '#FB7299'}}>&#xe604;</span>
                          <span className='text'>审核中心</span>
                        </div>
                        <div className="spinicon iconfont icon">&#xe637;</div>
                      </Link>
                    </div>
                  }
                  {
                    userinfo.permissions >= 1 &&
                      <div className="otherdiv">
                      <Link to={`/control`} target='_blank'>
                        <div className="othleftp">
                          <span className="icon iconfont" style={{fontSize: '18px'}}>&#xe602;</span>
                          <span className='text'>系统后台</span>
                        </div>
                        <div className="spinicon iconfont icon">&#xe637;</div>
                      </Link>
                    </div>
                  }
                  <div className="logout"></div>
                  <div className="otherdiv">
                    <div className="othleftp-leave" onClick={logoutbtn}>
                      <span className="icon iconfont">&#xe676;</span>
                      <span className='text'>退出登录</span>
                    </div>
                  </div>
                </div>
              }
            </div>
            <div className="onetiem messageitem"
              onMouseEnter={() => enterRightItem(2)} 
              onMouseLeave={leaveRightItem}
            >
              <div className="iteminner" onClick={() => rightToDirect(1)}>
                <span className='icon iconfont'>&#xe6eb;</span>
                <span className='text'>消息</span>
              </div>
              {
                rightAppendShow === 2 && userinfo !== null &&
                <div className="message-append">
                  <Link to={`/${uid}/whisper`}>
                    <div className="one-message-item">我的消息</div>
                  </Link>
                  <Link to={`/${uid}/replay`}>
                    <div className="one-message-item">回复我的</div>
                  </Link>
                  <Link to={`/${uid}/at`}>
                    <div className="one-message-item">@ 我的</div>
                  </Link>
                  <Link to={`/${uid}/love`}>
                    <div className="one-message-item">收到的赞</div>
                  </Link>
                  <Link to={`/${uid}/config`}>
                    <div className="one-message-item">系统消息</div>
                  </Link>
                </div>
              }
            </div>
            <div className="onetiem dynamicitem"
              onMouseEnter={() => enterRightItem(3)} 
              onMouseLeave={leaveRightItem}
            >
              <div className='iteminner' onClick={() => rightToDirect(2)}>
                <span className='icon iconfont' style={{scale: '1.1'}}>&#xe62d;</span>
                <span className='text'>动态</span>
              </div>
              {
                rightAppendShow === 3 && userinfo !== null &&
                <div className="dynamic-append">
                  <div className="dyappend-living">
                    <div className="dl-title">
                      <span className='dlt-left'>正在直播</span>
                      <div className="dlt-right" style={{display: 'flex', alignItems: 'center', height: '30px', cursor: 'pointer'}}>
                        <Link to={`/dynamicM/${uid}`} target='_blank'>
                          <span>查看更多</span>
                          <div className="icon iconfont">&#xe637;</div>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="living-box">
                    <div className="one-living">
                      <img src="" alt="" className="user-living-avatar" />
                      <div className="lv-name">living...</div>
                    </div>
                  </div>
                  <div className="dy-spain-box">
                    <div className="one-line-box"></div>
                    <span>历史动态</span>
                    <div className="one-line-box"></div>
                  </div>
                  <div className="dunamic-more-box">
                    {
                      dyanmiclist.map((item, index) =>
                        <div className="one-dyanmic-abox" data-vid={item.vid} onClick={tovideo}>
                          <img src={item.avatar} alt="" className="oda-avatar" />
                          <div className="oda-rightbox" data-vid={item.vid}>
                            <div className="ada-title">{item.name}</div>
                            <div className="oda-content" data-vid={item.vid}>
                              <div className="adac-left">{item.title}</div>
                              <img src={item.cover} alt="" className="oda-right" />
                            </div>
                            <div className="oda-time">{item.time.slice(0, 10)}</div>
                          </div>
                        </div>
                      )
                    }
                  </div>
                </div>
              }
            </div>
            <div className="onetiem favimte" 
              onMouseEnter={() => enterRightItem(4)} 
              onMouseLeave={leaveRightItem}
            >
              <div className='iteminner' onClick={() => rightToDirect(3)}>
                <span className='icon iconfont' style={{scale: '1.3'}}>&#xe62c;</span>
                <span className='text'>收藏</span>
              </div>
              {
                rightAppendShow === 4 && userinfo !== null &&
                <div className="fav-append">
                  <div className="fav-append-left">
                    {
                      favlist.map((item, index) =>
                        <div key={item.fid} className={favindex === index ? "one-left-item one-left-item-active" : "one-left-item"}
                          data-index={index} data-fid={item.fid}
                          onClick={changefavlist}>
                          <span>{item.title}</span>
                          <span>{item.nums}</span>
                        </div>
                      )
                    }
                  </div>
                  <div className="fav-append-right">
                    <div className="far-top-content">
                    {
                      favonesum.map(item =>
                      <div className="one-afv-right-box" key={item.vid} data-vid={item.vid} onClick={tovideo}>
                        <img src={item.cover} alt="" className="oarb-cover" />
                        <div className="oarb-rightingos" data-vid={item.vid}>
                          <div className="oarb-title">{item.title}</div>
                          <div className="oarb-upname">{item.name}</div>
                        </div>
                      </div>
                      )
                    }
                    </div>
                    <div className="far-bottom-infos">
                      <div className="fat-bi-left">查看全部</div>
                      <div className="fat-bi-right">播放全部</div>
                    </div>
                  </div>
                </div>
              }
            </div>
            <div className="onetiem hisitme" 
              onMouseEnter={() => enterRightItem(5)} 
              onMouseLeave={leaveRightItem}
            >
              <div className='iteminner' onClick={() => rightToDirect(4)}>
                <span className='icon iconfont' style={{scale: '0.9'}}>&#xe8bd;</span>
                <span className='text'>历史</span>
              </div>
              {
                rightAppendShow === 5 && userinfo !== null &&
                <div className="his-append">
                  <div className="hisappend-title">
                    <div onClick={() => setHisindex(0)}>
                      <span>视频</span>
                      {
                        hisindex === 0 &&
                        <div className="hisactive"></div>
                      }
                    </div>
                    <div onClick={() => setHisindex(1)}>
                      <span>直播</span>
                      {
                        hisindex === 1 &&
                        <div className="hisactive"></div>
                      }
                    </div>
                  </div>
                  <div className="his-top-content">
                    {
                      hisList?.map(item =>
                        <div className="one-top-history" 
                          key={item.vid} 
                          data-vid={item.vid}
                          onClick={tovideo}
                        >
                          <img src={item.cover} alt="" className="left-his-cover" />
                          <div className="right-his-infos" data-vid={item.vid}>
                            <div className="rhi-title">{item.title}</div>
                            <div className="rhi-data" data-vid={item.vid}>
                              <span className="text-span">{item.watchtype}</span>
                            </div>
                            <div className="rhi-data" data-vid={item.vid}>
                              <span className="icon iconfont">&#xe613;</span>
                              <span className="text-span">{item.upname}</span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    <div className="bottom-his-more">
                      <Link to={`watched/${uid}`} target='_blank'>
                        <div className="bhm-btn">查看全部</div>
                      </Link>
                    </div>
                  </div>
                </div>
              }
            </div>
            <div className="onetiem2">
              <div onClick={() => rightToDirect(5)}>
                <span className='icon iconfont'>&#xe635;</span>
                <span>投稿</span>
              </div>
            </div>
          </div>
        </div>
        {
          !showBg &&
          <div className="topbg">
            <div className="omgbox-topnav">
              {
                bgimg.map((item, index) =>
                  <img key={index} src={item} alt="" className="one-top-img" />
                )
              }
            </div>
            <div className='spanlogo'>
              <img src={toplogo} alt="" className="logo-img" />
            </div>
          </div>
        }
        {
          vipbuyflag &&
          <div className="vip-view">
            <div className="vip-blank-part"
              onClick={() => setVipblyflag(false)}
            ></div>
              <VIP
                uid={uid}
                setVipblyflag={setVipblyflag}
              />
          </div>
        }
    </div>
  );
})

export default Topnav