import './donate.scss'
import { baseurl } from '../../api'
import { useState, memo } from 'react'
import { addOrders, pay } from '../../api/pay'
import message from '../notice/notice'

const Donate = memo((props) => {
  const uid = props.upinfo?.uid
  const [index, setIndex] = useState(0)
  const [checkedflag, setCheckedflag] = useState(false)
  let websocket = null

  const topay = async () => {
    if (!checkedflag) {
      message.open({type: "info", content: '请先同意条约'})
      return
    }
    const data1 = {
      uid: uid,
      product: index === 0 ? '10￥充电' : '30￥充电',
      totalAmount: index === 0 ? 10 : 30,
    }

    const id = await addOrders(data1);

    console.log('=== orders id is:', id);
    // 订单id
    if (id) {
      if ('WebSocket' in window) {
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
      websocket.onmessage = function (e) {
        const res = e.data
        console.log("websocket.onmessage: " + res);
        if (res === 'pay_success') {
          console.log('支付成功');
          message.open({type: 'info', content: '支付成功', flag: true})
          // 关闭连接
          closeWebSocket()
          props.setDonateflag(false)
        } else if (res === 'pay_error') {
          console.log('支付失败');
          message.open({type: 'error', content: '支付失败', flag: true})
          // 关闭连接
          closeWebSocket()
          setCheckedflag(false)
          props.setDonateflag(false)
        }
      }

      //关闭WebSocket连接
      function closeWebSocket() {
        websocket.close();
        console.log('websocket.close: 关闭websocket连接')
      }

      await pay(id)
      window.open(`${baseurl}/alipay/pay?id=${id}`)
      
    }
  }
  return (
    <div className="donate-box">
      <div className="top-donate"
        style={{background: `url(${baseurl}/sys/header-bg.png)`}}
      >
        <span className="icon iconfont"
          onClick={() => props.setDonateflag(false)}
        >&#xe6bf;</span>
        <div className="top-left-info">
          <div className="name-top-line">{props.upinfo.name}</div>
          <div className="user-line">
            <div></div>
            <span>10</span>
            <span>人开通了为TA充电</span>
          </div>
        </div>
        <img src={props.upinfo.avatar} alt="" className="top-right-avatar" />
      </div>
      <div className="mid-donate">
        <div className={index === 0 ?"donate-select donate-active": "donate-select"}
          style={{background: index === 0 ? `url(${baseurl}/sys/month-grade-bg.png)` : 'none'}}
          onClick={() => setIndex(0)}
        >
          <span>为TA充电</span>
          <span>￥
            <span
              style={{color: index === 0 ? '#FF6699' : '#222', fontSize: '20px'}}
            >10</span>/月</span>
        </div>
        <div className={index === 1 ?"donate-select donate-active": "donate-select"}
          style={{marginTop: '14px', background: index === 1 ? `url(${baseurl}/sys/month-grade-bg.png)` : 'none'}}
          onClick={() => setIndex(1)}
        >
          <span>高档充电</span>
          <span>￥
            <span
              style={{color: index === 1 ? '#FF6699' : '#222', fontSize: '20px'}}
            >30</span>/月</span>
        </div>
      </div>
      <div className="bottom-donate">
        <div className="donateline">
          <span>支付</span>
          {
            index === 0 ?
            <span className='sp2'>10</span>
            :
            <span className='sp2'>30</span>
          }
          <div className={checkedflag ?"donate-btn donate-btn-active" : "donate-btn"}
            onClick={topay}
          >确认支取</div>
        </div>
      </div>
      <div className="read-line">
        <input id='readck' type="checkbox"
          checked={checkedflag}
          onChange={(e) => setCheckedflag(e.target.checked)}
        />
        <label for="readck">同意</label>
        <a href="" target='_blank'>&lt;&lt;充值条约&gt;&gt;</a>
      </div>
    </div>
  )
})

export default Donate