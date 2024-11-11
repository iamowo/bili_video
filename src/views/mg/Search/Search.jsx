import "./Search.scss"
import Mgtopnav from "../../../components/mgTop/Topnav"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { searchMg } from "../../../api/mg"
import { tothismg, tothiskeyword } from "../../../util/fnc"

function Searchmg() {
  const params = useParams(),
        keyword = params.keyword

  const [books, setBooks] = useState([])

  useEffect(() => {
    const getData = async () => {
      const res = await searchMg(keyword)
      console.log(res);
      
      setBooks(res)
    }
    getData()
    document.title = `${keyword} - | 搜索结果`
  }, [])
  return (
    <div>
      <Mgtopnav />
      <div className="searrch-view">
        <div className="search-warp">
          {
            books.length > 0 ?
            <div className="search-result">
              <span style={{color: "#32aeec"}}>{keyword} </span>
              的搜索结果({books.length})</div>
            :
            <div className="search-result">没有
              <span style={{color: "#32aeec"}}>{keyword} </span>
            的搜索结果</div>
          }
          <div className="search-content">
            {
              books.map(item =>
                <div className="one-result">
                  <img src={item.cover} alt="" className="limg" 
                    onClick={() => tothismg(item.mid)}
                  />
                  <div className="rightinfo">
                    <div className="title1"
                      onClick={() => tothismg(item.mid)}
                    >{item.title}</div>
                    <div className="authorline"
                      onClick={() => tothiskeyword(item.title)}
                    >{item.author}</div>
                    <div className="tagsline">
                      {
                        item.taglist.map(tag =>
                          <div className="onetag"
                            onClick={() => tothiskeyword(tag)}
                          >{tag}</div>
                        )
                      }
                    </div>
                    <div className="chapterline">
                      {
                        item.done === 1?
                        <div>已完结,共{item.chapters}章</div>
                        :
                        <div>连载中,更新至{item.chapters}章</div>
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

export default Searchmg