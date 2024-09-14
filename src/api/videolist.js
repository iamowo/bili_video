import http from ".";

// 获得一个列表
export function getUserVideoList(uid) {
  return http({
    method: 'GET',
    url: `/video/getUserVideoList/${uid}`,
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
export function addVideoToList(listid, vids, uid) {
  return http({
    method: 'GET',
    url: `/video/addVideoToList/${listid}/${vids}/${uid}`
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
export function getUnaddVideo(listid, uid) {
  return http({
    method: 'GET',
    url: `/video/getUnaddVideo/${listid}/${uid}`
  })
}