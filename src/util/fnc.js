
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

// 关注用户
export const tofollow = (uid, uid2) => {
  
}

// 取消关注
export const canclefollow = (uid, uid2) => {
  
}