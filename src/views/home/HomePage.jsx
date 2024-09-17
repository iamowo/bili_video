import './HomePage.scss'
import Topnav from '../../components/Topnav/Topnav.jsx'
import { useRef, useState, useEffect } from 'react';
import { getAllVideo, getRandom } from '../../api/video.js';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { touserspace, tovideo } from '../../util/fnc.js';
import { SassColor } from 'sass';
import { baseurl } from '../../api/index.js';

function Bnaaer () {
  const [nindex, setNindex] = useState(0)
  const [movex, setMovex] = useState(0)
  const [bannerlist, setBanner] = useState([
    {id: 1, src: baseurl + '/sys/b1.jpg'},
    {id: 2, src: baseurl + '/sys/b2.jpg'},
    {id: 3, src: baseurl + '/sys/b3.jpg'},
    {id: 4, src: baseurl + '/sys/b4.jpg'},
    {id: 5, src: baseurl + '/sys/b5.jpg'},
  ])
  
  let timer = null
  
  const initialSettimeout = () => {
    timer = setTimeout(() => {
      toright()
    }, 3000)
  }

  useEffect(() => {
    initialSettimeout()

    return () => {
      clearTimeout(timer)
    }
  }, [])
  const toleft = () => {
    if (nindex === 0) {
      setNindex(bannerlist.length - 1);
      setMovex(bannerlist.length - 1)
    } else {
      setNindex(nindex - 1)
      setMovex(nindex - 1)
    }
  }
  const toright = () => {
    if (nindex === bannerlist.length - 1) {
      setNindex(0);
      setMovex(0)
    } else {
      setNindex(nindex + 1)
      setMovex(nindex + 1)
    }
  }

  const tothispoint = (e) => {
    const now = parseInt(e.target.dataset.ind || e.target.parentNode.dataset.ind)    
    setNindex(now)
    setMovex(now)
  }

  //
  const menter = () => {
    console.log('enter');    
    clearTimeout(timer)
    timer = null
  }

  const mleave = () => {
    console.log('leave');
    clearTimeout(timer)
    initialSettimeout()
  }

  return (
    <div className="bannerout">
      <div className="bannerinner"
        onMouseEnter={menter}
        onMouseLeave={mleave}>
        <div className="onebannerimg">
          <div className="imgpart">
            <div className="imgs-out-box"
            style={{translate: -100 * movex + '% 0px'}}>
            {
              bannerlist.map((item, index) =>
                <img key={index}  src={item.src} alt="" className="thisbannerimg" />
              )
            }
            </div>
          </div>
          <div className="btinfo">
            <div className="infosline">
              <div className="lp">
                <div className="tp">test1{movex}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="lipart">
          <ul className="ul-a">
            {
              bannerlist.map((item, index) =>
                <li key={index} className={index === nindex ? 'oneli li-active' : 'oneli'}
                  data-ind={index}
                  onClick={tothispoint}>
                  <div className='li-innerbox'></div>
                </li>
              )
            }
          </ul>
        </div>
        <div className="rp">
          <div className="tol icon iconfont" onClick={toleft} style={{rotate: '-180deg'}}>&#xe775;</div>
          <div className="tor icon iconfont" onClick={toright}>&#xe775;</div>
        </div>
      </div>
    </div>
  )
}

