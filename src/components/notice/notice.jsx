import { useEffect, useImperativeHandle, useRef, useState, forwardRef  } from 'react';
import ReactDOM from 'react-dom/client';
import { nextTick, uuid } from '../../util/fnc';
import './index.scss';

const MESSAGE_CONTAINER_ID = 'message_container';
let containerRoot = null;

// 创建真实 DOM 容器
function createContainer() {
  // 尝试根据 ID 获取真实DOM节点
  let container = document.getElementById(MESSAGE_CONTAINER_ID);
  if (!container) {
    // 如果没有获取到，就创建一个，并插入 body 中
    // 创建了一个 id=message_container 的div元素在body中
    container = document.createElement('div');
    container.setAttribute('id', MESSAGE_CONTAINER_ID);
    document.body.appendChild(container);
  }
  return container;
}

// 创建 React root 容器
function renderMessageRoot() {
  const container = createContainer();
  if (!containerRoot) {
    //createRoot 允许在浏览器的 DOM 节点中创建根节点以显示 React 组件。
    containerRoot = ReactDOM.createRoot(container);
    // 用来显示组件
    containerRoot.render(<MessageManager />);
  }
}

// 单条消息组件(一个组件)
const MessageItem = ({ children, onRemove }) => {
  const messageItemRef = useRef();
  const [isVisible, setIsVisible] = useState(true);           // 显示 不显示

  useEffect(() => {
    let timer = null;
    timer = setTimeout(() => {
      if (messageItemRef.current) {
        messageItemRef.current.addEventListener('animationend', onRemove, {
          once: true,
        });
      }
      setIsVisible(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div 
      ref={messageItemRef}
      className={`messageItem ${isVisible ? 'messageItem-appear' : 'messageItem-disappear'}`}
    >
      {children}
    </div>
  );
};

// 消息容器组件（组件）
// forwardRef 允许组件使用 ref 将 DOM 节点暴露给父组件。

// import { forwardRef } from 'react';
// const MyInput = forwardRef(function MyInput(props, ref) {
   // ...
// });
const MessageContainer = forwardRef((props, ref) => {  
  const { messageList, setMessageList } = props;  
  // useImperativeHandle是react官方为了简便我们的ref操作，同时还可以让子组件返回给父组件自身的状态和方法去调用
  // useRef将ref绑定到某个子组件标签上，用以获取整个子组件的方法和参数
  // useImperativeHandle: 可以自定义暴露给父组件的方法或者变量
  useImperativeHandle(ref, () => {
    return {
      info: text => {
        // 插入一条消息
        const id = uuid();
        const type = 'info'
        setMessageList(list => [...list, { id, text, type }]);
      },
      error: text => {
        // 插入一条消息
        const id = uuid();
        const type = 'error'
        setMessageList(list => [...list, { id, text, type }]);
      },
      warning: text => {
        // 插入一条消息
        const id = uuid();
        const type = 'warning'
        setMessageList(list => [...list, { id, text, type }]);
      },
    };
  });
  return (
    <>
      {
        messageList.map(msg => (
          <MessageItem
            key={msg.id}
            onRemove={() => setMessageList(list => list.filter(item => item.id !== msg.id))}
          >
            {
              msg.type === 'info' &&
              <div className='d1info'>
                <span className="icon iconfont">&#xe69e;</span>
                <span>{msg.text}</span>
              </div>
            }
            {
              msg.type === 'warning' &&
              <div className='d2warning'>
                <span className="icon iconfont">&#xe7f4;</span>
                <span>{msg.text}</span>
              </div>            
            }
            {
              msg.type === 'error' &&
              <div className='d3error'>
                <span className="icon iconfont">&#xe7b7;</span>
                <span>{msg.text}</span>
              </div>
            }
          </MessageItem>
        ))
      }
    </>
  );
});

// 消息管理组件
function MessageManager() {
  const [messageList, setMessageList] = useState([]);

  const msgRef = useRef();

  useEffect(() => {
    message.current = msgRef.current;
    message.info = msgRef.current.info;
    message.error = msgRef.current.error;
    message.warning = msgRef.current.warning;

    console.log(message); // 查看 message 对象的值
  }, []);

  return <MessageContainer ref={msgRef} messageList={messageList} setMessageList={setMessageList} />;
}

const message = {
  current: null,
  info: null,
  error: null,
  warning: null,
  open: ({ type, content, flag }) => {
    if (containerRoot) {
      // 如果存在消息(初始化完成， // 派发即时任务)
      message[type](content);
    } else {      
      // 未完成初始化， 创建容器， 派发延时任务
      renderMessageRoot();
      if (flag) {
        setTimeout(() => {
          nextTick(() => {
            message[type](content);        
          });
        }, 100)
        return
      }
      nextTick(() => {
        message[type](content);        
      });
  }
  }
};

export default message;
