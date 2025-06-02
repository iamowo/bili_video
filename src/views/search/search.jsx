import './scss/search.scss'
import Topnav from '../../components/Topnav/Topnav'
import { useEffect, useRef, useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { getByKeywordAll } from '../../api/video'
import { searchUser } from '../../api/user'
import message from '../../components/notice/notice'
import { addKeyword } from '../../api/search'
import { HeightLightKw } from '../../util/fnc'
import { deleteAllKeyword, deleteKeyword, getAllKeyword, getHotRanking } from '../../api/search'
import { searchKw } from '../../api/video'

function SearchM () {
  const params = useParams()
  const oldkeyword = params.keyword
  const [keyword, setKeyword] = useState(oldkeyword)
  const [videonums, setVideonums] = useState(0),
        [animanums, setAnimanums] = useState(0),
        [livingnums, setLivingnums] = useState(0),
        [usernums, setUsernums] = useState(0)

  const [focusflag, setFocuseflag] = useState(false),
        [oldkeywords, setOldkeywords] = useState([]),    // 本地存储关键词
        [keywordresult, setKyresult] = useState([]),    // kw的搜索结果
        [hoslist, setHotlist] = useState()              // 热搜 10条

  const sbbox = useRef()
  const location = useLocation()
  const uid = params.uid || ''
  const [topindex,setTopindex] = useState(() => {
    if (location.pathname.includes('/all/')) {
      return 0
    } else if (location.pathname.includes('/videose/')) {
      return 1
    } else if (location.pathname.includes('/animas/')) {
      return 2
    } else if (location.pathname.includes('/lives/')) {
      return 3
    } else if (location.pathname.includes('/users/')) {
      return 4
    }
  })
  
  useEffect(() => {
    const getData = async () => {
      const res = await Promise.all([getByKeywordAll(keyword, 0, 0, 0),
                                     searchUser(keyword, uid, 0),
                                     getAllKeyword(uid),
                                     getHotRanking()
                                    ])
      setVideonums(res[0].length)
      setUsernums(res[1].length)
      setOldkeywords(res[2])
      setHotlist(res[3].slice(0, 10))
    }
    getData()
    document.title=`${keyword}-pilipili`
  }, [])
  
  const clicktoclose = (e) => {
    if (!sbbox?.current?.contains(e.target)) {
      setFocuseflag(false)
    }
  }

  useEffect(() => {
    if (focusflag) {
      window.addEventListener('click', clicktoclose)
    }
    return () => {
      window.removeEventListener('click', clicktoclose)
    }
  }, [focusflag])
  const changinp = async (e) => {
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

  const clearword = () => {
    setKeyword('')
  }

  const tothispart = (e) => {
    const index = e.target.dataset.index
    setTopindex(parseInt(index))
  }

  const tosearchkw = async () => {
    if (keyword.length <= 0) {
      message.open({ type: 'error', content: '搜索内容不能为空'})
      return
    }
    await addKeyword(uid, keyword)         // 添加hot——keyword
    const url = `/all/${keyword}/${uid}`
      // navigate(`/all/keyword/${uid}`)
    window.open(url, "_blank")
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
  return (
    <div className="searchout-view">
      <Topnav
        closemid={true}
      />
      <div className="search-main">
        <div className="search-mid">
          <div className="search-mid-input">
            <div 
              ref={sbbox}
              className={focusflag ? "search-outbox sb-active" : "search-outbox"}
            >
              <div className="dearch-line-b">
                <div className="leftsearch-icon icon iconfont">&#xe607;</div>
                <input type="text" className="input2-se"
                  onFocus={() => setFocuseflag(true)}
                  onChange={changinp}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      tosearchkw()
                    }
                  }}
                  value={keyword}
                />
                {
                  keyword.length > 0 &&
                  <span className="close-span icon iconfont"
                    onClick={clearword}
                  >&#xe7b7;</span>
                }
                <div className="search-rightbtn"
                  onClick={tosearchkw}
                >搜索</div>
              </div>
              <div className="mid-search-appendbox">
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
            </div>
          </div>
          <div className="search-type">  
            <div className="one-saerch-type">
              <Link to={`/all/${keyword}/${uid}`}>
                <span data-index={0} onClick={tothispart}
                  style={{color: topindex === 0 ? '#32AEEC' : '#61666D'}}
                >综合</span>
                {/* <span className="fon-nums">1</span> */}
                {
                  topindex === 0 &&
                  <div className="se-active"></div>
                }
              </Link>
            </div>
            <div className="one-saerch-type">
              <Link to={`/videose/${keyword}/${uid}`}>
                <span data-index={1} onClick={tothispart}
                  style={{color: topindex === 1 ? '#32AEEC' : '#61666D'}}
                >视频</span>
                {
                  videonums > 0 &&
                  <span className="fon-nums"data-index={1} onClick={tothispart}>{videonums > 99 ? '99+' : videonums}</span>
                }
                {
                  topindex === 1 &&
                  <div className="se-active"></div>
                }
              </Link>
            </div>
            <div className="one-saerch-type">
              <Link to={`/animas/${keyword}/${uid}`}>
                <span data-index={2} onClick={tothispart}
                  style={{color: topindex === 2 ? '#32AEEC' : '#61666D'}}
                >番剧</span>
                {
                  animanums > 0 &&
                  <span className="fon-nums"data-index={2} onClick={tothispart}>{animanums > 99 ? '99+' : animanums}</span>
                }
                {
                  topindex === 2 &&
                  <div className="se-active"></div>
                }
              </Link>
            </div>
            <div className="one-saerch-type">
              <Link to={`/lives/${keyword}/${uid}`}>
                <span data-index={3} onClick={tothispart}
                  style={{color: topindex === 3 ? '#32AEEC' : '#61666D'}}
                >直播</span>
                {
                  livingnums > 0 &&
                  <span className="fon-nums"data-index={3} onClick={tothispart}>{livingnums > 99 ? '99+' : livingnums}</span>
                }
                {
                  topindex === 3 &&
                  <div className="se-active"></div>
                }
              </Link>
            </div>
            <div className="one-saerch-type">
              <Link to={`/users/${keyword}/${uid}`}>
                <span data-index={4} onClick={tothispart}
                  style={{color: topindex === 4 ? '#32AEEC' : '#61666D'}}
                >用户</span>
                {
                  usernums > 0 &&
                  <span className="fon-nums"data-index={4} onClick={tothispart}>{usernums > 99 ? '99+' : usernums}</span>
                }
                {
                  topindex === 4 &&
                  <div className="se-active"></div>
                }
              </Link>
            </div>
          </div>
          <div className="search-content-all">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchM