import './anima.scss'
import Pages from '../../../components/pages/pages'

function Anima () {
  return (
    <div className="user-animabox">
      <div className="animaline">
        <span>追番列表</span>
      </div>
      <div className="anima-contentbox">
        <div className="one-animation">
          <img src="" alt="" className="animationimg" />
          <div className="rightinfos">
            <div className="infos-title1">123</div>
          </div>
        </div>
      </div>
      <div className="anima-bottom-page">
        <Pages />
      </div>
    </div>
  )
}

export default Anima