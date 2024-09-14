import './index.scss'
import { useState } from 'react'

function AnimaS () {
  const [animalist, setAnimalist] = useState([
    {'id': 1},
    {'id': 2},
    {'id': 3},
    {'id': 4},
  ])
  const [chapters, setChapters] = useState([
    {'id': 1},
    {'id': 2},
    {'id': 3},
    {'id': 4},
  ])
  return (
    <div className="animaspage">
      {
        animalist.map(item =>
        <div className="one-ainma-search">
          <div className="left-anmia-cover"></div>
          <div className="right-anima-infos">
            <div className="rai-top">
              <div className="rai-title">请问而他与</div>
              <div className="rai-infos1">asdasd</div>
              <div className="rai-infos2">阿三大苏打实打实的</div>
            </div>
            <div className="rai-bottom">
              <div className="rai-score">12人评分 9.7</div>
              <div className="rai-chapter">
                <div className="rai-playbtn">开始观看</div>
                <div className="rai-chapterlist">
                  {
                    chapters.map(item =>
                      <div className="rai-one-chapter">1</div>
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
  )
}

export default AnimaS