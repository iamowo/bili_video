import "./Topnav.scss"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { baseurl2 } from "../../api"
import { getMgList } from '../../api/mg'
import { tothismg } from "../../util/fnc"
import message from "../notice/notice"

function Mgtopnav(props) {
  const userinfo = JSON.parse(localStorage.getItem('userinfo')),
        uid = userinfo?.uid
  console.log('userinf: ', userinfo);
  
  const location = useLocation()
  const isdetail = location.pathname.includes("/detail/")
  const [topindex, setTopindex] = useState(() => {
    if(location.pathname.includes("/manga")) {
      return 0
    } else if (location.pathname.includes("/classify")) {
      return 1
    } else if (location.pathname.includes("/mgranking")) {
      return 2
    } else if (location.pathname.includes("/userspace")){
      return 3
    } else {
      return -1
    }
  })
  const [keyword, setKeyword] = useState("")

  const navigate = useNavigate()
  
  const [append1flag, setAppend1flag] = useState(false),
        [append2flag, setAppend2flag] = useState(false)

  const [hislist, setHislist] = useState([]),
        [favlist, setFavlist] = useState([]);

  let timer1 = null
  const enter1 = () => {    
    if (timer1 != null) {
      setAppend2flag(false)
      clearTimeout(timer1)
      timer1 = null
    }
    setAppend1flag(true)
  }

  const leave1 = () => {
    timer1 = setTimeout(() => {
      setAppend1flag(false)
    }, 500)
  }

  const enter2 = () => {
    if (timer1 != null) {
      setAppend1flag(false)
      clearTimeout(timer1)
      timer1 = null
    }
    setAppend2flag(true)
  }

  const leave2 = () => {
    timer1 = setTimeout(() => {
      setAppend2flag(false)
    }, 500)
  }

  useEffect(() => {
    const getData = async () => {
      const res = await Promise.all([getMgList(uid, 0), getMgList(uid, 1)])
      console.log('res is: ', res);
      setFavlist(res[0] != null && res[0].length > 0 ? res[0].splice(0, 3) : [])
      setHislist(res[1] != null && res[0].length > 0 ? res[1].splice(0, 3) : [])      
    }
    getData()
  },[])

  const tosearch = () => {
    if (keyword.length <= 0) {
      message.open({type: 'warning', content: '搜索不能为空'})
      return
    }
    // navigate(`/${uid}/search/${keyword}`)
    window.open(`/searchmg/${keyword}`, "_balnk")
  }
  
  return (
    <div className={isdetail ? "topnav-compontens isdetail-view" : "topnav-compontens"}>
      <div className="top-nav-content">
        <div className="top-left">
          <Link to={'/manga'}>
            <div className="one-left-box left-sp-one icon iconfont">&#xe620;</div>      
          </Link>
          <Link to={'/'}>
            <div className="one-left-box">
              <span className="left-text"
                onClick={() => window.open(baseurl2 + "/")}
              >主站</span>
            </div>          
          </Link>
          <Link to={'/manga'}
            onClick={() => setTopindex(0)}
          >
            <div className={topindex === 0 ? "one-left-box one-left-box-active" : "one-left-box"}>
              <span className="left-text">首页</span>
              <div className="left-active"></div>
            </div>          
          </Link>
          <Link to={'/classify'}
            onClick={() => setTopindex(1)}
          >
            <div className={topindex === 1 ? "one-left-box one-left-box-active" : "one-left-box"}>
              <span className="left-text">分类</span>
              <div className="left-active"></div>
            </div>          
          </Link>
          <Link to={'/mgranking'}
            onClick={() => setTopindex(2)}
          >
            <div className={topindex === 2 ? "one-left-box one-left-box-active" : "one-left-box"}>
              <span className="left-text">排行榜</span>
              <div className="left-active"></div>
            </div>          
          </Link>
        </div>
        {
          isdetail &&
          <div className="top-mid">
            <span className="titlesp"
              onClick={() => {
                navigate(`/${uid}/chapter/${props.mid}`)
                document.location.reload()
              }}
            >{props.title}</span>
            <span className="icon iconfont">&#xe649;</span>
            <span className="namesp">{props.name}</span>
          </div>   
        }
        <div className="top-right">
          <div className="mid-search-box">
            <input type="text" className="topsearch"
              onChange={(e) => setKeyword(e.target.value)}
              value={keyword}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  tosearch()
                }
              }}
            />
            <span className="icon iconfont"
              onClick={tosearch}
            >&#xe65e;</span>
          </div>
          <Link to={`/${uid}`}
            onMouseEnter={enter1}
            onMouseLeave={leave1}
          >
            <div className="one-right-box">
              <div className="right-text">
                <span>历史</span>
              </div>
              <div className={append1flag ? "right-append right-append-active" : "right-append"}
                style={{height: append1flag ? hislist.length * 110 + 50 + 'px' : "0"}}
              >
              {
                  hislist.length > 0 ?
                  <div className="otbx">
                    <div className="book-top-content">
                      {
                        hislist.map(item =>
                          <div className="one-book">
                            <img src={item.cover} alt="" className="left-avatar" 
                              onClick={() => tothismg(uid, item.mid)}
                            />
                            <div className="right-infos">
                              <div className="ri-title"
                                onClick={() => tothismg(uid, item.mid)}
                              >{item.title}</div>
                              {
                                item.done === 1 ?
                                <div className="ri-chapters">已完结,共{item.chapters}章</div>
                                :
                                <div className="ri-chapters">连载中,更新至{item.chapters}章</div>
                              }
                            </div>
                          </div>
                        )
                      }
                    </div>
                    <div className="watch-all"
                      onClick={() => window.open(`/userspace/${uid}/history`, '_blank')}
                    >查看全部</div>
                  </div>
                  :
                  <div className="otbx">
                    <div className="nocontent">没有观看历史~</div>
                  </div>
                }
              </div>
            </div>
          </Link>
          <Link to={`/${uid}`}
            onMouseEnter={enter2}
            onMouseLeave={leave2}
          >
            <div className="one-right-box">
              <div className="right-text">
                <span>收藏</span>
              </div>
              <div className={append2flag ? "right-append right-append-active" : "right-append"}
                style={{height: append2flag ? favlist.length * 110 + 50 + 'px' : "0"}}
              >
                {
                  favlist.length > 0 ?
                  <div className="otbx">
                    <div className="book-top-content">
                      {
                        favlist.map(item =>
                          <div className="one-book">
                            <img src={item.cover} alt="" className="left-avatar" 
                              onClick={() => tothismg(uid, item.mid)}
                            />
                            <div className="right-infos">
                              <div className="ri-title"
                                onClick={() => tothismg(uid, item.mid)}
                              >{item.title}</div>
                              {
                                item.done === 1 ?
                                <div className="ri-chapters">已完结,共{item.chapters}章</div>
                                :
                                <div className="ri-chapters">连载中,更新至{item.chapters}章</div>
                              }
                            </div>
                          </div>
                        )
                      }
                    </div>
                    <div className="watch-all"
                      onClick={() => window.open(`/userspace/${uid}/favorite`, '_blank')}
                    >查看全部</div>
                  </div>
                  :
                  <div className="otbx">
                    <div className="nocontent">没有收藏~</div>
                  </div>
                }
              </div>
            </div>
          </Link>
          <Link to={`/userspace/${uid}`}>
            <div className="one-right-box one-right-sp">
              <div className="right-text">
                <div className={ topindex === 3 ? "avatar-box avatar-box-active" : "avatar-box"}>
                  <img src={userinfo != null ? userinfo.avatar : null} alt="" className="avatar-img" />
                </div>
              </div>
              <div className="right-append2"></div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Mgtopnav