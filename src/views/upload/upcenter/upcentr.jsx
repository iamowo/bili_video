import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import './index.scss'
import { useState, useRef, useEffect } from 'react'
import { uploadVideoInfos, uploadChunks, mergeChunks, getAlready } from '../../../api/video'
import SparkMD5 from 'spark-md5' // 切片用
import { getUserVideoList, addVideoList } from '../../../api/videolist'
import { baseurl } from '../../../api'
import { getUploadAniList } from '../../../api/animation'
import message from '../../../components/notice/notice'
import { fileToBase64 } from '../../../util/fnc'
import VdieoCoverCrop from '../../../components/ImageCrop/VideoCoverCrop'

function Upcenter () {
  const [upindex, setUpindex] = useState(0)  // 0视频   1 漫画
  const params = useParams()
  const uid = params.uid
  const type = params.type  // 没用

  
  const containerRef = useRef(),
        inputRef = useRef();
  const [upprogress, setProgress] = useState('ready'),    //' ready uploading infos done
        [videofile, setVideoFile] = useState(null),   
        [seasonflag, setSeasonflag] = useState(false),     // 连续剧？
        [vidcover, setCover] = useState(null),            // cover url(默认时第一帧)（base64文件）
        [coverfile, setCoverfile] = useState(''),         // 封面的file，上传时时base64格式
        [upcovertype, setUpcovertype] = useState(0),      // 0 使用视频抽帧做封面   1 使用自定义图片
        [videoname, setOldtitle] = useState(''),          // 原来title，不可变
        [titleinp, setTileler] = useState(''),            // 标题
        [introinp, setIntroinp] = useState(''),           // 简介
        [tags, setTags] = useState(''),                   // 字符传形式的tags
        [tagList, setTagList] = useState([]),                 // tags 的数组形式
        [maintag, setMaintag] = useState(''),             // 主tag  分类
        [videoduration, setDuration] = useState(0),   
        [vidtype, setVidType] = useState(''),             // 上传视频文件类型
        [videosrc, setVideosrc] = useState(),             // 上传视频的链接
        [uppersent, setPersent] = useState(0)             // 文件上传服务器进度

  const [listflag, setListflag] = useState(0),            // 选择视频列表flag  1 选择  2 新建
        [listindex, setListindex] = useState(-1),          // 选择第几个列表
        [videolisttoselect, setVideotoselect] = useState([]),     // 个人的视频列表
        [listtitle, setListtitle] = useState(""),
        [listintro, setListintro] = useState("")

  const [listflag2, setListflag2] = useState(false),
        [listindex2, setListindex2] = useState(-1),          // 选择第几个列表
        [animationlist, setAnimationlist] = useState([])     // 继续上传的列表

  const [seasonnum, setSeasonnum] = useState(),
        [chapternum, setChapternum] = useState(),
        [chaptertitle, setChaptertitle] = useState("")

  const mtagref = useRef()
  const watchref = useRef()
  const spanref = useRef()

  const [upviewflag, setUpviewflag] = useState(false)  //上传封面页面
  const [maintaglist, setMaintaglist] = useState([
    '日常', '游戏', '音乐', '动漫', '电影', '搞笑', '电视剧', 'VLOG'
  ])


  useEffect(() => {
      const getData = async () => {
        const res = await Promise.all([getUserVideoList(uid), getUploadAniList(uid)])
        console.log('res is:', res);
        setVideotoselect(res[0])
        setAnimationlist(res[1])
      }
      getData()
      window.addEventListener('click', (e) => {
          if (e.target.className === 'input2box'||
              e.target.className === 'icon iconfont watchmore' ||
              e.target.className === 'inp2span')
          {
            mtagref.current.style.opacity = "1"
            mtagref.current.style.translate = "0 0"
            watchref.current.style.rotate = '90deg'
          } else if ((mtagref.current != null && !mtagref.current.contains(e.target)) || e.target.className === 'one-main-tag-s') {
            mtagref.current.style.opacity = '0'
            mtagref.current.style.translate = '100vw 0'
            watchref.current.style.rotate = '0deg'
          }
      })
  },[])

  const videofileref = useRef()
  const openfileselect = () => {    
    videofileref.current.click()
  }

  // 拖拽上传
  const dropfile1 = (e) => {   
    e.preventDefault()
    const thisfile = e.dataTransfer.files[0]
    changevideoinp(thisfile)
  }

  // 添加视频
  const changevideoinp = (dragfile, e) => {
    // 监察文件格式，判断是不是 视频
    let filedata = null
    if (dragfile !== null) {
      filedata = dragfile
    } else {
      filedata = e.target.files[0]
    }
    if (!filedata.type.includes('video/')) {
      message.open({type: 'warning', content: '此文件不是视频类型'})
      return
    }
    setOldtitle(filedata.name.split(".")[0])
    setTileler(filedata.name.split(".")[0])
    setVideoFile(filedata)  // 视频文件
    setVidType(filedata.type.split('/')[1])
    // 获取视频时长
    const url = URL.createObjectURL(filedata);
    setVideosrc(url)
    const filelement = new Audio(url);
    filelement.addEventListener("loadedmetadata", function (_event) {
      let duration = filelement.duration; // 得到视频或音频的时长，单位秒
      // console.log(typeof duration);
      setDuration(Math.floor(duration))
    });
    setProgress('infos')  // 下一步
  }

  // 对文件进行处理,返回buffer数据，hashs值，后缀名，文件名
  const changeBuffer = (file) => {
    return new Promise(resolve => {
      let fileReader = new FileReader()
      fileReader.readAsArrayBuffer(file)
      fileReader.onload = (e) => {
        let buffer = e.target.result,
            spark = new SparkMD5.ArrayBuffer(),
            HASH,
            suffix;
        spark.append(buffer)
        HASH = spark.end()
        suffix = /\.([a-zA-X0-9]+)$/.exec(file.name)[1];
        resolve({
          buffer,                              
          HASH,                               // hash值
          suffix,                             // 后缀名
          filename: `${HASH}.%{suffix}`       // 生成的文件名
        });
      }
    })
  }

  // 上传视频信息
  const touploadvideo = async (e) => {
    if (titleinp === "" || maintag === "" || vidcover === null) {
      message.open({type: 'warning', content: '缺少必要信息'})
      return
    }
    // 视频文件
    let file = videofile;
    if (!file) return
    // 处理后文件信息
    let {
      HASH,
      suffix
    } = await changeBuffer(file)
    console.log('视频HASH:', HASH);
    // 断点续传，获取已经上传的部分
    let already = [],
        thisvid = null
    // 获取已经上传的切片信息
    try {
      const res = await getAlready(HASH, uid);
      already = res.already
      thisvid = parseInt(res.vid)
    } catch (err) {}
    console.log("=============:",thisvid, "===: ", already);
    // 上传视频信息（标题，简介等。。。。
    if (thisvid === -1) {
      // 还没上传过此视频
      const data = {
        title: titleinp,
        uid: uid,
        intro: introinp,
        duration: videoduration,
        cover: vidcover,
        maintag: maintag,
        othertags: tagList.join(" "),
        hashValue: HASH,
        listid: listindex !== -1 ? videolisttoselect[listindex].listid : -1,
        aid: listindex2 !== -1 ? animationlist[listindex2].aid : -1,
        type: seasonflag ? 1 : 0,
        season: seasonnum,
        chapter: chapternum,
        chaptertitle: chaptertitle
      }
      console.log('upload data:', data);
      thisvid = await uploadVideoInfos(data) // 返回vid
      // 添加到视频列表
    }
    setProgress('uploading')  // 跳转到上传页面
    sendresource(thisvid, file, HASH, suffix, already)
  }

  // 分片并发送
  const sendresource = async(vid, file, HASH, suffix, already) => {
    // 文件分片
    // 方法一： 固定切片大小，一个切片1MB，如果文件太大，会导致上传个数太多导致处理变慢
    let max = 1024 * 1024,
        count = Math.ceil(file.size / max),
        index = 0,
        chunks = []     // 存储切片用的
    // 法二:固定大小切片个数 √
    if (count > 100) {
      max = file.size / 100
      count = 100
    }
    while (index < count) {
      chunks.push({
        file: file.slice(index * max, (index + 1) * max),
        filename: `${HASH}_${index + 1}.${suffix}`   // 每个切片的名字
      })
      index++
    }
    
    //处理样式
    const clear = () => {
      // flagAni.value = true
      setTimeout(() => {
        window.location.reload();
      }, 1500)
    }

    // 上传成功的处理
    index = 0
    const complate = async () => {
      // 管控进度条
      ++index;
      let progress = index / count * 100
      setPersent(progress)
      // 没有上传完成
      console.log(index , count);
      if (index >= count) {
        if (seasonflag) {
          // 连续剧
          await mergeChunks(uid, vid, 1)
        } else {
          await mergeChunks(uid, vid, 0)
        }
        setPersent(100)
      }
    }

    // 上传每个切片给服务器
    chunks.forEach(async chunk => {
      // 已经上传的无需在上传
      if (already.length > 0 && already.includes(chunk.filename)) {
        complate()
        return
      }
      let fm = new FormData()
      fm.append('vid', +vid)
      fm.append('uid', uid)
      fm.append('file', chunk.file)
      fm.append('filename', chunk.filename)
      await uploadChunks(fm).then(res => {
        if (+res === 200) {
          // 进度
          complate()
          return;
        }
        return Promise.reject('error')
      }).catch(() => {
        message.open({type: 'error', content: '上传文件失败', flag: true})
        setTimeout(() => {
          document.location.reload()
        }, 2000)
      })
    })
    
  }

  useEffect(() => {
    if (uppersent >= 100) {
      setProgress('done')
      message.open({type: 'info', content: '上传成功', flag: true})
    }
  }, [uppersent])
  
// ----------------------------------

  const upmore = () => {
    setProgress('ready')
    window.location.reload()
  }

  // 添加标签
  const addTag = (tag) => {
    if (tag.trim() && !tagList.includes(tag.trim())) {
      const keywordlistNew = [...tagList, tag.trim()];
      setTagList(keywordlistNew);
      setTags("");
    }
  };

  // 删除标签
  const removeTag = (index) => {
    const keywordlistNew = tagList.filter((_, i) => i !== index);
    setTagList(keywordlistNew);
  };

  // 回车确定tag
  const hadndleKeyDonw = (e) => {
    if (e.key === 'Enter' && tags.trim()) {
      e.preventDefault()
      addTag(tags)
      setTags("")
    } else if (e.key === "Backspace" && !tags && tagList.length > 0) {
      // 删除最后一个标签
      removeTag(tagList.length - 1);
    }
  }

  const clickthistag = (e) => {
    const text = e.target.dataset.text
    setMaintag(text)    
  }

  const tocloseupview = (e) => {
    setUpviewflag(false)
  }

  // 获取视频第一帧
  const videoref = useRef()
  // 给video加上proload=true之后就可一预加载出来了
  const videoloadeddata = () => {    
    let canvas = document.createElement("canvas");
    canvas.width = 1280
    canvas.height = 960
    let ctx = canvas.getContext('2d');
    ctx.drawImage(videoref.current, 0, 0, 1280, 960)
    const dataurl = canvas.toDataURL('image/png')
    // console.log('data,',dataurl);
    setCover(dataurl)
    // setCoverbase64()
  }

  // 创建新的视频列表
  const tocreateList = async () => {
    const data = {
      uid: uid,
      title: listtitle,
      intro: listintro,
    }
    const res = await addVideoList(data)
    if (res) {
      const res2 = await getUserVideoList(uid)
      setVideotoselect(res2)
    }
    setListflag(0)
  }

   // 点击容器聚焦输入框
  const handleContainerClick = () => {
    inputRef.current.focus();
  };

  return (
    <div className="upcenter-allbox">
      <div className="upcenter-box">
        <video ref={videoref}
          draggable
          src={videosrc != null ? videosrc : null}
          preload="auto"
          className="videeo"
          onLoadedData={videoloadeddata}  
        ></video>
        <div className="up-title">
        {
          upprogress === 'ready' &&
          <div className='ready-pro'>
             <div className="one-uptype">
              {/* 开头加 / 从头开始， 不加/ 在原来基础上添加 */}
              <Link to={`/${uid}/platform/upload/video`}>
                <span>视频投稿</span>
                {
                  upindex === 0 &&
                  <div className="active-btm"></div>
                }
              </Link>
            </div>
            {/* <div className="one-uptype">
              <Link to={`${uid}/platform/upload/mg`}>
                <span>漫画投稿</span>
                {
                  upindex === 1 &&
                  <div className="active-btm"></div>
                }
              </Link>
            </div> */}
          </div>
        }
        {
          upprogress === 'infos' &&
          <span className="upinfos-span">发布视频</span>
        }
        </div>
        <div className="up-conetnt">
          {
            type === 'video' && upprogress === 'ready' &&
            <div className="video-uploader"
              onDragOver={(e) => e.preventDefault()}
              onDrop={dropfile1}
            >
              <input type="file"
                ref={videofileref}
                className="upvideo-inp"
                accept="video/*"
                onChange={(e) => changevideoinp(null, e)}
              />
              <span className="text-up-span">上传视频大小不超过3GB~</span>
              <div className="video-uocent" onClick={openfileselect}>
                点击或拖拽上传视频
              </div>
            </div>
          }
          {
            type === 'video' && upprogress === 'uploading' &&
            <div className="uploading-box">
              <span className="pro-text">上传进度: {Math.floor(uppersent)} %</span>
              <div className="progress-loading-box">
                <div className="plb-done" style={{width: uppersent + "%"}}></div>
              </div>
            </div>
          }
          {
            type === 'video' && upprogress === 'infos' &&
            <div className="infos-box-up">
              <div className="had-up-infos">
                <div className="hadupload-box">
                  <div className="hadup-box-line1">{videoname}</div>
                  <div className="hadup-box-line2">
                    <span className="icon iconfont">&#xe616;</span>
                    <span className="hadup-span">已经上传</span>
                  </div>
                </div>
              </div>
              {
                
                <div className="addtovidellist-line">
                  <div className="al-left1">连续剧</div>
                  <div className={seasonflag ? "switchbox1 switchbox2" : "switchbox1"}
                    onClick={() => setSeasonflag(!seasonflag)}
                  >
                    <div className="switch-box"></div>
                  </div>
                </div>
              }
              {
                seasonflag ?
                <div className="addtovidellist-line">
                  <div className="al-left1">添加番剧列表</div>
                  <div className="al-right"
                  onClick={() => setListflag2(true)}
                >
                    <span className="numspan">{listindex2 !== -1 ? animationlist[listindex2].title : null}</span>
                  </div>
                </div>
                :
                <div className="addtovidellist-line">
                  <div className="al-left1">添加到视频列表</div>
                  <div className="al-right"
                    onClick={() => setListflag(1)}
                  >
                    <span className="numspan">{listindex !== -1 ? videolisttoselect[listindex].title : null}</span>
                  </div>
                </div>
              }
              {
                listflag > 0  &&
                  <div className="select-view-list">
                    {
                      listflag === 1 ?
                      <div className="list-box-tos">
                        <div className="lbt-line1x">
                          <span>选择列表</span>
                          <div className="icon iconfont"
                            onClick={() => {
                              setListindex(-1)
                              setListflag(0)
                            }}
                          >&#xe643;</div>
                        </div>
                        <div className="lbt-content">
                          <div className="lbt-innerbox">
                            {
                              videolisttoselect.map((item, index) =>
                                <div className={listindex === index ? "one-lbt-box olb-active" : "one-lbt-box"}
                                  key={item.id}
                                  onClick={() => {
                                    setListindex2(-1)
                                    setListindex(index)
                                  }}
                                >
                                  <div className="llbt-left-cover">
                                    <img src={item.cover} alt="" className="llbt-cover-img" />
                                  </div>
                                  <div className="llbt-right-info">
                                    <div className="llb-right-title">{item.title}</div>
                                    <div className="llb-nums">视频数量:{item.nums}</div>
                                  </div>
                                </div>
                              )
                            }
                            {
                              videolisttoselect.length === 0 &&
                              <div className="noresult-videw">
                                <div className="noresult-img"
                                  style={{background: `url(${baseurl}/sys/nodata02.png)`,
                                                      backgroundPosition: 'center 50px',
                                                      backgroundRepeat: 'no-repeat'}}>
                                </div>
                                <div className="noresult-text">没有视频列表~</div>
                              </div>
                            }
                          </div>
                        </div>
                        <div className="lbt-bottom">
                          <div className="lb-btn1"
                            onClick={() => setListflag(2)}
                          >新建视频列表</div>
                          <div className="lb-btn2"
                            onClick={() => setListflag(0)}
                          >确定</div>
                        </div>
                      </div>
                      :
                      <div className="list-box-tos">
                        <div className="lbt-line1x">
                          <span>新建视频列表</span>
                          <div className="icon iconfont"
                            onClick={() => setListflag(0)}
                          >&#xe643;</div>
                        </div>
                        <div className="newlist-name-line1">
                          <input type="text" className="titleinp"
                            value={listtitle}
                            maxLength={20}
                            onChange={(e) => setListtitle(e.target.value)}
                          />
                          <div className="inp-title">{listtitle.length} / 20</div>
                        </div>
                        <div className="newlist-intro-line2">
                          <textarea name="" id="" className='introinp'
                            value={listintro}
                            onChange={(e) => setListintro(e.target.value)}
                          ></textarea>
                        </div>
                        <div className="lbt-bottom">
                          <div className="lb-btn1"
                            onClick={() => {
                              setListtitle("")
                              setListintro("")
                              setListindex(-1)
                              setListflag(1)
                            }}
                          >取消</div>
                          <div className="lb-btn2"
                            onClick={tocreateList}
                          >确定</div>
                        </div>
                      </div>
                    }
                  </div>
              }
              {
                listflag2 &&
                <div className="select-view-list">
                  <div className="list-box-tos">
                    <div className="lbt-line1x">
                      <span>选择番剧列表</span>
                      <div className="icon iconfont"
                        onClick={() => {
                          setListindex2(-1)
                          setListflag2(false)
                        }}
                      >&#xe643;</div>
                    </div>
                    <div className="lbt-content">
                      <div className="lbt-innerbox">
                        {
                          animationlist.map((item, index) =>
                            <div className={listindex2 === index ? "one-lbt-box olb-active" : "one-lbt-box"}
                              key={item.aid}
                              onClick={() => {
                                setListindex(-1)
                                setListindex2(index)
                              }}
                            >
                              <div className="llbt-left-cover">
                                <img src={item.cover} alt="" className="llbt-cover-img" />
                              </div>
                              <div className="llbt-right-info">
                                <div className="llb-right-title">{item.title}</div>
                                <div className="llb-nums">共 {item.chapters} 级</div>
                              </div>
                            </div>
                          )
                        }
                        {
                          animationlist.length === 0 &&
                          <div className="noresult-videw">
                            <div className="noresult-img"
                              style={{background: `url(${baseurl}/sys/nodata02.png)`,
                                                  backgroundPosition: 'center 50px',
                                                  backgroundRepeat: 'no-repeat'}}>
                            </div>
                            <div className="noresult-text">没有视频列表~</div>
                          </div>
                        }
                      </div>
                    </div>
                    <div className="lbt-bottom">
                      <div className="lb-btn1"
                        onClick={() => {
                          setListindex2(-1)
                          setListflag2(false)
                        }}
                      >取消</div>
                      <div className="lb-btn2"
                        onClick={() => setListflag2(false)}
                      >确定</div>
                    </div>
                  </div>
                </div>
              }
              <div className="upbox-title2">基本信息</div>
              <div className="one-upbox3">
                <div className="left-text-spancover">封面
                  <span style={{color: "pink"}}>*</span>
                </div>
                <div className="right-coverbox">
                  <div className="upmask"
                    onClick={() => setUpviewflag(true)}
                  ></div>
                  <span className="icon iconfont">+</span>
                  { 
                    vidcover !== null &&
                    <img src={vidcover} alt="" className="upimg" />                  
                  }
                  <div className="bottom-tow-box">
                    <span className="one-btn-toclick"
                      onClick={() => setUpviewflag(true)}
                    >更改封面</span>
                    <span className="two-mid-line"></span>
                    <span className="one-btn-toclick">封面模板</span>
                  </div>
                </div>
                {
                  upviewflag &&
                  <VdieoCoverCrop 
                    upcovertype={upcovertype}
                    setUpcovertype={setUpcovertype}
                    tocloseupview={tocloseupview}
                    coverfile={coverfile}
                    setCoverfile={setCoverfile}
                    vidcover={vidcover}
                    setCover={setCover}
                    videofile={videofile}
                    setVideoFile={setVideoFile}
                  />
                }
              </div>
              <div className="one-upbox">
                <div className="left-text-span">标题
                <span style={{color: "pink"}}>*</span>
                </div>
                <div className="title-out-box">
                  <input type="text" className="rightinp"
                    maxLength={60}
                    onChange={(e) => setTileler(e.target.value)}
                    value={titleinp}
                  />
                  <div className="spical-sp1">{titleinp.length} / 60</div>
                </div>
              </div>
              <div className="one-upbox2">
                <div className="left-text-span">简介</div>
                <div className="intro-box">
                  <textarea className='rightinp'
                    onChange={(e) => setIntroinp(e.target.value)}
                    value={introinp}>
                  </textarea>
                </div>
              </div>
              <div>
                <div className="one-upbox" style={{marginTop: '30px'}}>
                  <div className="left-text-span">分类
                    <span style={{color: "pink"}}>*</span>
                  </div>
                  <div className="input-box-main-tag">
                    <div className="input2box">
                      <span className='inp2span'
                        ref={spanref}
                        style={{visibility: maintag.length > 0 ? 'visible' : 'hidden'}}
                      >{maintag}</span>
                      <div className="icon iconfont watchmore" ref={watchref}>&#xe775;</div>
                    </div>
                      <div className="selectMaintag" ref={mtagref}>
                        <div className="maintag-title">选择主标签</div>
                        <div className="tag-content">
                          <div className="innercontent-up">
                            {
                              maintaglist.map(item =>
                                <div className="one-main-tag-s"
                                data-text={item} key={item}
                                onClick={clickthistag}
                                >{item}</div>
                              )
                            }
                          </div>
                        </div>
                      </div>
                  </div>
                </div>
                <div className="one-upbox"
                  style={{marginTop: '30px'}}>
                  <div className="left-text-span">tags</div>
                  <div className="input-out-box1"
                    ref={containerRef}
                    onClick={handleContainerClick}
                  >
                    {
                      tagList.map((item, index) =>
                        <div className="onetags">
                          <span>{item}</span>
                          <span className="icon iconfont"
                            onClick={() => removeTag(index)}>&#xe7b7;</span>
                        </div>
                      )                        
                    }
                    {/* </div> */}
                    <input type="text"
                        ref={inputRef}
                        className="rightinptags"
                        onChange={(e) => setTags(e.target.value)}
                        value={tags}
                        onKeyDown={hadndleKeyDonw}
                    />
                    <span className="ss-sp">* 按回车输入tag</span>
                    <span className="ss-sp2">{tagList.length} / 10</span>
                  </div>
                </div>
              </div>
              {
                seasonflag &&
                  <div>
                    <div className="one-upbox">
                      <div className="left-text-span">季
                      <span style={{color: "pink"}}>*</span>
                      </div>
                      <div className="title-out-box">
                        <input type="text" className="rightinp"
                          maxLength={10}
                          onChange={(e) => setSeasonnum(e.target.value)}
                          value={seasonnum}
                        />
                        <div className="spical-sp1">请输入数字</div>
                      </div>
                    </div>
                    <div className="one-upbox">
                      <div className="left-text-span">章节
                      <span style={{color: "pink"}}>*</span>
                      </div>
                      <div className="title-out-box">
                        <input type="text" className="rightinp"
                          maxLength={60}
                          onChange={(e) => setChapternum(e.target.value)}
                          value={chapternum}
                        />
                        <div className="spical-sp1">请输入数字</div>
                      </div>
                    </div>
                    <div className="one-upbox">
                      <div className="left-text-span">章节名
                      <span style={{color: "pink"}}>*</span>
                      </div>
                      <div className="title-out-box">
                        <input type="text" className="rightinp"
                          maxLength={30}
                          onChange={(e) => setChaptertitle(e.target.value)}
                          value={chaptertitle}
                        />
                        <div className="spical-sp1">{chaptertitle.length} / 30</div>
                      </div>
                    </div>
                  </div>
              }
              <div className="upsnebtn"
                onClick={touploadvideo}
              >上传</div>
            </div>
          }
          {
            type === 'video' && upprogress === 'done' &&
            <div className="done-divbox">
              <span>视频上传完成,等待审核通过~</span>
              <div className="btnline">
                <div className="backtohome">
                  <Link to="/">返回主页</Link>
                </div>
                <div className="onemore" onClick={upmore}>继续上传</div>
              </div>
            </div>
          }
          {
            type === 'mg' &&
            <div className="mg-uploader">mg</div>
          }
        </div>
      </div>
    </div>
  )
}

export default Upcenter