import './rank.scss'
import { useEffect, useState } from 'react'
import Topnav from '../../components/Topnav/Topnav'
import { Link } from 'react-router-dom'
import { getRank } from '../../api/video'
import { touserspace, tovideo } from '../../util/fnc'
import Totop from '../../components/toTop/totop'

function Rank() {
  const [topindex,setTopindex] = useState(0)
  const [videolist, setVidelist] = useState([])
  const [totopflag, setToptopflag] = useState(false)

  useEffect(() => {
    const getData = async () => {
      const res = await getRank(0)
      console.log('rank list:', res);
      
      setVidelist(res)
    }
    getData()
    document.title = 'pilipili热门'

    const topdistance = 180
    window.addEventListener('scroll', () => {
      const h = document.body.scrollTop || document.documentElement.scrollTop
      if (h >= topdistance) {
        setToptopflag(true)
      } else {
        setToptopflag(false)
      }
    })
  },[])

  const tothisonernak = async (e) => {
    const index = parseInt(e.target.dataset.index || e.target.parentNode.dataset.index)
    setTopindex(index)
    const res = await getRank(index)
    setVidelist(res)
  }

  const totopb = () => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    })
  }
  return (
    <div className='rankallbox'>
      <Topnav />
      <div className="rank-outbox">
        <div className="ranktitle">
          <Link to="/rank/hot">
            <div className="onerank" 
              ata-index={0}
              onClick={tothisonernak}
            >
              <div className="cccont" data-index={0}>
                <div className="iconbox" style={{backgroundColor: '#fd7070'}}>
                  <span className='icon iconfont' style={{color: '#fff', fontSize: '15'}}>&#xe6c0;</span>
                </div>
                <span>综合热门</span>
              </div>
              {
                topindex === 0 &&
                <div className="active"></div>
              }
            </div>
          </Link>
          <Link to="/rank/history">
            <div className="onerank"
              data-index={1} 
              onClick={tothisonernak}
            >
              <div className="cccont"  data-index={1}>
                <div className="iconbox" style={{backgroundColor: '#ef8f24'}}>
                  <span className='icon iconfont'>&#xe639;</span>
                </div>
                <span>必刷榜</span>
              </div>
              {
                topindex === 1 &&
                <div className="active"></div>
              }
            </div>
          </Link>
          <Link to="/rank/all">
            <div className="onerank"
              data-index={2} 
              onClick={tothisonernak}
            >
              <div className="cccont"  data-index={2}>
                <div className="iconbox" style={{backgroundColor: '#fa719a'}}>
                  <span className='icon iconfont'>&#xe756;</span>
                </div>
                <span>排行榜</span>
              </div>
              {
                topindex === 2 &&
                <div className="active"></div>
              }
            </div>
          </Link>
        </div>
        <div className="rankintro">
          <span>各个领域中新奇好玩的优质内容都在这里~</span>
        </div>
        <div className="rankcontent">
          {
            videolist.map(item =>
              <div className="onerankbox">
                <img src={item.cover} alt="" className="rankcover" data-vid={item.vid} onClick={tovideo}/>
                <div className="rankinfos">
                  <div className="rank-title" data-vid={item.vid} onClick={tovideo}>{item.title}</div>
                  <div className="video-atag">
                    <div className="onetag">多人点赞</div>
                  </div>
                  <div className="rnak-infos1">
                    <div>
                      <span className="icon iconfont">&#xe665;</span>
                      <span className='unamesp' data-uid={item.uid} onClick={touserspace}>{item.name}</span>
                    </div>
                  </div>
                  <div className="rnak-infos1">
                      <div>
                        <span className="icon iconfont" style={{scale: '0.9'}}>&#xe6b8;</span>
                        <span>{item.plays}</span>
                      </div>
                      <div>
                        <span className="icon iconfont">&#xe666;</span>
                        <span>{item.danmus}</span>
                      </div>
                  </div>
                </div>
              </div>
            )
          }
        </div>
        <div className="bottom-line-rank">
          到底了~
        </div>
        <div className="rnak-totop" onClick={totopb} style={{opacity: totopflag ? '1' : '0'}}>
          <span className="icon iconfont">&#xe628;</span>
          <span className="rt-top">顶部</span>
        </div>
      </div>
    </div>

  )
}

export default Rank