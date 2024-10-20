import './dynamic.scss'
import { useState } from 'react'
import { todynamic, touserspace, tovideo } from '../../util/fnc'
import { addDynamicLike, addTopicalWatchs } from '../../api/dynamic'

// 动态组件
function DynamicCom (props) {
  const item = props.item
  const index = props.index
  const userinfo = props.userinfo
  const uid = userinfo.uid

  const [opationfalg , setOPationfalg] = useState(0)  // 1 转发   2 评论
  const [nowdyindex, setNowdyindex] = useState(-1)    // 当前所点击的，一次之打开一个
  const [controlflag, setControlflag] = useState(false)

  // 转发
  const handleShare = (e) => {    
    const index = parseInt(e.target.dataset.index || e.target.parentNode.dataset.index)
    console.log(index);
    setNowdyindex(index)
    setOPationfalg(1)
  }

  // 评论
  const handleComment = (e) => {
    const index = parseInt(e.target.dataset.index || e.target.parentNode.dataset.index)
    setNowdyindex(index)                            
    setOPationfalg(2)
  }

  // 方法一张图片
  const openimg = (e) => {
    // 阻止事件冒泡
    e.stopPropagation()
    e.preventDefault()
  }

  // 点赞
  const likethisdynamic = async (did) => {
    console.log(item.uid);
    const data = {
      did: did,
      uid: uid,
      hisuid: item.uid,
      type: 1
    }
    const res = await addDynamicLike(data)
    // 更新列表
    if (item.liked) {
      // 取消收藏
      if (res && props.setDylist !== undefined && props.setDylist !== null) {
        props.setDylist(props.dylist.map(dy => {
            if (dy.id === did) {
              dy.liked = false
              dy.likes -= 1
            }
            return dy
          }
        ))
      }
    } else {
      if (res && props.setDylist !== undefined && props.setDylist !== null) {
        props.setDylist(props.dylist.map(dy => {
            if (dy.id === did) {
              dy.liked = true
              dy.likes += 1
            }
            return dy
          }
        ))
      }
    }
  }
  return (
    <div key={item.id} className="one-dynamic-box">
      <div className='TTP'>
        <img src={item.avatar} alt="" className="left-user-avatar" />
        <div className="right-user-conetnt">
          <div className="right-infod1">
            <div className="boxinfo1">
                <div className="dy-ibe-name">{item.name}</div>
                <div className="data-infos">
                  <span className="time-span">{item.time.slice(0, 10)}</span>
                  {
                    item.type === 3 &&
                    <span className="ts-right-sp">投稿了视频</span>
                  }
                </div>
                {
                  item.topical !== null &&
                  <div className="topical-line">
                    <div className="this-topical-box"
                      onClick={async () => {
                        await addTopicalWatchs(-1, item.topical)
                        window.open(`/topical/${item.topical}`, "blank")
                      }}
                    ># {item.topical}</div>
                  </div>
                }
            </div>
            <div className="boxinfo2">
              <span className="icon iconfont"
                onClick={() => setControlflag(true)}
              >&#xe653;</span>
              {
                controlflag &&
                <div className="controlbox">
                  {
                    uid === item.uid ?
                    <span className="consp1"
                      onClick={() => {
                        setControlflag(false)
                        props.setDeletaflag(true)
                        props.setDeletedid(item.id)
                      }}
                    >删除动态</span>
                    :
                    <span className="consp1">举报</span>
                  }
                </div>
              }
            </div>
          </div>
          <div className="content-out-box">
            <div className="user-dy-contnet"
              data-did={item.id}
              onClick={todynamic}
            >{item.content}</div>
            {
              item.type === 0 && item.imgs[0] != null &&
              <div className="user-send-img-box"
                data-did={item.id}
                onClick={todynamic}
              >
                {
                  item.imgs.map(item2 =>
                    <img src={item2} alt="" className="one-sss-img"
                      data-did={item.id}
                      onClick={todynamic}/>
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
                    data-vid={item.video.vid}
                    onClick={tovideo}/>
                  </div>
                  <div className="left-info-vtb">
                    <div className="liv-title"
                      data-vid={item.video.vid}
                      onClick={tovideo}
                    >{item.video.vid}</div>
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
                <img src={item.video.cover} alt="" className="lsma-avatar"
                  data-vid={item.video.vid}
                  onClick={tovideo}
                />
              </div>
              <div className="right-send-my-info">
                <div className="rsyi-title"
                  data-vid={item.video.vid}
                  onClick={tovideo}
                >{item.video.title}</div>
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
                item.comments > 0 ?
                <span className="iconnum">{item.comments}</span>
                :
                <span className="iconnum"
                  data-index={index}
                >
                  {
                    item.comments > 0 ?
                    <span>{item.comments}</span>
                    :
                    <span>评论</span>
                  }
                </span>
              }
            </div>
            <div className={item.liked ? "one-opation-a one-active" : "one-opation-a"}
              onClick={() => likethisdynamic(item.id)}
            >
              <span className="icon iconfont">&#xe61c;</span>
              {
                item.likes > 0 ?
                <span className="iconnum">{item.likes}</span>
                :
                <span className="iconnum">
                  {
                    item.likes > 0 ?
                    <span>{item.likes}</span>
                    :
                    <span>点赞</span>
                  }
                </span>
              }
            </div>
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
              <span className="lbox-sp12">{item.comments}</span>
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
    </div>
  )
}

export default DynamicCom