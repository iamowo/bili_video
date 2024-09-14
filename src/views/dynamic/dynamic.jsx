import './index.scss'
import Topnav from '../../components/Topnav/Topnav'
import Dynamic from '../user/dynamic/dynamic'
import { useEffect, useRef, useState } from 'react'
import { getDyanmciList, sendDynamic, sendDyimgs } from '../../api/dynamic'
import Totop from '../../components/toTop/totop'
import { tovideo, touserspace } from '../../util/fnc'
import { todynamic } from '../../util/fnc'

function DynamicM () {
  const userinfo = JSON.parse(localStorage.getItem('userinfo'))
  const uid = userinfo.uid

  document.title = "动态首页"
  document.body.style.background = "url(http://127.0.0.1:8082/sys/bg.png) top / cover no-repeat fixed"

  const [dylist, setDylist] = useState([])
  const [textcontent, setText] = useState('')
  const [textlength, setLength] = useState(0)
  const [imgs, setImgs] = useState([])
  const [imgsleng, setimglength] = useState(0)

  const livingref = useRef()
  const [postionfalg, setPostion] = useState(false)
  const [opationfalg , setOPationfalg] = useState(0)  // 1 转发   2 评论
  const [nowdyindex, setNowdyindex] = useState(-1)    // 当前所点击的，一次之打开一个
  useEffect(() => {
    const getData = async () => {
      const res = await getDyanmciList(uid, 1)
      console.log('..:', res);
      if (res) {
        setDylist(res)
      }
    }
    getData()

    const topheigth = livingref.current.offsetTop
    window.addEventListener('scroll', () => {
      const top = document.body.scrollTop || document.documentElement.scrollTop
      if (top >= topheigth) {
        setPostion(true)
      } else {
        setPostion(false)
      }
    })
  },[])

  const changinput = (e) => {
    const text = e.target.value
    setText(text)
    setLength(text.length)
  }

  const senddy = async () => {
    if (textcontent === null && textcontent === "" && imgs.length === 0) {
      alert('不能为空')
      return
    }
    const info = {
      uid: uid,
      content: textcontent,
      type: 0
    }
    const did = await sendDynamic(info)

    if (did != -1 && imgs.length > 0) {
      for (let i = 0; i < imgs.length; i++) {
        const data = new FormData()
        data.append('uid', uid)
        data.append('did', did)
        data.append('img', imgs[i])
        data.append('type', imgs[i].type.split("/")[1])
        const res = await sendDyimgs(data)

        if (i === imgs.length - 1 && res) {
          console.log('success');

          // 清空原来数据
          setText('')
          setLength(0)
          setImgs([])
          setimglength(0)
        }
      }
    } else {
      setText('')
      setLength(0)
    }
    
    const newlist = await getDyanmciList(uid, 1)
    setDylist(newlist)
  }

  const inputimgs = (e) => {
    if (imgsleng === 9) {
      return
    }

    let files = e.target.files
    let temp = []
    for (let i = 0; i < files.length; i++) {
      // temp.push(URL.createObjectURL(files[i]))
      temp.push(files[i])
    }

    setImgs([
      ...imgs,
      ...temp
    ])

    setimglength(imgsleng + temp.length)
    console.log(imgs.length);
    
    if (imgs.length > 9) {
      console.log('bigger');
      console.log('最多九章图片');
      setImgs([
        ...imgs,
        ...imgs.slice(0, 9)
      ])
      setimglength(9)
    }    
  }

  const deletethis = (e) => {
    const tindex= parseInt(e.target.dataset.index)
    setImgs(
      imgs.filter((item, index) =>
        index !== tindex
      )
    )
  }

  const handleShare = (e) => {    
    const index = parseInt(e.target.dataset.index || e.target.parentNode.dataset.index)
    console.log(index);
    setNowdyindex(index)
    setOPationfalg(1)
  }

  const handleComment = (e) => {
    const index = parseInt(e.target.dataset.index || e.target.parentNode.dataset.index)
    setNowdyindex(index)                            
    setOPationfalg(2)
  }

  const openimg = (e) => {
    // 阻止事件冒泡
    e.stopPropagation()
    e.preventDefault()

    console.log('2333');
    
  }
  return (
    <div className="dynamic-box">
      <Topnav />
      <Totop/>
      <div className="dy-conbox">
        <div className="dy-left">
          <div className="leftuserinfo">
            <div className="user-top-infos">
              <img src={userinfo.avatar} alt="" className="user-avatar" />
              <div className="user-right-infos">
                <div className="uri-title">{userinfo.name}</div>
                <div className="url-infoss"></div>
              </div>
            </div>
            <div className="bottom-infos">
              <div className="oneinfos">
                <span className="tt-span">{userinfo.follows}</span>
                <span className="bb-span">关注</span>
              </div>
              <div className="oneinfos">
                <span className="tt-span">{userinfo.fans}</span>
                <span className="bb-span">粉丝</span>
              </div>
              <div className="oneinfos">
                <span className="tt-span">{userinfo.dynamics}</span>
                <span className="bb-span">动态</span>
              </div>
            </div>
          </div>
          <div className="livingbox" ref={livingref}
            style={{position: postionfalg ? 'fixed' : 'relative',
                    top: postionfalg ? '60px' : '0'}}>
            <div className="livinttitle">
              <div>
                <span className="tt-left-title">正在直播</span>
                <span className="living-num">1</span>
              </div>
              <span>more</span>
            </div>
            <div className="one-living">
              <img src="" alt="" className="user-avatar" />
              <div className="user-right-infos">
                <div className="uri-title">asdasd</div>
                <div className="url-infoss">zhibijianbiaoti</div>
              </div>
            </div>
          </div>
        </div>
        <div className="dy-main">
          <div className="send-mydynamic">
            <div className="sendbox-box">
              <textarea name="" id="" className="traea" placeholder='写点什么吧~'
                onChange={changinput}
                value={textcontent}
              ></textarea>
            </div>
            <div className="imgpart">
              {
                imgs.map((item, index) =>
                  <div key={index} className="oneinpimg" draggable="true"
                  // style={{backgroundImage: `url(URL.createObjectURL(${item}))`}}
                  >
                    <img src={URL.createObjectURL(item)} alt="" className="aimg" />
                    <div className="deletethis icon iconfont"
                    data-index={index}
                    onClick={deletethis}>&#xe7b7;</div>
                  </div>
                )
              }
              {
                imgsleng > 0 &&
                <div className="add2box icon iconfont">
                  &#xe643;
                 <input type="file" className="inptuimg2" accept="image/*" multiple onChange={inputimgs}/>
                </div>
              }
            </div>
            <div className="bottom-opation">
              <div className='btm-d1'>
                <span className="icon iconfont">&#xe667;</span>
                <span className="icon iconfont imgpin"
                style={{color: imgsleng > 0 ? '#32AEEC' : '#18191C'}}>&#xe67f;
                  <input type="file" className="inputimgs" accept="image/*" multiple
                    onChange={inputimgs}
                  />
                  </span>
                <span className="icon iconfont">&#xe626;</span>
              </div>
              <div className='btn-d2'>
                <span className="numtext">{textlength}</span>
                <span className="icon iconfont">&#xe638;</span>
                <span className="sendbox" onClick={senddy}>发送</span>
              </div>
            </div>
          </div>
          <div className="sub-userbox">
            <div className="one-sun-people">
              <div className="osp-avatar"></div>
              <div className="osp-name">阿松大12312312</div>
            </div>
          </div>
          <div className="type-dynamic">
            <div className="one-type">
              <span>全部</span>
              <div className="active-span"></div>
            </div>
            <div className="one-type">
              <span>视频</span>
              <div className="active-span"></div>
            </div>
            <div className="one-type">
              <span>专栏</span>
              <div className="active-span"></div>
            </div>
          </div>
          <div className="dy-contemtnbox">
            {
              dylist.map((item, index) => 
                <div key={item.id} className="one-dynamic-box">
                  <div className='TTP'>
                    <img src={item.avatar} alt="" className="left-user-avatar" />
                    <div className="right-user-conetnt">
                      <div className="dy-ibe-name">{item.name}</div>
                      <div className="data-infos">
                        <span className="time-span">{item.time.slice(0, 10)}</span>
                        {
                          item.type === 3 &&
                          <span className="ts-right-sp">投稿了视频</span>
                        }
                      </div>
                      <div className="content-out-box">
                        <div className="user-dy-contnet" data-did={item.id} onClick={todynamic}>{item.content}</div>
                        {
                          item.type === 0 && item.imgs[0] != null &&
                          <div className="user-send-img-box" data-did={item.id} onClick={todynamic}>
                            {
                              item.imgs.map(item2 =>
                                <img src={item2} alt="" className="one-sss-img"
                                  onClick={openimg}/>
                              )
                            }
                          </div>
                        }
                      </div>
                      {
                        item.type === 1 &&
                        <div className="video-type-box">
                          <div className="vtb-inner-video-box">
                            <div className="vtb-title-line">
                              <div className="left-userinfo">
                                <img src={item.video.avatar} alt="" className="vtb-lu-cover"
                                  data-uid={item.video.uid} onClick={touserspace}/>
                                <span className="vtb-lu-name"
                                  data-uid={item.video.uid} onClick={touserspace}>{item.video.name}</span>
                                <span className="vtb-lu-text">投稿的视频</span>
                              </div>
                              <div className="right-sub-info">
                                <span className="icon iconfont">&#xe643;</span>
                                <span className="rbi-addsub">关注</span>
                              </div>
                            </div>
                            <div className="vtb-video-box1">
                              <div className="left-img-vtb-img">
                                <img src={item.video.cover} alt="" className="livu-img"
                                data-vid={item.video.vid} onClick={tovideo}/>
                              </div>
                              <div className="left-info-vtb">
                                <div className="liv-title" data-vid={item.video.vid} onClick={tovideo}>{item.video.title}</div>
                                <div className="liv-intro">{item.video.intro}</div>
                                <div className="liv-infos-d">
                                  <div className="one-info-livbox">
                                    <span className="icon iconfont">&#xe6b8;</span>
                                    <span className="oio-nums">{item.video.plays}</span>
                                  </div>
                                  <div className="one-info-livbox">
                                    <span className="icon iconfont">&#xe666;</span>
                                    <span className="oio-nums">{item.video.danmus}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      }
                      {
                        item.type === 2 &&
                        <div className="dynamic-type-box">
                          <div className="dtb-inner-box">
                            <div className="vtb-title-line">
                              <div className="left-userinfo">
                                <img src={item.dy2.avatar} alt="" className="vtb-lu-cover"
                                  data-uid={item.dy2.uid}/>
                                <span className="vtb-lu-name"
                                  data-uid={item.dy2.uid}>{item.dy2.name}</span>
                                <span className="vtb-lu-text">的动态</span>
                              </div>
                              <div className="right-sub-info">
                                <span className="icon iconfont">&#xe643;</span>
                                <span className="rbi-addsub">关注</span>
                              </div>
                            </div>
                            <div className="dtb-content-box">{item.dy2.content}</div>
                            <div className="dtb-imgs">
                              {
                                item.dy2.imgs.map(oneimg =>
                                  <img src={oneimg} alt="" className="oneimg-dy2" />
                                )
                              }
                            </div>
                          </div>
                        </div>
                      }
                      {
                        item.type === 3 &&
                        <div className="my-send-video">
                          <div className="left-send-my-avatr">
                            <img src={item.video.cover} alt="" className="lsma-avatar" />
                          </div>
                          <div className="right-send-my-info">
                            <div className="rsyi-title">{item.video.title}</div>
                            <div className="rsyi-intro">{item.video.intro}</div>
                            <div className="rsyi-infos">
                              <div className="rsyi-div">
                                <span className="icon iconfont" style={{fontSize: '13px'}}>&#xe6b8;</span>
                                <span className="rsyi-text">{item.video.plays}</span>
                              </div>
                              <div className="rsyi-div">
                                <span className="icon iconfont">&#xe666;</span>
                                <span className="rsyi-text">{item.video.danmus}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      }
                      <div className="dy-opation-b">
                        <div className="one-opation-a"
                          data-index={index}
                          onClick={handleShare}
                          style={{color: (opationfalg === 1 && nowdyindex === index) ? '#32AEEC' : '#9499A0'}}>
                          <span className="icon iconfont">&#xe633;</span>
                          {
                            item.shares > 0 ?
                            <span className="iconnum">{item.shares}</span>
                            :
                            <span className="iconnum">转发</span>
                          }
                        </div>
                        <div className="one-opation-a"
                          data-index={index}
                          onClick={handleComment}
                          style={{color: (opationfalg === 2 && nowdyindex === index) ? '#32AEEC' : '#9499A0'}}>
                          <span className="icon iconfont"
                          >&#xe648;</span>
                          {
                            item.likes > 0 ?
                            <span className="iconnum">{item.likes}</span>
                            :
                            <span className="iconnum">评论</span>
                          }                      </div>
                        <div className={false ? "one-opation-a one-active" : "one-opation-a"}>
                          <span className="icon iconfont">&#xe61c;</span>
                          {
                            item.comments > 0 ?
                            <span className="iconnum">{item.comments}</span>
                            :
                            <span className="iconnum">点赞</span>
                          }                       </div>
                      </div>
                      {
                        // 转发
                        (opationfalg === 1 && nowdyindex === index) &&
                        <div className="share-box">
                          <img src={userinfo.avatar} alt="" className="left-share-avatar" />
                          <div className="right-share-box">
                            <div className="send-part">
                              <div className="titleline">转发{item.name}的动态~</div>
                              <textarea className='texta2'></textarea>
                            </div>
                            <div className="bottom-opation-part">
                              <div className="emog-icon icon iconfont" style={{fontSize: '22px', color: '#9499A0'}}>&#xe667;</div>
                              <div className="right-numandsend">
                                <div className="numspan">400</div>
                                <div className="snedspan">发送</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                  {
                    // 评论
                    (opationfalg === 2 && nowdyindex === index) &&
                    <div className="comment-box">
                      <div className="toptitleline">
                        <div className="lbox">
                          <span className="lbox-sp11">评论</span>
                          <span className="lbox-sp12">1</span>
                        </div>
                        <div className="rbox">
                          <span className="rbox-spp">最热</span>
                          <span className="rbox-line1"></span>
                          <span className="rbox-spp">最新</span>
                        </div>
                      </div>
                      <div className="send-dy-sendbox">
                        <img src={userinfo.avatar} alt="" className="useravatar2-dy" />
                        <div className="send-r-outbox">
                        <div className="send-dy-innerbox">
                          <textarea name="" id="" className="inp333-dy"></textarea>
                        </div>
                        <div className="send-dy-bottom-opation">
                          <div className="sdbp-left">
                            <span className="icon iconfont" style={{fontSize: '22px', color: '#9499A0'}}>&#xe667;</span>
                          </div>
                          <div className="sdbp-right">
                            <div className="sdbp-r-send">发布</div>
                          </div>
                        </div>
                        </div>
                      </div>
                    </div>
                  }
                </div>)
            }
          </div>
        </div>
        <div className="dy-right">
          <div className="dy-rnak">
            <div className="rank-title">话题</div>
            <div className="one-rank-b">
              <div className="orb-left"></div>
              <div className="orb-right">
                <div className="orb-r-top">asdasd</div>
                <div className="orb-r-bottom">1231</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DynamicM