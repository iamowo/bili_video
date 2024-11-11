import { baseurl2 } from "../api"

// 防抖函数
// 延时执行， 再次出发会重新开始延迟
// 搜索框实时显示结果，resize， 表单验证
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
// (按照一定时间间隔执行， 而不是每次触发都执行)
// 页面滚动， 点击按钮
export function throttle(fn, delay) {
  let canRun = false
  return async function () {
    if (canRun) {
      return
    }
    canRun = true
    setTimeout(() => {
      fn.apply(this, arguments)
      canRun = false
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

// 关键字高亮
export function HeightLightKw (content, keyword, tagName, type, uid) {
  let color = '#F25D8E';
  if (type === 1) {
    color = '#32aeec';
  }
  if (content === "") {
    return content
  }
  const a = content.toLowerCase()
  const b = keyword.toLowerCase()

  const indexof = a.indexOf(b)
  const c = indexof > -1 ? content.substr(indexof, keyword.length) : ''
  let val = `<${tagName} style="color:${color};">${c}</${tagName}>`
  if (type === 1) {
      val = `<${tagName} style="color:${color}; cursor: pointer"
              >${c}</${tagName}>`
  }
  const regS = new RegExp(keyword, 'gi')
  return content.replace(regS, val)
}

// 打开漫画
export function tothismg (mid) {
  console.log('mid is:', mid);
  
  window.open(`${baseurl2}/chapter/${mid}`, '_blank')
}

export function tothiskeyword (keyword) {
  window.open(`${baseurl2}/searchmg/${keyword}`, '_blank')
}