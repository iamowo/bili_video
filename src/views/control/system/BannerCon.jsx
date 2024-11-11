import { useEffect, useState } from "react"
import "../scss/bannercon.scss"
import Banner from "../../../components/Banner/Banner"
import Noresult from "../../../components/NoResult/Noresult"
import { getBanner, getBannerUnselected, setBanner } from "../../../api/banner"

const Bannercon = () => {
  const [playflag, setPlayflag] = useState(true)
  const [bannerlist, setBanner] = useState([]),
        [bannerlist2, setBannerlist2] = useState([])   // 未选择列表
  const [vfalg, setVflag] = useState(-1)

  useEffect(() => {
    const getData = async () => {
      const res = await Promise.all([getBanner(), getBannerUnselected()])
      console.log(res);
      
      setBanner(res[0])
      setBannerlist2(res[1])
    }
    getData()
  }, [])

  const deletethis = () => {

  }

  return (
    <div className="banner-view">
      <div className="bv-topbox">
        <span className="bv-tit">Banner Setting</span>
        <span className="bv-tit2">{bannerlist.length}</span>
      </div>
      <div className="bv-content">
        <div className="bv-banner-show1">
          <div className="bbs-title">example</div>
          <div className="bb-bannerbox">
            <Banner
              playflag={playflag}
            />
          </div>
          <div className="conbtn">
            {
              playflag ?
              <div className="playbtn"
                onClick={() => {
                  setPlayflag(false)
                }}
              >play</div>
              :
              <div className="playbtn stopb"
                onClick={() => {
                  setPlayflag(true)
                }}
              >stop</div>
            }
          </div>
        </div>
        <div className="bv-banner-change-box">
          <div className="change-box">
            {
              bannerlist.map(item => 
                <div className="one-banner">
                  <div className="banner-coverbox">
                    <img src={item.cover} alt="" />
                  </div>
                  <div className="banner-infos">
                    <div className="banner-title">{item.title}</div>
                    <div className="banner-type">类型: {item.type}</div>
                  </div>
                  <div className="deletebox">
                    <span className="iconfont"
                      onClick={deletethis}
                    >&#xe640;</span>
                  </div>
                </div>
              )
            }
            <div className="one-banner">
              <div className="addnew-banner"
                style={{cursor: 'pointer', userSelect: 'none'}}
                onClick={() => setVflag(0)}
              >add new one</div>
            </div>
          </div>
        </div>
      </div>
      {
        vfalg >= 0 &&
        <div className="banner-c-view">
          <div className="bcv-black"></div>
          <div className="select-banner-box">
            <div className="sbb-top">
              <span>select one</span>
              <span className="iconfont"
                onClick={() => setVflag(-1)}
              >&#xe66a;</span>
            </div>
            <div className="select-content">
              {
                bannerlist2.length === 0 ?
                <div>
                  <Noresult />
                </div>
                :
                <div>
                  {
                    bannerlist2.map(item =>
                      <div className="one-bn">1</div> 
                    )
                  }
                  <div className="one-bn">233</div>
                </div>
              }
            </div>
            <div className="select-bt-line">
              <div className="sbl-btn">create new one</div>
              <div className="sbl-btn btn2">ok</div>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default Bannercon