import './index.scss'
import { useEffect, useState } from 'react'
import Noresult from '../../../components/NoResult/Noresult'
import { getAnimationByKeyword } from '../../../api/animation'
import { useParams } from 'react-router-dom'

function AnimaS () {
  const params = useParams()
  const keyword = params.keyword
  const [animalist, setAnimalist] = useState([])

  useEffect(() => {
    const getData = async () => {
      const res = await getAnimationByKeyword(keyword)
      console.log('animations:  ', res);
      
      setAnimalist(res)
    }
    getData()
  }, [])
  return (
    <div className="animation-page">
      <div className="animaspage">
        {
          animalist.map(item =>
          <div className="one-ainma-search">
            <div className="left-anmia-cover">
              <img src={item.cover} alt="" className="ani-cover" />
            </div>
            <div className="right-anima-infos">
              <div className="rai-top">
                <div className="rai-title">{item.title}</div>
                <div className="rai-infos1">一共{item.chapters}章</div>
                <div className="rai-infos2">{item.intro}</div>
              </div>
              <div className="rai-bottom">
                <div className="rai-score">12人评分 9.7</div>
                <div className="rai-chapter">
                  <div className="rai-playbtn"
                    onClick={() =>
                      window.open(`/video/${item.vids[0]}`, '_blank')
                    }
                  >开始观看</div>
                  <div className="rai-chapterlist">
                    {
                      item.vids.map((item2, index) =>
                        <div className="rai-one-chapter"
                          onClick={() =>
                            window.open(`/video/${item2}`, '_blank')
                          }
                        >{index + 1}</div>
                      )
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          )
        }
      </div>
      {
        animalist.length === 0 &&
          <Noresult />
      }
    </div>
  )
}

export default AnimaS