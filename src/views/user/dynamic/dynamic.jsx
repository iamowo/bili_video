import './dynamic.scss'
import DynamicCom from "../../../components/dynamic/dynamicCom"
import { useEffect, useState } from 'react'
import { getDyanmciList } from '../../../api/dynamic'
import { tovideo, touserspace } from '../../../util/fnc'
import { useOutletContext, useParams } from 'react-router-dom'
import { getByUid } from '../../../api/user'
import { baseurl } from '../../../api'

function Dynamic () {
  const context = useOutletContext()
  const myinfo = context.myinfo,
        myuid = parseInt(context.myuid)

  const hisinfo = context.hisinfo,
      hisuid = parseInt(context.hisuid),
      setUserinfo = context.setUserinfo
  const isme = context.isme

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
          {
            dynamiclist.map((item, index) => 
              <DynamicCom 
                item={item}
                index={index}
                userinfo={myinfo}
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
              <span>{hisinfo?.hiduid}</span>
            </div>
            <div className='oneinfo'>
              <span>生日</span>
              <span>{hisinfo?.birthday}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dynamic