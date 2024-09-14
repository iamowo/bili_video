import { useEffect, useState } from 'react'
import './sum.scss'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { getUserVideoList, addVideoList, addVideoToList, getUnaddVideo } from '../../../api/videolist'
function Sum() {
  const params = useParams()
  const uid = params.uid

  const [addflag, setAddflag] = useState(0) // 1 新建列表  2 .添加视频

  const [style, setStyle] = useState(0) 
  const [vlist, setVlist] = useState([])
  const [unvideos, setUnvideos] = useState([])  // 未添加过的视频
  const [selectlist, setSelectlist] = useState([])  // 要添加的视频列表
  const [newlistid, setNlistid] = useState()  // 新建列表的id

  const [newlisttitle, setTile] = useState()
  const [newlistintro, setIntro] = useState()
  useEffect(() => {
    const getData = async () => {
      const res = await getUserVideoList(uid)
      setVlist(res)
      const res2 = await getUnaddVideo(-1, uid)  // listid = -1 时， 查找全部视频
      setUnvideos(res2)
      setSelectlist(new Array(res2.length).fill(false))
    }
    getData()
  },[])

  const choicethisvideo = (e) => {
    const index = parseInt(e.target.dataset.index || e.target.parentNode.dataset.index)
    setSelectlist(selectlist.map((item, ind) => {
      if (ind === index) return !item
      else return item
    }))
  }

  const nextstep = async () => {
    // console.log(newlistintro);
    if (newlisttitle === "" || newlisttitle === null) {
      alert('标题不能为空')
      return
    }
    const data = {
      uid: uid,
      title: newlisttitle,
      intro: newlistintro,
    }
    const res = await addVideoList(data);
    setNlistid(res) // 新listid
    if (res) {
      const res2 = await getUserVideoList(uid)
      setVlist(res2)
    }
    setAddflag(2)
  }
  
  const tocloseview = () => {
    setTile('')
    setIntro('')
    setAddflag(0)
    setSelectlist(new Array(selectlist.length).fill(false))
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
    const res = await addVideoToList(newlistid, vids, uid)
    if (res) {
      console.log('add sunccess');
      const res2 = await getUserVideoList(uid)
      setVlist(res2)
      tocloseview()
    }
  }

  return (
    <div className="sum-view">
      <div className="title-sum">
        <div className="top-left-sum">
        <div className="title-span">我的合集和视频列表</div>
          {
            style === 0 &&
            <div className="add-newlist-btn icon iconfont"  onClick={() => setAddflag(1)}>&#xe643; 新建</div>
          }
        </div>
        <div className="right-top-sum">
          <span className="icon iconfont" onClick={() => setStyle(0)} style={{color: style === 0 ? '#32aeec' : "#222"}}>1</span>
          <span className="icon iconfont" onClick={() => setStyle(1)} style={{color: style === 1 ? '#32aeec' : "#222"}}>2</span>
        </div>
      </div>
      {
        style === 0 ?
        <div className="sum-content1">
          <div className="add-newlist-bnt" onClick={() => setAddflag(1)}>
            <span className='icon iconfont'>&#xe643;</span>
            <span>添加视频列表</span>
          </div>
          {
            vlist.map(item=>
              <div className="one-vlist-box" key={item.listid}>
                <div className="ovb-top">
                  <img src={item.cover} alt="" className="style1-img" />
                  <div className="right-smask-vlist">
                    <span className="sp1-num-vlist">{item.nums}</span>
                    <span className="iconfont icon">&#xe63a;</span>
                  </div>
                  <Link to={`/${uid}/channel/detail/${item.listid}`}>
                    <div className="rmask-2"></div>
                  </Link>
                </div>
                <div className="ovb-btn">{item.title}</div>
              </div>
            )
          }
        </div>
        :
        <div className="sum-content2">
          {
            vlist.map(item=>
              <div className="contene2-line-box">
                <div className="title-con2-line">
                  <div className="tcl-left">
                    <span className="stcl-sp1">123</span>
                    <span className="stcl-sp2">1</span>
                  </div>
                  <Link to={`/${uid}/channel/detail/${item.id}`}>
                    <div className="tcl-right">更多</div>
                  </Link>
                </div>
                <div className="videos-con2-line"></div>
              </div>
            )
          }
        </div>
      }
      {
        addflag > 0 &&
        <div className="add-view-videlist">
          {
            addflag === 1 ?
            <div className="add1-view">
              <div className="av-video-title">
                <span className="avt-span">新建视频列表</span>
                <div className="icon iconfont" onClick={tocloseview}>&#xe643;</div>
              </div>
              <div className="avt-content">
                <div className="add-title-box">
                  <input type="text" maxLength={30} value={newlisttitle} onChange={(e) => setTile(e.target.value)} className="add-title-inp" placeholder='合计标题'/>
                  <span className="right-nums">0/30</span>
                </div>
                <div className="add-intro-box">
                  <textarea value={newlistintro} onChange={(e) => setIntro(e.target.value)} className='addintroinp' placeholder='视频简介(选填)'></textarea>
                </div>
              </div>
              <div className="avt-bottom">
                <div className="nex-btn-vl" onClick={nextstep}>下一步</div>
              </div>
            </div>
            :
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
                      data-index={index} onClick={choicethisvideo}>
                      <div className="left-img-box" data-index={index}>
                        <img src={item.cover} alt="" className="cover-selectf" />
                        <div className="timeinfos-div">{item.vidlong}</div>
                      </div>
                      <div className="right-box-infos" data-index={index}>
                        <div className="title-line-lv">{item.title}</div>
                        <div className="infos-line-lv">
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
                <div className="video-select-done2" onClick={onHandle1}>跳过</div>
                <div className="video-select-done" onClick={onHandle2}>完成</div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  )
}

export default Sum