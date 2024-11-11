import "./Chapter.scss"
import Mgtopnav from "../../../components/mgTop/Topnav"
import { useEffect, useRef, useState } from "react"
import { getOneMg, getChapters, addMgList, updateMgStatus, getMgs } from "../../../api/mg"
import { useParams } from "react-router-dom"
import { tothiskeyword, tothismg } from '../../../util/fnc'
import Comments from "../../../components/comments/comments"

const Chapter = () => {
  const params = useParams(),
        mid = params.mid
  const userinfo = JSON.parse(localStorage.getItem('userinfo')),
        uid = userinfo.uid
  const hisuid = useRef(-1)
  const [mginfo, setMginfo] = useState(),
        [chapters, setChapters] = useState([]),
        [chapterindex, setChapterindex] = useState(0),
        [chapterlist, setChapterlist] = useState([]),
        pagenum = 50
  const [recommendlist, setRecommendlist] = useState([])
  const [ourcomments, OutComments] = useState(0)

  useEffect(() => {
    const getData = async () => {
      const res = await getOneMg(mid, 1)
      hisuid.current = res.uid
      console.log(res);
      setMginfo(res)
      // 章节
      const tempnums = []
      for(let i = 0; i < Math.ceil(res.chapters/ pagenum) ; i++) {
        tempnums.push(i)
      }
      setChapters(tempnums)

      const res2 = await getChapters(mid, 0, pagenum)
      setChapterlist(res2)

      const res3 = await getMgs(6, 2);
      setRecommendlist(res3)

      document.title = res.title
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
                <div className="read-btn">阅读</div>
                {
                  mginfo != null && mginfo.collected ?
                  <div className="follow-btn2"
                    onClick={todeletesub}
                  >
                    <span className="icon iconfont">&#xe8c6;</span>
                    <span>取消收藏</span>
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
                      onClick={() => tothismg(uid, item.mid)}
                    />
                    <div className="right-re-infos">
                      <div className="rri-title"
                        onClick={() => tothismg(uid, item.mid)}
                      >{item.title}</div>
                      <div className="rri-author"
                        onClick={() => tothiskeyword(uid, item.author)}
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