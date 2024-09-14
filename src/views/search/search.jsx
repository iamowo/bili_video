import './search.scss'
import Topnav from '../../components/Topnav/Topnav'
import { useEffect, useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useParams } from 'react-router-dom'

function SearchM () {
  const params = useParams()
  const oldkeyword = params.keyword
  const [keyword, setKeyword] = useState(oldkeyword)
  
  const location = useLocation()
  console.log(location.pathname);

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
 
  const changinp = (e) => {
    const value = e.target.value
    setKeyword(value)
  }

  const clearword = () => {
    setKeyword('')
  }

  const tothispart = (e) => {
    const index = e.target.dataset.index
    setTopindex(parseInt(index))
  }
  return (
    <div className="searchout-view">
      <Topnav />
      <div className="search-main">
        <div className="search-mid">
          <div className="search-mid-input">
            <div className="search-outbox">
              <div className="leftsearch-icon icon iconfont">&#xe607;</div>
              <input type="text" className="input2-se" onChange={changinp} value={keyword}/>
              {
                keyword.length > 0 &&
                <span className="close-span icon iconfont" onClick={clearword}>&#xe7b7;</span>
              }
              <div className="search-rightbtn">搜索</div>
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
                <span className="fon-nums"data-index={1} onClick={tothispart}>1</span>
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
                <span className="fon-nums"data-index={2} onClick={tothispart}>1</span>
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
                <span className="fon-nums"data-index={3} onClick={tothispart}>1</span>
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
                <span className="fon-nums"data-index={4} onClick={tothispart}>1</span>
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