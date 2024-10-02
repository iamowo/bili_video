import { useNavigate, useParams } from "react-router-dom"
import "./sum"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { getVideoFormList, getUnaddVideo, addVideoToList, deleteVideoList, chanegListInfo, getUserListOne } from "../../../api/videolist"
import { updateinfo } from "../../../api/video"
import { tovideo } from "../../../util/fnc"

function Allvideos() {
  const params = useParams()
  const uid = params.uid
  const listid =  params.listid
  const [viewflag, setViewflag] = useState(false)

  const [listinfo, setListinfo] = useState()

  const [videos, setVideos] = useState([])
  const [unvideos, setUnvideos] = useState([])
  const [selectlist, setSelectlist] = useState([])  // 要添加的视频列表

  const [deletefalg1, setDeletefalg1] = useState(false)
  const [editorflag, setEditorfalg] = useState(0)    // 1 编辑  2 删除

  const [titleinp, setTitleinp] = useState(""),
        [introinp, setIntroinp] = useState("")

  const [videoeditor, setVideoeditor] = useState(-1)

  useEffect(() => {
    const getData = async () => {
      const res = await getVideoFormList(listid)
      setVideos(res)
      const res2 = await getUnaddVideo(uid)
      setUnvideos(res2)
      setSelectlist(new Array(res2.length).fill(false))

      const res3 = await getUserListOne(listid)
      setListinfo(res3)
      setTitleinp(res3.title)
      setIntroinp(res3.intro)
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

  // 添加视频到列表中
  const onHandle2 = async () => {
    const vids = []
    for (let i = 0; i < selectlist.length; i++) {
      if (selectlist[i] === true) {
        vids.push(unvideos[i].vid)
      }
    }
    const res = await addVideoToList(listid, uid, vids)
    if (res) {
      console.log('add sunccess');
      // 更新列表内容
      const res2 = await getVideoFormList(listid)
      setVideos(res2)
      // 更新未添加列表
      const res3 = await getUnaddVideo(uid)
      setUnvideos(res3)
      setSelectlist(new Array(res3.length).fill(false))
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

  // ...
  const deletebtnfnc = (e) => {
    if (e.target.className === 'delete-append') {
      setEditorfalg(2)
    }
    setDeletefalg1(false)
  }

  const chaneginfo = async () => {
    const data = {
      listid: listid,
      title: titleinp,
      intro: introinp
    }
    const res = await chanegListInfo(data)
    setEditorfalg(0)
  }

  // 删除列表
  const navigate = useNavigate()
  const deletelist = async () => {
    const res = await deleteVideoList(listid)
    setEditorfalg(0)
    if (res) {
      navigate(`/${uid}/channel`)
    }
  }
  
  // 删除视频
  const [nowvid, setNowvid] = useState(-1)
  const deletethisvid = async () => {
    const data = {
      vid: nowvid,
      listid: -1,
      type: 10   // 更新视频listid
    }
    console.log(data);
    
    const res = await updateinfo(data)
    if (res) {
      const res2 = await getVideoFormList(listid)
      setVideos(res2)
    }
    setNowvid(-1)
    setEditorfalg(0)
  }
  return (
    <div className="sum-view">
      <div className="title-sum">
        <div className="top-left-sum">
          <Link to={`/${uid}/channel`}>
            <div className="title-span">我的合集和视频列表</div>
          </Link>
         <div className="icon iconfont rightsp">&#xe775;</div>
         <div className="titel-span2">{listinfo != null ? listinfo.title : ""}</div>
        </div>
      </div>
      <div className="list-infos-line">
        <div className="lil1-box">
          <span className="lil1-span1">{videos.length}个视频</span>
        </div>
        <div className="lil2-box">
          <div className="editorbox"
            onClick={() => setEditorfalg(1)}
          >编辑</div>
          <div className="deletebox">
            <span className="icon iconfont"
              onClick={() => {
                setDeletefalg1(true)
              }}
            >&#xe653;</span>
            {
              deletefalg1 &&
              <div className="delete-append"
                onClick={() => {
                  setDeletefalg1(false)
                  setEditorfalg(2)
                }}
              >删除这个视频列表</div>
            }
          </div>
        </div>
      </div>
      {
        editorflag > 0 &&
        <div className="append-view-videosum">
          {
            editorflag === 1 &&
            <div className="editor-view">
              <div className="editor-title">编辑列表信息</div>
              <div className="title-input">
                <input type="text" className="titleinp"
                  placeholder="标题"
                  value={titleinp}
                  onChange={(e) => setTitleinp(e.target.value)}
                />
              </div>
              <div className="intro-input">
                <textarea className="introinp"
                  placeholder="简介"
                  value={introinp}
                  onChange={(e) => setIntroinp(e.target.value)}
                ></textarea>
              </div>
              <div className="editor-line">
                <div className="dbl-btn1"
                  onClick={() => {
                    setEditorfalg(0)
                    setTitleinp("")
                    setIntroinp("")
                  }}
                >取消</div>
                <div className="dbl-btn2"
                  onClick={chaneginfo}
                >确定</div>
              </div>
            </div>
          }
          {
            editorflag === 2 &&
            <div className="delete-view">
              <div className="delete-title">确定删除这个列表</div>
              <div className="delete-btn-line">
                <div className="dbl-btn1"
                  onClick={() => setEditorfalg(0)}
                >取消</div>
                <div className="dbl-btn2"
                  onClick={deletelist}
                >删除</div>
              </div>
            </div>
          }
          {
            editorflag === 3 &&
            <div className="delete-view">
              <div className="delete-title">确定删除这个视频</div>
              <div className="delete-btn-line">
                <div className="dbl-btn1"
                  onClick={() => setEditorfalg(0)}
                >取消</div>
                <div className="dbl-btn2"
                  onClick={deletethisvid}
                >删除</div>
              </div>
            </div>
          }
        </div>

      }
      <div className="box-content-videlost">
      <div className="sum-content1">
        <div className="add-newlist-bnt" onClick={() => setViewflag(true)}>
          <span className='icon iconfont'>&#xe643;</span>
          <span>添加视频</span>
        </div>
        {
          videos.map((item, index) =>
            <div className="one-vlist-box" key={item.vid}>
              <div className="ovb-top">
                <img src={item.cover} alt="" className="style1-img"  data-vid={item.vid} onClick={tovideo}/>
                <div className="right-time-2">{item.vidlong}</div>
              </div>
              <div className="ovb-btn2">
                <div className="title-box-ss1"
                  data-vid={item.vid}
                  onClick={tovideo}
                >{item.title}</div>
                <div className="right-deitor-box">
                  <span className="icon iconfont"
                    onClick={() => setVideoeditor(index)}
                  >&#xe653;</span>
                  {
                    videoeditor === index &&
                    <div className="video-editor-box"
                      onClick={() => {
                        setNowvid(item.vid)
                        setEditorfalg(3)
                        setVideoeditor(-1)
                      }}
                    >删除此视频</div>
                  }
                </div>
              </div>
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