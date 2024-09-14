import { useState } from 'react'
import './index.scss'

function Notice (props) {
  const [top, setTop] = useState('-100px')
  const content = props.content
  const type = props.type  // success  error warning
  let bgcolor = 'rgb(37, 194, 37)'
  if (type === 'error') {
    bgcolor = 'rgb(211, 48, 48)'
  } else if (type === 'warning'){
    bgcolor = 'rgb(231, 210, 23)'
  }
  const tosettime = () => {
    setTimeout(() => {
      setTop('-20vh');
    }, 2000)
  }
  return (
    <div className="notice-box" style={{backgroundColor: bgcolor, top: top}}>
      <span className="icon iconfony"></span>
      <span className='content'>{content}</span>
    </div>
  )
}

export default Notice