import { useEffect, useState } from 'react'
import "../../scss/UserSpace/search.scss"
import { useParams, Outlet, Link, useOutletContext, useLocation } from 'react-router-dom'
import { getDynamicByKeyword } from '../../../../api/dynamic'
import { getVideoByKeyword } from '../../../../api/video'

function Search () {
  const context = useOutletContext()
  const {hisuid, hisinfo, myuid, myinfo} = context

  const params = useParams(),
        keyword = params.keyword
  console.log(keyword);

  const [videoList, setVideolist] = useState([]),
        [dylist, setDylist] = useState([])

  const parentData = useOutletContext()
  const location = useLocation(),
        pathname = location.pathname

  const [leftindex, setLefindex] = useState(() => {
    if (pathname.includes('search/video/')) {
      return 0
    } else if (pathname.includes('search/dynamic/')) {
      return 1
    }
  })                                                      // 0 视频  1 动态
  
  // useEffect(() => {
  //   const getData = async () => {
  //     const res = await Promise.all([getVideoByKeyword(hisuid, keyword), getDynamicByKeyword(hisuid, keyword)]);
  //     setVideolist(res[0])
  //     setDylist(res[1])
  //   }
  //   getData()
  // }, [])

  useEffect(() => {
    const getData = async () => {
      const res = await Promise.all([getVideoByKeyword(hisuid, keyword), getDynamicByKeyword(hisuid, keyword)]);
      setVideolist(res[0])
      setDylist(res[1])
    }
    getData()
  }, [keyword])

  const tothisoneleft = (e) => {
    const index = parseInt(e.target.dataset.index || e.target.parentNode.dataset.index)
    setLefindex(index)
  }
  return (
    <div className="searchout-view-vad">
      <div className="video-left-search">
        <Link to={`/${hisuid}/search/video/${keyword}`}>
          <div className={leftindex === 0 ? "one-left-contentn olc-active" : "one-left-contentn"}
          data-index = {0}
          onClick={tothisoneleft}>
            <span>视频</span>
            <span>{videoList.length}</span>
          </div>
        </Link>
        <Link to={`/${hisuid}/search/dynamic/${keyword}`}>
          <div className={leftindex === 1 ? "one-left-contentn olc-active" : "one-left-contentn"}
            data-index = {1}
            onClick={tothisoneleft}>
            <span>动态</span>
            <span>{dylist.length}</span>
          </div>
        </Link>
      </div>
      <div className="video-right-xx">
        <Outlet 
          context={{"videolist": videoList,
                    "dylist": dylist,
                    'hisuid': hisuid,
                    'hisinfo': hisinfo,
                    'myuid': myuid,
                    'myinfo': myinfo
                  }}
        />
      </div>
    </div>
  )
}

export default Search