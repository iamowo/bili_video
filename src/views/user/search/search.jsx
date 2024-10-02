import { useState } from 'react'
import './search.scss'
import { useParams, Outlet, Link } from 'react-router-dom'

function Search () {
  const params = useParams()
  const uid = params.uid
  const keyword = params.keyword
  console.log('xxx', keyword);
  
  const [leftindex, setLefindex] = useState(0)
  const [videonums, setVideonums] = useState(0)
  const [dynamicnums, setDynamicnums] = useState(0)

  

  const tothisoneleft = (e) => {
    const index = parseInt(e.target.dataset.index || e.target.parentNode.dataset.index)
    setLefindex(index)
  }
  return (
    <div className="searchout-view-vad">
      <div className="video-left-search">
        <Link to={`/${uid}/search/video/${keyword}`}>
          <div className={leftindex === 0 ? "one-left-contentn olc-active" : "one-left-contentn"}
          data-index = {0}
          onClick={tothisoneleft}>
            <span>视频</span>
            <span>{videonums}</span>
          </div>
        </Link>
        <Link to={`/${uid}/search/dynamic/${keyword}`}>
          <div className={leftindex === 1 ? "one-left-contentn olc-active" : "one-left-contentn"}
            data-index = {1}
            onClick={tothisoneleft}>
            <span>动态</span>
            <span>{dynamicnums}</span>
          </div>
        </Link>
      </div>
      <div className="video-right-xx"><Outlet /></div>
    </div>
  )
}

export default Search