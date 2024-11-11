import './test.scss'
import message from '../../components/notice/notice'
import { useState } from 'react'
import { click } from '@testing-library/user-event/dist/click'
import { getAllVideo } from '../../api/video'
import axios from 'axios'

import { useDispatch, useSelector } from 'react-redux'
import { addOne, addSome, subOne } from '../../store/modules/countStore'
import { addLater } from '../../store/modules/countStore'

function Son2 () {
  const userinfo = useSelector(state => state.userStore.userinfo)
  const count = useSelector(state => state.countStore.v)
  const dispatch = useDispatch()

  return (
    <div>
      <span
        onClick={() => dispatch(addOne())}
      >+1</span>
      <span
        style={{margin: '0 20px'}}
      >{count}</span>
      <span
        onClick={() => dispatch(subOne())}
      >-1</span>
      <span
        onClick={() => dispatch(addSome(10))}
      >add 10</span>
            <span
        onClick={() => dispatch(addLater(10))}
      >add Later 10</span>
    </div>
  )
}

function Son3 () {
  const count = useSelector(state => state.countStore.v)
  const dispatch = useDispatch()

  return (
    <div>
      <span
        onClick={() => dispatch(addOne())}
      >+1</span>
      <span
        style={{margin: '0 20px'}}
      >{count}</span>
      <span
        onClick={() => dispatch(subOne())}
      >-1</span>
    </div>
  )
}

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

  //============================================
  const uid = 2
  let websocket = null
  if ('WebSocket' in window) {
    // 改成你的地址
    websocket = new WebSocket("ws://127.0.0.1:8082/websocket/" + uid);
  } else {
    alert('当前浏览器 Not support websocket')
  }

      //连接发生错误的回调方法
  websocket.onerror = function () {
    console.log("websocket.onerror: WebSocket连接发生错误");
  };

  //连接成功建立的回调方法
  websocket.onopen = function () {
    console.log("websocket.onopen: WebSocket连接成功");
  }

      //接收到消息的回调方法
  websocket.onmessage = function (event) {
    console.log("websocket.onmessage: " + event.data);
  }

   //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
   window.onbeforeunload = function () {
    closeWebSocket();
  }

   //关闭WebSocket连接
   function closeWebSocket() {
    websocket.close();
    alert('websocket.close: 关闭websocket连接')
  }

     //发送消息
     function send() {
      var message = 23333
      try {
          websocket.send('{"msg":"' + message + '"}');
          console.log("websocket.send: " + message);
      } catch (err) {
          console.error("websocket.send: " + message + " 失败");
      }
  }

  const getmsg = async () => {
    const res = await axios(`http://127.0.0.1:8082/video/socket/sendmessag/${uid}`)
    console.log('res is:', res.data.data);
    
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
      <div
        style={{margin: '40px 0'}}
      >==========================================================================</div>
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
      <div
        style={{margin: '40px 0'}}
      >=========================================================================</div>
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
      <div className="sendmessag"
        onClick={send}
      >sendmmeesga</div>
      <div className="sendmessag"
        onClick={getmsg}
      >getmmeesga</div>
      <div
        style={{margin: '40px 0'}}
      >================================================================================</div>
      <Son2 />
      <Son3 />
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