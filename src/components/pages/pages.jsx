import { getDefaultNormalizer } from '@testing-library/react'
import './pages.scss'
import { useEffect, useState } from "react"

function Pages (props) {
  const [index, setIndex] = useState(0)
  const [enterpage, setEnterpage] = useState("")

  const pagelength = props.pagelength
  const pages = []
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
      const res = await props.getDataFnc(props.uid, index, props.num)
      props.setList(res)
    }
    getData()
  }, [index])
  return (
    <div>
      {
        // pages !== null && pages.length > 1 &&
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