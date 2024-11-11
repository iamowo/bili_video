import "./VIP.scss"
import { baseurl } from '../../api'
import { useState, memo } from 'react'
import { addOrders, pay } from '../../api/pay'
import message from '../notice/notice'

const VIP = memo((props) => {
  // account:  hkmuje7920@sandbox.com
  const uid = props?.uid
  const [index, setIndex] = useState(0),
        [price, setPrice] = useState(15.00);
  const [checkedflag, setCheckedflag] = useState(false)
  let websocket = null

  const topay = async () => {
    if (!checkedflag) {
      message.open({type: "info", content: '请先同意条约'})
      return
    }
    let product = "";
    if (price === 0) {
      product = '15￥一个月会员'
    } else if (price === 1) {
      product = '80￥半年会员'
    } else {
      product = '150￥一年会员'
    }
    const data1 = {
      uid: uid,
      product: product,
      totalAmount: price,
    }
    const id = await addOrders(data1);
    console.log('orders id is:', id);
    
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
          props.setVipblyflag(false)
        } else if (res === 'pay_error') {
          console.log('支付失败');
          message.open({type: 'error', content: '支付失败', flag: true})
          // 关闭连接
          closeWebSocket()
          setCheckedflag(false)
          props.setVipblyflag(false)
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
    <div className="vip-box">
      <div className="top-donate"
        style={{background: `url(${baseurl}/sys/header-bg.png)`}}
      >
        <span className="icon iconfont"
          onClick={() => props.setVipblyflag(false)}
        >&#xe6bf;</span>
        <div className="top-left-info">
          <span>开通会员</span>
        </div>
      </div>
      <div className="mid-donate">
        <div className={index === 0 ?"donate-select donate-active": "donate-select"}
          style={{background: index === 0 ? `url(${baseurl}/sys/month-grade-bg.png)` : 'none'}}
          onClick={() => {
            setIndex(0)
            setPrice(15.00)
          }}
        >
          <span>开通一个月</span>
          <span>￥
            <span
              style={{color: index === 0 ? '#FF6699' : '#222', fontSize: '20px'}}
            >15</span>/月</span>
        </div>
        <div className={index === 1 ?"donate-select donate-active": "donate-select"}
          style={{marginTop: '14px', background: index === 1 ? `url(${baseurl}/sys/month-grade-bg.png)` : 'none'}}
          onClick={() => {
            setIndex(1)
            setPrice(80.00)
          }}
        >
          <span>开通半年</span>
          <span>￥
            <span
              style={{color: index === 1 ? '#FF6699' : '#222', fontSize: '20px'}}
            >80</span>/半年</span>
        </div>
        <div className={index === 2 ?"donate-select donate-active": "donate-select"}
          style={{marginTop: '14px', background: index === 2 ? `url(${baseurl}/sys/month-grade-bg.png)` : 'none'}}
          onClick={() => {
            setIndex(2)
            setPrice(150.00)
          }}
        >
          <span>开通一个年</span>
          <span>￥
            <span
              style={{color: index === 2 ? '#FF6699' : '#222', fontSize: '20px'}}
            >150</span>/年</span>
        </div>
      </div>
      <div className="bottom-donate">
        <div className="donateline">
          <span>支付</span>
          <span className='sp2'>{price}</span>
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

export default VIP