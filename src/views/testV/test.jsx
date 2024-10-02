import './test.scss'
import message from '../../components/notice/notice'
import { useState } from 'react'

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
        onClick={() => message.open({ type: 'error', content: 'Hello23333!' })}
      >click</div>
      <div>=========================================================================</div>
      <div className='fatherbox'>
        <div className="titlebox">{countstate1}</div>
        <Son1 
          countstate1={countstate1}

          setCountstate1={setCountstate1}
        />
      </div>
    </div>
  )
}
export default Test

function Son1 (props) {

  return (
    <div className="son1box">
    <div className="son1bnt1"></div>
  </div>
  )
}