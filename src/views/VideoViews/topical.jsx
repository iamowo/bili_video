import './scss/topical.scss'
import Topnav from '../../components/Topnav/Topnav'
import { useEffect, useRef, useState } from 'react'
import DynamicCom from '../../components/dynamic/dynamicCom'
import { useParams } from 'react-router-dom'
import { getDynamicByTopical, getOneTopical } from '../../api/dynamic'

function Topical () {
  const params = useParams()
  const topical = params.topical
  const userinfo = JSON.parse(localStorage.getItem('userinfo'))
  const uid = userinfo !== null ? parseInt(userinfo?.uid) : -1

  const [deleteflag, setDeletaflag] = useState(false),       // 删除一条动态
        [deletedid, setDeletedid] = useState(-1)           // 要删除的did

  const [dylist, setDylist] = useState([]),
        [topicalinfo, setTopicalinfo] = useState({}),
        [styleindex, setStyleindex] = useState(0)

  const selectline = useRef()
  let topdistance = 0
  let [show, setShow] = useState(false)
  useEffect(() => {
    const getData = async () => {
      const res = await Promise.all([getDynamicByTopical(topical, uid, 0), getOneTopical(topical)])
      setDylist(res[0])
      setTopicalinfo(res[1])
      console.log(res);
      
    }
    getData()
    topdistance = selectline.current.offsetTop
    document.title=topicalinfo?.name
    window.addEventListener('scroll', scrollfnc)
  }, [])

  const scrollfnc = (e) => {
    const h = document.body.scrollTop || document.documentElement.scrollTop
    console.log(h, topdistance);
    
    if (h > topdistance) {
      setShow(true)
    } else {
      setShow(false)
    }
    
    
  }
  return (
    <div className="topilca-view">
      <Topnav />
      <div className="topical-top-bg"></div>
      <div className="gptoptop"
        style={{visibility: show ? 'visible' : 'hidden'}}
        onClick={() => {
          window.scroll({
            top: 0,
            behavior: "smooth" 
          })
        }}
      >
        <span className="icon iconfont">&#xe637;</span>
        <span>TOP</span>
      </div>
      <div className="topical-mid-content">
        <div className="topintro">
          <div className="intro-user-line">
            <div className="use-avatar">
              <img src={topicalinfo?.avatar} alt="" className="user-avatar-img" />
            </div>
            <span className="user-name">{topicalinfo?.name}</span>
            <span>发起</span>
          </div>
          <div className="topical-title">{topicalinfo?.title}</div>
          <div className="topical-infos">
            <span style={{marginRight: '10px'}}>{topicalinfo?.watch}浏览</span>
            <span>{topicalinfo?.counts}讨论</span>
          </div>
          <div className="topical-intro">{topicalinfo?.intro}</div>
        </div>
        <div className="two-tyep-line" ref={selectline}>
          <div
            className={styleindex === 0 ? "ttl-btn1 ttl-btn1-active" : "ttl-btn1"}
            onClick={async () => {
              setStyleindex(0)
              const res = await getDynamicByTopical(topical, uid, 0)
              setDylist(res)
            }}  
          >
            <span>最热</span>
            <div className="btm-lin"></div>
          </div>
          <div
            className={styleindex === 1 ? "ttl-btn1 ttl-btn1-active" : "ttl-btn1"}
            onClick={async () => {
              setStyleindex(1)
              const res = await getDynamicByTopical(topical, uid, 1)
              setDylist(res)
            }}  
          >
            <span>最新</span>
            <div className="btm-lin"></div>
          </div>
        </div>
        <div className="btn-main-content">
          {
            dylist.map((item, index) => 
              <DynamicCom
                item={item}
                index={index}
                userinfo={userinfo}
                setDeletaflag={setDeletaflag}
                setDeletedid={setDeletedid}
                dylist={dylist}
                setDylist={setDylist}
              />
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Topical