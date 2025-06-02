import './scss/all.scss'
import { useState, useEffect } from 'react'
import { getByKeywordAll, getByKeywordName } from '../../api/video'
import { useParams } from 'react-router-dom'
import { touserspace, tovideo, HeightLightKw } from '../../util/fnc'
import Noresult from '../../components/NoResult/Noresult'

function All () {
  const params = useParams()
  const keyword = params.keyword

  const [alllist, setAlllist] = useState([])
  const [sortindex1, setSortindex1] = useState(0)
  const [sortopen, setSortopen] = useState(false)
  const [sortindex2, setSortindex2] = useState(0)
  const [sortindex3, setSortindex3] = useState(0)

  const [pagelist, setPageList] = useState([
    {'id': 1},
    {'id': 2},
    {'id': 3},
    {'id': 4},
    {'id': 5},
    {'id': 6}
  ])
  useEffect(() => {
    const getData = async () => {
      const res = await getByKeywordAll(keyword, 0, 0, 0)
      console.log(res);
      
      setAlllist(res)
    }
    getData()
  },[])

  const tothissort1 = async (e) => {    
    const index= parseInt(e.target.dataset.index)
    setSortindex1(index)    
    let res = await getByKeywordAll(keyword, index, sortindex2, sortindex3)
    console.log('xx', res);
    setAlllist(res)
  }

  const tothissort2 = async (e) => {
    const index= parseInt(e.target.dataset.index)
    setSortindex2(index)

    let res = await getByKeywordAll(keyword, sortindex1, index, sortindex3)
    setAlllist(res)
  }

  const tothissort3 = async (e) => {
    const index= parseInt(e.target.dataset.index)
    setSortindex3(index)

    // let res = await getByKeywordAll(keyword, sortindex1, sortindex2, index)
      // setAlllist(res)
  }

  return (
    <div className="all-view-page">
       <div className="res-sort" style={{height: sortopen ? '136px' : '42px'}}>
          <div className="sort-line">
            <div className="srot-part">
              <div className={sortindex1 === 0 ? "sort1 sort-active" : "sort1"} data-index={0} onClick={tothissort1}>综合排序</div>
              <div className={sortindex1 === 1 ? "sort1 sort-active" : "sort1"} data-index={1} onClick={tothissort1}>最多播放</div>
              <div className={sortindex1 === 2 ? "sort1 sort-active" : "sort1"} data-index={2} onClick={tothissort1}>最新发布</div>
              <div className={sortindex1 === 3 ? "sort1 sort-active" : "sort1"} data-index={3} onClick={tothissort1}>最多收藏</div>
              <div className={sortindex1 === 4 ? "sort1 sort-active" : "sort1"} data-index={4} onClick={tothissort1}>最多弹幕</div>
            </div>
            <div className="srot-part">
              <div className="more-sort"
                onClick={() => setSortopen(!sortopen)}>更多筛选
                <div className="icon iconfont" style={{rotate: sortopen ? '-180deg' : '0deg'}}>&#xe624;</div>
              </div>
            </div>
          </div>
          <div className="sort-line">
            <div className="srot-part">
              <div className={sortindex2 === 0 ? "sort1 sort-active" : "sort1"} data-index={0} onClick={tothissort2}>全部时长</div>
              <div className={sortindex2 === 1 ? "sort1 sort-active" : "sort1"} data-index={1} onClick={tothissort2}>10分钟以下</div>
              <div className={sortindex2 === 2 ? "sort1 sort-active" : "sort1"} data-index={2} onClick={tothissort2}>10-30分钟</div>
              <div className={sortindex2 === 3 ? "sort1 sort-active" : "sort1"} data-index={3} onClick={tothissort2}>30-60分钟</div>
              <div className={sortindex2 === 4 ? "sort1 sort-active" : "sort1"} data-index={4} onClick={tothissort2}>60分钟以上</div>
            </div>
          </div>
          <div className="sort-line">
            <div className="srot-part">
              <div className={sortindex3 === 0 ? "sort13 sort-active" : "sort13"} data-index={0} onClick={tothissort3}>全部分区</div>
              <div className={sortindex3 === 1 ? "sort13 sort-active" : "sort13"} data-index={1} onClick={tothissort3}>动画</div>
              <div className={sortindex3 === 2 ? "sort13 sort-active" : "sort13"} data-index={2} onClick={tothissort3}>番剧</div>
              <div className={sortindex3 === 3 ? "sort13 sort-active" : "sort13"} data-index={3} onClick={tothissort3}>音乐</div>
              <div className={sortindex3 === 4 ? "sort13 sort-active" : "sort13"} data-index={4} onClick={tothissort3}>游戏</div>
              <div className={sortindex3 === 5 ? "sort13 sort-active" : "sort13"} data-index={5} onClick={tothissort3}>电视剧</div>
              <div className={sortindex3 === 6 ? "sort13 sort-active" : "sort13"} data-index={6} onClick={tothissort3}>美食</div>
            </div>
          </div>
        </div>
      <div className="all-page">
        {
          alllist.map(item =>
            <div className="one-all-box" key={item.vid}>
              <div className="all-img-box">
                <img src={item.cover} alt="" className="one-all-cover" 
                  data-vid={item.vid} onClick={tovideo}
                />
                <div className="bottom-video-infos">
                  <div className='leftdiv-sear'>
                    <div className="left-d1-searchbox">
                      <span className="icon iconfont">&#xe6b8;</span>
                      <span>{item.plays}</span>
                    </div>
                    <div className="left-d1-searchbox">
                      <span className="icon iconfont">&#xe6b8;</span>
                      <span>{item.danmus}</span>
                    </div>
                  </div>
                  <span>{item.vidlong}</span>
                </div>
              </div>
              <div className="oa-title"
                data-vid={item.vid} onClick={tovideo}
              >
                <span dangerouslySetInnerHTML={{__html: HeightLightKw(item.title, keyword, "span", 0)}}></span>
              </div>
              <div className="oa-infos">
                <div className='name-part-aa'
                data-uid={item.uid} onClick={touserspace}
                >
                  <span className="icon iconfont">&#xe665;</span>
                  <span>{item.name}</span>
                </div>
                <span className='icon iconfont'>&#xec1e;</span>
                <span>{item.time.slice(0, 10)}</span>
              </div>
            </div>     
          )
        }
      </div>
      {
        alllist.length === 0 &&
        <Noresult />
      }
    </div>
  )
}

export default All