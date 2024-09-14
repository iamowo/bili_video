import './dynamic.scss'
import DynamicCom from "../../../components/dynamic/dynamicCom"
import { useEffect, useState } from 'react'
import { getDyanmciList } from '../../../api/dynamic'
import { tovideo, touserspace } from '../../../util/fnc'

function Dynamic () {
  const userinfo = JSON.parse(localStorage.getItem('userinfo'))
  const uid = userinfo.uid

  const [dynamiclist, setDylist] = useState([])

  useEffect(() => {
    const getData = async() => {
      const res = await getDyanmciList(uid, 0);
      console.log(res);
      
      setDylist(res)
    }

    getData()
  },[])

  return (
    <div className="user-dynamic">
      <div className="dynamic-left-content">
          {
            dynamiclist.map(item => 
              <div className="onedynamic" key={item.id}>
                <div className="dy-left-box">
                  <img src={item.avatar} alt="" className="dy-useravatar" />
                </div>
                <div className="dy-right-box">
                  <div className="dy-toptitle">
                    <div className="dy-top1">{item.name}</div>
                    <div className="dy-top2">{item.time}</div>
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
          }
          <div className="dynamic-bottom-span">没有更多了~</div>
        </div>
      <div className="dynamic-right-content">
        <div className="rightuserinfo">
          <div className="introtitle">
            <span>个人资料</span>
            {true &&
              <div className="editorinfs"
              onClick={() => window.open(`/${uid}/account/home`, '_blank')}>
                编辑资料
              </div>
            }
          </div>
          <div className="btinfosshow">
            <div className='oneinfo'>
              <span>UID</span>
              <span>{userinfo.uid}</span>
            </div>
            <div className='oneinfo'>
              <span>生日</span>
              <span>{userinfo.birthday}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dynamic