import "./Type.scss"
import Mgtopnav from "../../../components/mgTop/Topnav"
import { useEffect, useState } from "react"
import { getClassify } from "../../../api/mg"
import { tothismg } from "../../../util/fnc"
import { useParams } from "react-router-dom"

function Type() {
  const params = useParams()
  const uid = params.uid

  const [booktype1, setBooktype1] = useState([
    {id: 0, text: "热血", value: "null"},
    {id: 1, text: "热血", value: "热血"},
    {id: 2, text: "热血", value: "热血"},
    {id: 3, text: "热血", value: "热血"},
    {id: 4, text: "热血", value: "热血"},
    {id: 4, text: "热血", value: "热血"},
    {id: 5, text: "热血", value: "热血"},
    {id: 6, text: "热血", value: "热血"}
  ])
  const [booktype2, setBooktype2] = useState([
    {id: 0, text: "全部", value: -1},
    {id: 1, text: "已完结", value: 1},
    {id: 2, text: "未完结", value: 0}
  ])
  const [booktype3, setBooktype3] = useState([
    {id: 0, text: "全部", value: 0},
    {id: 1, text: "从新到旧", value: 0},
    {id: 2, text: "从旧到新", value: 1},

  ])
  const [typeindex1, setTypeindex1] = useState(0),
        [typeindex2, setTypeindex2] = useState(0),
        [typeindex3, setTypeindex3] = useState(0)
  const [books, setBooks] = useState([])

  useEffect(() => {
    const getData = async () => {
      const res = await getClassify(null, -1, 0)
      console.log(res);
      
      setBooks(res)
    }
    document.title = '漫画分类'
    getData()
  }, [])

  useEffect(() => {
    const getData = async () => {
      const type1 = booktype1[typeindex1].value
      const type2 = booktype2[typeindex2].value
      const type3 = booktype3[typeindex3].value
      console.log(type1, type2, type3);
      
      const res = await getClassify(type1, type2, type3)
      setBooks(res)
    }
    getData()
  }, [typeindex1, typeindex2, typeindex3])
  return (
    <div>
      <Mgtopnav />
      <div className="classify-view">
        <div className="class-warp">
          <div className="top-calssify">
            <div className="one-classify-line">
              <span className="typical-span">题材</span>
              {
                booktype1.map((item, index) =>
                  <span className={typeindex1 === index ? "one-span one-sapn-active" : "one-span"}
                    key={item.id}
                    onClick={() => setTypeindex1(index)}
                  >{item.text}</span>
                )
              }
            </div>
            <div className="one-classify-line">
              <span className="typical-span">进度</span>
              {
                booktype2.map((item, index) =>
                  <span className={typeindex2 === index ? "one-span one-sapn-active" : "one-span"}
                    key={item.id}
                    onClick={() => setTypeindex2(index)}
                  >{item.text}</span>
                )
              }
            </div>
            <div className="one-classify-line">
              <span className="typical-span">时间</span>
              {
                booktype3.map((item, index) =>
                  <span className={typeindex3 === index ? "one-span one-sapn-active" : "one-span"}
                    key={item.id}
                    onClick={() => setTypeindex3(index)}
                  >{item.text}</span>
                )
              }
            </div>
          </div>
          <div className="book-content">
              {
                books.map(item =>
                  <div className="one-boox-box">
                    <img src={item.cover} alt="" className="book-cover"
                      onClick={() => tothismg(uid, item.mid)}
                    />
                    <div className="book-title"
                      onClick={() => tothismg(uid, item.mid)}
                    >{item.title}</div>
                    <div className="book-chapterinfos">{item.chapters}</div>
                  </div>
                )
              }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Type