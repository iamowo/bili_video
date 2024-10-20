import { useEffect, useState } from "react"
import "./index.scss"
import { getAllv, userdeletevideo, userChnageInfo } from "../../../api/video"
import { updateMgInfo } from "../../../api/mg"
import { getUploadMg } from "../../../api/mg"
import { useParams } from "react-router-dom"
import { baseurl } from "../../../api"
import message from "../../../components/notice/notice"

function Mgcontrol() {
  const params = useParams()
  const uid = params.uid

  const [topindex, setTopindex] = useState(0)
  const [mglist, setMglist] = useState([])

  const [videoindex, setVideoindex] = useState(-1)
  const [mgmid, setMgmid] = useState(-1)
  const [changflag, setChnageflag] = useState(0)   // 1 编辑  2 删除
  const [newtitle, setNewtitle] = useState()
  const [newauthor, setNewAuthor] = useState()
  const [newintro, setNewintro] = useState()
  useEffect(() => {
    const getData = async () => {
      const res = await getUploadMg(uid);
      setMglist(res)
      console.log(res);
      
    }
    getData()
  },[])


  let timer = null
  const mouseenter = (e) => {    
    if (timer != null) {
      clearTimeout(timer)
      timer = null
      return
    }
    const index = parseInt(e.target.dataset.index)
    const mid = parseInt(e.target.dataset.mid)
    setMgmid(mid)
    setVideoindex(index)
    setNewtitle(mglist[index].title)
    setNewAuthor(mglist[index].author)
    setNewintro(mglist[index].intro)
  }

  const mouseleave = () => {
    timer = setTimeout(() => {
      setVideoindex(-1)
    }, 400)
  }

  const toclosethismanage = () => {
    setChnageflag(0)
    setVideoindex(-1)
    setMgmid(-1)

    setNewtitle("")
    setNewAuthor("")
    setNewintro("")
  }

  // 删除
  const todeleteit = async () => {
    const data = {
      mid: mgmid,
      deleted: 1
    }
    const res = await updateMgInfo(data)
    if (res) {
      message.open({type: "info", content: "删除成功"})
      const res = await getUploadMg(uid);
      setMglist(res)
    }
    toclosethismanage()
  }

  // 修改信息
  const sendchange = async () => {
    const data = {
      mid: mgmid,
      title: newtitle,
      author: newauthor,
      intro: newintro
    }
    const res = await updateMgInfo(data)
    if (res) {
      // message.open({type: "info", content: "修改成功"})
      const res = await getUploadMg(uid);
      setMglist(res)
    }
    toclosethismanage()
  }
  return (
    <div className="videocontroll-box">
      <div className="all-content-title">
        <div className="act-left">
          <div data-index="0" className={ topindex === 0 ? "one-title-box top-active" : "one-title-box"}>全部稿件</div>
          {/* <div onClick={selectthis} data-index="1" className={ topindex === 1 ? "one-title-box top-active" : "one-title-box"}>已审核稿件</div>
          <div onClick={selectthis} data-index="2" className={ topindex === 2 ? "one-title-box top-active" : "one-title-box"}>未审核稿件</div> */}
        </div>
      </div>
      <div className="content-videos-box">
        {
          mglist.map((item, index) =>
            <div className="one-up-mg" key={item.vid}>
              <div className="left-up-cover">
                <img src={item.cover} alt="" className="luc-img" />
                <div className="time-long">{item.vidlong}</div>
              </div>
              <div className="mid-up-infos">
                <div className="video-title">{item.title}</div>
                <div className="mg-author">{item.author}</div>
                <div className="mg-author">
                  {
                    item.taglist.map(item =>
                      <span className="onetag">{item}</span>
                    )
                  }
                </div>
                <div className="mg-intro">简介: {item.intro}</div>
                <div className="video-uptime">{item.time.slice(0, 10)}</div>
              </div>
              <div className="change-suit-videoinfo">
                <span className="icon iconfont" data-index={index} data-mid={item.mid} onMouseEnter={mouseenter} onMouseLeave={mouseleave}>&#xe653;</span>
                {
                  videoindex === index &&
                  <div className="change-part-two" data-index={index} data-mid={item.mid} onMouseEnter={mouseenter} onMouseLeave={mouseleave}>
                    <div className="cpt-d1" onClick={() => setChnageflag(1)}>编辑信息</div>
                    <div className="cpt-d2" onClick={() => setChnageflag(2)}>删除</div>
                  </div>
                }
              </div>
            </div>
          )
        }
        {
          mglist.length === 0 &&
            <div className="noresult-videw">
              <div className="noresult-img"
                style={{background: `url(${baseurl}/sys/nodata02.png)`,
                                    backgroundPosition: 'center 50px',
                                    backgroundRepeat: 'no-repeat'}}>
              </div>
            </div>
        }
      </div>
      {
        changflag > 0 &&
        <div className="editor-viewo-manager2">
          {
            changflag === 1 ?
            <div className="evm-mamager">
              <div className="ed-title">
                <span>编辑信息</span>
                <div className="icon iconfont clsebtn-man2" onClick={toclosethismanage}>&#xe643;</div>
              </div>
              <div className="deiter-video-info">
                <div className="div-chang-line">标题</div>
                <div className="div-chang-box">
                  <input type="text" className="changtitle" maxLength={80}
                    value={newtitle}
                    onChange={(e) => setNewtitle(e.target.value)}/>
                  <div className="num-edi">{newtitle.length}/80</div>
                </div>
                <div className="div-chang-line">作者</div>
                <div className="div-chang-box">
                  <input type="text" className="changtitle" maxLength={80}
                    value={newauthor}
                    onChange={(e) => setNewAuthor(e.target.value)}/>
                </div>
                <div className="div-chang-line">简介</div>
                <div className="div-chang-box2">
                  <textarea name="" id="" className="changintro"
                    onChange={(e) => setNewintro(e.target.value)}
                   value={newintro}></textarea>
                </div>
              </div>
              <div className="send-change-btn" onClick={sendchange}>确定</div>
            </div>
            :
            <div className="evm-delete">
              <div className="ed-title">
                <span>确定删除此漫画吗</span>
                <div className="icon iconfont clsebtn-man2" onClick={toclosethismanage}>&#xe643;</div>
              </div>
              <div className="ed-two-line">
                <div className="edtl-b1" onClick={toclosethismanage}>取消</div>
                <div className="edtl-b2" onClick={todeleteit}>确定</div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  )
}

export default Mgcontrol