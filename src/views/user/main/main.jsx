import { useEffect, useState } from 'react'
import './main.scss'
import { Link, useParams } from 'react-router-dom'
import { getVideoByUid, getFamous, getUnfamous, changeFamous } from '../../../api/video'
import { getByUid } from '../../../api/user'
import { getFavlist } from '../../../api/favlist'

function Mainhome () {
  const localinfo = JSON.parse(localStorage.getItem('userinfo'))
  const uid = parseInt(localinfo.uid)
  const params = useParams()
  const hisuid = parseInt(params.uid)
  const isme = hisuid === uid

  const [userinfo, setUserinfo] = useState(() => isme ? localinfo : null)
  const [gg, setGg] = useState('')  // 公告
  const [ggflag, setGgflag] = useState(false)

  const [addvideoflag, setAddvideoflag] = useState(false)   // 指定视频flag
  const [selectflag, setSelectflag] = useState(false)
  const [selectstyle, setSelectstyle] = useState(0)         // 时间  播放量
  const [videoList, setVideolist] = useState([])
  const [famouslist, setFamouslist] = useState([])          // 代表作
  const [unfamouslist, setUnfamouslist] = useState([])      // 飞代表作
  const [famousvids, setFamousvids] = useState([])          // 最多三个，代表作
  const [vidselected, setVidseleted] = useState([])         // 已选择的视频

  const [homefavlist, setHomefavlist] = useState([])        // 收藏夹

  useEffect(() => {    
    let senduid = isme ? uid : params.uid
    const getData = async () => {
      const res = await getVideoByUid(hisuid, 8)
      console.log(res);
      setVideolist(res)

      const res2 = await getFamous(hisuid)
      console.log('res2:', res2);
      setFamouslist(res2)
      
      const res3 = await getUnfamous(hisuid, 0) // 默认事件排序
      setUnfamouslist(res3)
      setVidseleted(new Array(res3.length).fill(false))

      const res4 = await getFavlist(hisuid, -1);
      console.log(res4);
      
      setHomefavlist(res4)

      if (!isme) {
        const res2 = await getByUid(hisuid)
        setUserinfo(res2)
      }
    }
    getData()
  }, [])

  const blurfnc = () => {
    setGgflag(false)
    console.log(gg);
    
  }

  const changtextgg = (e) => {
    setGg(e.target.value)
  }

  const closeAddflag = () => {
    setFamousvids([])       // 清空选中
    setVidseleted(new Array(unfamouslist.length).fill(false))
    setAddvideoflag(false)
  }

  const sendfamous = async () => {
    if (famousvids.length > 0) {
      const res = await changeFamous(uid, famousvids, 0)
      console.log('update: ', res);
      
      setFamouslist(res)
      closeAddflag()
    }
  }

  const clickthisfamous = async (e) => {    
    const vid = parseInt(e.target.dataset.vid || e.target.parentNode.dataset.vid)
    const index = parseInt(e.target.dataset.index || e.target.parentNode.dataset.index)

    setVidseleted(vidselected.map((item, ind) => {
      if (ind === index) {
        item = !item
        if (item === true) {
          // 选中
          // 更新vids
          if (famousvids.length < 3) {
            setFamousvids([
              ...famousvids,
              vid
            ])
          } else {            
            if (famousvids.includes(vid)) {
              setFamousvids(famousvids.filter(item => item !== vid))
            } else {
              alert('只能选择三个')
              item = !item
            }
          }
        } else {
          // 取消
          setFamousvids(famousvids.filter(item => item !== vid))
        }
      }
        return item
    }))

  }

  const tocloseselect = (e) => {
    if (selectflag === true) {
      const tarname = e.target.className
      if (tarname !== "append-select-two" && tarname !== "ast-d1") {
        setSelectflag(false)
      }
    }
  }
  const selectthisstyle = async (e) => {
    const index = parseInt(e.target.dataset.index)
    setSelectstyle(index)

    const res = await getUnfamous(uid, index)
    console.log('热水：', res);
    
    setUnfamouslist(res)

    setSelectflag(false)  // 关闭窗口
  }
  return (
    <div className="user-mainbox">
       {
          addvideoflag &&
            <div className="addVideoBoxView">
              <div className="add-video-box" onClick={tocloseselect}>
                <div className="avb-title">
                  <span className='txspan'>选择置顶视频</span>
                  <div className="icon iconfont" onClick={closeAddflag}>&#xe643;</div>
                </div>
                <div className="avb-searchbox">
                  <input type="text" className="search-myvideo" placeholder='搜索我上传的视频'/>
                  <div className="icon iconfont">&#xe6a8;</div>
                </div>
                <div className="select-box">
                  <span className='sptext'>为添加的视频列表</span>
                  <div onClick={() => setSelectflag(true)}>
                    <span className='sptext2'>
                      {
                        selectstyle === 0 ?
                        <span>最新发布 </span>
                        :
                        <span>最多播放 </span>
                      }
                      <span className='icon iconfont'>&#xe624;</span>
                    </span>
                  </div>
                  {
                    selectflag &&
                    <div className="append-select-two">
                      <div className="ast-d1" data-index={0} onClick={selectthisstyle}>最新发布</div>
                      <div className="ast-d1" data-index={1} onClick={selectthisstyle}>最多播放</div>
                    </div>
                  }
                </div>
                <div className="video-content-avb">
                  {
                    unfamouslist.map((item, index) =>
                      <div className={vidselected[index] ? "one-video-nox ovo-active" : "one-video-nox"} key={item.vid}
                        data-vid={item.vid} data-index={index} onClick={clickthisfamous}>
                        <img src={item.cover} alt="" className="left-cover" />
                        <div className="right-infos" data-vid={item.vid} data-index={index}>
                          <div className="ri-title">{item.title}</div>
                          <div className="ri-infos" data-vid={item.vid} data-index={index}>
                            <div className="rii-d1">
                              <span className="icon iconfont">&#xe6b8;</span>
                              <span className="ir-text">{item.plays}</span>
                            </div>
                            <div className="rii-d1" data-vid={item.vid} data-index={index}>
                            <span className="icon iconfont" style={{fontSize: '16px'}}>&#xe666;</span>
                            <span className="ir-text">{item.danmus}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }
                </div>
                <div className="send-line">
                  <div className={famousvids.length > 0 ? "left-sendbox lsend-active" : "left-sendbox"} onClick={sendfamous}>确定</div>
                  <div className="right-sendbox" onClick={closeAddflag}>取消</div>
                </div>
              </div>
            </div>
        }
      <div className="uer2left">
        <div className="maintitle1">
          <span className='spp1'>代表作</span>
          {
            isme && famouslist.length >= 3 &&
            <span className="more-span icon iconfont" onClick={() => setAddvideoflag(true)}>设置 &#xe775;</span>
          }
        </div>
        <div className="famesworks">
          {
            famouslist.map(item =>
              <div className="onefamouswork">
                <div className="coveroutbox">
                  <img src={item.cover} alt="" className="workcover" />
                  <div className="time-span">{item.vidlong}</div>
                </div>
                <div className="worktitle">{item.title}</div>
                <div className="workinfos">
                  <div className='onebox'>
                    <div className='winner'>
                      <span className="icon iconfont">&#xe6b8;</span>
                      <span>{item.plays}</span>
                    </div>
                    <div className='winner'>
                      <span className="icon iconfont" style={{fontSize: '15px'}}>&#xe666;</span>
                      <span>{item.danmus}</span>
                    </div>
                  </div>
                  <div className='onebox'>
                    <span className='icon iconfont moreicon'>&#xe653;</span>
                  </div>
                </div>
              </div>
            )
          }
          {
            isme && famouslist.length < 3 &&
            <div className='addOneFmous' onClick={() => setAddvideoflag(true)}>
              <span className='icon iconfont'>&#xe643;</span>
              <span className='sptext'>设置置顶视频</span>
            </div>
          }
        </div>
        <div className="maintitle1">
          <span className='spp1'>TA的视频</span>
          <Link to={`/${uid}/videos`}>
            <div className="more-span icon iconfont">更多 &#xe775;</div>
          </Link>
        </div>
        <div className="hisvideo">
          {
            videoList.map(item =>
              <div className="onehisvideo">
                <div className="coveroutbox">
                  <img src={item.cover} alt="" className="workcover" />
                  <span className="time-span2">{item.vidlong}</span>
                </div>
                <div className="worktitle">{item.title}</div>
                <div className="workinfos">
                  <div>
                    <span className="icon iconfont">&#xe6b8;</span>
                    <span>{item.plays}</span>
                  </div>
                  <div>
                    <span>{item.time.slice(0, 10)}</span>
                  </div>
                </div>
              </div>
            )
          }
        </div>
        <div className="maintitle1">
          <span className='spp1'>收藏夹</span>
          <Link to={`/${uid}/favlist`}>
            <div className="more-span icon iconfont">更多 &#xe775;</div>
          </Link>
        </div>
        <div className="sublist">
          {
            homefavlist.map(item =>
              <div className="one-favlist">
                <div className="fav-img">
                  <img src={item.cover} alt="" className="this-cover" />
                  <div className="imgs-span">{item.nums}</div>
                </div>
                <div className="fav-infos">
                  <span className="fav-title">{item.title}</span>
                  {
                    item.pub === 0 ?
                    <span className="gongkai">公开</span>
                    :
                    <span className="gongkai">私有</span>
                  }
                </div>
              </div>
              )
          }
        </div>
      </div>
      <div className="uer2right">
        {
          !isme &&
          <div className="donate">
            <div className="dobox">充电</div>
          </div>
        }
        {
          isme &&
          <div className="createcenter">
            <div className="toptitlexa">创作中心</div>
            <div className="bottomcontent">
              <div className="btcond1">
                <Link to={`/${uid}/platform/upload/video`} target='_blank'>视频投稿</Link>
              </div>
              <div className="midsp"></div>
              <div className="btcond1">
                <Link to={`/${uid}/platform/upload/video`} target='_blank'>内容管理</Link>
              </div>
            </div>
          </div>
        }
        <div className="selfintro">
          <div className="introtitle">公告</div>
          <div className="myintor"
            style={{border: ggflag ? '1px solid #00AEEC' : '1px solid #b7babc88',
                    borderWidth: ggflag ? '1px' : '1px 0 0 0',
                    borderRadius: ggflag ? '4px' : '0'
            }}
            onMouseEnter={() => setGgflag(true)}
            onMouseLeave={() => setGgflag(false)}
          >
            <textarea name="" id="" className="mytextarea"
              onFocus={() => setGgflag(true)}
              onBlur={blurfnc}
              placeholder={gg.length > 0? gg : (userinfo != null ? userinfo.gonggao : '编辑空间公告')}
              onChange={changtextgg}
            ></textarea>
            {
              ggflag &&
              <div className="textnum">{gg.length} / 150</div>
            }
          </div>
        </div>
        <div className="livespace">
          <div className="introtitle">
            <span>直播间</span>
            {
              !isme &&
              <div className="rightpart-intro-main">
                <div className="follow-his-live">
                  关注直播间
                </div>
                <span className='fhl-num'>233</span>
              </div>
            }
          </div>
          {
            !isme ?
            <div className="intorcontent">
              <div className="inttop">主播不在，关注后就能在动态收到开播的通知哦~</div>
              <div className="intbot">前往TA的直播间 ←</div>
            </div>
            :
            <div className="mylive">
              <span>前往我的直播间</span>
            </div>
          }
        </div>
        <div className="rightuserinfo">
          <div className="introtitle">
            <span>个人资料</span>
            {
              isme &&
              <div className="editorinfs"
              onClick={() => window.open(`/${uid}/account/home`, '_blank')}>
                编辑资料
              </div>
            }
          </div>
          <div className="btinfosshow">
            <div className='oneinfo'>
              <span>UID</span>
              <span>{userinfo != null ? userinfo.uid : '-1'}</span>
            </div>
            <div className='oneinfo'>
              <span>生日</span>
              <span>{userinfo != null ? userinfo.birthday : '-1'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Mainhome