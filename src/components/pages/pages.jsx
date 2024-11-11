import { Navigate, useNavigate } from 'react-router-dom'
import './pages.scss'
import { useEffect, useState } from "react"

function Pages (props) {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const [enterpage, setEnterpage] = useState("")
  const pagelength = props.pagelength  
  const pages = []
  const getDataFnc = props.getDataFnc,
        uid = props.uid,
        num = props.num,
        setList = props.setList,
        pathname = props.pathname,
        keyword = props.keyword
        
  for (let i = 0; i < pagelength; i++) {
    pages.push({id: `${i}`})
  }

  const entertosearch = (e) => { 
    if (e.key === 'Enter' && !e.shiftKey) {
      const regPos = /^[0-9]+.?[0-9]*/; //判断是否是数字。
      if (regPos.test(enterpage)) {
        if (+enterpage > 0 && +enterpage <= pages.length) {
          setIndex(+enterpage - 1)
        }
      }
      setEnterpage("")
    }
  }

  useEffect(() => {    
    const getData = async () => {
      const res = await getDataFnc(uid, index + 1, num, keyword)
      setList(res.list)
      navigate(`${pathname}?page=${index + 1}&num=${num}`)
      window.scroll({
        top: 0
      })
    }
    getData()
  }, [index])
  return (
    <div>
      {
        <div className="page-out">
          {
            index > 0 &&
            <div className="changpages"
              onClick={() => {setIndex(index - 1)}}
            >上一页</div>
          }
            <div className={index ===  0 ? "onepage onepage-active" : "onepage"}
              onClick={() => setIndex(0)}
            >{1}</div>
            {
              pages.length > 4 && index > 3 &&
                <div className="blanketbox icon iconfont">&#xe623;</div>
            }        
            {
              pages.map((item, i) => {
                  if (i > 0 && i < pages.length - 1 && i >= index - 2 && i <= index + 2) {
                    return (
                      <div className={index === i ? "onepage onepage-active" : "onepage"}
                        key={i}
                        onClick={() => setIndex(i)}
                      >{i + 1}</div>
                    )
                  }
                }
              )
            }
            {
              pages.length > 4 && index < pages.length - 4 &&
                <div className="blanketbox icon iconfont">&#xe623;</div>
            }
            <div className={index ===  pages.length - 1 ? "onepage onepage-active" : "onepage"}
              onClick={() => setIndex(pages.length - 1)}
            >{pages.length}</div>
          {
            index < pages.length - 1 &&
              <div className="changpages"
                onClick={() => {setIndex(index + 1)}}
              >下一页</div>
          }
          <div className="pageinfos">
              <span>共{pages.length}页面,跳至</span>
              <input type="text" className="pageinp"
                value={enterpage}
                onChange={(e) => setEnterpage(e.target.value)}
                onKeyDown={entertosearch}
              />
              <span>页</span>
          </div>
        </div>
      }
    </div>
  )
}

export default Pages