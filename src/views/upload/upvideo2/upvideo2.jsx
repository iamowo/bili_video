// 上传动漫 电影  等 官方上传的
import { useState } from "react"
import "./upvideo2.scss"
import SparkMD5 from 'spark-md5' // 切片用
import { useParams } from "react-router-dom"
import { uploadChunks } from "../../../api/video"

function Upvideo2 () {
  const params = useParams()
  const uid = params.uid
  const [topidnex, setTopindex] = useState(0)

  const [title, setTitle] = useState()
  const [intro, setIntro] = useState()
  const [season, setSeason] = useState()         // 第几季
  const [cpttitle, setCpttitle] = useState()     
  const [chapter, setChapter] = useState()
  const [coverimg, setCoverimg] = useState()
  const [coverfile, setCoverfile] = useState()
  const [covertype, setCovertype] = useState()
  const [videofile, setVideofile] = useState()

  useState(() => {
    const getData = async () => {
      const res = 2
    }
    getData()
  },[])

  const addcover = (e) => {
    const file = e.target.files[0]
    const url = URL.createObjectURL(file)
    setCoverimg(url)
    
  }

  const addvideo = (e) => {
    const filedata = e.target.files[0]
    if (!filedata.type.includes('video/')) {
      alert('此文件不是视频类型')
      return
    }
    setVideofile(filedata)
  }

  // 首次上传
  const toupload = async () => {
    const data = {
      title: title,
      uid: uid,
      intro: intro,
      chaptertitle: cpttitle,
      coverimg: coverimg,
      covertype: covertype,
      videofile: videofile,
      type: 1
    }
    if (topidnex === 0) {
    } else if (topidnex === 1) {

    }
  }


  // 上传视频文件===============================================
    // 对文件进行处理,返回buffer数据，hashs值，后缀名，文件名
    const changeBuffer = file => {
      return new Promise(resolve => {
        let fileReader = new FileReader()
        fileReader.readAsArrayBuffer(file)
        fileReader.onload = ev => {
          let buffer = ev.target.result,
              spark = new SparkMD5.ArrayBuffer(),
              HASH,
              suffix;
          spark.append(buffer)
          HASH = spark.end()
          suffix = /\.([a-zA-X0-9]+)$/.exec(file.name)[1];
          resolve({
            buffer,
            HASH,
            suffix,
            filename: `${HASH}.%{suffix}`
          });
        }
      })
    }
  
    // 分片并发送
  const sendresource = async(vid) => {
    let file = videofile;
    if (!file) return
    // 处理文件
    let {
      HASH,
      suffix,         // 后缀
    } = await changeBuffer(file)

    // 文件切片处理(法二:固定大小 √)
    let max = 1024 * 100,
        count = Math.ceil(file.size / max),
        index = 0,
        index2 = 0,
        chunks = []     // 存储切片用的
    if (count > 100) {
      max = file.size / 100
      count = 100
    }
    while (index < count) {
      chunks.push({
        file: file.slice(index * max, (index + 1) * max),
        filename: `${HASH}_${index + 1}.${suffix}`
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
    const complate = async () => {
      // 管控进度条
      index2++;
      let progress = Math.floor(index2 / count * 100) + '%'
      console.log('...:', progress);
      // provalue.value = (index2 / count )* 100
      // done3.value.style.width = progress
      // setPersent(progress)
      // 没有上传完成
      if (index2 === count) {
        // setPersent('100%')
        // setProgress('done')

        // 发送动态, 后端直接发送，不用前端在发送
        // const data = {
        // 
        // }
        // const res = await sendDynamic(data)

      }
    }

    let already = []     // 断点续传，获取已经上传的部分
    // 上传每个切片给服务器
    // fname.value = file.name
    let chunknum = 0
    chunks.forEach(async chunk => {
      // 已经上传的无需在上传
      if (already.length > 0 && already.includes(chunk.filename)) {
        complate()
      }
      let fm = new FormData()
      fm.append('vid', parseInt(vid))
      fm.append('uid', uid)
      fm.append('file', chunk.file)
      fm.append('filename', chunk.filename)
      fm.append('chunsnum', count)    // chunks的数量
      fm.append('index', chunknum++)  // 当前下标
      await uploadChunks(fm).then(res => {
        if (res == 200) {
          // 进度
          complate()
          return;
        }
        // return Promise.reject('error')
      }).catch(() => {
        console.log('上传文件失败');
        // ElMessage({
        //   type: 'error'  ,
        //   message: '上传文件失败'
        // })
      })
    })
    
    }
  return (
    <div className="upvideo2-view">
      <div className="up2-title">
        <div className={topidnex === 0 ? "up2-one-type up2-active" : "up2-one-type"}>
          <span onClick={() => setTopindex(0)}>新上传</span>
        </div>
        <div className={topidnex === 1 ? "up2-one-type up2-active" : "up2-one-type"}>
          <span onClick={() => setTopindex(1)}>上传续集</span>
        </div>
      </div>
      <div className="up2-infos-box1">
        <div className="up2-one-line">
          <input type="text" className="inp1" placeholder="标题"
            value={title} onChange={(e) => setTitle(e.target.value)}/>
        </div>
        {
          topidnex === 0 &&
          <div className="up2-one-line2">
            <textarea type="text" className="inp2" placeholder="简介"
              value={intro} onChange={(e) => setIntro(e.target.value)}
            ></textarea>
          </div>
        }
        {
          topidnex === 0 &&
          <div className="add-cover-box">
            <span className="acb-span">点击添加封面</span>
            {
              coverimg != null &&
              <img src={coverimg} alt="" className="cover-img" />
            }
            <input type="file" className="addcover-b" accept="image/*" onChange={addcover}/>
          </div>
        }
      </div>
      <div className="up2-content">
        {
          topidnex === 1 &&
          <div className="continue-update">
            <div className="left-video-img">1</div>
            <div className="right-infos">
              <div className="ri-title1"></div>
              <div className="ri-intro"></div>
              <div className="ri-infos"></div>
            </div>
          </div>
        }
        <div className="up2-zone-line">
          <div className="up2-zone-box">
            <div className="add-one-video">
              <span className="icon iconfont">&#xe643;</span>
              <span className="aov-add">点击添加视频</span>
              <input type="file" className="inpvideo" accept="video/*" onChange={addvideo}/>
            </div>
            {
              videofile != null &&
              <div className="add-one-video2">
                <div className="aov-line1">{videofile.name}</div>
                <div className="aov-line2">
                  <span className="icon iconfont">&#xe69e;</span>
                  <span>上传成功</span>
                </div>
              </div>
            }
          </div>
        </div>
        <div className="up2-infos-box">
          <div className="up2-one-line">
              <input type="text" className="inp1" placeholder="第几季"
                value={season} onChange={(e) => setSeason(e.target.value)}
              />
              <span className="numsspan">请填写阿拉伯数字</span>
            </div>
          <div className="up2-one-line">
            <input type="text" className="inp1" placeholder="章节标题"
              value={cpttitle} onChange={(e) => setCpttitle(e.target.value)}
            />
            <span className="numsspan">{cpttitle != null ? cpttitle.length : 0}/80</span>
          </div>
          <div className="up2-one-line">
            <input type="text" className="inp1" placeholder="章节"
              value={chapter} onChange={(e) => setChapter(e.target.value)}
            />
          </div>
        </div>
        <div className="up2-bottom">
          <div className="toupload" onClick={toupload}>上传</div>
        </div>
      </div>
    </div>
  )
}

export default Upvideo2