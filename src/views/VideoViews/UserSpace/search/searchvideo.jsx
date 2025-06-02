import { useParams, Link, useOutletContext } from "react-router-dom"
import { baseurl } from "../../../../api/index"
import { HeightLightKw } from "../../../../util/fnc"

function SearchVideo() {
  const params = useParams(),
        keyword = params.keyword
  const context = useOutletContext(),
        hisuid= context.hisuid,
        videolist = context.videolist
  return (
    <div>
      <div className="video-right-title-sss">
        <div>
          <span className="vrt-sp1">TA的视频</span>
          <span className="sort1">最新发布</span>
          <span className="sort1">最多播放</span>
          <span className="sort1">最多收藏</span>
        </div>
        <div className="plyall">播放全部</div>
      </div>
      {
        videolist.length > 0 ?
        <div className="search-video-view">
          <div className="search-line-spicale">
            <span className="sls-sp1">共找到关于“ {keyword} ”的</span>
            <span className="sls-sp2"> {videolist.length} </span>
            <span className="sls-sp1">个视频</span>
          </div>
          <div className="selectline2">
            <div>
              <span className="sptext">全部</span>
              <span className="numsp">12</span>
            </div>
            <div>
              <span className="sptext">生活</span>
              <span className="numsp">12</span>
            </div>
            <div>
              <span className="sptext">游戏</span>
              <span className="numsp">12</span>
            </div>
          </div>
          <div className="user-videopart">
            {
              videolist.map(item => 
                <div className="one-uservideo-video"
                  key={item.uid}
                >
                  <img src={item.cover} alt="" className="video-cover" />
                  <div className="video-title">
                    <span dangerouslySetInnerHTML={{__html: HeightLightKw(item.title, keyword, "span", 0)}}></span>
                  </div>
                  <div className="vidoe-infos">
                    <div className="vi-btn-info">
                      <span className="icon iconfont" style={{scale: '0.8'}}>&#xe6b8;</span>
                      <span>{item.plays}</span>
                    </div>
                    <div className="vi-btn-info">
                      <span className="icon iconfont">&#xe666;</span>
                      <span>{item.danmus}</span>
                    </div>
                  </div>
                </div>
              )
            }
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
            <Link to={`/${hisuid}/videos`}>
              <div className="look-all-dy">查看全部视频</div>
            </Link>
          </div>
        </div>
      }
    </div>
  )
}

export default SearchVideo