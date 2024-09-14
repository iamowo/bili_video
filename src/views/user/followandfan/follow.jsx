import { useEffect, useState } from "react"
import { getFollow } from "../../../api/user"
import { useParams } from "react-router-dom"
import { touserspace } from "../../../util/fnc"

function Follow () {
  const params = useParams()
  const uid = params.uid

  const [searcjkeyword, setKeyword] = useState('')
  const [pagelist, setPagelist] = useState([
    {id: 1},
    {id: 1},
    {id: 1},
    {id: 3}
  ])
  const [userlist, setUserlist] = useState([])
  useEffect(() => {
    const getData = async () => {
      const res = await getFollow(uid)
      setUserlist(res)
    }
    getData()
  },[])
  const tosearch = () => {

    setKeyword('')
  }
  return (    
    <div className="follow-view">
        <div className="top-follow-line">
          <span className="tfl-span">全部关注</span>
          <div className="right-tfl-infos">
            <div className="searchbox-rfl">
              <input type="text" className="rfl-search-top" 
                value={searcjkeyword}
                onChange={(e) => setKeyword(e.target.value)}/>
              <span className="icon iconfont" onClick={tosearch}>&#xe6a8;</span>
            </div>
          </div>
        </div>
        <div className="follow-content">
          {
            userlist.map(item =>
              <div className="one-follow">
                <div className="left-fc-avatar">
                  <img src={item.avatar} alt="" className="user-ava-fc"
                    data-uid={item.uid} onClick={touserspace}/>
                </div>
                <div className="right-fc-infos">
                  <div className="fc-name-line" data-uid={item.uid} onClick={touserspace}>{item.name}</div>
                  <div className="fc-intro-line">{item.intro}</div>
                </div>
                <div className="right-follow-btn">已关注</div>
              </div>
            )
          }
        </div>
        {
        // alllist.length > 36 &&
        true &&
        <div className="bottom-page-con">
          <div className="bpl-lastpage">上一页</div>
          <div className="page-allcontent">
            {
              pagelist.map((item, index) =>
                <div key={index} className={index === 1 ? "opepage-active onepage-se" : "onepage-se"}>{index + 1}</div>
              )
            }
          </div>
          <div className="bpl-nextpage">下一页</div>
        </div>
      }
    </div>
  )
}

export default Follow