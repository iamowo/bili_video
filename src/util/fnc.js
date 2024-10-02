
// 防抖函数
export function debounce (fn, delay) {
  let timer = null
  return function (e) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, arguments)
    }, delay)
  }
}

// 节流
export function throttle(fn, delay) {
  let canRun = true
  return function () {
    if (!canRun) {
      canRun = false
    }
    setTimeout(() => {
      fn.apply(this, arguments)
      canRun = true
    }, delay)
  }
}

// 用户空间
export const touserspace = (e) => {
  const uid = e.target.dataset.uid || e.target.parentNode.dataset.uid
  const url = `/${uid}`
  window.open(url, "_blank")
}

// 打开视频

export const tovideo = (e) => {
  const vid = e.target.dataset.vid || e.target.parentNode.dataset.vid
  const url = `/video/${vid}`
  window.open(url, "_blank")
}

// 打开详情动态
export const todynamic = (e) => {
  const did = e.target.dataset.did || e.target.parentNode.dataset.did
  const url = `/dydetail/${did}`
  window.open(url, "_blank")
}

// message 组件用到的
export function nextTick(callback) {
  let timerFunc;
  if (typeof Promise !== 'undefined') {
    const p = Promise.resolve();
    timerFunc = () => {
      p.then(callback);
    };
  } else if (
    typeof MutationObserver !== 'undefined' &&
    MutationObserver.toString() === '[object MutationObserverConstructor]'
  ) {
    let counter = 1;
    const observer = new MutationObserver(callback);
    const textNode = document.createTextNode(String(counter));
    observer.observe(textNode, { characterData: true });
    timerFunc = () => {
      counter = (counter + 1) % 2;
      textNode.data = String(counter); // 数据更新
    };
  } else if (typeof setImmediate !== 'undefined') {
    timerFunc = () => {
      setImmediate(callback);
    };
  } else {
    timerFunc = () => {
      setTimeout(callback, 0);
    };
  }
  timerFunc();
}

// 生成唯一id
export function uuid() {
  const uuid = window.crypto.getRandomValues(new Uint8Array(8));
  return uuid.toString().split(',').join('');
}