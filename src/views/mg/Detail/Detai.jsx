import "./Detail.scss"
import Mgtopnav from "../../../components/mgTop/Topnav"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getMgImgs, getChapters, getOneMg, addMgList, updateMgStatus } from "../../../api/mg"
import message from "../../../components/notice/notice"

function Detail() {
  const params = useParams()
  const {mid, number} = params
  const userinfo = JSON.parse(localStorage.getItem('userinfo')),
        uid = userinfo.uid
  const navigate = useNavigate()

  const [readstyle, setReadstyle] = useState(1)              // 0 上下翻页 1 左右双页
  const [imgs, setImgs] = useState([]),
        [mgchapters, setMgchapters] = useState([]),
        [mginfo, setMginfo] = useState()

  const [nowindex, setNowindex] = useState(0)                // 页数 / 2
  const [controlflag, setControlflag] = useState(false)

  const [settingglag, setSettingflag] = useState(false),
        [setting2, setSteeing2] = useState(true)

  const [chapterflag, setChapterflag] = useState(false),
        [chapterindex, setChapterindex] = useState(number - 1)

  useEffect(() => {
    const getData = async () => {
      const res = await Promise.all([getMgImgs(mid, number), getChapters(mid, 0, 0), getOneMg(mid, uid)])
      console.log('res is:', res);
      setImgs(res[0])
      setMgchapters(res[1])
      setMginfo(res[2])
      document.title = number + "_" +res[1][parseInt(number) - 1].name + " | " +res[2].title
    }
    getData()
  }, [])


  useEffect(() => {
    window.addEventListener("beforeunload",  sednHistory(nowindex, readstyle))
    return () => {
      window.removeEventListener("beforeunload",  sednHistory(nowindex, readstyle))
    }
  }, [nowindex, readstyle])
  
  const sednHistory = async ()  => {
    setNowindex(n => n + 0)
    setReadstyle(n => n + 0)
    const data = {
      uid: uid,
      mid: mid,
      type: 1,
      number: number,
      watchpage: nowindex,
      watchtype: readstyle
    }
    await addMgList(data)
    return
  }
  let timer1 = null
  const enterzone = () => {
    if (timer1 !== null) {
      clearTimeout(timer1)
      timer1 = null
    }
    setControlflag(true)
  }

  const leavezone = () => {
    timer1 = setTimeout(() => {
      setControlflag(false)
      setSettingflag(false)
      setChapterflag(false)
    }, 2000)
  }

  // 收藏 or 取消收藏
  const tofavorite = async () => {
    if (mginfo.collected) {
      // 取消收藏
      const data = {
        mid: mid,
        uid: uid,
        type: 0,
        deleted: 1
      }
      const res = await updateMgStatus(data)
      if (res) {
        setMginfo({
          ...mginfo,
          collected: false
        })
        message.open({type: 'info', content: '取消收藏', flag: true})
      }
    } else {
      // 添加收藏
      const data = {
        mid: mid,
        uid: uid,
        type: 0,
      }
      const res = addMgList(data)
      if (res) {
        setMginfo({
          ...mginfo,
          collected: true
        })
        message.open({type: 'info', content: '已收藏', flag: true})
      }
    }
  }
  return (
    <div>
      <div className="topzone"
        onMouseEnter={enterzone}
        onMouseLeave={leavezone}
      >
        <div className="topcontrol"
          style={{translate: controlflag ? "0 0" : "0 -50px"}}
        >
          <Mgtopnav
            mid={mid}
            title={mginfo != null ? mginfo.title : ""}
            number={mgchapters.length > 0 ? mgchapters[0].number : ""}
            name={mgchapters.length > 0 ? mgchapters[0].name : ""}
          />
        </div>
      </div>
      <div className="detail-view">
        <div className="detail-content">
          {
            readstyle === 0 ?
            <div className="readbox1">
              <div className="readbox1-mask"
                style={{backgroundColor: controlflag ? "#00000080" : "transparent"}}
              ></div>
              <div className="img-warp">
                {
                  imgs.map(item =>
                    <img src={item.path} alt="" className="one-img1" />
                  )
                }
              </div>
            </div>
            :
            <div className={setting2 && readstyle === 1 ? "readbox2 readbox2-active" : "readbox2"}>
              <div className="imgbox21">
                <div className="leftmask"
                  style={{backgroundColor: controlflag ? "#00000080" : "transparent"}}
                  onClick={() => {
                      // 从左到右
                      if (nowindex === Math.ceil(imgs.length)) {
                        message.open({type: 'info', content: '下一章'})
                        return
                      }
                      setSettingflag(false)
                      setControlflag(false)
                      setChapterflag(false)
                      setNowindex(nowindex + 1)
                  }}
                ></div>
                {
                  nowindex * 2 + 1 < imgs.length ?
                  <img src={imgs.length > 0 ? imgs[nowindex * 2 + 1].path: null} alt="" className="one-img2" />
                  :
                  <div className="endpage">End</div>
                }
              </div>
              <div className="imgbox22">
                <div className="rightmask"
                  style={{backgroundColor: controlflag ? "#00000080" : "transparent"}}
                  onClick={() => {
                      if (nowindex === 0) {
                        message.open({type: 'info', content: '没有前一章了'})
                        return
                      }
                      setSettingflag(false)
                      setControlflag(false)
                      setNowindex(nowindex - 1)
                  }}
                ></div>
                <img src={imgs.length > 0 ?imgs[nowindex * 2].path: null} alt="" className="one-img2" />
              </div>
            </div>
          }
          <div className="control-zone"
            onMouseEnter={enterzone}
            onMouseLeave={leavezone}
          >
            <div className="control-line1"
              style={{translate: controlflag ? "0 0" : "0 140px"}}
            >
              <div className="cline1-box">
                <div className="outb"
                  onClick={tofavorite}
                >
                  <div className="iconbox">
                    {
                      mginfo != null && mginfo.collected ?
                      <span className="iconfont iconfont-active">&#xe8c6;</span>
                      :
                      <span className="iconfont">&#xe8c6;</span>
                    }
                    </div>
                  <span className="textsp">收藏</span>
                </div>
              </div>
              <div className="cline1-box">
                <div className="outb"
                  onClick={() => {
                    setChapterflag(false)
                    setSettingflag(!settingglag)
                  }}
                >
                  <div className="iconbox">
                    <span className="iconfont">&#xe672;</span>
                  </div>
                  <span className="textsp">设置</span>
                </div>
                <view className={settingglag ? "setting-box setting-box-active" : "setting-box"}>
                  <div className="sb-line1">阅读设置</div>
                  <div className="read-setting-box">
                    <div className="one-setting-line">
                      <div className="left-sp">阅读模式</div>
                      <div className="right-sp">
                        <div className={readstyle === 1 ? "mode1 mode-active" : "mode1"}
                          onClick={() => {
                            setSettingflag(false)
                            setReadstyle(1)
                          }}
                        >左右翻页</div>
                        <div className={readstyle === 0 ? "mode2 mode-active" : "mode2"}
                          onClick={() => {
                            setSettingflag(false)
                            setReadstyle(0)
                          }}                          
                        >上下滚动</div>
                      </div>
                    </div>
                    <div className="one-setting-line">
                      <div className="left-sp">翻页方向</div>
                      <div className="right-sp">
                        <div className={setting2 ? "mode1 mode-active" : "mode1"}
                          onClick={() => {
                            setSettingflag(false)
                            setSteeing2(true)
                          }}
                        >从左向右</div>
                        <div className={!setting2 ? "mode2 mode-active" : "mode2"}
                          onClick={() => {
                            setSettingflag(false)
                            setSteeing2(false)
                          }}   
                        >从右向左</div>
                      </div>
                    </div>
                  </div>
                </view>
              </div>
              <div className="cline1-box">
                <div className="outb"
                  onClick={() => {
                    setSettingflag(false)
                    setChapterflag(!chapterflag)
                  }}
                >
                  <div className="iconbox">
                    <span className="iconfont">&#xe62f;</span>
                  </div>
                  <span className="textsp">目录</span>
                </div>
                <view className={chapterflag ? "menu-box menu-box-active" :"menu-box"}>
                  <div className="sb-line1">全部章节</div>
                  <div className="chapterbox-inner">
                    {
                      mgchapters.map((item, index) =>
                        <div className={chapterindex === index ? "one-chapter one-chapter-active" : "one-chapter"}
                          onClick={() => {
                            navigate(`/detail/${mid}/${item.number}`)
                            document.location.reload()
                          }}
                        >{item.number} {item.name}</div>
                      )
                    }
                  </div>
                </view>
              </div>
            </div>
            <div className="control-line2"
              style={{translate: controlflag ? "0 0" : "0 140px"}}
            >
              <div className="toleftsp icon iconfont">&#xe75b;</div>
              {
                readstyle === 0 ?
                <div className="pro1">
                  <span className="numner-span">{parseInt(nowindex) + 1}/{Math.ceil(imgs.length / 2)}</span>
                  <div className="progress-inp">
                    <input type="range" className="mg-progress"
                      value={nowindex}
                      min={0}
                      max={Math.ceil(imgs.length / 2) - 1}
                      step={1}
                      onChange={(e) => setNowindex(e.target.value)}
                    />
                  </div>
                </div>
                :
                <div className="pro1">
                  <div className="numner-span">{parseInt(nowindex) + 1}/{Math.ceil(imgs.length / 2)}</div>
                  <div className="progress-inp">
                    <input type="range" className="mg-progress"
                      value={nowindex}
                      min={0}
                      max={Math.ceil(imgs.length / 2) - 1}
                      step={1}
                      onChange={(e) => setNowindex(e.target.value)}
                    />
                  </div>
                </div>
              }
              <div className="torightsp icon iconfont">&#xe75b;</div>
            </div>
          </div>
          <div className="left-page-view">
            {
              readstyle === 0 ?
              <div className="read-box1">
                <div className="one-page">{nowindex}</div>
                <div className="mg-info">
                  <div className="mg-lin1">{imgs.length}P</div>
                  <div className="mg-lin1">第{imgs.length > 0 ? imgs[0].number : 0}话</div>
                </div>
              </div>
              :
              <div className="read-box2">
                {
                  setting2 ?
                  <div style={{display: "flex"}}>
                    {/* 左到右 */}
                    <div className="one-page">{(nowindex + 1) * 2}</div>
                    <div className="one-page">{nowindex * 2 + 1}</div>
                  </div>
                  :
                  <div style={{display: "flex"}}>
                    <div className="one-page">{nowindex * 2 + 1}</div>
                    <div className="one-page">{(nowindex + 1) * 2}</div>
                  </div>
                }
                <div className="mg-info">
                  <div className="mg-lin1">{imgs.length}P</div>
                  <div className="mg-lin1">第{imgs.length > 0 ? imgs[0].number : 0}话</div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Detail