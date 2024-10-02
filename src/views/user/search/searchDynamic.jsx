import { useState } from "react"
import "./search.scss"
import { useParams } from "react-router-dom"
import { baseurl } from "../../../api/index"
import { Link } from "react-router-dom"

function SearchDynamic() {
  const params = useParams()
  const uid = params.uid  
  const keyword = params.keyword
  const [dylist, setDylist] = useState([])

  return (
    <div>
      <div className="video-right-title-sss">
        <div>
          <span className="vrt-sp1">TA的动态</span>
        </div>
      </div>
      {
        dylist.length > 0 ?
        <div className="sls-out1">
          <div className="search-line-spicale">
            <span className="sls-sp1">共找到关于“ {keyword} ”的</span>
            <span className="sls-sp2"> {12} </span>
            <span className="sls-sp1">个动态</span>
          </div>
          <div className="dynamic-content-search">
            <div className="one-search-content">
                
            </div>
          </div>
        </div>
        :
        <div className="sls-out2">
          <div className="noresult-img"
            style={{background: `url(${baseurl}/sys/nodata02.png)`,
                                backgroundPosition: 'center 50px',
                                backgroundRepeat: 'no-repeat'}}>
          </div>
          <div className="ssp2-nores">没有找到“ {keyword} ”的动态哦</div>
          <div className="watch-moreline">
            <Link to={`/${uid}/dynamic`}>
              <div className="look-all-dy">查看全部动态</div>
            </Link>
          </div>
        </div>
      }
    </div>
  )
}

export default SearchDynamic