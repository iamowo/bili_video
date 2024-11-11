import "./Ranking.scss"
import Mgtopnav from "../../../components/mgTop/Topnav"
import { useState } from "react"
import { useEffect } from "react"
import { getMgRanking } from "../../../api/mg"
import { tothismg } from "../../../util/fnc"
import { useParams } from "react-router-dom"

function Ranking() {
  const params = useParams()
  const uid = params.uid
  const [leftindex, setLefindex] = useState(0)
  const [books, setBooks] = useState([])

  useEffect(() => {
    const getData = async () => {
      const res = await getMgRanking(0)
      setBooks(res)
    }
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const res = await getMgRanking(leftindex)
      setBooks(res)
    }
    getData()
        document.title = '漫画排行榜'
  }, [leftindex])
  return (
    <div>
      <Mgtopnav />
      <div className="ranking-view">
        <div className="ranking-warp">
          <div className="ranking-text">
            <div className={leftindex === 0 ?"one-type one-type-active" : "one-type"}
              onClick={() => setLefindex(0)}
            >阅读榜</div>
            <div className={leftindex === 1 ?"one-type one-type-active" : "one-type"}
              onClick={() => setLefindex(1)}
            >收藏榜</div>
          </div>
          <div className="book-content">
              {
                books.map((item, index) =>
                  <div className="one-boox-box">
                    <div className="number-box">{index}</div>
                    <img src={item.cover} alt="" className="book-cover" 
                      onClick={() => tothismg(uid, item.mid)}
                    />
                    <div className="bookinfos-b">
                      <div className="book-title"
                        onClick={() => tothismg(uid, item.mid)}
                      >{item.title}</div>
                      <div className="book-chapterinfos">{item.author}</div>
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

export default Ranking