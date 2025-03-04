import "./Chapter.scss"
import Mgtopnav from "../../../components/mgTop/Topnav"
import { useEffect, useRef, useState } from "react"
import { getOneMg, getChapters, addMgList, updateMgStatus, getMgs, getLastWatch } from "../../../api/mg"
import { useParams } from "react-router-dom"
import { tothiskeyword, tothismg } from '../../../util/fnc'
import Comments from "../../../components/comments/comments"
import message from "../../../components/notice/notice"

const Chapter = () => {
  const params = useParams(),
        mid = params.mid
  const userinfo = JSON.parse(localStorage.getItem('userinfo')),
        uid = userinfo.uid
  const hisuid = useRef(-1)             // 上传者的uid
  const [mginfo, setMginfo] = useState(),
        [chapters, setChapters] = useState([]),
        [chapterindex, setChapterindex] = useState(0),
        [chapterlist, setChapterlist] = useState([]),
        [lastwatch, setLastwatch] = useState(),        // 上次观看的信息
        pagenum = 50
  const [recommendlist, setRecommendlist] = useState([])
  const [ourcomments, OutComments] = useState(0)

  useEffect(() => {
    const getData = async () => {
      const res = await Promise.all([getOneMg(mid, uid), getChapters(mid, 0, pagenum), getMgs(6, 2), getLastWatch(mid, uid)])
      document.title = res[0].title
      hisuid.current = res[0].uid
      console.log('res is: ', res);
      
      setMginfo(res[0])
      // 章节
      const tempnums = []
      for(let i = 0; i < Math.ceil(res[0].chapters/ pagenum) ; i++) {
        tempnums.push(i)
      }
      setChapters(tempnums)
      setChapterlist(res[1])
      setRecommendlist(res[2])
      setLastwatch(res[3])
    }
    getData()
  },[])

  const changechapters = async (i) => {
    setChapterindex(i)
    const res = await getChapters(mid, i, pagenum)
    setChapterlist(res)
    
  }

  const tosub = async () => {
    const data = {
      uid: uid,
      mid: mid,
      type: 0
    }
    const res = await addMgList(data)
    setMginfo({
      ...mginfo,
      collected: true
    })
    message.open({type: 'info', content: '已收藏', flag: true})
  }

  const todeletesub = async () => {
    const data = {
      uid: uid,
      mid: mid,
      type: 0,
      deleted: 1
    }
    const res = await updateMgStatus(data)
    setMginfo({
      ...mginfo,
      collected: false
    })
    message.open({type: 'info', content: '已取消收藏', flag: true})
  }
  return (
    <div>
      <Mgtopnav />
      <div className="chapter-view">
        <div className="chapter-wrap">
          <div className="chapter-top-infos">
            <div className="left-cover">
              <img src={mginfo != null ? mginfo.cover : null}
                alt="" className="mg-cover" />
            </div>
            <div className="right-infos">
              <div className="info-title">{mginfo != null ? mginfo.title : null}</div>
              <div className="info-author">{mginfo != null ? mginfo.author : null}</div>
              <div className="info-tags">
                {
                  mginfo != null && mginfo.taglist.map(tag =>
                    <div className="onetag"
                      onClick={() => tothiskeyword(tag)}
                    >{tag}</div>
                  )
                }
              </div>
              <div className="cahpter-info">
                {
                  mginfo != null && mginfo.done === 1 ?
                  "已完结"
                  :
                  "未完结"
                }
                一共{mginfo != null ? mginfo.chapters : null}章
              </div>
              <div className="info-introduce">{mginfo != null ? mginfo.intro : null}</div>
              <div className="btn-line">
                <div className="read-btn">
                  {
                    lastwatch == null ?
                    <div
                      onClick={() => window.open(`/detail/${mid}/1`)}
                    >
                      <span>阅读</span>
                    </div>
                    :
                    <div>
                      <span
                        onClick={() => window.open(`/detail/${mid}/${lastwatch.watchpage + 1}`)}
                      >上次看到第{lastwatch?.watchpage + 1}话</span>
                    </div>
                  }
                </div>
                {
                  mginfo != null && mginfo.collected ?
                  <div className="follow-btn2"
                    onClick={todeletesub}
                  >
                    <span className="icon iconfont">&#xe8c6;</span>
                    <span>已收藏</span>
                  </div>
                  :
                  <div className="follow-btn1"
                    onClick={tosub}
                  >
                    <span className="icon iconfont">&#xe8c6;</span>
                    <span>收藏</span>
                  </div>
                }
              </div>
            </div>
          </div>
          <div className="chapter-btm-infos">
            <div className="left-outbox0">
              <div className="btn-left-box">
                <div className="title-chapter">章节列表</div>
                {
                  chapters.length > 1 &&
                  <div className="chapters-box1">
                    {
                      chapters.map(i =>
                        <div className={i === chapterindex ? "one-chatper-span one-chatper-span-active" : "one-chatper-span"}
                          onClick={() => changechapters(i)}
                        >{i * pagenum + 1} - {(i + 1) * pagenum}</div>
                      )
                    }
                  </div>
                }
                <div className="chapters-box2">
                  {
                    chapterlist.map(chapter =>
                      <div className="one-hapter"
                        onClick={() => window.open(`/detail/${chapter.mid}/${chapter.number}`, "target")}
                      >
                        {chapter.number}. {chapter.name}
                      </div>
                    )
                  }
                </div>
              </div>
              <div className="mgcommentbox">
                <Comments
                  mid={parseInt(mid)}
                  uid={uid}
                  hisuid={hisuid.current}
                  userinfo={userinfo}
                  commentType = {2}
                  OutComments={OutComments}
                />
              </div>
            </div>

            <div className="btn-right-box">
              <div className="brb-title">为你推荐</div>
              {
                recommendlist.map(item =>
                  <div className="one-recommend-book">
                    <img src={item.cover} alt="" className="left-re-cover"
                      onClick={() => tothismg(item.mid)}
                    />
                    <div className="right-re-infos">
                      <div className="rri-title"
                        onClick={() => tothismg(item.mid)}
                      >{item.title}</div>
                      <div className="rri-author"
                        onClick={() => tothiskeyword(item.author)}
                      >{item.author}</div>
                    </div>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chapter