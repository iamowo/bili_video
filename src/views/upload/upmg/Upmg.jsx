import { useEffect, useRef, useState } from "react"
import "./Upmg.scss"
import { uploadMgInfo, uploadMgImg, getByTitle, updateMg } from "../../../api/mg"
import { useParams } from "react-router-dom"

function Upmg() {
  const params = useParams()
  const uid = parseInt(params.uid)
  
  const mgsref = useRef()
  const coverref = useRef()
  const [imgfile, setImgfile] = useState([])             // 要上传的图片
  const [attentionview, setAttention] = useState(false)  // 注意页面
  const [addcoverflag, setAddcoverflag] = useState(false)

  const [titleinp, setTitleinp] = useState(""),
        [authorinp, setAuthorinp] = useState(""),
        [chapterindexinp, setChapterindexinp] = useState(1),
        [chapternameinp, setChapternameinp] = useState(""),
        [introinp, setIntroinp] = useState(""),
        [tags, setTgas] = useState(""),                    // tags
        [coverbase, setCoverbase] = useState(""),
        [doneflag, setDoneflag] = useState(false)

  const [titleres, setTitleres] = useState([])
  const [coverurl, setCoverurl] = useState(null)
  const [oldmid, setOldmid] = useState(-1)            // 上传续集，漫画的mid

  const [uploading, setUploading] = useState(false),   // 是否在上传
        [upprogress, setUpprogress] = useState(0)

  // 上传漫画图片
  const addImg = (e) => {
    const files1 = e.target.files
    if (files1.length === 0) {
      alert('文件夹为空')
      return
    }
    console.log(files1);
    
    let files = []
    for (let i = 0; i < files1.length; i++) {
      if (files1[i].type.includes("image/")) {
        files.push(files1[i])
      }
    }
    // 对files排序
    console.log(files);
    
    if (files.length === 0) {
      alert('请确认，该文件夹中没有图片格式')
    }
    setImgfile(files.sort())
  }

  function sortByFileName (files) {

  }

  const changetitle = async (e) => {
    const kw = e.target.value
    setTitleinp(kw)
    if (kw.length > 0) {
      console.log(kw);
      
      const res = await getByTitle(kw)
      console.log("res:", res);
      setTitleres(res)
      // kw 和 搜索标题完全一致
      for (let i = 0 ; i < res.length; i++) {
        if (res[i].title === kw) {
          setTitleinp(res[i].title)
          setOldmid(res[i].mid)
          setChapterindexinp(res.length  +1)
          return
        }
      }
      setOldmid(-1)
    } else {
      setOldmid(-1)
      setTitleres([])
    }
    
  }


  // 添加视频封面
  const addcoverimg = async (e) => {
    const url = URL.createObjectURL(e.target.files[0])    
    setCoverurl(url)
    // file => base64
    const res = await fileToBase64(e.target.files[0])
    setCoverbase(res)
  }
  // file 转 base64
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      // 创建一个新的 FileReader 对象
      const reader = new FileReader();
      // 读取 File 对象
      reader.readAsDataURL(file);
      // 加载完成后
      reader.onload = function () {
        // 将读取的数据转换为 base64 编码的字符串
        const base64String = reader.result.split(",")[1];
        // 解析为 Promise 对象，并返回 base64 编码的字符串
        resolve(base64String);
      };
   
      // 加载失败时
      reader.onerror = function () {
        reject(new Error("Failed to load file"));
      };
    });
  }

  // 上传信息 or 更新
  const toupload = async () => {
    if (imgfile.length === 0) {
      alert("待上传文件为空")
      return
    }
    if (oldmid === -1) {
      if (titleinp === "" || coverbase === "") {
        alert("缺少必要信息")
        return
      }
      const tags1 = tags.trim().split(" ").filter(item => item !== " ")
      const data = {
        uid: uid,
        title: titleinp,
        author: authorinp,
        intro: introinp,
        coverfile: coverbase,
        done: doneflag ? 1 : 0,
        taglist: tags1,
        name: chapternameinp,
        number: chapterindexinp === "" ? 1 : chapterindexinp
      }
      const mid = await uploadMgInfo(data)
      uploadimg(mid);
    } else {
      const data = {
        mid: oldmid,
        title: titleinp,
        number: chapterindexinp,
        name: chapternameinp,
        done: doneflag ? 1 : 0
      }
      console.log(data);
      const res = await updateMg(data)
      uploadimg(oldmid)
    }
  }

  // 上传图片
  const uploadimg = (mid) => {
    imgfile.forEach((item, index) => {
      setTimeout(async () => {
        const data = new FormData()
        data.append('mid', mid)
        data.append('title', titleinp)      
        data.append('imgfile', item)
        data.append('type', item.name.split(".")[1])
        data.append("number", chapterindexinp === "" ? 1 : chapterindexinp)
        data.append("name", chapternameinp)
        data.append("uploadindex", index + 1)
        data.append("ind", index)
        const res = await uploadMgImg(data)
        if (index === 0) {
          setUploading(true)
        }
        if (res) {
          const progress = (index / imgfile.length * 100).toFixed(2)
          setUpprogress(progress)
        }
        if (res && index === imgfile.length - 1) {
          setUpprogress(100)
        }
      },0)
    })
  }

  useEffect(() => {
    if (upprogress === 100) {
      alert("上传成功")
    }
  }, [upprogress])
  return (
    <div className="upmg-view">
      <div className="upmg-box">
        <div className="upmg-title">上传漫画</div>
        <div className="upload-part">
          <div className="add-mg-box"
            onClick={() => setAttention(true)}
          >点击添加文件夹+</div>
          <input
            type="file"
            className="mgfile"
            ref={mgsref}
            Webkitdirectory='true'
            onChange={addImg}
          />
          {
            imgfile.length > 0 &&
            <div className="upreslut-box">
              <div className="file-title">文件上传成功</div>
              <div className="file-nums">文件个数:{imgfile.length}</div>
            </div>
          }
        </div>
        {
          attentionview &&
          <div className="attention-view">
            <div className="attention-box">
              <div className="attention1">
                <span>注意</span>
                <div className="iconbox">
                  <span className="icon iconfont"
                    onClick={() => setAttention(false)}
                  >&#xe643;</span>
                </div>
              </div>
              <div className="attention2">请上传文件夹,文件夹中的图片名称应按顺序排列好，以避免出现乱序</div>
              <div className="attention3"
                onClick={() => {
                    setAttention(false)
                    mgsref.current.click()
                  }
                }
              >确认</div>
            </div>
          </div>
        }
        <div className="one-upimg-line3">
          <div className="div3-outbox">
            <div className="text-span">标题<span style={{color: 'pink'}}>*</span></div>
            <input type="text" className="titlespan"
              value={titleinp}
              onChange={changetitle}
            />
            {
              oldmid !== -1 &&
              <div className="hadselectd-box">已选择漫画 (mid: {oldmid})</div>
            }
          </div>
          {
            titleres.length > 0 && oldmid === -1 &&
            <div className="res-append">
              {
                titleres.map(item =>
                  <div className="one-res-box"
                    key={item.mid}
                    onClick={() => {
                      setTitleinp(item.title)
                      setOldmid(item.mid)
                      setChapterindexinp(titleres.length  +1)
                    }}
                  >
                    <div className="left-img-cover">
                      <img src={item.cover} alt="" />
                    </div>
                    <div className="dirght-info-box">
                      <div className="info-right-line"><span className="titlesp">{item.title}</span></div>
                      <div className="info-right-line"><span className="authorsp">{item.author}</span></div>
                      <div className="info-right-line">
                        <div className="tags">
                          <div className="one-tag">213</div>
                        </div>
                      </div>
                      <div className="info-right-line">
                        {
                          item.done === 0 ?
                          <span className="authorsp">章节更新至第{item.chapters}章</span>
                          :
                          <span className="authorsp">已完结，一共{item.chapters}章</span>
                        }
                      </div>
                    </div>
                  </div>
                )
              }
            </div>
          }
        </div>
        {
          oldmid === -1 ?
          <div className="other-content">
            <div className="one-upimg-line">
              <div className="text-span">作者</div>
              <input type="text" className="titlespan"
                value={authorinp}
                onChange={(e) => setAuthorinp(e.target.value)}
              />
            </div>
            <div className="one-upimg-line">
              <div className="text-span">tags</div>
              <input type="text" className="titlespan" 
                placeholder="tag之间用空格隔开,最多6个tag"
                value={tags}
                onChange={(e) => setTgas(e.target.value)}
              />
            </div>
            <div className="one-upimg-line2">
              <textarea name="" id="" placeholder="简介" className="introinp"
              value={introinp}
                onChange={(e) => setIntroinp(e.target.value)}
              ></textarea>
            </div>
            <div className="chapter-line">
              <div className="one-upimg-linecp spcp1">
                <div className="text-span">章节名称</div>
                <input type="text" className="titlespan"
                  value={chapternameinp}
                  onChange={(e) => setChapternameinp(e.target.value)}
                />
              </div>
              <div className="one-upimg-linecp">
                <div className="text-span">章节顺序</div>
                <input type="text" className="titlespan"
                  value={chapterindexinp}
                  onChange={(e) => setChapterindexinp(e.target.value)}
                />
              </div>
            </div>
            <div className="addcover">
              <span>添加封面<span style={{color: 'pink'}}>*</span> + </span>
              <input type="file"
                ref={coverref}
                className="addcoverinput"
                accept="image/*"
                onChange={addcoverimg}
              />
              {
                coverurl !== null &&
                <img src={coverurl} alt="" className="showimg" />
              }
              {
                addcoverflag &&
                <view className="cover-view">
                  <div className="cover-box">
                    <div className="cover-title">剪裁封面</div>
                    <div className="img-content">
                      <div className="left-img-content">
                        <div className="img-out-box-suit">
                          <img src={coverurl} alt="" className="cover-img1" />
                          <div className="changesizebox">
                            <div className="tlbox"></div>
                            <div className="trbox"></div>
                            <div className="blbox"></div>
                            <div className="brbox"></div>
                          </div>
                        </div>
                      </div>
                      <div className="right-img-content"></div>
                    </div>
                    <div className="bnt-line">
                      <div className="cahngimg"
                        onClick={() => coverref.current.click()}
                      >更换</div>
                      <div className="sned-img-bnt"
                        onClick={() => setAddcoverflag(false)}
                      >确定</div>
                    </div>
                  </div>
                </view>
              }
              <div className="cover-control"
                onClick={() => {
                  coverref.current.click()
                  setAddcoverflag(true)
                }}
              ></div>
            </div>
          </div>
          :
          <div className="other-content">
            <div className="chapter-line">
              <div className="one-upimg-line spcp1">
                <div className="text-span">章节名称</div>
                <input type="text" className="titlespan"
                  value={chapternameinp}
                  onChange={(e) => setChapternameinp(e.target.value)}
                />
              </div>
              <div className="one-upimg-line">
                <div className="text-span">章节顺序</div>
                <input type="text" className="titlespan"
                  value={chapterindexinp}
                  onChange={(e) => setChapterindexinp(e.target.value)}
                />
              </div>
            </div>
          </div>
        }
        <div className="done-line">
          <div className="left-bone-sp">状态</div>
          <label htmlFor="chek">
            <input type="checkbox" id="chek"
              value={doneflag}
              onChange={(e) => {
                setDoneflag(!doneflag)                
              }}
            />
            <span>已完结</span>
          </label>
        </div>
        <div className="btn-line-upload">
          {
            uploading ?
            <div className="uploadline">
              <div className="numbersp">上传中</div>
              <div className="upload-progress-line">
                <div className="done-line1"
                  style={{width: upprogress + "%"}}
                ></div>
              </div>
              <div className="numbersp2">{upprogress + '%'}</div>
            </div>
            :
            <div className="done-btn" onClick={toupload}>上传</div>
          }
        </div>
      </div>
    </div>
  )
}

export default Upmg