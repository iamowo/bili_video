import http from ".";

// 获得用户的播放列表
export function getUserVideoList(uid) {
  return http({
    method: 'GET',
    url: `/video/getUserVideoList/${uid}`
  })
}

// 获得一个播放列表
export function getUserListOne(listid) {
  return http({
    method: 'GET',
    url: `/video/getUserListOne/${listid}`
  })
}

// 新增一个列表
export function addVideoList(data) {
  return http({
    method: 'POST',
    url: '/video/addVideoList',
    data: data
  })
}

// 添加视频到列表中
export function addVideoToList(listid, uid, vids) {
  return http({
    method: 'GET',
    url: `/video/addVideoToList/${listid}/${uid}/${vids}`
  })
}

// 得到一个列表中的视频(已经添加过的)
export function getVideoFormList(listid) {
  return http({
    method: 'GET',
    url: `/video/getVideoFormList/${listid}`
  })
}

// 一个列表中未添加过的视频
export function getUnaddVideo(uid) {
  return http({
    method: 'GET',
    url: `/video/getUnaddVideo/${uid}`
  })
}

// 改变信息
export function chanegListInfo (data) {
  return http({
    method: 'POST',
    url: '/video/chanegListInfo',
    data: data
  })
}

export function deleteVideoList (listid) {
  return http({
    method: 'GET',
    url: `/video/deleteVideoList/${listid}`
  })
}

