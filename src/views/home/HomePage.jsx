import './HomePage.scss'
import Topnav from '../../components/Topnav/Topnav.jsx'
import { useRef, useState, useEffect, memo } from 'react';
import { getSomeVideos, getRandom, getAllClassify } from '../../api/video.js';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { touserspace, tovideo } from '../../util/fnc.js';
import { baseurl } from '../../api/index.js';
import message from '../../components/notice/notice.jsx';
import { throttle } from '../../util/fnc.js';
import Banner from '../../components/Banner/Banner.jsx';

const MemoNav2 = memo(
  function Nav2 (props) {    
    const uid = props.uid
    const [classifys, setClassify] = useState([])
    const todynamicview = () => {
      if (uid === -1) {
        message.open({ type: 'warning', content: '请先登录'})
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

    useEffect(() => {
      const getData = async () => {
        const res = await getAllClassify()
        setClassify(res)
      }
      getData()
    }, [])
    return (
      <div className="nav2">
        <div className="navleft">
            <div className="nl1"
              onClick={todynamicview}>
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
        <div className="navmid"
          onClick={tothisone}>
          {
            classifys.map(item =>
              <div className="item">{item.value}</div>
            )
          }
          <div className="item iconfont">更多 &#xe624;</div>
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
)
function Video (props) {  
  // 用户uid
  // const uid = props.userinfo.uid
  const data = props.data
  const videoref = useRef()
  const [nowtime ,setNowTime] = useState('00:00')   // 视频进度时间  
  const [videoindex, setVideoindex] = useState(-1)   // 悬浮播放index
  const [thislocaded1, setThisloaded1] = useState(false)          // 封面加载完毕


  // // 悬浮鼠标，播放视频
  // const timer = useRef(null)
  // const hangtoplayvideo = (path, e) => {
  //   const index = +(e.target.dataset.index || e.target.parentNode.dataset.index)
  //   const thisvideo = e.target.parentNode.querySelector(".hangtoplay") || e.target.querySelector(".hangtoplay")
  //   delayDeal(index, path, thisvideo)
  // }

  // const delayDeal = (index, path, video) => {
  //   // 闭包环境
  //   timer.current = setTimeout(() => {      
  //     setVideoindex(index)
  //     video.src = path
  //   })
  // }
  // // 离开视频，停止播放
  // const leavetostop = (e) => {
  //   console.log('leaving...');
    
  //   clearTimeout(timer)
  //   timer.current = null
    
  //   setVideoindex(-1)
  //   const thisvideo = e.target.parentNode.querySelector(".hangtoplay") || e.target.querySelector(".hangtoplay")
  //   if (thisvideo !== undefined && thisvideo !== null) {
  //     thisvideo.src = ""
  //   }
  // }
  const timer = useRef(null)
  const hangtoplayvideo = (index) => {
    setVideoindex(index)
  }

  const leavetostop = (e) => {
    setVideoindex(-1)
  }

  // 视频可以播放, 总是出错  ⭐ 用 autoplay就没问题了
  // const canlplayfnc = (thisvideo) => {
  //   // timer = setTimeout(() => {
  //     // thisvideo.play()
  //   // }, 1500);
  // }

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

  // 添加到稍后再看
  const addlaterwatch = (e) => {
    const vid = e.target.dataset.vid
  }

  const imgloaded = (e) => {
    // console.log('==图片加载完成==', e.target);
    setThisloaded1(true)
  }
  return (
    <div className="onevideo" style={{marginTop: props.style1 === 'yes' ? '40px' : '0'}}>
      <div className="videoimg"
        data-path={data.path}
        data-index={props.index}
        // onMouseEnter={(e) => hangtoplayvideo(data.path, e)}
        onMouseEnter={() => hangtoplayvideo(props.index)}
        onMouseLeave={leavetostop}
        data-vid={data.vid}
        onClick={tovideo}>
        {
          videoindex === props.index &&
          <div className="addlaterwatch"
            data-vid = {data.vid}
            onClick={addlaterwatch}>
            <div className="icondiv icon iconfont">&#xe646;</div>
            <div className="moreleft">添加至稍后再看</div>
          </div>
        }
        {
          videoindex === props.index &&
          <video
            src={data.path}
            autoplay="autoplay"
            data-src={data.path}
            preload="auto"
            muted
            className="hangtoplay" 
            ref={videoref}
            style={{zIndex: videoindex === props.index ? '1' : '0'}}
            data-vid={data.vid}
            onTimeUpdate={playing}
            onClick={tovideo}
          ></video>
        }
        <img
          src={data.cover}
          alt=""
          data-vid={data.vid}
          className="vidimg"
          style={{zIndex: videoindex === props.index ? '0' : '1'}}
          onClick={tovideo}
          onLoad={imgloaded}
        />
        <div className={thislocaded1 ? "load1 loaded1" : "load1"}></div>
        <div className="infos" data-vid={data.vid}
          style={{justifyContent: videoindex === props.index ? 'end' : 'space-between'}}
        >
          <div className="left"  style={{display: videoindex === props.index ? 'none' : 'flex'}}>
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
            <span className="protime" style={{display: videoindex === props.index ? 'inline-block' : 'none'}}>{nowtime} /</span>
            <span> {data.vidlong}</span>
          </div>
        </div>
      </div>
      <div className={thislocaded1 ? "title" : 'load2'}
        data-vid={data.vid}
        onClick={tovideo}
      >{data.title}</div>
      {
        !thislocaded1 &&
        <div className='load2 load22'></div>
      }
      <div className={thislocaded1 ? "author" : "load3"}>
        <div className="lspan1"
          data-uid={data.uid}
          onClick={touserspace}>
          <span className="icon iconfont"
            style={{marginTop: '2px'}}>&#xe665;</span>
          <span>{data.name}</span>
        </div>
        <span className='icon iconfont point'>&#xec1e;</span>
        <span>{data.time.slice(0, 10)}</span>
      </div>
    </div>
  )
}

function Home() {
  document.title="啤哩啤哩 (゜-゜)つロ 干杯~-pilipili"

  const userinfo = JSON.parse(localStorage.getItem('userinfo')),
        uid = userinfo ? userinfo.uid : -1
  // 在父组件中定义， 子组件也可以是使用
  const navigate = useNavigate()
  // 要赋值为数组形式， 否则没有map方法，会报错
  const [recommendlist, setRecommend] = useState([]),
        [videolist, setVideolist] = useState([]),
        [vids, setVids] = useState([])

  // 获取数据
  useEffect(() => {
    document.title = 'pilipili'
    const getData = async() => {      
      const result = await Promise.all([getRandom(5), getRandom(6)])
      setVideolist(result[0])
      for(let i = 0; i < result[0].length; i++) {
        console.log(result[0][i].vid)
        setVids([
          ...vids,
          result[0][i].vid
        ])
      }
      setRecommend(result[1])
    }
    getData();
    window.addEventListener("scroll", lazyloadfnc)
  },[])
  
  
  const lazyloadfnc = async (e) => {
    var a = document.body.clientHeight || document.documentElement.clientHeight
    var b = document.body.scrollTop || document.documentElement.scrollTop
    var c = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    // console.log(a, Math.ceil(b + c));
    
    if(a <= Math.ceil(b + c) && b > 0 ){
      console.log(vids);
      const res = await getSomeVideos(vids, 5);
      setVideolist([
        ...videolist,
        res
      ])
      for(let i = 0; i < res[0].length; i++) {
        setVids([
          ...vids,
          res[0][i].vid
        ])
      }
    }
  }

  const totopmove = () => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    })
  }

  // 换一换
  let temp1 = false
  const [iconflag, setIconflag] = useState(false)
  const changapart = (e) => {
    // 节流
    if (temp1) {
      return
    }
    setIconflag(true)
    temp1 = true
    setTimeout(async() => {
      const res = await getRandom(6)
      setRecommend(res)
      setIconflag(false)
      temp1 = false
    }, 1200)
  }
  return (
    <div className="conbox">
      <Topnav />
      <div className="mainbox">
      <MemoNav2
        uid={uid}
      />
        <div className="innerbox">
          <div className="changpart"
            onClick={changapart}
          >
            <div className={iconflag ? "iconani icon iconfont" : "icon iconfont"}>&#xe614;</div>
            <span className="changspan2">换一换</span>
            </div>
          <div className="bottompart">
            <div className="bbox1 icon iconfont b1">&#xe646;</div>
            <div className="bbox1 icon iconfont b2">&#xe615;</div>
            <div className="bbox1 bx2"
              onClick={totopmove}>
              <div className='icon iconfont'>&#xe628;</div>
              <div className='totoptext'>顶部</div>
            </div>
          </div>
          <div className="bannerpart">
            <Banner
              playflag={true}
            />
          </div>
          <div className="toprecbox">
          {
            recommendlist.map((item, index) => 
              <Video key={item.vid} 
              data={item}
              index={index}
              />
            )
          }
          </div>
          {
            videolist.map((item, index) => 
              <Video
              key={item.vid} 
              data={item}
              index={index}
              style1="yes"/>
              // <div key={item.vid} className="onevideo">{item.vid}</div>
            )
          }
        </div>
        {
          <div className="loadmore-line">
            <span>加载更多</span>
            <div>
              <span className='iconfont sp1'>&#xec1e;</span>
              <span className='iconfont sp2'>&#xec1e;</span>
              <span className='iconfont sp3'>&#xec1e;</span>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default Home