import { useParams } from "react-router-dom"
import "./sum"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { getVideoFormList, getUnaddVideo, addVideoToList } from "../../../api/videolist"
import { tovideo } from "../../../util/fnc"

function Allvideos() {
  const params = useParams()
  const uid = params.uid
  const listid =  params.listid
  const [viewflag, setViewflag] = useState(false)

  const [videos, setVideos] = useState([])
  const [unvideos, setUnvideos] = useState([])
  const [selectlist, setSelectlist] = useState([])  // 要添加的视频列表


  useEffect(() => {
    const getData = async () => {
      const res = await getVideoFormList(listid)
      setVideos(res)
      const res2 = await getUnaddVideo(listid, uid)
      setUnvideos(res2)
      setSelectlist(new Array(res2.length).fill(false))
    }
    getData()
  },[])

  const tocloseview = () => {
    setSelectlist(new Array(selectlist.length).fill(false))   // 清除数据
    setViewflag(false)
  }

  const onHandle1 = () => {
    tocloseview()
  }

  const onHandle2 = async () => {
    const vids = []
    for (let i = 0; i < selectlist.length; i++) {
      if (selectlist[i] === true) {
        vids.push(unvideos[i].vid)
      }
    }
    const res = await addVideoToList(listid, vids, uid)
    if (res) {
      console.log('add sunccess');
      tocloseview()
    }
  }

  const choicethisvideo = (e) => {
    const index = parseInt(e.target.dataset.index || e.target.parentNode.dataset.index)
    setSelectlist(selectlist.map((item, ind) => {
      if (ind === index) return !item
      else return item
    }))
  }
  return (
    <div className="sum-view">
      <div className="title-sum">
        <div className="top-left-sum">
          <Link to={`/${uid}/channel`}>
            <div className="title-span">我的合集和视频列表</div>
          </Link>
         <div className="icon iconfont rightsp">&#xe775;</div>
         <div className="titel-span2">233</div>
        </div>
      </div>
      <div className="list-infos-line">
        <div className="lil1-box">
          <span className="lil1-span1">{videos.length}个视频</span>
        </div>
        <div className="lil2-box">233</div>
      </div>
      <div className="box-content-videlost">
      <div className="sum-content1">
        <div className="add-newlist-bnt" onClick={() => setViewflag(true)}>
          <span className='icon iconfont'>&#xe643;</span>
          <span>添加视频</span>
        </div>
        {
          videos.map(item=>
            <div className="one-vlist-box" key={item.vid}>
              <div className="ovb-top">
                <img src={item.cover} alt="" className="style1-img"  data-vid={item.vid} onClick={tovideo}/>
                <div className="right-time-2">{item.vidlong}</div>
              </div>
              <div className="ovb-btn2" data-vid={item.vid} onClick={tovideo}>{item.title}</div>
            </div>
          )
        }
      </div>
      {
        viewflag &&
        <div className="vvxx-view">
          <div className="add2-view">
            <div className="av-video-title">
              <span className="avt-span">选择视频</span>
              <div className="icon iconfont" onClick={tocloseview}>&#xe643;</div>
            </div>
            <div className="add-search-box">
              <div className="serachc-box-v">
                <input type="text" className="search-video-inp" />
                <span className="icon iconfont">&#xe6a8;</span>
              </div>
            </div>
            <div className="add2-content">
              {
                unvideos.map((item, index) =>
                  <div className={selectlist[index] ? "one-video-to-select one-video-to-select-active" : "one-video-to-select"} key={item.vid}
                    data-index={index}
                    onClick={choicethisvideo}>
                    <div className="left-img-box" data-index={index}>
                      <img src={item.cover} alt="" className="cover-selectf" />
                      <div className="timeinfos-div">{item.vidlong}</div>
                    </div>
                    <div className="right-box-infos" data-index={index}>
                      <div className="title-line-lv">{item.title}</div>
                      <div className="infos-line-lv" data-index={index}>
                        <div className="one-show" data-index={index}>
                          <span className="icon iconfont" style={{fontSize: '13px'}}>&#xe6b8;</span>
                          <span className="txt-one-span">{item.plays}</span>
                        </div>
                        <div className="one-show" data-index={index}>
                          <span className="icon iconfont">&#xe666;</span>
                          <span className="txt-one-span">{item.danmus}</span>
                        </div>
                        <div className="one-show" data-index={index}>
                          <span className="txt-one-span">{item.time.slice(0, 10)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }
            </div>
            <div className="bottom-style2-line">
              <div className="video-select-done2" onClick={onHandle1}>取消</div>
              <div className="video-select-done" onClick={onHandle2}>完成</div>
            </div>
          </div>
        </div>
      }
      </div>
    </div>
  )
}

export default Allvideos