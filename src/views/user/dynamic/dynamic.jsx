import './dynamic.scss'
import DynamicCom from "../../../components/dynamic/dynamicCom"
import { useEffect, useState } from 'react'
import { getDyanmciList } from '../../../api/dynamic'
import { tovideo, touserspace } from '../../../util/fnc'
import { useParams } from 'react-router-dom'
import { getByUid } from '../../../api/user'
import { baseurl } from '../../../api'

function Dynamic () {
  const params = useParams()
  const [userinfo, setUserinfo] = useState(() => localStorage.getItem('userinfo'))
  const hisuid = parseInt(params.uid)
  const myinfo = JSON.parse(localStorage.getItem('userinfo'))
  const myuid = myinfo != null ? parseInt(myinfo.uid) : parseInt(-1)
  const isme = hisuid === myuid

  const [dynamiclist, setDylist] = useState([])
  useEffect(() => {
    const getData = async() => {
      const res = await getDyanmciList(hisuid, 0);
      setDylist(res)

      const res2 = await getByUid(hisuid)
      setUserinfo(res2)
    }

    getData()
  },[])

  return (
    <div className="user-dynamic">
      <div className="dynamic-left-content">
          {/* {
            dynamiclist.map(item => 
              <div className="onedynamic" key={item.id}>
                <div className="dy-left-box">
                  <img src={item.avatar} alt="" className="dy-useravatar" />
                </div>
                <div className="dy-right-box">
                  <div className="dy-toptitle">
                    <div className="dy-top1">{item.name}</div>
                    <div className="dy-top2">{item.time.slice(0, 10)}</div>
                  </div>
                  <div className="dy-onecontentbox">
                    <div className="dy-text">{item.content}</div>
                    {
                      item.imgs[0] != null &&
                      <div className="dy-imgs">
                        {
                          item.imgs.map((item2) =>
                            <img key={item2} src={item2} alt="" className="dy-imgs-oneimgxs" />                          
                          )
                        }
                      </div>
                    }
                    <div className="dy-infos">
                      <div className="dy-oneinfos-opation">
                        <span className="icon iconfont">&#xe633;</span>
                        {
                          item.shares > 0 ?
                          <span>{item.shares}</span>
                          :
                          <span>转发</span>
                        }
                      </div>
                      <div className="dy-oneinfos-opation">
                        <span className="icon iconfont">&#xe648;</span>
                        {
                          item.comments > 0 ?
                          <span>{item.comments}</span>
                          :
                          <span>评论</span>
                        }
                      </div>
                      <div className="dy-oneinfos-opation">
                        <span className="icon iconfont">&#xe61c;</span>
                        {
                          item.likes > 0 ?
                          <span>{item.likes}</span>
                          :
                          <span>点赞</span>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          } */}
          {
            dynamiclist.map((item, index) => 
              <DynamicCom 
                item={item}
                index={index}
                userinfo={userinfo}
              />
            )
          }
          {
            dynamiclist.length > 0 ?
            <div className="dynamic-bottom-span">没有更多了~</div>
            :
            <div className="noresult-videw">
              <div className="noresult-img"
                style={{background: `url(${baseurl}/sys/nodata02.png)`,
                                    backgroundPosition: 'center 50px',
                                    backgroundRepeat: 'no-repeat'}}>
              </div>
            </div>
          }
        </div>
      <div className="dynamic-right-content">
        <div className="rightuserinfo">
          <div className="introtitle">
            <span>个人资料</span>
            {
              isme &&
              <div className="editorinfs"
              onClick={() => window.open(`/${hisuid}/account/home`, '_blank')}>
                编辑资料
              </div>
            }
          </div>
          <div className="btinfosshow">
            <div className='oneinfo'>
              <span>UID</span>
              <span>{userinfo != null ? userinfo.hiduid : null}</span>
            </div>
            <div className='oneinfo'>
              <span>生日</span>
              <span>{userinfo != null ? userinfo.birthday : null}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dynamic