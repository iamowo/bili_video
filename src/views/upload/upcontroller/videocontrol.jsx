import { useEffect, useState } from "react"
import "./index.scss"
import { getAllv, userdeletevideo, userChnageInfo } from "../../../api/video"
import { useParams } from "react-router-dom"
import { baseurl } from "../../../api"

function Vdieocontrol() {
  const params = useParams()
  const uid = params.uid

  const [topindex, setTopindex] = useState(0)
  const [videolsit, setVideolist] = useState([])
  const [oldtemp, setOldtemp] = useState([])

  const [videoindex, setVideoindex] = useState(-1)
  const [videovid, setVideovid] = useState(-1)
  const [changflag, setChnageflag] = useState(0)   // 1 编辑  2 删除
  const [newtitle, setNewtitle] = useState()
  const [newintro, setNewintro] = useState()
  useEffect(() => {
    const getData = async () => {
      const res = await getAllv(uid);
      setVideolist(res)
      setOldtemp(res)
    }
    getData()
  },[])

  const selectthis = (e) => {
    const ind = parseInt(e.target.dataset.index)
    setTopindex(ind)
    if (ind === 0) {
      setVideolist(oldtemp)
    } else if (ind === 1) {
      setVideolist(
        oldtemp.filter(item => {
          return item.pass === 1
        })
      )
    } else if (ind === 2) {
      setVideolist(
        oldtemp.filter(item => {
          return item.pass !== 1
        })
      )
    }
  }

  let timer = null
  const mouseenter = (e) => {    
    if (timer != null) {
      clearTimeout(timer)
      timer = null
      return
    }
    const index = parseInt(e.target.dataset.index)
    const vid = parseInt(e.target.dataset.vid)
    setVideovid(vid)
    setVideoindex(index)
    setNewtitle(videolsit[index].title)
    setNewintro(videolsit[index].intro)
  }

  const mouseleave = () => {
    timer = setTimeout(() => {
      setVideoindex(-1)
    }, 400)
  }

  const toclosethismanage = () => {
    setChnageflag(0)
    setVideoindex(-1)
    setVideovid(-1)

    setNewtitle("")
    setNewintro("")
  }

  const todeleteit = async () => {
    const res = await userdeletevideo(videovid)
    if (res) {
      console.log('删除成功');
      const res2 = await getAllv(uid)
      setVideolist(res2)
    }
    toclosethismanage()
  }

  const sendchange = async () => {
    const data = {
      vid: videovid,
      title: newtitle,
      intro: newintro
    }
    const res = await userChnageInfo(data)
    if (res) {
      console.log('修改成功');
      const res2 = await getAllv(uid)
      setVideolist(res2)
    }
    toclosethismanage()
  }
  return (
    <div className="videocontroll-box">
      <div className="all-content-title">
        <div className="act-left">
          <div onClick={selectthis} data-index="0" className={ topindex === 0 ? "one-title-box top-active" : "one-title-box"}>全部稿件</div>
          <div onClick={selectthis} data-index="1" className={ topindex === 1 ? "one-title-box top-active" : "one-title-box"}>已审核稿件</div>
          <div onClick={selectthis} data-index="2" className={ topindex === 2 ? "one-title-box top-active" : "one-title-box"}>未审核稿件</div>
        </div>
      </div>
      <div className="content-videos-box">
        {
          videolsit.map((item, index) =>
            <div className="one-up-video" key={item.vid}>
              <div className="left-up-cover">
                <img src={item.cover} alt="" className="luc-img" />
                <div className="time-long">{item.vidlong}</div>
              </div>
              <div className="mid-up-infos">
                <div className="video-title">{item.title}</div>
                <div className="video-uptime">{item.time.slice(0, 10)}</div>
              </div>
              {
                item.pass === 0 &&
                <div className="right-up-infos1">
                  <span className="rui-sp1">审核中</span>
                </div>
              }
              {
                item.pass === 1 &&
                <div className="right-up-infos2">
                  <span className="rui-sp2">已通过</span>
                  <span className="timesp">{}</span>
                </div>
              }
              {
                item.pass === 2 &&
                <div className="right-up-infos3">
                  <span className="rui-sp3">未通过</span>
                </div>
              }
              <div className="change-suit-videoinfo">
                <span className="icon iconfont" data-index={index} data-vid={item.vid} onMouseEnter={mouseenter} onMouseLeave={mouseleave}>&#xe653;</span>
                {
                  videoindex === index &&
                  <div className="change-part-two" data-index={index} data-vid={item.vid} onMouseEnter={mouseenter} onMouseLeave={mouseleave}>
                    <div className="cpt-d1" onClick={() => setChnageflag(1)}>编辑信息</div>
                    <div className="cpt-d2" onClick={() => setChnageflag(2)}>删除</div>
                  </div>
                }
              </div>
            </div>
          )
        }
        {
          videolsit.length === 0 &&
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
        <div className="editor-viewo-manager">
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
                <span>确定删除此视频吗</span>
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

export default Vdieocontrol