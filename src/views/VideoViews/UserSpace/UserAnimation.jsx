import '../scss/UserSpace/UserAnimation.scss'
import Pages from '../../../components/pages/pages'
import { getAnimationPage, cnacleAnimation } from '../../../api/animation'
import { useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import { getAnimationList } from '../../../api/animation'
import Noresult from '../../../components/NoResult/Noresult'

function UserAnimation () {
  const context = useOutletContext(),
        hisuid = context.hisuid,
        isme = context.isme

  const [animalist, setAnimalist] = useState([]),
        [deleteindex, setDeleteindex] = useState(-1)

  useEffect(() => {
    const getData = async () => {
      const res = await getAnimationList(hisuid)
      setAnimalist(res)
      console.log('animation list:', res);
      
    }
    getData()
  }, [])

  useEffect(() => {
    if (deleteindex !== -1) {
      console.log('xb');
      window.addEventListener("click", clickToClose)
    }
    return () => {
      window.removeEventListener("click", clickToClose)
    }
  }, [deleteindex])

  const clickToClose = (e) => {
    console.log(e.target.className);
    if (e.target.className !== " append-control-btn") {
      setDeleteindex(-1)
    }
  }

  // 取消收藏
  const tocanclesub = async (aid) => {
    setDeleteindex(-1)    
    await cnacleAnimation(hisuid, aid)
    const res = await getAnimationList(hisuid)
    setAnimalist(res)
  }
  return (
    <div className="user-animabox">
      <div className="animaline">
        <span>追番列表</span>
      </div>
      <div className="anima-contentbox">
        {
          animalist.map((item, index) =>
            <div className="one-animation">
              <img src={item.cover} alt="" className="animationimg" 
                onClick={() => window.open(`/video/${item.vids[0]}`, '_blank')}
              />
              <div className="rightinfos">
                <div className="infos-title1"
                  onClick={() => window.open(`/video/${item.vids[0]}`, '_blank')}
                >{item.title}</div>
                <div className="intro-line">{item.intro}</div>
                <div className="chapters">一共{item.chapters}话</div>
                <div className="more-line">
                  {
                    isme &&
                    <span className="morespan iconfont"
                      onClick={() => setDeleteindex(index)}
                    >&#xe653;</span>
                  }
                  {
                    deleteindex === index &&
                    <div className="append-control-btn"
                      onClick={() => tocanclesub(item.aid)}
                    >取消追番</div>
                  }
                </div>
              </div>
            </div>
          )
        }
      </div>
      {
          animalist.length === 0 &&
          <div className="noresult-box">
            <Noresult />
          </div>
      }
      {
        Math.ceil(animalist.length / 20) > 1 &&
        <Pages 
          pagelength={Math.ceil(animalist.length / 20)}
          getDataFnc={getAnimationPage}
          setList={setAnimalist}
          num={20}
          uid={hisuid}
        />
      }
    </div>
  )
}

export default UserAnimation