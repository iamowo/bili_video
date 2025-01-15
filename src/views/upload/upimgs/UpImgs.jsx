import { useEffect, useRef, useState } from "react"
import "./upimg.scss"
import { uploadImgInfon, uploadImgs } from "../../../api/imgs"
import { useNavigate, useParams } from "react-router-dom"
import message from "../../../components/notice/notice"
import { baseurl2 } from "../../../api"
import { click } from "@testing-library/user-event/dist/click"

function UpImgs() {
  const navigate = useNavigate()
  const params = useParams(),
        uid = parseInt(params.uid)

  const mgsref = useRef()
  const coverref = useRef(),
        upboxref = useRef()
  const [imgfile, setImgfile] = useState([]),             // 要上传的图片
        [imgs ,setImgs] = useState([]),
        [heightlist, setHieghtlist] = useState([120, 0, 0, 0, 0, 0]),        // 要上传的高度数组
        [translate, setTranslate] = useState([]),
        [maxheight, setMaxheight] = useState()
  const [upstyle, setUpstyle] = useState(0),
        [clicked, setClicked] = useState(false),
        [titleinp, setTitleinp] = useState(""),
        [introinp, setIntroinp] = useState(""),
        [tags, setTgas] = useState(""),                    // tags
        [doneflag, setDoneflag] = useState(false)
  const [uploadstatus, setUploadstatus] = useState(0),   // 0 upload  1 uploading  2 uploaded
        [upprogress, setUpprogress] = useState(0)

  // 上传图片
  const addImg = (e) => {
    const files1 = e.target.files
    const a1 = [],
          a2 = []
    for (let i = 0; i < files1.length; i++) {
      if (files1[i].type.includes("image/")) {
        const f = files1[i]
        const imgurl = URL.createObjectURL(f)
        const thisImg = new Image()
        thisImg.onload = function () {
          
        }
        a1.push(f)
        a2.push(imgurl)
      }
    }
    // console.log(a1);
    // console.log(a2);
    setImgfile([
      ...imgfile,
      ...a1
    ])
    setImgs([
      ...imgs,
      ...a2
    ])
    setTimeout(() => {
      dealTranslate()
    }, 0)
  }

  // 高度偏移
  const dealTranslate = () => {
    const imgNodes = upboxref.current.getElementsByClassName('upreslut-box1')
    const imgArray = Array.prototype.slice.call(imgNodes)
    const hieghts = imgArray.map(item => item.clientHeight * 2)
    console.log('height ' , hieghts);
    setHieghtlist({
      ...heightlist,
      ...hieghts
    })
    
  }

  const clickToDelete = (index) => {
    console.log(index);
    const a1 =  imgs.filter((item, i) =>
        i !== index
      )
    const a2 =  imgfile.filter((item, i) =>
        i !== index
      )
    const a3 =  heightlist.filter((item, i) =>
        i !== index
      )
      console.log(a1);
      console.log(a2);
    setImgs(a1)
    setImgfile(a2)
    setHieghtlist(a3)
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

  // 上传
  const toupload = async () => {
    if (imgfile.length === 0) {
      message.open({type: 'warning', content: '待上传文件为空'})
      return
    }
    if (upstyle === 0) {
      for (let i = 0; i < imgfile.length; i++) {
        const data = {
          title: imgfile[i].name.replace(/(.*\/)*([^.]+).*/ig,"$2"),
          intro: introinp,
          uid: uid,
          nums: 1,
        }        
        const res1 = await uploadImgInfon(data)
        if (res1) {
          const data2 = new FormData()
          data2.append("uid", uid)
          data2.append("imgId", res1)
          data2.append("height", heightlist[i])
          data2.append("file", imgfile[i])
          data2.append("type", imgfile[i].type.split("/")[1])
          const res2 = await uploadImgs(data2)
          if (res2) {
            uploadSuccess()
          }
        }
      }
    } else {
      const data = {
        title: titleinp,
        intro: introinp,
        uid: uid,
        nums: imgfile.length
      }
      const res1 = await uploadImgInfon(data)
      console.log('res1 is:', res1);
      if (res1) {
        for (let i = 0; i < imgfile.length; i++) {
          const data2 = new FormData()
          data2.append("uid", uid)
          data2.append("imgId", res1)
          data2.append("height", heightlist[i])
          data2.append("file", imgfile[i])
          data2.append("type", imgfile[i].type.split("/")[1])
          const res2 = await uploadImgs(data2)
          if (res2) {
            uploadSuccess()
          }
        }
      }
    }
  }

  useEffect(() => {
    if (upprogress === 100) {
      message.open({type: 'info', content: '上传成功', flag: true})
      setUploadstatus(2)
    }
  }, [upprogress])

  const timer1 = useRef(null)

  const enterBox = () => {
    console.log('111');
    
    if (timer1.current != null) {
      clearTimeout(timer1.current)
    }
    setClicked(true)
  }

  const leaveBox = () => {
    timer1.current = setTimeout(() => {
      setClicked(false)
      timer1.current = null
    },[500])
  }

  const clickthis = (num) => {
    setUpstyle(parseInt(num))
    timer1.current = null
    setClicked(false)
  }

  // 上传成功，更新状态，清空样式
  const uploadSuccess = () => {
    //

    // 清空原来的样式
    setImgfile([])
    setImgs([])
    setHieghtlist([])

    setUpstyle(0)
    setClicked(false)
    setTitleinp()
    setIntroinp()
    setTgas()
  }
  return (
    <div className="upmg-view">
      <div className="upmg-box">
        <div className="upmg-title">上传图片</div>
        <div className="upload-part"
          ref={upboxref}
        >
          <div className="inner-imgbox">
            <div className="add-mg-box"
              onClick={() => mgsref.current.click()}
            >上传</div>
            <input
              type="file"
              className="mgfile"
              ref={mgsref}
              accept="image/*"
              multiple
              onChange={addImg}
            />
            {
              imgs.map((item, index) =>
                <div className="upreslut-box1">
                  <img src={item} alt="" />
                  <div className="closeview">
                    <span className="iconfont"
                      onClick={() => clickToDelete(index)}
                    >&#xe640;</span>
                  </div>
                </div>
              )
            }
          </div>
        </div>
        <div className="one-upimg-line3"
          style={{width: '32%'}}
        >
          <div className="div3-outbox">
            <div className="text-span">方式<span style={{color: 'pink'}}>*</span></div>
            <div className="right-pp"
              onMouseEnter={() => enterBox()}
              onMouseLeave={() => leaveBox()}
            >
              <div className="seelectspan">
                {
                  upstyle === 0 ?
                  <span>单个上传</span>
                  :
                  <span>合并上传</span>
                }
              </div>
              <div className={clicked ? "iconfont iconcliecked" : "iconfont"}>&#xe624;</div>
              {
                clicked &&
                <div className="select-box"
                  onMouseEnter={() => enterBox()}
                  onMouseLeave={() => leaveBox()}
                >
                  <div className="one-item"
                    onClick={() => clickthis(0)}
                  >单个上传</div>
                  <div className="one-item"
                    onClick={() => clickthis(1)}
                  >合并上传</div>
                </div>
              }
            </div>
            {/* <datalist id="typelist">
              <option>单个按文件名上传</option>
              <option>vertical</option>
            </datalist> */}
          </div>
        </div>
        <div className="one-upimg-line3">
          <div className="div3-outbox">
            <div className="text-span">标题<span style={{color: 'pink'}}></span></div>
            {
              upstyle === 1 ?
              <input type="text" className="titlespan"
                value={titleinp}
                onChange={(e) => setTitleinp(e.target.value)}
              />
              :
              <span className="text-sp2">标题为文件名</span>
            }
          </div>
        </div>
        <div className="other-content">
          <div className="one-upimg-line">
            <div className="text-span">tags</div>
            <input type="text" className="titlespan" 
              placeholder="tag之间用空格隔开"
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
        </div>
        <div className="btn-line-upload">
          {
            uploadstatus === 0 &&
            <div className="done-btn" onClick={toupload}>上传</div>
          }
          {
            uploadstatus === 1 &&
            <div className="uploadline">
              <div className="numbersp">上传中</div>
              <div className="upload-progress-line">
                <div className="done-line1"
                  style={{width: upprogress + "%"}}
                ></div>
              </div>
              <div className="numbersp2">{upprogress + '%'}</div>
            </div>
          }
          {
            uploadstatus === 2 &&
            <div className="done-btn2">
              <div className="doneb1"
                onClick={() => navigate(`/`)}
              >返回主页</div>
              <div className="doneb2"
                onClick={() => document.location.reload()}
              >继续上传</div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default UpImgs
