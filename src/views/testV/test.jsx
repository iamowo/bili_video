import './test.scss'
import message from '../../components/notice/notice'
import { useState } from 'react'
import { click } from '@testing-library/user-event/dist/click'
import { getAllVideo } from '../../api/video'

function Test() {
//   var add = (function () {
//     var counter = 0;
//     console.log('1:', counter);    
//     return function () {
//       console.log('2:', counter);
      
//       return counter += 1;
//     }
// })();
 
// console.log(add());
// console.log(add());
// console.log(add());

  const [countstate1, setCountstate1] = useState(0)

  const addfnc = () => {
    setCountstate1(countstate1 + 1)
  }

  const p = new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('2333');
    }, 1000)
  })
  
  setTimeout(() => {
    console.log('xixixi.2');
  }, 1000)

  p.then((res) => {
    console.log('success:', res);
  }, (err) => {
    console.log('error:', err);
  }
  )

  const click1 = () => {
    message.open({ type: 'info', content: 'Hello23333!', flag: false})
  }

  const click2 = async () => {
    const res = await getAllVideo()
    message.open({ type: 'info', content: 'sb!' , flag: true})
    if (res) {
    }

  }

  return (
    <div>
      <div className="text-view">
        <view className="v1box">
          <div className="load-box"></div>
          <div className="load-box2"></div>
          <div className="load-box3"></div>
        </view>
      </div>
      <div className="opbtn"
        onClick={() => click1()}
      >click1</div>
            <div className="opbtn"
        onClick={() =>  click2()}
      >click11</div>
                  <div className="opbtn"
        onClick={() => message.open({ type: 'warning', content: 'warning message!' })}
      >click3</div>
            <div className="opbtn"
        onClick={() => message.open({ type: 'error', content: 'error message!' })}
      >click3</div>
      <div>=========================================================================</div>
      <div className='fatherbox'>
        <div className="titlebox">{countstate1}</div>
        <Son1 
          countstate1={countstate1}
          setCountstate1={setCountstate1}
          addFunction={addfnc}
        >
          <h1>233</h1>
          <div>2331</div>
          <h1>2332</h1>
          </Son1>
      </div>
    </div>
  )
}
export default Test

function Son1 (props) {
  console.log(props.children);
  
  const addcountdnc = (num) => {
    props.setCountstate1(props.countstate1 + num)
  }
  return (
    <div className="son1box">
      <div className="son1bnt1"
        // onClick={props.addFunction}
        onClick={() => addcountdnc(2)}
      >
      click this
    </div>
    {props.children[1]}
  </div>
  )
}