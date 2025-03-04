import http from ".";

// type 0 全部
export function getMgsss (type) {
  return http({
    method: "GET",
    url: `/mg/getMgsss/${type}`
  })
}

export function uploadMgInfo (data) {
  return http({
    method: "POST",
    url: '/mg/uploadMgInfo',
    data: data
  })
}

export function uploadMgImg (data) {
  return http({
    method: "POST",
    url: '/mg/uploadMgImg',
    data: data
  })
}

export function updateMgInfo (data) {
  return http({
    method: "POST",
    url: '/mg/updateMgInfo',
    data: data
  })
}

export function getByTitle (keyword) {
  return http({
    method: "GET",
    url: `/mg/getByTitle/${keyword}`
  })
}

export function updateMg (data) {
  return http({
    method: "POST",
    url: '/mg/updateMg',
    data: data
  })
}

export function getUploadMg (uid) {
  return http({
    method: "GET",
    url: `/mg/getUploadMg/${uid}`
  })
}

// 获取n个漫画
// 0 热门推荐  1 最近更新  2 漫画相关推荐
export function getMgs (num, type) {
  return http({
    method: 'GET',
    url: `/mg/getMgs/${num}/${type}`
  })
}

// 获取历史 or 收藏
export function getMgList (uid, type) {
  return http({
    method: 'GET',
    url: `/mg/getMgList/${uid}/${type}`
  })
}

// 添加收藏 or 收藏
export function addMgList (data) {
  return http({
    method: 'POST',
    url: '/mg/addMgList',
    data: data
  })
}

export function updateMgStatus (data) {
  return http({
    method: 'POST',
    url: '/mg/updateMgStatus',
    data: data
  })
}

// 获取详情页面
export function getOneMg (mid, uid) {
  return http({
    method: 'GET',
    url: `/mg/getOneMg/${mid}/${uid}`
  })
}

// 获取章节
// page = 0 num = 0  获取全部章节
export function getChapters (mid, page, num) {
  return http({
    method: 'GET',
    url: `/mg/getChapters/${mid}/${page}/${num}`
  })
}

// 获取imgs
export function getMgImgs (mid, number) {
  return http({
    method: 'GET',
    url: `/mg/getMgImgs/${mid}/${number}`
  })
}

export function getMgImgsRandom (mid, number, num) {
  return http({
    method: 'GET',
    url: `/mg/getMgImgsRandom/${mid}/${number}/${num}`
  })
}


// 获取分类
export function getClassify (type1, type2, type3) {
  return http({
    method: 'GET',
    url: `/mg/getClassify/${type1}/${type2}/${type3}`
  })
}

export function getMgRanking (type) {
  return http({
    method: 'GET',
    url: `/mg/getMgRanking/${type}`
  })
}

export function searchMg (keyword) {
  return http({
    method: 'GET',
    url: `/mg/searchMg/${keyword}`
  })
}

// 获取上次观看记录

export function getLastWatch (mid, uid) {
  return http({
    method: 'GET',
    url: `/mg/getLastWatch/${mid}/${uid}`
  })
}