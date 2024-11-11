import http from ".";

// 分页获取收藏
export function getAnimationPage(uid, page, num) {
  return http({
    method: "GET",
    url: `animation/getAnimationPage/${uid}/${page}/${num}`
  })
}

// 上传时获得列表
export function getUploadAniList(uid) {
  return http({
    method: "GET",
    url: `animation/getUploadAniList/${uid}`
  })
}

// 得到所有番剧列表
export function getAnimationList(uid) {
  return http({
    method: "GET",
    url: `animation/getAnimationList/${uid}`
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
export function getAnimationByVid(vid, uid) {
  return http({
    method: "GET",
    url: `animation/getAnimationByVid/${vid}/${uid}`
  })
}

// 搜索
export function getAnimationByKeyword(keyword) {
  return http({
    method: "GET",
    url: `animation/getAnimationByKeyword/${keyword}`
  })
}

// 追剧
export function subthisAnimation(uid, aid) {
  return http({
    method: "GET",
    url: `animation/subthisAnimation/${uid}/${aid}`
  })
}

// 取消
export function cnacleAnimation(uid, aid) {
  return http({
    method: "GET",
    url: `animation/cnacleAnimation/${uid}/${aid}`
  })
}
