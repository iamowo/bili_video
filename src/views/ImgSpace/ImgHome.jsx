import './scss/home.scss'
import ImgTop from '../../components/imgTop/imgTopCom'
import { memo, useEffect, useRef, useState } from 'react'
import { getAllImg } from '../../api/imgs'
import { useNavigate, Outlet, Link } from 'react-router-dom'
import CollectImg from '../../components/imgs/CollectImg'

const OneImg = memo((props) => {
  const navigate = useNavigate()
  const {data, tl, setDetailflag} = props

  const toImgDetail = (imgid) => {    
    // window.open(`/imgdetail/${imgid}`, "_blank")
    setDetailflag(true)
    navigate(`/img/${imgid}`)
  }

  const collectOrCancle = (e, imgid) => {
    e.stopPropagation()
    console.log('233333');
  }
  
  return (
    <div className="oneimgbox"
      style={{height: data.height + 'px',translate: `${tl?.x}px ${tl?.y}px` }}
    >
      <div className="imgcover"
        onClick={() => toImgDetail(data.id)}
      >
        <div className="collect-btn"
          onClick={(e) => collectOrCancle(e, data.id)}
        >
          <div className={false ? "iconfont icon1" : "iconfont"}>&#xe8c3;</div>
        </div>
      </div>
      <img 
        style={{height: data.height + 'px'}}
        src={data.path} alt="" />
    </div>
  )
})

function ImgHome () {
  const uid = localStorage.getItem('userinfo')?JSON.parse(localStorage.getItem('userinfo')).uid : -1
  // console.log(uid);
  const [detailflag, setDetailflag] = useState(false)
  const [imgs, setImgs] = useState([]),
        imgs2 = useRef([]),
        heightlist = useRef([]),                                   // 记录每列最高值,列数会随屏幕变化而变化
        [translate, setTraslate] = useState([]),                                      // 每个图片的偏移距离
        maxheight = useRef(0)                                      // 最高的一列的高度

  const [collectflag, setCollectflag] = useState(false)
  
  useEffect(() => {
    const getData = async () => {
      const res = await Promise.all([getAllImg(uid)])
      const allimgs = res[0]
      // console.log('all imgs: ', res[0]);
      setImgs(allimgs)
      imgs2.current = allimgs
      const windowWidth = document.body.clientWidth  
      dealHeight(allimgs, judgeHieghtlist(windowWidth))
    }
    getData()
    document.title = 'pili-imgs'
    window.addEventListener('resize', resizefnc)
    return() => {
      window.removeEventListener('resize', resizefnc)
    }
  }, [])

  // 判断列数
  const judgeHieghtlist = (windowWidth) => {
    let tplist = []
    if (windowWidth > 1920) {
      tplist = [0, 0, 0, 0, 0, 0, 0, 0]
    } else if (windowWidth > 1800 && windowWidth <= 1920) {
      tplist = [0, 0, 0, 0, 0, 0, 0]
    } else if (windowWidth > 1680 && windowWidth <= 1800) {
      tplist = [0, 0, 0, 0, 0, 0]
    } else if (windowWidth > 1430 && windowWidth <= 1680) {
      tplist = [0, 0, 0, 0, 0]
    } else if (windowWidth <= 1430) {
      tplist = [0, 0, 0, 0]
    }
    console.log('heightlist length is: ', tplist.length);    
    return tplist
  }

  // 处理图像偏移
  const dealHeight = (allimgs, heightlist) => {
    console.log('enter1: ', allimgs);
    console.log('enter2: ', heightlist);
    
    const translateTemp = []
    const heightTemp = heightlist      
    for (let i = 0 ; i < allimgs.length; i++) {
      // 寻找最小的高度插入
      let min = 0                     // 最小高度索引
      for (let j = 0; j < heightTemp.length; j++) {
        // console.log(j, heightTemp[j], '===', heightTemp[j] < heightTemp[min]  ,'====', min, heightTemp[min]);
        if (heightTemp[j] < heightTemp[min]) {
          min = j
        }
      }
      translateTemp.push({
        x: 256 * min,
        y: heightTemp[min]
      })
      // console.log(heightTemp[min] ,'    ',allimgs[i].height + 16);
      heightTemp[min] = heightTemp[min] + allimgs[i].height + 16        
    }
    let maxHeight = 0               // 最高列的高度
    for (let i = 0; i < heightTemp.length; i++) {
      maxHeight = heightTemp[i] > maxHeight ? heightTemp[i] : maxHeight
    }
    console.log('maxheight: ',maxHeight);
    maxheight.current = maxHeight
    heightlist.current = heightTemp
    // translate.current = translateTemp
    setTraslate(translateTemp)
  }

  const resizefnc = () => {
    const windowWidth = document.body.clientWidth
    dealHeight(imgs2.current, judgeHieghtlist(windowWidth))
  }

  return (
    <div>
      <ImgTop />
      <div className="content-out">
        <div className="content-inner">
            <div className="second-box"></div>
            <div className="content-box"
              style={{height: `${maxheight.current}px`}}
            >
              {
                imgs.map((item, index) =>
                  <OneImg
                    key={item.id}
                    data={item}
                    tl={translate[index]}
                    setDetailflag={setDetailflag}
                  />
                )
              }
            </div>
        </div>
      </div>
      <Outlet 
        context={{
          'detailflag': detailflag,
          'setDetailflag': setDetailflag
        }}
      />
      <CollectImg 
        uid={uid}
        collectflag={collectflag}
      />
    </div>
  )
}

export default ImgHome