import './comments.scss'
import { useState, useRef, useEffect } from 'react'
import message from '../notice/notice'
import { addComment, deleteComment, getAllComment, addLikeinfo, deletelikeinfo } from '../../api/comment'
import { getByVid } from '../../api/video'
import Emoji from '../emoji/emoji'
import At from '../At/at'
import { HeightLightKw, touserspace } from '../../util/fnc'
import { getDynamic } from '../../api/dynamic'
import Userinfo from '../Userinfo/Userinfo'

function Comments(props) {
  // commentType  0视频 1动态 2漫画
  const { vid, did, mid, commentType }  = props       
  const userinfo = props.userinfo
  const uid = props.uid
  const hisuid = props.hisuid    
  let id = -1
  if (commentType === 0) {
    id = vid
  } else if (commentType === 1) {
    id = did
  } else if (commentType === 2) {
    id = mid
  }
  console.log('id:', id,' type:', commentType);
  
  const [thisinfo, setThisinfo] = useState()             // 视频 or 动态 的信息
  const [commentnums, setCommentnums] = useState(0)      // 评论个数
  const [commentsort, setCommentsort] = useState(0)      // 0按照likes 1按照时间
  const [commentlist, setCommentlist] = useState([])
  const [commentArray, setCommentarray] = useState([])   // 回复消息时，flag===true，弹出回复框
  const [secondnums, setSecondsnums] = useState([])      // 查看全部二级评论flag
  const [commentflag, setCommentflag] = useState(false)    // 评论框flag
  const sendpart = useRef()
  const sendpart2 = useRef()
  const [commentshowone ,setShowOne] = useState(false)  // 翻滚显示下面的评论

  const [commentcontent, setContnet] = useState('')     // 一级回复内容
  const [commentcontent2, setContnet2] = useState('')   // 二级回复内容

  const [oneemoji, setOneemoji] = useState(''),
        [emojiflag, setEmojiflag] = useState(false),
        [atfalg, setAtflag] = useState(false),
        [atuser, setAtuser] = useState()

  const [oneemoji2, setOneemoji2] = useState(''),
        [emojiflag2, setEmojiflag2] = useState(false),
        [atfalg2, setAtflag2] = useState(false),
        [atuser2, setAtuser2] = useState()

  // f1: 一级的index  f2:二级的index  f3: 0 头像  1 名字  2 回复人的名字
  const [userinfoflag, setUserinfoflag] = useState({f1: -1, f2: -1, f3: -1})
  useEffect(() => {
    const getData = async () => {   
      const res = await getAllComment(id, uid, 0, commentType)
      setCommentlist(res)      
      // console.log('all comment is:', res);
      let tempsum = 0;
      for (let i = 0; i < res.length; i++) {        
        tempsum += (1 + res[i].lists.length)
      }
      setCommentnums(tempsum)
      if (props.OutComments !== null && props.OutComments !== undefined) {
        props.OutComments(tempsum)                // 外层评论数量
      }
      setCommentarray(new Array(res.length).fill(false))
      setSecondsnums(new Array(res.length).fill(3))
      let res2 = ''
      if (commentType === 0) {
        res2 = await getByVid(vid, uid)
      } else if (commentType === 1) {
        res2 = await getDynamic(did, uid)
      } else if (commentType === 2) {
        // res2 = await 
      }
      setThisinfo(res2)
    }
      
    getData()
    window.addEventListener('scroll', scrollfnc)
    return () => {
      window.removeEventListener('scroll', scrollfnc)
    }
  },[])

  // 发送一级评论
  const sendcomment = async () => {
    if (userinfo === null) {
      message.open({ type: 'error', content: '请先登录'})
      return;
    }
    if (commentcontent.length > 0) {
      const data = {
        uid: userinfo.uid,
        // vid: vid,
        content: commentcontent,
        topid: 0,
        fid: 0,
        hisuid: hisuid,
        type: commentType,                  // 0视频   1动态   2 漫画
        atuid: atuser != null && commentcontent.includes('@' + atuser.name) ? atuser.uid : -1,
        atname: atuser != null ? '@' + atuser.name : ''
      }
      if (commentType === 0) {
        data.vid = vid
      } else if (commentType === 1){
        data.did = did
      } else if (commentType === 2){
        data.mid = mid
      }
      console.log('send comment data is:', data);
      
      const res = await addComment(data)
      if (res) {
        // 清除
        setCommentflag(false)
        setContnet('')                          // 清除输入框中内容
        // 更新数据
        const data2 = {
          id: res,
          uid: userinfo.uid,
          // vid: vid,
          content: commentcontent,
          topid: 0,
          fid: 0,
          time: '刚刚',
          avatar: userinfo.avatar,
          name: userinfo.name,
          liked: false,
          likes: 0,
          type: commentType,
          lists: [],  // 否则会报 找不到 slice 错误
          atuid: atuser != null && commentcontent.includes('@' + atuser.name) ? atuser.uid : -1,
          atname: atuser != null ? '@' + atuser.name : ''
        }
        if (commentType === 0) {
          data2.vid = vid
        } else {
          data2.did = did
        }
        setCommentlist([
          ...commentlist,
          data2
        ])
        setCommentnums(commentnums + 1)
        if (props.OutComments !== null && props.OutComments !== undefined) {
          props.OutComments(commentnums + 1)   // 外层评论数量
        }
        message.open({ type: 'info', content: '成功发送评论', flag: true})
      }
    } else {
      message.open({ type: 'error', content: '内容部不能为空'})
    }
  }

  // 回复评论（一级）
  const [replaydata, setReplaydata] = useState({})
  const toreplaycomment = (e) => {
    const index = parseInt(e.target.dataset.index)
    const newarrya = commentArray.map((item, tindex) => {
      if (tindex === index) {
        return true
      } 
      return false
    })    
    setCommentarray(newarrya)
    
    const data = {
      topid: e.target.dataset.topid,             // 一级评论的id
      fid: e.target.dataset.fid,                 // 要回复评论的id
      fname: e.target.dataset.name,               // 要回复评论的人的名字
      content: e.target.dataset.content,          // 要回复的内容（别人的评论）
      replaycid: e.target.dataset.id
    }
    console.log(data);
    
    setReplaydata(data)
  }

  // 回复评论（二级）
  const sendcomment2 = async () => {
    if (commentcontent2.length > 0) {
      const data = {
        uid: userinfo.uid,
        // vid: vid,
        type: 2,
        content: commentcontent2,
        topid: replaydata.topid,    // 最顶层， 一级id
        fid: replaydata.fid,        // 二级id， 回复的评论的id
        hisuid: hisuid,         // 回复对象的uid
        replaycid: replaydata.replaycid,
        replaycontent: replaydata.content,
        atuid: atuser2 != null && commentcontent2.includes('@' + atuser2.name) ? atuser2.uid : -1,
        atname: atuser2 != null ? '@' + atuser2.name : ''
      }
      if (commentType === 0) {
        data.vid = vid
      } else {
        data.did = did
      }
      const res = await addComment(data)
      if (res) {
        setCommentflag(false)
        setContnet2('') 

        const data2 = {
          id: res,
          uid: userinfo.uid,
          // vid: vid,
          type: 2,
          content: commentcontent2,
          topid: 1,   // 最顶层， 一级id
          fid: 2,        // 二级id， 回复的评论的id
          name: userinfo.name,
          avatar: userinfo.avatar,
          time: '刚刚',
          fname: replaydata.fname,
          liked: false,
          likes: 0,
          atuid: atuser2 != null && commentcontent2.includes('@' + atuser2.name) ? atuser2.uid : -1,
          atname: atuser2 != null ? '@' + atuser2.name : ''
        }
        if (commentType === 0) {
          data2.vid = vid
        } else {
          data2.did = did
        }
        // 更新列表
        const newArray = commentArray.map((item, ind) => {
          if (item === true) {
            commentlist[ind].lists.push(data2)
          }
          return commentlist[ind]
        })
        setCommentlist(commentlist)
        // 更新commentArray（让二级回复框消失）
        setCommentarray(new Array(commentlist.length).fill(false))
        setCommentnums(commentnums + 1)
        if (props.OutComments !== null && props.OutComments !== undefined) {
          props.OutComments(commentnums + 1)   // 外层评论数量
        }
        message.open({ type: 'info', content: '回复评论成功', flag: true})
      } else {
        message.open({ type: 'error', content: '回复评论失败', flag: true})
      }
    } else {
      message.open({ type: 'error', content: '评论内容不能为空'})
    }
  }

  // 删除评论
  const todeletecomment = async (e) => {
    const id = parseInt(e.target.dataset.id)
    const topid = parseInt(e.target.dataset.topid)
    const index1 = parseInt(e.target.dataset.index1)      // 删除一级评论
    const index21 = parseInt(e.target.dataset.index21)    // 二级评论的一级评论的index
    const index22 = parseInt(e.target.dataset.index22)    // 二级评论的index

    // 如果是一级评论
    if (parseInt(e.target.dataset.topid) === 0) {
      // ⭐ 直接删除，这样很快，但重新赋值会出错
      // commentlist.splice(index1, 1)    // index未要删除位置的索引， 1 未删除个数，   改变数组
      setCommentlist(
        commentlist.filter(item =>
          item.id !== id
        )
      )
    } else {
      // ⭐ 问题同上     
      // const newlists = commentlist[index].lists.filter((item, i) => i !== sindex)
      // commentlist[index].lists = newlists      
      // setCommentlist(commentlist)
      setCommentlist(
        commentlist.map((item1, i) => {
          if (i === index21) {
            item1.lists = item1.lists.filter((item2, j) => j !== index22)
          }
          return item1
        })
      )
    }
    message.open({ type: 'info', content: '删除评论成功'})
    const deleteid = commentType === 0 ? vid : did
    const res = await deleteComment(id, deleteid, commentType)
    if (res === 200) {
      setCommentnums(commentnums - 1)
      if (props.OutComments !== null && props.OutComments !== undefined) {
        props.OutComments(commentnums - 1)   // 外层评论数量
      }
    } else {
      message.open({ type: 'error', content: '删除评论失败'})
    }
  }

  const cilckfnc = (e) => {      
    if (!(sendpart.current)?.contains(e.target)) {
      setCommentflag(false)
      setEmojiflag(false)               // 表情flag
      setAtflag(false)
      window.removeEventListener('click', cilckfnc)        
    }
  }

  const cilckfnc2 = (e) => {      
    if (!(sendpart2.current).contains(e.target)) {
      setCommentflag(false)
      setEmojiflag(false)               // 表情flag
      setAtflag(false)
      window.removeEventListener('click', cilckfnc2)        
    }
  }

  const scrollfnc = (e) => {
    const top = document.body.scrollTop || document.documentElement.scrollTop
    const distance = sendpart.current.offsetTop
    setShowOne(top > distance ? true : false);
  }

  // 评论排序
  const changeCommentSort = async (sort) => {
    setCommentsort(sort)
    if (commentlist.length === 0) {
      return
    }
    const id = commentType === 0 ? vid : did
    const res = await getAllComment(id, uid, sort, commentType)
    setCommentlist(res) 
  }

  // 点赞评论
  const likethiscomment = async (e) => {
    if (uid === -1) {
      message.open({ type: 'error', content: '请先登录'})
      return
    }      
    const thisliked = e.target.dataset.liked || e.target.parentNode.dataset.liked
    const cid = e.target.dataset.cid || e.target.parentNode.dataset.cid
    const type = parseInt(e.target.dataset.type || e.target.parentNode.dataset.type)            // 0： 一级评论   1： 二级
    const index1 = parseInt(e.target.dataset.index1 || e.target.parentNode.dataset.index1)       // 删除一级评论
    const index21 = parseInt(e.target.dataset.index21 || e.target.parentNode.dataset.index21)    // 二级评论的一级评论的index
    const index22 = parseInt(e.target.dataset.index22 || e.target.parentNode.dataset.index22)    // 二级评论的index
    // console.log(index21, index22);
    
    // 已经过赞
    if (thisliked === 'true') {        
      const res = deletelikeinfo(cid, uid)
      if (res) {
        if (type === 0) {
          setCommentlist(
            commentlist.map((item1, i) => {
              if (i === index1) {
                item1.liked = false
                item1.likes -= 1
              }
              return item1
            })
          )
        } else {
          setCommentlist(
            commentlist.map((item1, i) => {
              if (i === index21) {
                item1.lists = item1.lists.map((item2, j) => {
                  if (j === index22) {
                    item2.liked = false
                    item2.likes -= 1
                  }
                  return item2
                })
              }
              return item1
            })
          )
        }
      } 
    } else {
      const hisuid = e.target.dataset.hisuid || e.target.parentNode.dataset.hisuid
      const data = {
        type: 2,
        hisuid: hisuid,
        uid: uid,
        cid: cid
        // vid: thisvid.vid
      }
      
      if (commentType === 0) {
        data.vid = vid
      } else if (commentType === 1){
        data.did = did
      } else if (commentType === 2) {
        console.log('xxxxxxxx', parseInt(commentType));
        data.mid = mid
      }
      const res = await addLikeinfo(data);
      if (res) {
        if (type === 0) {            
          setCommentlist(
            commentlist.map((item1, i) => {
              if (i === index1) {
                item1.liked = true
                item1.likes += 1
              }
              return item1
            })
          )
        } else {
          setCommentlist(
            commentlist.map((item1, i) => {
              if (i === index21) {
                item1.lists = item1.lists.map((item2, j) => {
                  if (j === index22) {
                    item2.liked = true
                    item2.likes += 1
                  }
                  return item2
                })
              }
              return item1
            })
          )
        }
      }
    }
  }
  
  const time_userinfo = useRef(null)
  // 展示用户详情(可以加关注， 发私信)
  const enterUserinfo = (index, index2, num) => {    
    if (time_userinfo.current != null) {
      clearTimeout(time_userinfo.current)
    }
    setUserinfoflag({f1: index, f2: index2, f3: num})
  }

  // 离开用户详情(0.8s之后关闭)
  const leaveUserinfo = () => {
    time_userinfo.current = setTimeout(() => {
      setUserinfoflag({f1: -1, f2: -1, f3: -1})
      time_userinfo.current = null
    }, 800)
  }

  useEffect(() => {
    if (oneemoji !== '') {
      setContnet(commentcontent + oneemoji)
      setOneemoji("")
    }
  }, [oneemoji])

  useEffect(() => {
    if (atuser != null && atuser !== '') {
      setContnet(commentcontent + '@' + atuser.name + " ")
    }
  }, [atuser])

  useEffect(() => {
    if (oneemoji2 !== '') {
      setContnet2(commentcontent2 + oneemoji2)
      setOneemoji("")
    }
  }, [oneemoji2])

  useEffect(() => {
    if (atuser2 != null && atuser2 !== '') {
      setContnet2(commentcontent2 + '@' + atuser2.name + " ")
    }
  }, [atuser2])
  return (
    <>
    <div className="commetnbox">
      <div className="commenttitle">
        <div className="cmt1">
          <h2>评论</h2>
          <span style={{fontSize: '14px'}}>{commentnums}</span>
        </div>
        <div className="cmt2">
          <span
            onClick={() => changeCommentSort(0)} style={{color: commentsort === 0 ? '#18191C' : '#9499A0'}}
          >最热</span>
          <div></div>
          <span
            onClick={() => changeCommentSort(1)} style={{color: commentsort === 1 ? '#18191C' : '#9499A0'}}
          >最新</span>
        </div>
      </div>
      {/* 顶部一级评论 */}
      <div className="vidsendbox" ref={sendpart}>
        <div className="snetext">
          <div className="avatarpart">
            <img src={userinfo?.avatar} alt="" className="useravatarcom" />
          </div>
          <div className="rightppp">
            <div className="rightcommentpart" style={{backgroundColor: commentflag ? '#FFF' : '#F1F2F3'}}> 
              <textarea name="" id="" className="comtextarea"
                onFocus={() => {
                  setCommentflag(true)
                  window.addEventListener('click', cilckfnc)
                }}
                onChange={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  setContnet(e.target.value)
                }}
                value={commentcontent}
                placeholder='写点什么吧~'
              ></textarea>
            </div>
            { 
              commentflag &&
              <div className="sendbtn">
                <div className="leftconfss">
                  <div className="one-control"
                      onClick={() => {
                        setAtflag(!atfalg)
                        setEmojiflag(false)
                      }}
                  >
                    <span className="icon iconfont">&#xe626;</span>
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
                  <div className="one-control"
                    onClick={() =>  {
                      setEmojiflag(!emojiflag)
                      setAtflag(false)
                    }}
                  >
                    <span className="icon iconfont">&#xe667;</span>
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
                <div className="rightsends"
                onClick={sendcomment}
                style={{backgroundColor: commentcontent.length > 0 ? '#32AEEC' : '#00AEEC80'}}
                >发布</div>
              </div>
            }
          </div>
        </div>
      </div>
      { 
        commentlist.map((item, index) =>
          <div className="oneusercomment" key={item.id}>
            <div className="onecm">
              <div className="ocmla">
                <img src={item.avatar} alt="" 
                  className='onecmavatar'
                  style={{cursor: 'pointer', userSelect: 'none'}}
                  data-uid={item.uid}
                  onClick={touserspace}
                  onMouseEnter={() => enterUserinfo(index, -1, 0)}
                  onMouseLeave={leaveUserinfo}
                />
                {
                  userinfoflag.f1 === index && userinfoflag.f2 === -1 && userinfoflag.f3 === 0 &&
                  <div className="ui-append"
                    style={{position: "absolute", left: "50px", bottom: '50px'}}
                    onMouseEnter={() => enterUserinfo(index, -1, 0)}
                    onMouseLeave={leaveUserinfo}
                  >
                    <Userinfo
                      hisuid={item.uid}
                      myuid={uid}
                      setClose={setUserinfoflag}
                    />
                  </div>
                }
              </div>
              <div className="firsetcm">
                {/* 一级评论 */}
                <div className="onerpart">
                  <span className="cmname"
                    style={{cursor: 'pointer', userSelect: 'none'}}
                    onMouseEnter={() => enterUserinfo(index, -1, 1)}
                    onMouseLeave={leaveUserinfo}
                  >
                    <span
                      data-uid={item.uid}
                      onClick={touserspace}
                    >{item.name}</span>
                    {
                      userinfoflag.f1 === index && userinfoflag.f2 === -1 && userinfoflag.f3 === 1 &&
                      <div className="ui-append"
                        style={{position: "absolute", left: "0px", bottom: '25px'}}
                        onMouseEnter={() => enterUserinfo(index, -1, 1)}
                        onMouseLeave={leaveUserinfo}
                      >
                        <Userinfo
                          hisuid={item.uid}
                          myuid={uid}
                          setClose={setUserinfoflag}
                        />
                      </div>
                    }
                  </span>
                </div>
                <div className="commentcontent">
                  {
                    item.atid === -1 ?
                    <span className="firstcon">
                      {item.content}
                    </span>
                    :
                    <span 
                      onClick={() => window.open(`/${uid}`, "_blank")}
                      dangerouslySetInnerHTML={{__html: HeightLightKw(item.content, item.atname, "span", 1, item.atuid)}}></span>
                  }
                </div>
                <div className="eommentinfos">
                  <span className='timesp1'>{item.time.slice(0, 10)}</span>
                  <div className={item.liked ? "liseli lise-active" : 'liseli'}
                    data-cid={item.id}
                    data-hisuid={item.uid}
                    data-liked={item.liked}
                    data-index1={index}
                    data-type="0"
                    onClick={likethiscomment}
                  >
                    <span className='icon iconfont'>&#xe61c;</span>
                    <span className='likenum'>{item.likes}</span>
                  </div>
                  {
                    // 先要登录才能回复
                    userinfo != null && item.uid === userinfo.uid ?
                    <span className='cmback'
                      data-id={item.id}
                      data-topid={item.topid}
                      data-index1={item.index}
                      onClick={todeletecomment}>删除</span>
                    :
                    <span className='cmback'
                      data-id={item.id}
                      data-fid={item.uid}
                      data-topid={item.id}
                      data-name={item.name}
                      data-index={index}
                      data-content={item.content}
                      onClick={toreplaycomment}
                    >回复</span>
                  }
                </div>
                {/* 二级评论 */}
                { 
                  item.lists.slice(0, secondnums[index]).map((item2, index2) =>
                    <div className="secondcomments" key={item2.id}>
                      <div className="onesecondcomment">
                        <div className="leftpartsceavatar">
                          <img src={item2.avatar} alt=""
                            className="secondavatar"
                            style={{cursor: 'pointer', userSelect: 'none'}}
                            data-uid={item2.uid}
                            onClick={touserspace}
                            onMouseEnter={() => enterUserinfo(-1, index2, 0)}
                            onMouseLeave={leaveUserinfo}
                          />
                          {
                            userinfoflag.f1 === -1 && userinfoflag.f2 === index2 && userinfoflag.f3 === 0 &&
                            <div className="ui-append"
                              style={{position: "absolute", left: "0px", bottom: '35px'}}
                              onMouseEnter={() => enterUserinfo(-1, index2, 0)}
                              onMouseLeave={leaveUserinfo}
                            >
                              <Userinfo
                                hisuid={item2.uid}
                                myuid={uid}
                                setClose={setUserinfoflag}
                              />
                            </div>
                          }
                        </div>
                        <div className="rightusercomment-a">
                          <div className="rightcommentscrond">
                            <span className="secondname"
                              style={{cursor: 'pointer', userSelect: 'none'}}
                              onMouseEnter={() => enterUserinfo(-1, index2, 1)}
                              onMouseLeave={leaveUserinfo}
                            >
                              <span
                                data-uid={item2.uid}
                                onClick={touserspace}
                              >{item2.name}</span>
                              {
                                userinfoflag.f1 === -1 && userinfoflag.f2 === index2 && userinfoflag.f3 === 1 &&
                                <div className="ui-append"
                                  style={{position: "absolute", left: "0px", bottom: '25px'}}
                                  onMouseEnter={() => enterUserinfo(-1, index2, 1)}
                                  onMouseLeave={leaveUserinfo}
                                >
                                  <Userinfo
                                    hisuid={item2.uid}
                                    myuid={uid}
                                    setClose={setUserinfoflag}
                                  />
                                </div>
                              }
                            </span>
                            <span className="secondcontent">
                              <span className="text11">
                                <span
                                  style={{color: '#222', margin: '0 5px'}}
                                >回复</span>
                                <span className='replayname'>
                                  <span className='spcliname'
                                    data-uid={item2.fid}
                                    onClick={touserspace}
                                    onMouseEnter={() => enterUserinfo(-1, index2, 2)}
                                    onMouseLeave={leaveUserinfo}
                                  >{item2.fname}</span>
                                  {
                                    userinfoflag.f1 === -1 && userinfoflag.f2 === index2 && userinfoflag.f3 === 2 &&
                                    <div className="ui-append"
                                      style={{position: "absolute", left: "0px", bottom: '25px'}}
                                      onMouseEnter={() => enterUserinfo(-1, index2, 2)}
                                      onMouseLeave={leaveUserinfo}
                                    >
                                      <Userinfo
                                        hisuid={item2.fid}
                                        myuid={uid}
                                        setClose={setUserinfoflag}
                                      />
                                    </div>
                                  }
                                </span>
                              </span>
                              {/* {item2.content} */}
                              {
                                item2.atid === -1 ?
                                <span className="firstcon">
                                  :{item2.content}
                                </span>
                                :
                                <span 
                                  onClick={() => window.open(`/${uid}`, "_blank")}
                                  dangerouslySetInnerHTML={{__html: HeightLightKw(item2.content, item2.atname, "span", 1, item2.atuid)}}></span>
                              }
                            </span>
                          </div>
                          <div className="secondcommentinfos">
                            <span className='timesp1'>{item2.time.slice(0, 10)}</span>
                            <div className={item2.liked ? "liseli lise-active" : 'liseli'}
                              data-cid={item2.id}
                              data-hisuid={item2.uid}
                              data-liked={item2.liked}
                              data-index21={index}
                              data-index22={index2}
                              data-type="1"
                              onClick={likethiscomment}
                            >
                              <span className='icon iconfont'>&#xe61c;</span>
                              <span className='likenum'>{item2.likes}</span>
                            </div>
                            {
                              userinfo != null && item2.uid === userinfo.uid ?
                              <span className='cmback'
                                data-id={item2.id}
                                data-topid={item2.topid}       // topid != 0, 说明不是一级评论
                                data-index21={index}
                                data-index22={index2}
                                onClick={todeletecomment}>删除</span>
                              :
                              <span className='cmback'
                                data-id={item2.id}
                                data-fid={item2.uid}
                                data-topid={item.id}           // 设置父id
                                data-name={item2.name}
                                data-index={index}
                                data-content={item2.content}
                                onClick={toreplaycomment}
                              >回复</span>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
                {
                  item.lists.length > 3 && secondnums[index] < item.lists.length &&
                  <div className="watchmore">
                    <span>共{item.lists.length}条评论,</span>
                    <span className='watchmoreclick'
                      onClick={() =>
                        setSecondsnums(item, i => {
                          if (i === index) {
                            return item.lists.length
                          } else {
                            return item
                          }
                        })
                      }
                    >点击查看</span>
                  </div>
                }
                {
                  // 二级评论
                  // item.openflag &&
                  commentArray[index] === true &&
                  <div className="replaybox">
                    <div className="snetext">
                      <div className="avatarpart">
                        <img src={userinfo != null ? userinfo.avatar : null} alt="" className="useravatarcom" />
                      </div>
                      <div className="rightppp">
                        <div className="rightcommentpart"> 
                          <textarea name="" id="" className="comtextarea"
                            onChange={(e) => setContnet2(e.target.value)}
                            value={commentcontent2}
                            placeholder={'回复@ ' + replaydata.fname + ' :'}
                          ></textarea>
                        </div>
                        <div className="sendbtn">
                          <div className="leftconfss">
                            <div className="one-control"
                                onClick={() => {
                                  setAtflag2(!atfalg2)
                                  setEmojiflag2(false)
                                }}
                            >
                              <span className="icon iconfont">&#xe626;</span>
                              {
                                atfalg2 &&
                                <div className="at-box">
                                  <At
                                    uid={uid}
                                    setAtflag={setAtflag2}
                                    setAtuser={setAtuser2}
                                  />
                                </div>
                              }
                            </div>
                            <div className="one-control"
                              onClick={() =>  {
                                setEmojiflag2(!emojiflag2)
                                setAtflag2(false)
                              }}
                            >
                              <span className="icon iconfont">&#xe667;</span>
                              {
                                emojiflag2 &&
                                <div className="emoji-box">
                                  <Emoji 
                                    oneemoji={oneemoji2}
                                    setOneemoji={setOneemoji2}
                                    setEmojiflag={setEmojiflag2}
                                  />
                                </div>
                              }
                            </div>
                          </div>
                          <div className="rightsends"
                          onClick={sendcomment2}
                          style={{backgroundColor: commentcontent2.length > 0 ? '#32AEEC' : '#00AEEC80'}}
                          >发布</div>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        )
      }
      </div>
      {
        // 底部一级评论
        commentshowone &&
        <div className="sendbox2bottom"
          ref={sendpart2}
          style={{width: sendpart.current.clientWidth + "px"}}
        >
          <div className="snetext">
              <div className="avatarpart">
                <img src={userinfo != null ? userinfo.avatar : null} alt="" className="useravatarcom" />
              </div>
              <div className="rightppp">
               <div className="rightcommentpart" style={{backgroundColor: commentflag ? '#FFF' : '#F1F2F3'}}> 
                  <textarea name="" id="" className="comtextarea"
                    onFocus={() => {
                      setCommentflag(true)
                      window.addEventListener('click', cilckfnc2)
                    }}
                    onChange={(e) => setContnet(e.target.value)}
                    value={commentcontent}
                    placeholder='写点什么吧~'
                  ></textarea>
                </div>
                { 
                  commentflag &&
                  <div className="sendbtn">
                    <div className="leftconfss">
                      <div className="one-control"
                          onClick={() => {
                            setAtflag(!atfalg)
                            setEmojiflag(false)
                          }}
                      >
                        <span className="icon iconfont">&#xe626;</span>
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
                      <div className="one-control"
                        onClick={() =>  {
                          setEmojiflag(!emojiflag)
                          setAtflag(false)
                        }}
                      >
                        <span className="icon iconfont">&#xe667;</span>
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
                    <div className="rightsends"
                    onClick={sendcomment}
                    style={{backgroundColor: commentcontent.length > 0 ? '#32AEEC' : '#00AEEC80'}}
                    >发布</div>
                  </div>
                }
              </div>
            </div>
        </div>
      }
    </>
  )
}

export default Comments