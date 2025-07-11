import { useEffect, useState } from 'react'
import '../scss/UserSpace/UserHome.scss'
import { Link, useOutletContext, useParams } from 'react-router-dom'
import { getVideoByUid, getFamous, getUnfamous, changeFamous } from '../../../api/video'
import { getByUid, updateUserinfo } from '../../../api/user'
import { getFavlist } from '../../../api/favlist'
import { touserspace, tovideo } from '../../../util/fnc'

function UserHome () {
  const context = useOutletContext()
  const myinfo = context.myinfo,
        myuid = parseInt(context.myuid)

  const hisinfo = context.hisinfo,
        hisuid = parseInt(context.hisuid),
        setUserinfo = context.setUserinfo

  const isme = context.isme
  const [gg, setGg] = useState(''),  // 公告
        [ggflag, setGgflag] = useState(false)

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
    const getData = async () => {
      const res = await getVideoByUid(hisuid, 8)
      console.log(res);
      setVideolist(res)

      const res2 = await getFamous(hisuid)
      setFamouslist(res2)
      
      const res3 = await getUnfamous(hisuid, 0) // 默认事件排序
      setUnfamouslist(res3)
      setVidseleted(new Array(res3.length).fill(false))

      const res4 = await getFavlist(hisuid, -1);
      console.log(res4);
      
      setHomefavlist(res4)

      // if (!isme) {
      //   const res2 = await getByUid(hisuid)
      //   setUserinfo(res2)
      // }
    }
    getData()
  }, [])

  // 更新空间信息
  const blurfnc = async () => {
    setGgflag(false)
    const data = new FormData()
    data.append('uid', hisuid)
    data.append('gonggao', gg)
    const res = await updateUserinfo(data)
    if (res) {
      hisinfo.gonggao = gg
      setUserinfo(hisinfo)
    }
  }

  const closeAddflag = () => {
    setFamousvids([])       // 清空选中
    setVidseleted(new Array(unfamouslist.length).fill(false))
    setAddvideoflag(false)
  }

  const sendfamous = async () => {
    if (famousvids.length > 0) {
      const res = await changeFamous(hisuid, famousvids, 0)
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

    const res = await getUnfamous(myuid, index)    
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
                      <div className={vidselected[index] ? "one-video-nox ovo-active" : "one-video-nox"}
                        key={item.vid}
                        data-vid={item.vid}
                        data-index={index}
                        onClick={clickthisfamous}
                      >
                        <img src={item.cover} alt="" className="left-cover" />
                        <div className="right-infos" 
                          data-vid={item.vid} 
                          data-index={index}
                        >
                          <div className="ri-title">{item.title}</div>
                          <div className="ri-infos" 
                            data-vid={item.vid} 
                            data-index={index}
                          >
                            <div className="rii-d1">
                              <span className="icon iconfont">&#xe6b8;</span>
                              <span className="ir-text">{item.plays}</span>
                            </div>
                            <div className="rii-d1"
                              data-vid={item.vid}
                              data-index={index}
                            >
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
            // isme && famouslist.length >= 3 &&
            isme &&
            <span className="more-span icon iconfont" onClick={() => setAddvideoflag(true)}>设置 &#xe775;</span>
          }
        </div>
        {
          famouslist.length > 0 ?
            <div className="famesworks">
              {
                famouslist.map(item =>
                  <div className="onefamouswork"
                    key={item.vid}
                  >
                    <div className="coveroutbox">
                      <img src={item.cover}
                        alt=""
                        className="workcover"
                        data-vid={item.vid}
                        onClick={tovideo} 
                      />
                      <div className="time-span">{item.vidlong}</div>
                    </div>
                    <div className="worktitle"
                      data-vid={item.vid}
                      onClick={tovideo} 
                    >{item.title}</div>
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
                        {
                          isme &&
                          <span className='icon iconfont moreicon'>&#xe653;</span>
                        }
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
            :
          <div className='nofamous'>
            没有设置置顶视频
          </div>
        }
        <div className="maintitle1">
          <span className='spp1'>TA的视频</span>
          <Link to={`/${hisuid}/videos`}>
            <div className="more-span icon iconfont">更多 &#xe775;</div>
          </Link>
        </div>
        {
          videoList.length > 0 ?
          <div className="hisvideo">
          {
            videoList.map(item =>
              <div className="onehisvideo"
                key={item.vid}
              >
                <div className="coveroutbox">
                  <img src={item.cover}
                    alt=""
                    className="workcover"
                    data-vid={item.vid}
                    onClick={tovideo}                   
                  />
                  <span className="time-span2">{item.vidlong}</span>
                </div>
                <div className="worktitle"
                  data-vid={item.vid}
                  onClick={tovideo}                 
                >{item.title}</div>
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
        :
        <div className='nofamous'>空间主任还没有投稿过视频~~</div>
        }
        <div className="maintitle1">
          <span className='spp1'>收藏夹</span>
          <Link to={`/${hisuid}/favlist`}>
            <div className="more-span icon iconfont">更多 &#xe775;</div>
          </Link>
        </div>
        <div className="sublist">
          {
            homefavlist.map(item =>
              <div className="one-favlist"
                key={item.fid}
              >
                <div className="fav-img">
                  <Link to={`/${hisuid}/favlist/${item.fid}`}>
                    <img src={item.cover} alt="" className="this-cover"/>
                  </Link>
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
                <Link to={`/${hisuid}/platform/upload/video`} target='_blank'>视频投稿</Link>
              </div>
              <div className="midsp"></div>
              <div className="btcond1">
                <Link to={`/${hisuid}/platform/upload/video`} target='_blank'>内容管理</Link>
              </div>
            </div>
          </div>
        }
        <div className="selfintro">
          <div className="introtitle">公告</div>
          {
            isme ?
            <div className="myintor"
              style={{border: ggflag ? '1px solid #00AEEC' : '1px solid #b7babc88',
                      borderWidth: ggflag ? '1px' : '1px 0 0 0',
                      borderRadius: ggflag ? '4px' : '0'
              }}
              onMouseEnter={() => setGgflag(true)}
              onMouseLeave={() => setGgflag(false)}
            >
              <textarea 
                className="mytextarea"
                onFocus={() => setGgflag(true)}
                onBlur={blurfnc}
                placeholder={gg.length > 0? gg : (hisinfo != null ? hisinfo.gonggao : '编辑空间公告')}
                onChange={(e) => setGg(e.target.value)}
                value={gg}
              ></textarea>
              {
                ggflag &&
                <div className="textnum">{gg.length} / 150</div>
              }
            </div>
            :
            <div className="gonggaodivbox">
              <div className="text-gopngao-span">

              </div>
            </div>
          }
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
              onClick={() => window.open(`/${myuid}/account/home`, '_blank')}>
                编辑资料
              </div>
            }
          </div>
          <div className="btinfosshow">
            <div className='oneinfo'>
              <span>UID</span>
              <span>{hisinfo?.uid}</span>
            </div>
            <div className='oneinfo'>
              <span>生日</span>
              <span>{hisinfo?.birthday}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserHome