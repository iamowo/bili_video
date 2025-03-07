
import "./Home.scss"
import Mgtopnav from "../../../components/mgTop/Topnav"
import { getMgs, getMgImgsRandom } from "../../../api/mg"
import { useEffect, useState } from "react"
import { tothismg, tothiskeyword } from "../../../util/fnc"

function Mghome() {
  const userinfo = JSON.parse(localStorage.getItem("userinfo")),
        uid = userinfo?.uid

  const [nowindex, setNowindex] = useState(0)
  const [recommendlist, setRecommendlist] = useState([])
  const [randomImg, setReandoming] = useState([])

  useEffect(() => {
    const gatData = async () => {
      const res1 = await getMgs(7, 0)
      setRecommendlist(res1)
      const res2 = await getMgImgsRandom(res1[0].mid, 1, 5)
      setReandoming(res2)
    }
    gatData()
    document.title = '漫画'
    const timer = setInterval(() => {
      setNowindex(n => {
        if (n < 6) {
          return n + 1
        } else if (n >= 6) {
          return 0
        }
      }
      )
    }, 3000)
  },[])

  useEffect(() => {
    const change = async () => {
      const res2 = await getMgImgsRandom(recommendlist[nowindex].mid, 1, 5)
      setReandoming(res2)
    }
    if (recommendlist.length > 0) {
      change()
    }
    // console.log(nowindex);
  }, [nowindex])
  return (
    <div>
      <Mgtopnav />
      <div className="home-view">
        <div className="home-warp-box">
          <div className="home-title">
            <div className="title-left">热门推荐</div>
          </div>
          <div className="recommend-box">
            <div className="recommend-box1">
              <div className="info-box1">
                <div className="info-title">{recommendlist.length > 0 ? recommendlist[nowindex].title : ""}</div>
                <div className="info-tags">
                  {
                    recommendlist.length > 0 && recommendlist[nowindex].taglist.map(item =>
                      <div className="one-tag-box"
                        onClick={() => tothiskeyword(uid, item)}
                      >{item}</div>
                    )
                  }
                </div>
                <div className="intros">{recommendlist.length > 0 ? recommendlist[nowindex].intro : ""}</div>
                <div className="mgs">
                  {
                    recommendlist.map((item, index) =>
                      <div className={nowindex === index ? "one-mg one-mg-active" : "one-mg"}
                        onClick={() =>
                          setNowindex(index)
                        }
                      >
                        <img src={item.cover} alt="" className="one-cover" />
                      </div>
                    )
                  }
                </div>
              </div>
            </div>
            <div className="recommend-box2">
              <div className="img-box">
                {
                  randomImg.map(item =>
                    <img src={item.path} alt="" className="mg-one-imgtolook" />
                  )
                }
              </div>
              <div className="start-to-read icon iconfont"
                onClick={() => window.open(`/chapter/${randomImg[nowindex].mid}`)}
              >&#xe60f;</div>
            </div>
          </div>
          <div className="home-title">
            <div className="title-left">我的收藏</div>
            <div className="more-span icon iconfont"
              onClick={() => window.open(`/userspace/${uid}/favorite`, "_blank")}
            >更多 &#xe649;</div>
          </div>
          <div className="book-line-box">
            {
              recommendlist.map(item =>
                <div className="one-book-box">
                  <div className="book-img-box">
                    <img src={item.cover} alt="" className="book-cover"
                      onClick={() => tothismg(item.mid)}
                    />
                    <div className="book-tag-line">
                      <div className="one-book-tag"></div>
                    </div>
                  </div>
                  <div className="book-infos">
                    <div className="div-title-line"
                      onClick={() => tothismg(item.mid)}
                    >{item.title}</div>
                    <div className="div-chapter-line">
                      {
                        item.done ?
                        <span>已完结,一共{item.chapters}话</span>
                        :
                        <span>更新中,更新至{item.chapters}话</span>
                      }
                    </div>
                  </div>
                </div>
              )
            }
          </div>
          <div className="home-title">
            <div className="title-left">最近更新</div>
          </div>
          <div className="book-line-box">
            {
              recommendlist.map(item =>
                <div className="one-book-box">
                <div className="book-img-box">
                  <img src={item.cover} alt="" className="book-cover"
                    mid={item.mid}
                    uid={uid}
                    onClick={() => tothismg(item.mid)}
                  />
                  <div className="book-tag-line">
                    <div className="one-book-tag"></div>
                  </div>
                </div>
                <div className="book-infos">
                  <div className="div-title-line"
                    mid={item.mid}
                    uid={uid}
                    onClick={() => tothismg(item.mid)}
                  >{item.title}</div>
                  <div className="div-chapter-line">
                    {
                      item.done ?
                      <span>已完结,一共{item.chapters}话</span>
                      :
                      <span>更新中,更新至{item.chapters}话</span>
                    }
                  </div>
                </div>
              </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Mghome