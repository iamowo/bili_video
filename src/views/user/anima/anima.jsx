import './anima.scss'
import Pages from '../../../components/pages/pages'
import { getAnimationPage } from '../../../api/animation'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

function Anima () {
  const params = useParams()
  const uid = params.uid
  const [animalist, setAnimalist] = useState([
    {id: 1, text: '1'},
    {id: 1, text: '1'},
    {id: 1, text: '1'},
    {id: 1, text: '1'},
    {id: 1, text: '1'},
    {id: 1, text: '1'},
    {id: 1, text: '1'},
    {id: 1, text: '1'},
    {id: 1, text: '1'},
    {id: 1, text: '1'},
    {id: 1, text: '1'},
    {id: 1, text: '1'},
    {id: 1, text: '1'},
    {id: 1, text: '1'},
    {id: 1, text: '1'},
    {id: 1, text: '1'},
    {id: 1, text: '1'},
    {id: 1, text: '1'},
    {id: 1, text: '1'},
    {id: 1, text: '1'},
    {id: 1, text: '1'},
  ])
  return (
    <div className="user-animabox">
      <div className="animaline">
        <span>追番列表</span>
      </div>
      <div className="anima-contentbox">
        {
          animalist.map(item =>
            <div className="one-animation">
              <img src="" alt="" className="animationimg" />
              <div className="rightinfos">
                <div className="infos-title1">123</div>
              </div>
            </div>
          )
        }
      </div>
      {
        Math.ceil(animalist.length / 20) > 1 &&
        <Pages 
          pagelength={Math.ceil(animalist.length / 20)}
          getDataFnc={getAnimationPage}
          setList={setAnimalist}
          num={20}
          uid={uid}
        />
      }
    </div>
  )
}

export default Anima