function Nav2 () {
  const userinfo = JSON.parse(localStorage.getItem('userinfo'))
  const uid = parseInt(userinfo != null && userinfo != "" ? userinfo.uid : -1)

  const todynamicview = () => {
    if (uid === -1) {
      alert('请先登录')
      return
    }
    window.open(`dynamicM/${uid}`, '_blank')
  }

  const tothisone = (e) => {
    if (e.target.className === "item") {
      const tag = e.target.textContent
      window.open(`/channels/${tag}`, '_blank')
    } else if (e.target.className === "item icon iconfont") {
      window.open('/alltag', "_blank")
    }
    
  }
  return (
    <div className="nav2">
      <div className="navleft">
          <div className="nl1" onClick={todynamicview}>
            <div className="topn2 icon iconfont">&#xe608;</div>
            <span>动态</span>
          </div>
        <Link to="/rank/hot">
          <div className="nl1">
          <div className="topnl icon iconfont">&#xe6c0;</div>
            <span>热门</span>
          </div>
        </Link>
      </div>
      <div className="navmid" onClick={tothisone}>
        <div className="item">番剧</div>
        <div className="item">国创</div>
        <div className="item">综艺</div>
        <div className="item">动画</div>
        <div className="item">鬼畜</div>
        <div className="item">舞蹈</div>
        <div className="item">娱乐</div>
        <div className="item">科技</div>
        <div className="item">美食</div>
        <div className="item">汽车</div>
        <div className="item">运动</div>
        <div className="item">VLOG</div>
        <div className="item">电影</div>
        <div className="item">电视剧</div>
        <div className="item">纪录片</div>
        <div className="item">游戏</div>
        <div className="item">音乐</div>
        <div className="item">影视</div>
        <div className="item">知识</div>
        <div className="item">资讯</div>
        <div className="item">生活</div>
        <div className="item">搞笑</div>
        <div className="item">动物圈</div>
        <div className="item icon iconfont">更多 &#xe624;</div>
      </div>
      <div className="navright">
        <div className="oneitem">专栏</div>
        <div className="oneitem">活动</div>
        <div className="oneitem">社区中心</div>
        <div className="oneitem">直播</div>
        <div className="oneitem">音乐</div>
        <div className="oneitem">课堂</div>
      </div>
    </div>
  )
}
function Video (props) {
  // 用户uid
  const uid = 1
  const data = props.data
  const [playflag, setPlay] = useState(false)       // 进入
  const videoref = useRef()
  const [nowtime ,setNowTime] = useState('00:00')   // 视频进度时间
  
  const [videoindex, setVideoindex] = useState(0)   // 悬浮播放index

  let timer = null
  // 悬浮鼠标，播放视频
  const hangtoplayvideo = (e) => {
      timer = setTimeout(() => {
        setPlay(true)    
        const thisvideo = e.target.parentNode.querySelector(".hangtoplay")
        console.log('enter==', thisvideo);
        const src = thisvideo.dataset.src != null ? thisvideo.dataset.src : null             // 播放地址   
        console.log(".....src:", src);
        thisvideo.src = src
        thisvideo.addEventListener("loadedmetadata", canlplayfnc(thisvideo))
      },300)
  }

  // 视频可以播放
  const canlplayfnc = (thisvideo) => {
    setTimeout(() => {
      if (playflag === false || playflag === 0) {        
        console.log('thisvideo:', thisvideo);
          thisvideo.play()
      }
    }, 200)
  }

  const playing  = () => {
    const duration = Math.floor(videoref.current.duration)
    const now = Math.floor(videoref.current.currentTime)
    let mm = Math.floor(now / 60) > 10 ? '' + Math.floor(now / 60) : '0' + Math.floor(now / 60)
    let ss = now % 60 > 10 ? '' + Math.floor(now % 60) : '0' + now % 60
    if (now >= 3600) {
      let hh = Math.floor(now / 3600) > 10 ? '' + Math.floor(now / 3600) : '0' + Math.floor(now/ 3600)
      setNowTime(hh + ":" + mm + ":" + ss)
    } else {
      setNowTime(+ mm + ":" + ss)
    }
  }

  // 离开视频，停止播放
  const leavetostop = (e) => {
    console.log('leave==');
    if (timer != null) {
      clearTimeout(timer)
      timer = null
      return
    }
    const thisvideo = e.target.parentNode.querySelector(".hangtoplay")
    thisvideo.src = null
    thisvideo.removeEventListener("loadedmetadata", canlplayfnc(thisvideo))
    setPlay(false)
  }

  // 添加到稍后再看
  const addlaterwatch = (e) => {
    const vid = e.target.dataset.vid
    console.log('233');
  }

  return (
    <div className="onevideo" style={{marginTop: props.style1 === 'yes' ? '40px' : '0'}}>
      <div className="videoimg"
        data-path={data.path}
        data-index={props.index}
        onMouseEnter={hangtoplayvideo}
        onMouseLeave={leavetostop}
        data-vid={data.vid} onClick={tovideo}>
        {
          playflag &&
          <div className="addlaterwatch"
            data-vid = {data.vid}
            onClick={addlaterwatch}>
            <div className="icondiv icon iconfont">&#xe646;</div>
            <div className="moreleft">添加至稍后再看</div>
          </div>
        }
        <video
          src="" data-src={data.path} preload="auto" muted  className="hangtoplay" 
          ref={videoref}
          style={{zIndex: playflag ? '1' : '0'}}
          data-vid={data.vid}
          onTimeUpdate={playing}
          onClick={tovideo}
        ></video>
        <img src={data.cover} alt="" data-vid={data.vid} className="vidimg"
          style={{zIndex: playflag ? '0' : '1'}}
          onClick={tovideo}
        />
        <div className="infos" data-vid={data.vid}
          style={{justifyContent: playflag ? 'end' : 'space-between'}}
        >
          <div className="left"  style={{display: playflag ? 'none' : 'flex'}}>
            <div className="leftdiv">
              <span className="icon iconfont" style={{marginTop: '2px'}}>&#xe6b8;</span>
              <span className="lefttext">{data.plays}</span>
            </div>
            <div className="leftdiv">
              <span className="icon iconfont" style={{fontSize: '17px'}}>&#xe666;</span>
              <span className="lefttext">{data.danmus}</span>
            </div>
          </div>
          <div className="right">
            <span className="protime" style={{display: playflag ? 'inline-block' : 'none'}}>{nowtime} /</span>
            <span> {data.vidlong}</span>
          </div>
        </div>
      </div>
      <div className="title" data-vid={data.vid} onClick={tovideo}>{data.title}</div>
      <div className="author">
        <div className="lspan1" data-uid={data.uid} onClick={touserspace}>
          <span className="icon iconfont" style={{marginTop: '2px'}}>&#xe665;</span>
          <span>{data.name}</span>
        </div>
        <span className='icon iconfont point'>&#xec1e;</span>
        <span>{data.time.slice(0, 10)}</span>
      </div>
    </div>
  )
}

