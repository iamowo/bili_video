import http from ".";

// 分页获取收藏
export function getAnimationPage(uid, page, num) {
  return http({
    method: "GET",
    url: `animation/getAnimationPage/${uid}/${page}/${num}`
  })
}

// 得到所有番剧列表
export function getAnimationList() {
  return http({
    method: "GET",
    url: 'animation/getAnimationList'
  })
}


// 得到所有番剧列表
export function getSeasons(aid) {
  return http({
    method: "GET",
    url: `animation/getSeasons/${aid}`
  })
}

// 得到animation信息
export function getAnimationByVid(vid) {
  return http({
    method: "GET",
    url: `animation/getAnimationByVid/${vid}`
  })
}

// 搜索
export function getAnimationByKeyword(keyword) {
  return http({
    method: "GET",
    url: `animation/getAnimationByKeyword/${keyword}`
  })
}