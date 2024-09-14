import { useState, useRef, useEffect } from 'react'
import './index.scss'
import { useLocation } from 'react-router-dom'
import { debounce } from '../../util/fnc'
import { Link, useNavigate } from 'react-router-dom'
import { touserspace } from '../../util/fnc'
import { useSelector, useDispatch } from 'react-redux'   // 使用redux
import { setuserinfo } from '../../store/modules/userStore'  // redux方法
import Login from '../Login/login'
import { getByUid, login } from '../../api/user'
import { getHistory, getHomeHistory, searchKw, getHomeDynamic } from '../../api/video'
import { tovideo } from '../../util/fnc'
import { getFavlist, getOneList } from '../../api/favlist'

// 类形式的组件
// class Topnav extends Component {

// }

const Topnav = (props) => {
  // 路由跳转之后数据 消失
  // const dispatch = useDispatch()   // 更待store需要用到
  //const { userinfo } = useSelector(state => state.userinfo)

  const [userinfo, setUserinfos] = useState(() => JSON.parse(localStorage.getItem('userinfo')))
  // const userinfo = JSON.parse(localStorage.getItem('userinfo'))
  const uid = parseInt(userinfo !== null && userinfo !== '' ? userinfo.uid : -1)
  // console.log('this uid is:', uid);
  
  if (localStorage.getItem('keywords') === null) {
    localStorage.setItem('keywords', JSON.stringify([]))
  }
  
  const bgimg = [
    'http://127.0.0.1:8082/sys/a1.webp',
    'http://127.0.0.1:8082/sys/a2.webp',
    'http://127.0.0.1:8082/sys/a3.webp',
    'http://127.0.0.1:8082/sys/a4.webp',
    'http://127.0.0.1:8082/sys/a5.webp',
    'http://127.0.0.1:8082/sys/a6.webp',
    'http://127.0.0.1:8082/sys/a7.webp',
    'http://127.0.0.1:8082/sys/a8.webp',
    'http://127.0.0.1:8082/sys/a9.webp',
    'http://127.0.0.1:8082/sys/a10.webp',
    'http://127.0.0.1:8082/sys/a11.webp',
    'http://127.0.0.1:8082/sys/a12.webp',
    'http://127.0.0.1:8082/sys/a13.webp',
    'http://127.0.0.1:8082/sys/a14.webp',
    'http://127.0.0.1:8082/sys/a15.webp',
    'http://127.0.0.1:8082/sys/a16.webp',
    'http://127.0.0.1:8082/sys/a17.webp',
    'http://127.0.0.1:8082/sys/a18.webp'
  ]
  const [loginfla, setLoginflag] = useState(false)  // 登录flag
  const navigate = useNavigate()
  const location = useLocation()
  // 滚动事件 , 设置一个state后，要用事件更改值，不能直接更改 ⭐
  const [active, setActive] = useState(() => 
    location.pathname === '/' ||  location.pathname.includes('/rank/') || location.pathname.includes('/channels/')
    ? false : true)
  const [bgflag, setBgflag] = useState(active)   // 是否显示顶部背景图
  const [appendflag, setAppendflag] = useState(false)  // 用户信息append

  const [messageflag, setMfalg] = useState(false)
  const [dynamicflag, setDyflag] = useState(false)
  const [historyflag, setHisflag] = useState(false)
  const [favlistflag, setFavlistflag] = useState(false)
  const [focusflag, setFocusflag] = useState(false)    // 搜索框append
  const [keywordresult, setKyresult] = useState([])    // kw的搜索结果

  const searchboxref = useRef()

  const [oldkeywords, setOldkeywords] = useState([])    // 本地存储关键词

  const [dyanmiclist, setDynamicList] = useState([])   // 动态

  const [favlist, setFavlist] = useState([])           // 收藏夹
  const [favindex, setFavindex] = useState(0)         
  const [favonesum, setFavonesum] = useState([])       // 数量

  const [hisList, setHislist] = useState([])            // 历史记录
  const [hisindex, setHisindex] = useState(0)  // 0 视频  1 直播
  useEffect(() => {
    // 本地有数据
    const getData = async () => {      
      const res = await getByUid(uid)
      console.log('???', uid);
      
      console.log('xxx', res);
      // const res = await login(userinfo.accouht, userinfo.password)
      // localStorage.setItem('userinfo', JSON.stringify(res))
      // setUserinfos(res)
      // 动态
      const res4 = await getHomeDynamic(uid)
      setDynamicList(res4)
      console.log('动态: ', res4);
      
      // 观看历史
      const res3 = await getHomeHistory(uid, 0, 20, 20);
      setHislist(res3)
      // 收藏夹

      const res2 = await getFavlist(uid, -1)
      console.log('收藏夹列表,', res2);
      
      const res22 = await getOneList(res2[0].fid)
      setFavlist(res2)
      setFavonesum(res22)
      
    }
    if (uid === -1) {
      console.log('未登录');
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
    //
    window.addEventListener('click', (e) => {
        const tar = e.target.className
        // searchboxref 刚加载出来， contains会报错
        // if (!searchboxref.current.contains(e.target)) {
        //   setFocusflag(false)
        // }
        if (tar != 'out-midbox' && tar != "om-line1" && tar != "inp-out" &&
            tar != "search" && tar != "icon1" && tar != "rightbox" && tar != "icon2" &&
            tar != "mid-append" && tar != "append-mid-innerbox"
        ) {
          setFocusflag(false)
        }
    })

  },[])

  const scrfnc = () => {
    const sheight = document.body.scrollTop || document.documentElement.scrollTop
    if (sheight > 64) {
      setActive(true)
    } else {
      setActive(false)
    }
  }
  if (location.pathname === '/') {     // 获得当前路由
    window.addEventListener('scroll', debounce(scrfnc, 100))
  }
  
  // // 屏幕宽度
  // const [cwidth, setCwidth] = useState(document.body.clientWidth)
  // // resize 事件
  // window.addEventListener('resize', throttle(resizefunc, 300))
  // function resizefunc () {
  //   const nowWidth = document.body.clientWidth
  //   if (nowWidth < 2560 && nowWidth > 1500) {
  //     setCwidth(document.body.clientWidth)
  //   } else if (nowWidth >= 2560) {
  //     setCwidth(2560)
  //   } else {
  //     setCwidth(1500)
  //   }
  // }

  const [keyword, setKeyword] = useState('')
  const changinput1 = async (e) => {
    const newValue = e.target.value
    setKeyword(newValue)
    
    if (newValue !== '') {
      const res = await searchKw(newValue)
      console.log(res);
      setKyresult(res)
    }
  }

  const clearWord = () => {
    setKeyword('')
  }

  // 搜索
  const tosearch = () => {
    if (uid === -1 || uid === null) {
      alert('请先登录')
      return
    }
    if (localStorage.getItem('keywords') != null) {
      const words = JSON.parse(localStorage.getItem('keywords'))
      console.log(words);
      words.push(keyword)
      localStorage.setItem('keywords', JSON.stringify(words))
    } else {
      const keywords = [keyword]
      localStorage.setItem('keywords', JSON.stringify(keywords))
    }

    const url = `/all/${keyword}/${uid}`
      // navigate(`/all/keyword/${uid}`)
    window.open(url, "_blank")
  }

  const entertosearch = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      tosearch()
    }
  }

  let timer1 = null
  const menter = (e) => {
    if (timer2 != null) {
      setMfalg(false)
      timer2 = null
    } else if (timer3 != null) {
      setDyflag(false)
      timer3 = null
    } else if (timer4 != null) {
      setFavlistflag(false)
      timer4 = null
    } else if (timer5 != null) {
      setHisflag(false)
      timer5 = null
    }
    setAppendflag(true)
    clearTimeout(timer1)
  }

  const mleave = (e) => {
    timer1 = setTimeout(() => {
      setAppendflag(false)
    }, 300)
  }

  let timer2 = null
  const menter2 = (e) => {
    if (timer1 != null) {
      setAppendflag(false)
      timer1 = null
    } else if (timer3 != null) {
      setDyflag(false)
      timer3 = null
    } else if (timer4 != null) {
      setFavlistflag(false)
      timer4 = null
    } else if (timer5 != null) {
      setHisflag(false)
      timer5 = null
    }
    setMfalg(true)
    clearTimeout(timer2)
  }
  const mleave2 = (e) => {
    timer2 = setTimeout(() => {
      setMfalg(false)
    }, 300)
  }

  let timer3 = null
  const menter3 = (e) => {
    if (timer2 != null) {
      setMfalg(false)
      timer2 = null
    } else if (timer1 != null) {
      setAppendflag(false)
      timer1 = null
    } else if (timer4 != null) {
      setFavlistflag(false)
      timer4 = null
    } else if (timer5 != null) {
      setHisflag(false)
      timer5 = null
    }
    setDyflag(true)
    clearTimeout(timer3)
  }
  const mleave3 = (e) => {
    timer3 = setTimeout(() => {
      setDyflag(false)
    }, 300)
  }

  let timer4 = null
  const menter4 = async (e) => {
    if (timer2 != null) {
      setMfalg(false)
      timer2 = null
    } else if (timer3 != null) {
      setDyflag(false)
      timer3 = null
    } else if (timer1 != null) {
      setAppendflag(false)
      timer1 = null
    } else if (timer5 != null) {
      setHisflag(false)
      timer5 = null
    }
    setFavlistflag(true)
    const res = await getHistory(uid)
    setHislist(res)
    clearTimeout(timer4)
  }
  const mleave4 = (e) => {
    timer4 = setTimeout(() => {
      setFavlistflag(false)
    }, 300)
  }

  let timer5 = null
  const menter5 = async (e) => {
    if (timer2 != null) {
      setMfalg(false)
      timer2 = null
    } else if (timer3 != null) {
      setDyflag(false)
      timer3 = null
    } else if (timer4 != null) {
      setFavlistflag(false)
      timer4 = null
    } else if (timer1 != null) {
      setAppendflag(false)
      timer1 = null
    }

    setHisflag(true)
    clearTimeout(timer5)
    // 获取新的历史记录
    const res = await getHistory(uid)
    setHislist(res)
  }

  const mleave5 = (e) => {
    timer5 = setTimeout(() => {
      setHisflag(false)
    }, 300)
  }

  const inpfocus = () => {
    // 关键词记录
    const oldkeywords = JSON.parse(localStorage.getItem('keywords'))
    setOldkeywords(oldkeywords)

    setFocusflag(true)
  }

  // const inpblur = () => {
  //   setFocusflag(false)
  // }

  // 关闭登录页面
  const colseLogin = () => {    
    setLoginflag(false)
  }

  // 退出登录
  const logoutbtn = () => {
    navigate("/")
    localStorage.clear()
    window.location.reload()

    // dispatch(JSON.stringify(setuserinfo('')))
    // setTimeout(() => {
    //   window.location.reload()
    // },100)
  }

  const clearallkeyword = () => {
    localStorage.setItem('keywords', JSON.stringify([]))
    setOldkeywords([])
  }

  const clearthiskeyword = (e) => {
    const aindex = parseInt(e.target.dataset.index)
    let words = JSON.parse(localStorage.getItem('keywords'))
    const newwords = words.filter((item, index) => {
      return index !== aindex
    })
    localStorage.setItem('keywords', JSON.stringify(newwords))
    setOldkeywords(newwords)
  }

  const changefavlist = async (e) => {
    const index = parseInt(e.target.dataset.index || e.target.parentNode.dataset.index)
    const fid = parseInt(e.target.dataset.fid || e.target.parentNode.dataset.fid)
    console.log('fix :', fid);
    
    setFavindex(index)
    const res = await getOneList(fid)
    setFavonesum(res)
    console.log(res);
    
  }

  const tomessage = () => {
    if (uid === -1) {
      alert('请先登录')
      return
    }
    window.open(`/${uid}/whisper`, '_blank')
  }

  const todynamic = () => {
    if (uid === -1) {
      alert('请先登录')
      return
    }
    window.open(`/dynamicM/${uid}`, '_blank')
  }

  const tofavorite = () => {
    if (uid === -1) {
      alert('请先登录')
      return
    }
    window.open(`/${uid}/favlist`, '_blank')
  }

  const tohistory = () => {
    if (uid === -1) {
      alert('请先登录')
      return
    }
    window.open(`/watched/${uid}`, '_blank')
  }

  const toupload = () => {
    if (uid === -1) {
      alert('请先登录')
      return
    }
    window.open(`/${uid}/platform/upload/video`, "_blank")
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
            <div className="oneitem">
              <Link to="/">
                {
                  active ?
                  <span className="icon1 icon iconfont">&#xe6f1;</span>
                  :
                  <span className='icon2 icon iconfont'>&#xe61e;</span>
                }
                <span>首页</span>
              </Link>
            </div>
            <div className="oneitem moveanimation">
              <Link to={`/channels/番剧`} target='blank'>番剧</Link>
            </div>
            <div className="oneitem moveanimation">直播</div>
            <div className="oneitem moveanimation">漫画</div>
          </div>
          <div className="midp" ref={searchboxref}>
            <div className="out-midbox"
            style={{height: focusflag? '240px' : '40px',
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
                keyword.length === 0 ?
                <div className="mid-append">
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
                            <div className="onehis" key={item}>
                              <sapn className="icon iconfont" data-index={index} onClick={clearthiskeyword}>&#xe7b7;</sapn>
                              <span className="inner-tt-cont">{item}</span>
                            </div>
                          )
                        }
                      </div>
                    </div>
                  }
                  {
                    true &&
                    <div className="append-mid-innerbox2">
                      {
                        oldkeywords.map(item =>
                          <div className="one-result" key={item}>{item}</div>
                        )
                      }
                    </div>
                  }
                </div>
                :
                <div className="mid-append">
                  {
                    keywordresult.map(item =>
                      <div className="one-keyword-reslut" key={item}
                        onClick={() => {
                          window.open(`/all/${item}/${uid}`)
                        }}
                      >{item}</div>
                    )
                  }
                </div>
              }
            </div>
          </div>
          <div className="rightp">
            <div className="onetiem1">
              {
                userinfo === null &&
                <div className="login-box" onClick={() => setLoginflag(true)}>登录</div>
              }
              {
                userinfo !== null &&
                  <img src={userinfo.avatar} alt="" className='useravatar'
                    data-uid={userinfo.uid}
                    style={{scale: appendflag ? '2' : '1', translate: appendflag ? '-10px 35px' : '0 0'}}
                    onMouseEnter={menter} onMouseLeave={mleave}
                    onClick={touserspace}
                  />
              }
              {
                appendflag && userinfo !== null &&
                <div className="avatarappend" onMouseEnter={menter} onMouseLeave={mleave}>
                  <div className="namediv">kuron</div>
                  <span className="lvdiv">lv1</span>
                  <div className="icons">
                      <span>硬币:</span>
                      <span>{userinfo.icons}</span>
                  </div>
                  <div className="infodiv">
                    <div className="onediv">
                      <div className="number">{userinfo.follows}</div>
                      <div className="text">关注</div>
                    </div>
                    <div className="onediv">
                      <div className="number">{userinfo.fans}</div>
                      <div className="text">粉丝</div>
                    </div>
                    <div className="onediv">
                      <div className="number">{userinfo.dynamics}</div>
                      <div className="text">动态</div>
                    </div>
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
            <div className="onetiem messageitem" onMouseEnter={menter2} onMouseLeave={mleave2}>
              <div className="iteminner" onClick={tomessage}>
                <span className='icon iconfont'>&#xe6eb;</span>
                <span className='text'>消息</span>
              </div>
              {
                messageflag && userinfo !== null &&
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
            <div className="onetiem dynamicitem" onMouseEnter={menter3} onMouseLeave={mleave3}>
              <div className='iteminner' onClick={todynamic}>
                <span className='icon iconfont' style={{scale: '1.1'}}>&#xe62d;</span>
                <span className='text'>动态</span>
              </div>
              {
                dynamicflag && userinfo !== null &&
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
                      <div className="lv-name">123123</div>
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
            <div className="onetiem favimte" onMouseEnter={menter4} onMouseLeave={mleave4}>
              <div className='iteminner' onClick={tofavorite}>
                <span className='icon iconfont' style={{scale: '1.3'}}>&#xe62c;</span>
                <span className='text'>收藏</span>
              </div>
              {
                favlistflag && userinfo !== null &&
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
            <div className="onetiem hisitme" onMouseEnter={menter5} onMouseLeave={mleave5}>
              <div className='iteminner' onClick={tohistory}>
                <span className='icon iconfont' style={{scale: '0.9'}}>&#xe8bd;</span>
                <span className='text'>历史</span>
              </div>
              {
                historyflag && userinfo !== null &&
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
                      hisList.map(item =>
                        <div className="one-top-history" key={item.vid} data-vid={item.vid} onClick={tovideo}>
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
              <div onClick={toupload}>
                <span className='icon iconfont'>&#xe635;</span>
                <span>投稿</span>
              </div>
            </div>
          </div>
        </div>
        {
          !bgflag &&
          <div className="topbg">
            <div className="omgbox-topnav">
              {
                bgimg.map((item, index) =>
                  <img key={index} src={item} alt="" className="one-top-img" />
                )
              }
            </div>
            <div className='spanlogo'>
              <img src={"http://127.0.0.1:8082/sys/bpbg.png"} alt="" className="logo-img" />
            </div>
          </div>
        }
    </div>
  );
}

export default Topnav