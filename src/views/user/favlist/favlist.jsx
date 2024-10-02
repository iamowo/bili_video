import './favlist.scss'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getFavlist, getOneList, addOneFavlist, deleteFav, updateFav, deleteVideoFromFav, deleteMangFav } from '../../../api/favlist'
import {tovideo} from '../../../util/fnc'
import { getByUid } from '../../../api/user'
import { useOutletContext } from 'react-router-dom'   // 获取父传给子的数据
import { searchKw } from '../../../api/video'

function Favlist () {
  const isme = useOutletContext()        // 是不是本人空间
  
  const [favlist, setFavlist] = useState([])
  const [favindex, setFavindex] = useState(-1)  // 左侧index，用于修改列表信息用
  const [hoverfid, setHoverfid] = useState(-1)  // 鼠标悬浮式的fid
  const [newtitle, setNewtitle] = useState()
  const [newpub, setNewpub] = useState()
  // 一个收藏夹的信息
  const [nowinfos, setNowinfos] = useState({
    title: '',
    cover: '',
    name: '',
    nums: '',
    pub: 0
  })
  const [opationflag, setOpationflag] = useState(false)   // 操作收藏夹flag
  const [videolist, setVideolist] = useState([]),
        [templist, setTemplist] = useState([]),
        [checkedall, setCheckedall] = useState(false),    // 全选
        [checked, setChecked] = useState([]),
        [checkednum, setCheckednum] = useState(0)

  const [leftindex, setLefindex] = useState(0)         // 左侧列表index，用于列表之间切换用
  const [newfavfalg, setNewfavflag] = useState(false)
  const [createtitle, setCreatetitle] = useState("")
  const [pubtype, setPubstyle] = useState(false)      // 是否为私有

  const params = useParams()
  const uid = parseInt(params.uid)  // up 的uid
  let fid = parseInt(params.fid)
  const [defaultfid, setDefaid] = useState()        // 默认收藏夹id

  const [deleteindex, setDeleteindex] = useState(-1),
        [deletevid, setDeletevid] = useState(-1)

  const [sortstyle, setSortstyle] = useState(0),    // 0 最新  1 播放量
        [sortflag, setSortflag] = useState(false)

  const [keyword, setKeyword] = useState("")

  useEffect(() => {
    const getData = async() => {
      const res = await Promise.all([getFavlist(uid, -1), getByUid(uid)])
      setFavlist(res[0])        // 左侧列表

      setDefaid(res[1].defaultfid)
      const tempdefaultfid = res[1].defaultfid

      const res2 = await getOneList(tempdefaultfid, 0, null)
      setVideolist(res2)      // 一个收藏夹中的视频
      setTemplist(res2)
      setChecked(new Array(res2.length).fill(false))

      const ninfo = {
        title: res[0][0].title,
        cover: res[0][0].cover,
        name: res[0][0].name,
        nums: res2.length,
        pub: res[0][0].pub
      }
      setNowinfos(ninfo)

      // 表示为默认收藏夹
      if (fid === 'NaN') {
        fid = res[0][leftindex].fid
      }
    }
    getData()
  },[])

  const tothisfav = async (e) => {
    const index = parseInt(e.target.dataset.index || e.target.parentNode.dataset.index)
    const fid = parseInt(e.target.dataset.fid || e.target.parentNode.dataset.fid)
    setLefindex(index)
    const res = await getOneList(fid, 0, null)
    console.log('...',res);
    setVideolist(res)
    setChecked(new Array(videolist.length).fill(false))
    const ninfo = {
      title: favlist[index].title,
      cover: favlist[index].cover,
      name: favlist[index].name,
      nums: res.length,
      pub: favlist[index].pub
    }
    setNowinfos(ninfo)
  }
  
  const toclosecreate = () => {
    setNewfavflag(false)
    setCreatetitle('')
    setPubstyle(false)
  }

  const tocreateone = async () => {
    if (createtitle.length > 0) {
      const res = await addOneFavlist(uid, createtitle, pubtype ? 1 : 0)
      setFavlist(res)  // 更新列表
      toclosecreate()
    } else {
      alert('title is empty')
      return
    }
  }

  let timer1 = null
  const entercahnge = (e) => {   
    if (timer1 != null) {
      setFavindex(-1)
      setHoverfid(-1)
      clearTimeout(timer1)
    }

    const index = parseInt(e.target.dataset.index || e.target.parentNode.dataset.index)
    setNewtitle(favlist[index].title)
    setNewpub(favlist[index].pub === 1 ? true : false)  // 1时私有  否则公开
    // console.log(favlist[index].title, '  ', favlist[index].pub);
    
    const fid = parseInt(e.target.dataset.fid || e.target.parentNode.dataset.fid)    
    setHoverfid(fid)
    setFavindex(index)
  }

  const leavechange = () => {
    timer1 = setTimeout(() => {
      setFavindex(-1)
    },300)
  }

  const [deitorflag, setEdittorflag] = useState(false)
  const toeditorfav = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setEdittorflag(true)
  }

  // update
  const toupdate = async () => {
    if (newtitle.length > 0) {
      const res = await updateFav(uid, hoverfid, newtitle, newpub === true ? 1 : 0)
      if (res) {
        setFavlist(res)
        tocloseeditor()
      }
    } else {
      alert('收藏夹名称不能为空')
      return
    }
  }

  // 关闭update
  const tocloseeditor = () => {
    setNewtitle('')
    setNewpub(false)
    setEdittorflag(false)    
  }

  const [deleteflag, setDeleteflag] = useState(false)
  const todeletefav = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setDeleteflag(true)
  }

  // delete
  const suretodelete = async () => {
    const res = await deleteFav(hoverfid, uid)
    if (res) {
      setFavlist(res)
    }
    setDeleteflag(false)
  }


  // 删除一个视频
  const deletefavvidedo = async () => {
    console.log(fid, deletevid);
    const res = await deleteVideoFromFav(fid, deletevid)
    if (res) {
      const res2 = await getOneList(fid, 0, null)
      setVideolist(res2)      // 一个收藏夹中的视频
      setChecked(new Array(videolist.length).fill(false))
    }
    setDeletevid(-1)
    setDeleteindex(-1)
  }

  const choivethissort = async (type) => {
    setSortstyle(parseInt(type))
    const res = await getOneList(fid, type, null)
    if (res) {
      setVideolist(res)
      setChecked(new Array(videolist.length).fill(false))
    }
    setSortflag(false)
  }

  // 搜索
  const ensearch = async () => {
    if (keyword.length === 0) {
      setVideolist(templist)
      setChecked(new Array(videolist.length).fill(false))
      return
    }
    const nlist = videolist.filter(item =>    
      item.title.includes(keyword)
    )
    if (nlist === 0) {
      alert('没有结果')
      return
    }
    console.log(nlist);
    
    // const res = await getOneList(fid, 0, keyword)
    setVideolist(nlist)
    setChecked(new Array(nlist.length).fill(false))
  }

  const entertosearch = (e) => {
    if (e.key === 'Enter') {
      ensearch()
    }
  }

  // 批量操作
  const clickthisvideochecked = (index) => {
    const newlist = checked.map((item, ind) => {
      if (ind === index) {
        if (!item) {
          setCheckednum(checkednum + 1)
        } else {
          setCheckednum(checkednum - 1)
        }
        return !item
      }
      return item
    })
    setChecked(newlist)
  }

  // 批量删除
  const deletemang = async () => {
    const vids = []
    fid = params.fid || favindex[leftindex].fid
    checked.forEach((item, index) => {
      if (item) {
        vids.push(videolist[index].vid)
      }
    })
    const res = await deleteMangFav(fid, vids);
    if (res) {
      const res2 = await getOneList(fid, 0, null)
      setVideolist(res2)      // 一个收藏夹中的视频
      setChecked(new Array(videolist.length).fill(false))
    }
    setOpationflag(false)
  }
  return (
    <div className="user-videos">
      {
        newfavfalg &&
        <div className="newfav-view">
          <div className="new-fav-box">
            <div className="nfb-title">
              <span className="ntb-title">收藏夹信息</span>
              <div className="icon iconfont" onClick={toclosecreate}>&#xe643;</div>
            </div>
            <div className="one-line-fav">
              <input type="text" className="titleinp" placeholder='收藏夹名称' maxLength="20" 
                value={createtitle} onChange={(e) => setCreatetitle(e.target.value)}/>
              <span className="nums-span">{createtitle.length} / 20</span>
            </div>
            <div className="one-line-fav2">
              <label htmlFor="" className='outlabel' for="inpname">
                <input type="checkbox" id='inpname' onChange={() => setPubstyle(!pubtype)}/>
                <span className='simi'>设为私密</span>
              </label>
            </div>
            <div className="sendbox" onClick={tocreateone}>创建</div>
          </div>
        </div>
      }
      {
        deitorflag &&
        <div className="newfav-view">
          <div className="new-fav-box">
            <div className="nfb-title">
              <span className="ntb-title">编辑收藏夹信息</span>
              <div className="icon iconfont" onClick={tocloseeditor}>&#xe643;</div>
            </div>
            <div className="one-line-fav">
              <input type="text" className="titleinp" placeholder={123} maxLength="20" 
                value={newtitle} onChange={(e) => setNewtitle(e.target.value)}/>
              <span className="nums-span">{newtitle.length} / 20</span>
            </div>
            <div className="one-line-fav2">
              <label htmlFor="" className='outlabel' for="inpname">
                <input type="checkbox" id='inpname' checked={newpub === true} onChange={() => setNewpub(!newpub)}/>
                {/* <div className="left-check"></div> */}
                <span className='simi'>设为私密</span>
              </label>
            </div>
            <div className="sendbox" onClick={toupdate}>更改</div>
          </div>
        </div>
      }
      {
        deleteflag &&
        <div className="newfav-view">
          <div className="new-fav-box">
            <div className="nfb-title">
              <span className="ntb-title">确认提示</span>
              <div className="icon iconfont" onClick={() => setDeleteflag(false)}>&#xe643;</div>
            </div>
            <div className="text-line1">确认删除这个收藏夹吗?</div>
            <div className="send-lin-two">
              <div className="inner-one" data-fid={1} onClick={suretodelete}>确认</div>
              <div className="inner-one2" onClick={() => setDeleteflag(false)}>取消</div>
            </div>
          </div>
        </div>
      }
      <div className="video-left">
        <div className="one-left-contentn-title" onClick={() => setNewfavflag(true)}>
          <span className='icon iconfont'>&#xe659;</span>
          <span>新建收藏夹</span>
        </div>
        {
          favlist.map((item, index) =>
            <Link to={`/${uid}/favlist/` + item.fid} key={item.id}
              data-index={index}
              data-fid={item.fid}
              onClick={tothisfav}>
              <div data-index={index} data-fid={item.fid} className={leftindex === index ? "one-left-contentnfav olc-act" : "one-left-contentnfav"}>
                <span>{item.title}</span>
                {
                  isme ?
                  <div className="spoutbox" data-index={index}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onMouseEnter={entercahnge} onMouseLeave={leavechange}>
                    <span className='ilsp' data-index={index}>{item.nums}</span>
                    <span className='icon iconfont' data-index={index}>&#xe653;</span>
                  </div>
                  :
                  <span>{item.nums}</span>
                }
                {
                  (favindex === index && isme) &&
                  <div className="changfav-box"
                    data-fid={item.fid} onMouseEnter={entercahnge} onMouseLeave={leavechange}>
                    <div className="sp1-deital" data-fid={item.fid} onClick={toeditorfav}>编辑信息</div>
                    {
                      defaultfid !== item.fid &&
                      <div className="sp1-delete" data-fid={item.fid} onClick={todeletefav}>删除</div>
                    }
                  </div>
                }
            </div>
          </Link>
          )
        }
      </div>
      <div className="video-right">
        <div className="video-right-title">
          <img src={nowinfos.cover} alt="" className="favlist-leftimg" />
          <div className="favlistrightinfos">
            <div className="fav-listname">{nowinfos.title}</div>
            <div className="fav-userinfos">
              <span style={{marginRight: '15px'}}>创建者: {nowinfos.name}</span>
              <span>播放次数: 0</span>
            </div>
            <div className="fav-userinfos">
              <span className='icon1'>{nowinfos.nums}个内容</span>
              <span className='icon iconfont spicon'>&#xec1e;</span>
              {
                nowinfos.pub === 0 ?
                  <div className='icon1'>公开<div className='icon iconfont sicon'>&#xe8d4;</div></div>
                  :
                  <div className='icon1'>私密<div className='icon iconfont sicon'>&#xe8d5;</div></div>
                }
            </div>
          </div>
        </div>
        {
          opationflag ?
          <div className="control-opation2">
            <div className="co-line1">
              <div className="back-tofav"
                onClick={() => setOpationflag(false)}
              >
                <div className="icon iconfont">&#xe775;</div>
                <span>返回</span>
              </div>
            </div>
            <div className="co-line2">
              <div className="coline2-left">
                <div className="one-co-let">
                  <label htmlFor="ckall">
                    <input id="ckall" type="checkbox" className="checkall"
                      checked={checkedall}
                      value={checkedall}
                      onChange={() => setCheckedall(!checkedall)}
                    />
                    <span>全选</span>
                  </label>
                </div>
                <div className="one-co-let">
                  <div className="delete-video-btn"
                    onClick={deletemang}
                  >
                    取消收藏
                  </div>
                </div>
              </div>
              <div className="coline2-right">已选择{checkednum}个视频</div>
            </div>
          </div>
          :
          <div className="control-opation">
            <div className="opa1"
              onClick={() => {
                if (videolist.length === 0) {
                  return
                }
                setOpationflag(true)
              }}
            >
              <span>批量操作</span>
            </div>
            <div className="opa1">
              {
                sortstyle == 0 ?
                  <span
                  onClick={() => setSortflag(true)}
                >最近收藏</span>
                :
                <span
                  onClick={() => setSortflag(true)}
                >最多播放</span>
              }
              {
                sortflag &&
                <div className="append-two-box">
                  <div className="ap1"
                    onClick={() => choivethissort(0)}
                  >最近收藏</div>
                  <div className="ap1 ap11"
                    onClick={() => choivethissort(1)}
                  >最多播放</div>
                </div>
              }
            </div>
            <div className="searchopabox">
              <input type="text" className="searchinp"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={entertosearch}
              />
              <span className='icon iconfont'
                onClick={ensearch}
              >&#xe6a8;</span>
            </div>
          </div>
        }
        <div className="video-contentparta">
        {
          videolist.map((item, index) =>
          <div className="one-videopart" key={item.id}>
            <div className="one-fav-box1">
              <div className="ofb-out-box">
                <img src={item.cover} alt="" className="ofb-top-img" />
                {
                  opationflag ?
                  <div className="mask-favlist2"
                    onClick={() => clickthisvideochecked(index)}
                  >
                    <input type="checkbox" className="falvcheck"
                      checked={checked[index]}
                      value={checked[index]}
                    />
                  </div>
                  :
                  <div className="mask-favlist1">
                    <div className="tiem-one-box">{item.vidlong}</div>
                    <div className="fav-one-mask-box"
                      data-vid={item.vid}
                      onClick={tovideo}>
                      <span className="fomb-sp">播放: {item.plays}</span>
                      <span className="fomb-sp">收藏: {item.favorites}</span>
                      <span className="fomb-sp">up主: {item.name}</span>
                      <span className="fomb-sp">投稿: {item.time.slice(0, 10)}</span>
                    </div>
                  </div>
                }
              </div>
              <div className="ofb-bt-title"
                data-vid={item.vid}
                onClick={tovideo}
              >{item.title}</div>
              <div className="ofb-bt-info">
                <span className="llspan-p1">收藏于: {item.time.slice(0, 10)}</span>
                <div className="control-box">
                  <span className="rrspan-p2 icon iconfont"
                    onClick={() => {
                      setDeletevid(item.vid)
                      setDeleteindex(index)
                    }}
                  >&#xe653;</span>
                  {
                    deleteindex === index &&
                    <div className="append-deletebox"
                      onClick={deletefavvidedo}
                    >删除视频</div>
                  }
                </div>
              </div>
            </div>
          </div>
          )
        }
        </div>
      </div>
    </div>
  )
}

export default Favlist