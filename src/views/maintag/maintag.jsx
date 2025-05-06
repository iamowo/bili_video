import { useParams } from 'react-router-dom'
import './maintag.scss'
import { useEffect, useState } from 'react'
import { getResourceByTag } from '../../api/tag'
import Topnav from '../../components/Topnav/Topnav'
import { tovideo, touserspace } from '../../util/fnc'
import Noresult from '../../components/NoResult/Noresult'

function Maintag() {
  const params = useParams()
  const maintag = params.maintag
  const [videolist, setVideolist] = useState([])

  useEffect(() => {
    const getData = async () => {
      const res = await getResourceByTag(0, maintag, 0, 0)
      console.log(res);
      
      setVideolist(res.slice(0, 10))
    }
    getData()
    document.title = '标签-' + params.maintag

  },[])
  
  return (
    <div className="maintag-view">
      <Topnav />
      <div className="main-tag-container-out">
        <div className="mt-container">
          {
            false &&
            <div className="v-banner2">
              <div className="banner-cotainer"></div>
            </div>
          }
          <div className="view-container">
            {
              videolist.length === 0 &&
              <div className="nores-box">
                <Noresult />
              </div>
            }
            <div className="left-containers">
              <div className="spbox"># {maintag}</div>
              {
                videolist.map(item =>
                  <div className="one-video-box">
                    <div className="vbox-img-box">
                      <img src={item.cover} alt="" className="this-cover"
                        data-vid={item.vid} onClick={tovideo}/>
                      <div className="info-line1">
                        <div className="ldiv">
                          <div className="onediv">
                            <span className="icon iconfont" style={{fontSize: '13px'}}>&#xe6b8;</span>
                            <span className="txtsp">{item.plays}</span>
                          </div>
                          <div className="onediv">
                            <span className="icon iconfont">&#xe666;</span>
                            <span className="txtsp">{item.danmus}</span>
                          </div>
                        </div>
                        <div className="ldiv">
                          <div className="onediv2">
                            <span className="txtsp">{item.vidlong}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="vbox-info-box">
                      <div className="title-line1" data-vid={item.vid} onClick={tovideo}>{item.title}</div>
                      <div className="info-line1">
                        <div className="onediv">
                          <span className="icon iconfont" style={{fontSize: '15px'}}>&#xe665;</span>
                          <span className="txtsp" data-uid={item.uid} onClick={touserspace}>{item.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }
            </div>
            {
              videolist.length > 0 &&
              <div className="right-rank">
                <div className="rrank-title">{maintag}排行榜</div>
                <div className="ran-containt">
                  {
                    videolist.map((item, index) =>
                    <div className="one-rank-box">
                      <div className="lnums">{index + 1}</div>
                      <div className="lrtext" data-vid={item.vid} onClick={tovideo}>{item.title}</div>
                    </div>
                    )
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Maintag