import './HomePage.scss'
import Topnav from '../../components/Topnav/Topnav.jsx'
import { useRef, useState, useEffect, memo } from 'react';
import { getSomeVideos, getRandom } from '../../api/video.js';
import { getMainTag, getTags } from '../../api/tag.js';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { touserspace, tovideo } from '../../util/fnc.js';
import { baseurl } from '../../api/index.js';
import message from '../../components/notice/notice.jsx';
import { throttle } from '../../util/fnc.js';
import Banner from '../../components/Banner/Banner.jsx';
import { getBanner } from "../../api/banner"
import Noresult from '../../components/NoResult/Noresult.jsx';

const MemoNav2 = memo((props) => {
    const {uid, logined} = props
    const [classifys, setClassify] = useState([]),                  // 全部
          [mainclassify, setMainclassify] = useState([]),           // 一级
          [remaindclassify, setRecommendclassify] = useState([]),   // 剩余一级
          [secondclassify, setSecondclassify] = useState([]),       // 二级
          [secondflag, setSecondflag] = useState(-1),
          timer = useRef(null)
    const [scrollflag, setScrollflag] = useState(false)

    useEffect(() => {
      const getData = async () => {
        // 获取视频主标签
        const res = await getMainTag(0, 0)
        setClassify(res)
        console.log('res is: ', res);
        
        const temp = res.filter(item =>
          item.type !== 1
        )
        const temp2 = temp.slice(23)
        setMainclassify(temp.slice(0, 23))       // 23个
        setRecommendclassify(temp2)              // 剩余的
      }
      getData()
    }, [])

    useEffect(() => {
      const scrollFnc = () => {
        const top = document.body.scrollTop || document.documentElement.scrollTop      
        if (top > 236) {
          setScrollflag(true)
        } else {
          setScrollflag(false)
        }
      }
      
      document.addEventListener('scroll', scrollFnc)
      return () => {
        document.removeEventListener('scroll', scrollFnc)
      }
    }, [setScrollflag])

    // 鼠标进入 tag 标签
    const enterTag = async (index, id) => {
      console.log('secondflah is');
      
      if (timer.current != null) {
        setSecondflag(-1)
        clearTimeout(timer.current)
        timer.current = null
      }
      const res = await getTags(id, 0, "null", 0, 0, 0)
      if (res != null && res.length > 0) {
        setSecondflag(index)
        setSecondclassify(res)
      }
    }

    const enterMore = () => {
      if (timer.current != null) {
        setSecondflag(-1)
        clearTimeout(timer.current)
        timer.current = null
      }
      setSecondflag(23)
    }

    const leaveTag = () => {
      timer.current = setTimeout(() => {
        setSecondflag(-1)
      },400)
    }

    const toThisTag = (value, type) => {
      window.open(`/channels/${value}`)
    }
    return (
      <>
        <div className="nav2">
          <div className="navleft">
              <div className="nl1"
                onClick={() => {
                  if (!logined) {
                    message.open({type: 'info', content: '请先登录'})
                    return
                  }
                  window.open(`dynamicM/${uid}`, '_blank')
                }}>
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
          <div className="navmid">
            {
              mainclassify.map((item, index) =>
                <div
                  className="item"
                  key={item.id}
                  onMouseEnter={() => enterTag(index, item.id)}
                  onMouseLeave={leaveTag}
                  onClick={() => toThisTag(item.tagName, item.type)}
                >
                  <span>{item.tagName}</span>
                  {
                    secondflag === index &&
                    <div className={index <= 11 ? "childbox" : "childbox childbox2"}
                    onMouseEnter={() => enterTag(index, item.id)}
                            onMouseLeave={leaveTag}
                    >
                      {
                        secondclassify.map(item2 =>
                          <div
                            key={item2.id}
                            className="seconditem"
                            onClick={(e) => {
                              e.stopPropagation()
                              toThisTag(item2.tagName, item2.type)
                            }}
                          >
                            {item2.tagName}
                          </div>
                        )
                      }
                    </div>
                  }
                </div>
              )
            }
            <div className="item"
              onMouseEnter={enterMore}
              onMouseLeave={leaveTag}
              onClick={() => window.open('/alltag')}
            >
              <span>更多</span>
              <div className='iconfont'>&#xe624;</div>
              {
                secondflag === 23 && remaindclassify.length > 0 &&
                <div className="childbox childbox2"
                  onMouseEnter={enterMore}
                  onMouseLeave={leaveTag}
                >
                  {
                    remaindclassify.map(item2 =>
                      <div
                        key={item2.id}
                        className="seconditem"
                        onClick={(e) => {
                          e.stopPropagation()
                          toThisTag(item2.value, item2.type)
                        }}
                      >
                        {item2.value}
                      </div>
                    )
                  }
                </div>
              }
            </div>
          </div>
          <div className="navright">
            <div className="oneitem"><span className="iconfont">&#xe605;</span><span>专栏</span></div>
            <div className="oneitem"><span className="iconfont">&#xe67d;</span><span>活动</span></div>
            <div className="oneitem"><span className="iconfont">&#xe685;</span><span>反馈</span></div>
            <div className="oneitem"><span className="iconfont">&#xe67c;</span><span>会员购</span></div>
            <div className="oneitem"><span className="iconfont">&#xe67b;</span><span>音乐</span></div>
            <div className="oneitem"><span className="iconfont">&#xe678;</span><span>漫画</span></div>
          </div>
        </div>
        <div className={scrollflag ? "nav2active nav2active2" : "nav2active"}>
          <div className="nav22active">
              <div className="navleft">
                <div className="nl1"
                  onClick={() => {
                    if (!logined) {
                      message.open({type: 'info', content: '请先登录'})
                      return
                    }
                    window.open(`dynamicM/${uid}`, '_blank')
                  }}>
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
            <div className="little-line">
              <div className="line"></div>
            </div>
            <div className="right-cont">
              {
                mainclassify.map(item =>
                  <div
                    className="one-box"
                    key={item.id}
                    onClick={() => toThisTag(item.value, item.type)}
                  >{item.tagName}</div>
                )
              }
              <div className="one-box"
                onClick={() => window.open('/alltag')}
              >
                <span>更多</span>
                <div className='iconfont'>&#xe624;</div>
              </div>
            </div>
            <div className="right-box-icon">
              <div className='iconfont rbii'>&#xe624;</div>
            </div>
          </div>
        </div>
      </>
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
        <span>{data.time != null ? data.time.slice(0, 10) : ''}</span>
      </div>
    </div>
  )
}

function Home() {
  const userinfo = JSON.parse(localStorage.getItem('userinfo')),
        uid = userinfo ? userinfo.uid : -1,
        logined = uid !== -1
        
  // 在父组件中定义， 子组件也可以是使用
  const navigate = useNavigate()
  // 要赋值为数组形式， 否则没有map方法，会报错
  const [recommendlist, setRecommend] = useState([]),
        [videolist, setVideolist] = useState([]),
        [vids, setVids] = useState([]),
        [bannerlist, setBannerlist] = useState([])
  const lazyLoadTimer = useRef(null) // 下拉加载
  const changeOneBitchTimer = useRef(false), // 推荐 换一换
        [iconflag, setIconflag] = useState(false) // 换一换动画

  useEffect(() => {
    const getData = async() => {      
      const result = await Promise.all([getRandom(5), getRandom(6), getBanner()])      
      setVideolist(result[0])
      for(let i = 0; i < result[0].length; i++) {
        setVids([
          ...vids,
          result[0][i].vid
        ])
      }
      setRecommend(result[1])      
      setBannerlist(result[2])
    }
    getData();
    document.title="啤哩啤哩 (゜-゜)つロ 干杯~-pilipili"
  },[])

  // 下拉刷新
  useEffect(() => {
    // 第二个参数是空的话，形成了闭包，导致不会更新
    const lazyloadfnc = () => {
      var a = document.body.clientHeight || document.documentElement.clientHeight
      var b = document.body.scrollTop || document.documentElement.scrollTop
      var c = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      
      if(a <= Math.ceil(b + c) && b > 0 ) {
          if (lazyLoadTimer.current != null) {
            return;
          } else {
            lazyLoadTimer.current = setTimeout(async () => {
              console.log(vids);
              const res = await getSomeVideos(vids, 5);
              const temp = [
                ...videolist,
                ...res
              ]
              console.log('old:', videolist);
              console.log('new video:', temp);
              setVideolist(temp)
              if (res != null && res.length > 0) {
                for(let i = 0; i < res[0].length; i++) {
                  setVids([
                    ...vids,
                    res[0][i].vid
                  ])
                }
              } else {
                message.open({ type: 'info', content: '没有更多了', flag: true})
              }
              lazyLoadTimer.current = null
            }, 1500)
          }
        }
    }
    document.addEventListener("scroll", lazyloadfnc)
    return () => {
      document.removeEventListener('scroll', lazyloadfnc)
    }
  }, [videolist])

  const toTopMove = () => {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    })
  }

  // 换一换
  const changapart = (e) => {
    // 节流
    if (changeOneBitchTimer.current) {
      return
    }
    setIconflag(true)
    changeOneBitchTimer.current = true
    setTimeout(async() => {
      const res = await getRandom(6)
      setRecommend(res)
      setIconflag(false)
      changeOneBitchTimer.current = false
    }, 1200)
  }

  return (
    <div className="conbox">
      <Topnav />
      {
        recommendlist.length > 0 && videolist.length > 0 ?
        <div className="mainbox">
        <MemoNav2
          uid={uid}
          logined={logined}
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
                onClick={toTopMove}>
                <div className='icon iconfont'>&#xe628;</div>
                <div className='totoptext'>顶部</div>
              </div>
            </div>
            <div className="bannerpart">
              {
                bannerlist.length > 0 &&
                <Banner
                  playflag={true}
                  bannerlist = {bannerlist}
                  listLength = {bannerlist.length}
                />
              }
            </div>
            <div className="toprecbox">
            {
              recommendlist.map((item, index) => 
                <Video
                  key={item.vid} 
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
                  style1="yes"
                />
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
      :
      <div className="noresult-b">
        <Noresult />
      </div>
    }
    </div>
  )
}

export default Home