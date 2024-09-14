import './history.scss'
import Topnav from '../../components/Topnav/Topnav'
import { useEffect, useState } from 'react'
import { getHistory, deleteHistory, deleteAll } from '../../api/video'
import { touserspace, tovideo } from '../../util/fnc'

function History () {
  const userinfo = JSON.parse(localStorage.getItem('userinfo'))
  const uid = userinfo.uid

  const [hislist, setHislist] = useState([])

  useEffect(() => {
    const getData = async () => {
      const res = await getHistory(uid);
      console.log(res);
      
      if (res) {
        setHislist(res)
      }
    }
    getData()
  },[])

  const deletethis = async(e) => {
    const vid = e.target.dataset.vid
    const res = await deleteHistory(uid, vid)
    if (res) {
      console.log('delete success');
      
    }
  }

  const deleteAllhis = async() => {
    const res = await deleteAll(uid)
    if (res) {
      console.log('delete success');
      
    }
  }

  return (
    <div className="history-all">
      <Topnav />
      <div className="history-main">
        <div className="histitle">
          <div className='div-left1'>
            <div className="icon iconfont" style={{fontSize: '30px'}}>&#xe6db;</div>
            <span className='titlespan'>历史记录</span>
          </div>
          <div className="rightbox-opation">
            <div className="search-box">
              <div className="icon iconfont">&#xe6a8;</div>
              <input type="text" className="inptext" />
            </div>
            <div className="stop-histopry">暂停历史记录</div>
            <div className="stop-histopry" onClick={deleteAllhis}>清除历史</div>
          </div>
        </div>
        {
          hislist.map((item) =>
            <div className="one-history" key={item}>
              <div className="oh-left1"></div>
              <div className="oh-left2">
                <div className="lefticon"></div>
                <span>{item.time.slice(11, 16)}</span>
              </div>
              <img src={item.cover} alt="" className="history-img" data-vid={item.vid} onClick={tovideo}/>
              <div className="oh-left3">
                <div className="deleteit icon iconfont" data-vid={item.vid} onClick={deletethis}>&#xe61d;</div>
                <div className="history-title" data-vid={item.vid} onClick={tovideo}>{item.title}</div>
                <div className="bottom-infos">
                  <div className="watchtime">
                    <span className="timeinfo" style={{marginRight: "10px"}}>看到</span>
                    <span className="timeinfo">{item.watchtype}</span>
                  </div>
                  <div className="videoinfobox">
                    <img src={item.upavatar} alt="" className="littleuseravatar" data-uid={item.uid} onClick={touserspace}/>
                    <span className="little-name" data-uid={item.uid} onClick={touserspace}>{item.upname}</span>
                    <div className="icondiva"></div>
                    <span className="maintag">{item.tag}</span>
                  </div>
                </div>
              </div>
            </div>   
          )
        }
      </div>
    </div>
  )
}

export default History