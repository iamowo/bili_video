import { useEffect, useState } from "react"
import { getFollow } from "../../../../api/user"
import { useLocation, useOutletContext, useParams } from "react-router-dom"
import { touserspace } from "../../../../util/fnc"
import { HeightLightKw } from "../../../../util/fnc"
import Pages from "../../../../components/pages/pages"
import Noresult from '../../../../components/NoResult/Noresult'

function Follow () {
  const location = useLocation(),
        pathname = location.pathname

  const context = useOutletContext(),
        hisuid = context.hisuid,
        isme = context.isme

  const [searcjkeyword, setKeyword] = useState('')
  const [userlist, setUserlist] = useState([]),
        [olddata, setOlddata] = useState([]),
        [pagelength, setPagelength] = useState(0)

  useEffect(() => {
    const getData = async () => {
      const res = await getFollow(hisuid, 1, 10, "")      
      setOlddata(res)      
      setUserlist(res.list)
      setPagelength(res.len)
    }
    getData()
  },[])

  const tosearch = () => {
        // if (searcjkeyword.length === 0) {
    //   setUserlist(olddata.list)
    //   setPagelength(olddata.len)
    //   return
    // }
    // setUserlist(oldList.filter(item => item.name.includes(searcjkeyword)))
    // const res = await getFans(hisuid, 1, 10, searcjkeyword)
    // setUserlist(res.list)
    // setPagelength(res.len)
  }

  const entrtToSearch = (e) => {
    if (e.key === 'Enter') {
      tosearch()
    }
  }
  return (    
    <div className="follow-view">
        <div className="top-follow-line">
          <span className="tfl-span">
            {
              isme ? 
              <span>全部关注</span>
              :
              <span>TA的全部关注</span>
            }
          </span>
          <div className="right-tfl-infos">
            <div className="searchbox-rfl">
              <input type="text" className="rfl-search-top" 
                value={searcjkeyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={entrtToSearch}  
              />
              <span className="icon iconfont"
                onClick={tosearch}
              >&#xe6a8;</span>
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
                  <div className="fc-name-line"
                    data-uid={item.uid}
                    onClick={touserspace}
                  >
                  {
                    searcjkeyword.length > 0 ?
                    <span dangerouslySetInnerHTML={{__html: HeightLightKw(item.name, searcjkeyword, "span", 0)}}></span>
                    :
                    <span>{item.name}</span>
                  }
                  </div>
                  <div className="fc-intro-line">{item.intro}</div>
                </div>
                <div className="right-follow-btn">已关注</div>
              </div>
            )
          }
                    {
            userlist.length === 0 &&
            <div className="noresbox">
              <Noresult />
            </div>
          }
        </div>
        {
          pagelength > 10 &&
          <div className="bottom-page-con">
            <Pages
              uid={hisuid}
              getDataFnc={getFollow}
              num={10}
              pagelength={Math.ceil(pagelength / 10)}
              setList={setUserlist}
              pathname={pathname}
              keyword={searcjkeyword}
            />
          </div>
        }
    </div>
  )
}

export default Follow