function Home() {

  // 在父组件中定义， 子组件也可以是使用
  const navigate = useNavigate()

  // 要赋值为数组形式， 否则没有map方法，会报错
  const [recommendlist, setRecommend] = useState([])
  const [videolist, setVideolist] = useState([])
  // 获取数据
  useEffect(() => {
    document.title = 'pilipili'
    const getData = async() => {      
      const result = await Promise.all([getAllVideo(), getRandom()])
      console.log(result);
      for (let i = 0; i < result[0].length; i++) {        
        // let blob = new Blob(result[0][i].path, 'video/' + result[0][i].path.split('.')[1])
        // result[0][i].path = URL.createObjectURL(blob)
      }
      setVideolist(result[0])
      setRecommend(result[1])
    }
    getData();
  },[])
  
  const totopmove = () => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    })
  }
  return (
    <div className="conbox">
      <Topnav></Topnav>
      <div className="mainbox">
      <Nav2 />
        <div className="innerbox">
          <div className="changpart">
            <div className="icon iconfont" style={{fontSize: '15px'}}>&#xe614;</div>
            <span className="changspan2">换一换</span>
            </div>
          <div className="bottompart">
            <div className="bbox1 icon iconfont b1">&#xe646;</div>
            <div className="bbox1 icon iconfont b2">&#xe615;</div>
            <div className="bbox1 bx2" onClick={totopmove}>
              <div className='icon iconfont'>&#xe628;</div>
              <div className='totoptext'>顶部</div>
            </div>
          </div>
          <div className="bannerpart">
            <Bnaaer />
          </div>
          <div className="toprecbox">
          {
            recommendlist.map((item, index) => 
              <Video key={item.vid} 
              data={item}
              index={index}
              />
              // <div key={item.vid} className="onevideo">{item.vid}</div>
            )
          }
          </div>
          {
            videolist.map((item, index) => 
              <Video key={item.vid} 
              data={item}
              index={index}
              style1="yes"/>
              // <div key={item.vid} className="onevideo">{item.vid}</div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Home