import { useState } from 'react'
import './scss/home.scss'

const ControlHome = () => {
  return (
    <div className="control-home-box">
      <div className="top-line1">
        <div className="date-box">

        </div>
        <div className="tp-box2">
          <div className="smilebox">
            (*^_^*)
          </div>
          <div className="timebox">
            <TimeComponent />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ControlHome

const TimeComponent = () => {
  const [time, setTime] = useState("00:00")
  return (
    <div className="time">{time}</div>
  )
}