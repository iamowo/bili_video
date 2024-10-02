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

  // useImperativeHandle 是 React 中的一个 Hook，它能让你自定义由 ref 暴露出来的句柄
  useImperativeHandle(ref, () => {
    return {
      info: text => {
        const id = uuid();
        setMessageList(list => [...list, { id, text }]);
      },
      error: text => {
        const id = uuid();
        setMessageList(list => [...list, { id, text }]);
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
            <span className="icon iconfont">&#xe69e;</span>
            <span>{msg.text}</span>
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
  }, []);

  return <MessageContainer ref={msgRef} messageList={messageList} setMessageList={setMessageList} />;
}

const message = {
  current: null,
  open: ({ type = 'info', content }) => {
    if (containerRoot) {
      // 如果存在消息
      message[type](content);
    } else {
      renderMessageRoot();
      nextTick(() => {
        message[type](content);
      });
    }
  },
};

export default message;