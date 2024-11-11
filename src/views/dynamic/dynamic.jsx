import './index.scss'
import Topnav from '../../components/Topnav/Topnav'
import Dynamic from '../user/dynamic/dynamic'
import { memo, useEffect, useRef, useState } from 'react'
import { getDyanmciList, sendDynamic, sendDyimgs, updateDyinfo, getAllTopical,  addTopical ,addTopicalWatchs, addTopicalCount } from '../../api/dynamic'
import { getHomeDynamic } from '../../api/video'
import Totop from '../../components/toTop/totop'
import { baseurl } from '../../api'
import DynamicCom from '../../components/dynamic/dynamicCom'
import message from '../../components/notice/notice'
import { setuserinfo } from '../../store/modules/userStore'
import { useParams } from 'react-router-dom'
import At from '../../components/At/at'
import Emoji from '../../components/emoji/emoji'

function DynamicM () {  
  const params = useParams()
  const [userinfo, setUserinfo] = useState(() => JSON.parse(localStorage.getItem('userinfo')))
  const uid = parseInt(params.uid)

  document.title = "动态首页-pilipili"
  document.body.style.background = `url(${baseurl}/sys/bg.png) top / cover no-repeat fixed`

  const [dylist, setDylist] = useState([])
  const [oldlist, setOldlist] = useState([])
  const [textcontent, setText] = useState('')
  const [imgs, setImgs] = useState([])
  const [imgsleng, setimglength] = useState(0)
  const [userindex, setUserindex] = useState(0)             // 0 全部动态  1，2，3.。。 关注的人的动态
  const [duindex, steDuindex] = useState(0)                 // 0 全部   1 动态    2 视频
  const livingref = useRef()
  const [postionfalg, setPostion] = useState(false)
  const [opationfalg , setOPationfalg] = useState(0)        // 1 转发   2 评论
  const [nowdyindex, setNowdyindex] = useState(-1)          // 当前所点击的，一次之打开一个
  const [deleteflag, setDeletaflag] = useState(false),       // 删除一条动态
        [deletedid, setDeletedid] = useState(-1)           // 要删除的did
  const [dyuser, setDyuser] = useState([])                  // 发送动态的用户

  const [topicalflag, setTopicalflag] = useState(false),
        [topical, setTopical] = useState({}),
        [topicallist, setToplicalist] = useState([])

  const [oneemoji, setOneemoji] = useState(''),
        [emojiflag, setEmojiflag] = useState(false),
        [atfalg, setAtflag] = useState(false),
        [atuser, setAtuser] = useState()
  const [searchtopical, setSearchtopical] = useState(),
        [newTopicalflag, setNewtopicalflag] = useState(false),
        [topicaltitle, setTopicaltitle] = useState(""),
        [topicalintro, setTopicalintro] = useState("")

  useEffect(() => {
    const getData = async () => {
      const res = await Promise.all([getDyanmciList(uid, 1), getHomeDynamic(uid, 1), getAllTopical()])
      setDylist(res[0])
      setOldlist(res[0])
      // 去重
      console.log(res[1]);
      
      setDyuser(res[1])

      setToplicalist(res[2])
    }
    getData()

    const topheigth = livingref.current.offsetTop + 64 // padding-top的距离    
    window.addEventListener('scroll', () => {
      const top = document.body.scrollTop || document.documentElement.scrollTop
      if (top >= topheigth) {
        setPostion(true)
      } else {
        setPostion(false)
      }
    })
  },[])

  useEffect(() => {
    console.log(duindex);
    
    if (duindex === 0) {
      setDylist(oldlist)
    } else if (duindex === 1) {
      setDylist(oldlist.filter(item => item.type !== 1 && item.type !== 3))
    } else {
      setDylist(oldlist.filter(item => item.type !== 0 && item.type !== 2))
    }
  }, [duindex])

  // 发送动态
  const senddy = async () => {
    console.log(textcontent === "");
    console.log(imgs.length === 0);
    if (textcontent === "" && imgs.length === 0) {
      message.open({type: 'error', content: '内容不能为空'})
      return
    }
    const data = {
      uid: uid,
      content: textcontent,
      type: 0,
    }
    if (JSON.stringify(topical) !== '{}') {
      addTopicalCount(topical.tid)
      data.topical = topical.topical
      setTopical({})
    }
    const did = await sendDynamic(data)
    console.log('res idi is:', did);
    
    updateuserinfos(1)
    // 本地更新
    if (did !== -1 && imgs.length > 0) {
      for (let i = 0; i < imgs.length; i++) {
        const data = new FormData()
        data.append('uid', uid)
        data.append('did', did)
        data.append('img', imgs[i])
        data.append('type', imgs[i].type.split("/")[1])
        const res = await sendDyimgs(data)

        if (i === imgs.length - 1 && res) {
          // 清空原来数据
          setText('')
          setImgs([])
          setimglength(0)
        }
      }
    } else {
      setText('')
    }
    const newlist = await getDyanmciList(uid, 1)
    setDylist(newlist)
  }

  // 上传图片
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

  // 删除一张图片
  const deletethis = (e) => {
    const tindex= parseInt(e.target.dataset.index)
    setImgs(
      imgs.filter((item, index) =>
        index !== tindex
      )
    )
  }

  // 删除一条动态
  const deletethisdynamic = async () => {
    const data = {
      id: deletedid,
      deleted: 1,
      uid: uid
    }
    const res = await updateDyinfo(data)
    setDylist(dylist.filter(item => item.id !== parseInt(deletedid)))
    setDeletaflag(false)
    updateuserinfos(-1)
  }

  const selectthisuser = (index, uid) => {
    setUserindex(index)
    if (parseInt(index) === 0) {
      setDylist(oldlist)
    } else {
      setDylist(oldlist.filter(item => item.uid === uid))
    }
  }

  const updateuserinfos = (num) => {
    setUserinfo({
      ...userinfo,
      dynamics: userinfo.dynamics + num
    })
    userinfo.dynamics = userinfo.dynamics + num
    localStorage.setItem('userinfo', JSON.stringify(userinfo))
    console.log(userinfo);
  }

  useEffect(() => {
    if (oneemoji !== '') {
      setText(textcontent + oneemoji)
      setOneemoji("")
    }
  }, [oneemoji])

  useEffect(() => {
    if (atuser != null && atuser !== '') {
      setText(textcontent + '@' + atuser.name + " ")
    }
  }, [atuser])

  const topicalBox = useRef()

  useEffect(() => {
    if (topicalflag) {
      window.addEventListener('click', cliclkCloseTopical)
    } else {
      // window.removeEventListener('click', cliclkCloseTopical)
    }
  }, [topicalflag])

  const cliclkCloseTopical = (e) => {
    // console.log(topicalBox.current, '   ',e.target);
    if (!topicalBox?.current?.contains(e.target)) {
      setTopicalflag(false)
    }
  }

  const selectThisTopical = (topical) => {
    setTopical(topical)
    setTopicalflag(false)
  }

  const createNewTopical = async() => {
    const data = {
      uid: uid,
      topical: topicaltitle,
      intro: topicalintro,
    }
    const res = await addTopical(data)
    if (res) {
      const res2 = await getAllTopical()
      setToplicalist(res2)
    }
    setTopicaltitle("")
    setTopicalintro("")
    setNewtopicalflag(false)
  }
  return (
    <div className="dynamic-box">
      <Topnav />
      <Totop/>
      <div className="toptop"
        style={{visibility: postionfalg ? 'visible' : 'hidden'}}
        onClick={() => {
          window.scroll({
            top: 0,
            behavior: 'smooth'
          })
        }}
      >
        <span className='icon iconfont'>&#xe637;</span>
        <span>top</span>
      </div>
      <div className="dy-conbox">
        <div className="dy-left">
          <div className="leftuserinfo">
            <div className="user-top-infos">
              <img src={userinfo.avatar} alt="" className="user-avatar" />
              <div className="user-right-infos">
                <div className="uri-title">{userinfo.name}</div>
                <div className="url-infoss">LV: {userinfo.lv}</div>
              </div>
            </div>
            <div className="bottom-infos">
              <div className="oneinfos"
                onClick={() => window.open(`/${uid}/fans/follow`, '_blank')}
              >
                <span className="tt-span">{userinfo.follows}</span>
                <span className="bb-span">关注</span>
              </div>
              <div className="oneinfos"
                onClick={() => window.open(`/${uid}/fans/fan`, '_blank')}
              >
                <span className="tt-span">{userinfo.fans}</span>
                <span className="bb-span">粉丝</span>
              </div>
              <div className="oneinfos"
                onClick={() => window.open(`/${uid}/dynamic`, '_blank')}
              >
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
                <span className="living-num">{1}</span>
              </div>
              <span className='icon iconfont'>更多关注 &#xe775;</span>
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
            <div className="topical-line">
              <div className="topical-out-box"
                ref={topicalBox}
              >
                {
                  JSON.stringify(topical) === "{}" ?
                  <div className="choicetopical"
                    onClick={() => {
                      setAtflag(false)
                      setEmojiflag(false)
                      setTopicalflag(!topicalflag)
                    }}
                  >
                    <span>#  选择话题</span>
                  </div>
                  :
                  <div className="choicetopical2">
                    <span>#  {topical?.topical}</span>
                    <span className="icon iconfont"
                      onClick={() => setTopical({})}
                    >&#xe7b7;</span>
                  </div>
                }
                {
                  newTopicalflag &&
                  <div className="newtopical-view">
                    <div className="newtopical-bg"></div>
                    <div className="newtopical-box">
                      <div className="nb-titlele">
                        <span>新建话题</span>
                        <span className="icon iconfont"
                          onClick={() => {
                            setTopicaltitle("")
                            setTopicalintro("")
                            setNewtopicalflag(false)
                          }}
                        >&#xe6bf;</span>
                      </div>
                      <input type="text" className="nb-title"
                        onChange={(e) => setTopicaltitle(e.target.value)}
                        value={topicaltitle}
                        placeholder='话题名称'
                      />
                      <textarea name="" id="" className='nb-intro'
                        onChange={(e) => setTopicalintro(e.target.value)}
                        value={topicalintro}
                        placeholder='话题简介'
                      ></textarea>
                      <div className="nb-btn-line">
                        <div className="nb-cancle-btn"
                          onClick={() => {
                            setTopicaltitle("")
                            setTopicalintro("")
                            setNewtopicalflag(false)
                          }}
                        >取消</div>
                        <div className="nb-ok-btn"
                          onClick={createNewTopical}
                        >确定</div>
                      </div>
                    </div>
                  </div>
                }
                <div
                  className={topicalflag ? "choice-box choice-box-active" : "choice-box"}
                >
                  <div className="topical-toppart">
                    <div className="top-line1">
                      <span className="icon iconfont">&#xe6a8;</span>
                      <input type="text" className="topline-inp2"
                        placeholder='搜索话题'
                      />
                    </div>
                  </div>
                  <div className="topical-content-b">
                    {
                      topicallist.map(item =>
                        <div className="one-topical"
                          onClick={() => selectThisTopical(item)}
                        >
                          <div className="one-tp-line1">
                            <div className="ljing">#</div>
                            <span className="topical-title">{item.topical}</span>
                          </div>
                          <div className="one-tp-line2">
                            <span className="topicaon-infos">阅读量{item.counts}</span>
                          </div>
                        </div>
                      )
                    }
                  </div>
                  <div className="topical-bottompart">
                    <div className="btn-create-topical"
                      onClick={() => setNewtopicalflag(true)}
                    >新建话题</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="sendbox-box">
              <textarea name="" id="" className="traea" placeholder='写点什么吧~'
                onChange={(e) => setText(e.target.value)}
                value={textcontent}
              ></textarea>
            </div>
            <div className="imgpart">
              {
                imgs.map((item, index) =>
                  <div key={index} className="oneinpimg" draggable="true">
                    <img src={URL.createObjectURL(item)} alt="" className="aimg" />
                    <div className="deletethis icon iconfont"
                      data-index={index}
                      onClick={deletethis}>&#xe7b7;
                    </div>
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
                <div className={atfalg ? "iconbox iconbox-active" : "iconbox"}>
                  <span className="icon iconfont"
                    onClick={() => {
                      setAtflag(!atfalg)
                      setEmojiflag(false)
                      setTopicalflag(false)
                    }}
                  >&#xe626;</span>
                  {
                      atfalg &&
                      <div className="at-box">
                        <At
                          uid={uid}
                          setAtflag={setAtflag}
                          setAtuser={setAtuser}
                        />
                      </div>
                    }
                </div>
                <span className="icon iconfont imgpin"
                  style={{color: imgsleng > 0 ? '#32AEEC' : '#18191C'}}>&#xe67f;
                  <input type="file" className="inputimgs"
                    accept="image/*" multiple
                    onChange={inputimgs}
                  />
                  </span>
                <div className={emojiflag ? "iconbox iconbox-active" : "iconbox"}>
                  <span className="icon iconfont"
                    onClick={() => {
                      setAtflag(false)
                      setTopicalflag(false)
                      setEmojiflag(!emojiflag)
                    }}
                  >&#xe667;</span>
                    {
                      emojiflag &&
                      <div className="emoji-box">
                        <Emoji 
                          oneemoji={oneemoji}
                          setOneemoji={setOneemoji}
                          setEmojiflag={setEmojiflag}
                        />
                      </div>
                    }
                </div>
              </div>
              <div className='btn-d2'>
                <span className="numtext">{textcontent.length}</span>
                <span className="icon iconfont">&#xe638;</span>
                <span className="sendbox"
                  onClick={senddy}
                >发送</span>
              </div>
            </div>
          </div>
          <div className="sub-userbox">
            <div className={userindex === 0 ? "one-sun-people one-active-user" : "one-sun-people"}
              onClick={() => selectthisuser(0, -1)}
            >
              <div className="osp-avatar">
                <div className="icon iconfont">&#xe6ca;</div>
              </div>
              <div className="osp-name">全部动态</div>
            </div>
            {
              dyuser.map((item, index) =>
                <div className={userindex === index + 1 ? "one-sun-people one-active-user" : "one-sun-people"}
                  onClick={() => selectthisuser(index + 1, item.uid)}
                >
                  <div className="osp-avatar">
                    <img src={item.avatar} alt="" className="one-user-ava" />
                  </div>
                  <div className="osp-name">{item.name}</div>
                </div>
              )
            }
          </div>
          {
            userindex === 0 &&
            <div className="type-dynamic">
              <div className="one-type"
                onClick={() => steDuindex(0)}
              >
                <span>全部</span>
                  <div className={ duindex === 0 ? "active-span active-span-active" : "active-span"}></div>
              </div>
              <div className="one-type"
                  onClick={() => steDuindex(1)}
              >
                <span>动态</span>
                  <div className={ duindex === 1 ? "active-span active-span-active" : "active-span"}></div>
              </div>
              <div className="one-type"
                  onClick={() => steDuindex(2)}
              >
                <span>视频</span>
                  <div className={ duindex === 2 ? "active-span active-span-active" : "active-span"}></div>
              </div>
            </div>
          }
          <div className="dy-contemtnbox">
            {
              dylist.map((item, index) =>
                <DynamicCom
                  key={item.id}
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
            {
              deleteflag &&
              <div className="control-view-delete">
                <div className="deletebox">
                  <div className="delete-line1">确定删除这条动态</div>
                  <div className="delete-line2">
                    <div className="delete-btn1"
                      onClick={() => {
                        setDeletedid(-1)
                        setDeletaflag(false)
                      }}
                    >取消</div>
                    <div className="delete-btn2"
                      onClick={() => {
                        deletethisdynamic()
                        message.open({type: "info", content: '删除成功'})
                      }}
                    >删除</div>
                  </div>
                </div>
              </div>
            }
            {
              dylist.length === 0 &&
              <div className="noresult-videw">
                <div className="noresult-img"
                  style={{background: `url(${baseurl}/sys/nodata02.png)`,
                                      backgroundPosition: 'center 50px',
                                      backgroundRepeat: 'no-repeat'}}>
                </div>
              </div>
            }
          </div>
        </div>
        <div className="dy-right">
          <div className="rank-img">
            <img src={`${baseurl}/sys/trbg.png`} alt="" />
          </div>
          <div className="dy-rnak">
            <div className="rank-title">话题</div>
            <div className="one-rank-b">
              {
                topicallist.map(item =>
                  <div className="one-topical-right-rank"
                    onClick={async () => {
                      await addTopicalWatchs(parseInt(item.tid), item.topical)
                      // 跳转页面
                      window.open(`/topical/${item.topical}`, "_blank")
                    }}
                  >
                    <div className="orb-left">
                      <span className="icon iconfont">&#xe63d;</span>
                      <span className='sp'>#</span>
                    </div>
                    <div className="orb-right">
                      <div className="orb-r-top">
                        <span>{item.topical}</span>
                      </div>
                      <div className="orb-r-bottom">
                        <span style={{marginRight: '10px'}}>{item.watch}浏览</span>
                        <span>{item.counts}帖子</span>
                      </div>
                    </div>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DynamicM