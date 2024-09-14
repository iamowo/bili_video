// 收藏夹api
import http from ".";

// vid = -1 时，只查询列表， vid != 1 时，查询带是否收藏信息
export function getFavlist(uid, vid) {
  return http({
    method: 'GET',
    url: `/favlist/getFavlist/${uid}/${vid}`
  })
}

// 获得一个收藏夹中的视频
export function getOneList(fid) {
  return http({
    method: 'GET',
    url: `/favlist/getOneList/${fid}`
  })
}

// 添加收藏
export function addOneVideo(data) {
  return http({
    method: 'POST',
    url: '/favlist/addOneVideo',
    data: data
  })
}

// 新建收藏夹
export function addOneFavlist(uid, title, pub) {
  return http({
    method: 'GET',
    url: `/favlist/addOneFavlist/${uid}/${title}/${pub}`
  })
}

// update
export function updateFav(uid, fid, title, pub) {
  return http({
    method: 'GET',
    url: `/favlist/updateFav/${uid}/${fid}/${title}/${pub}`
  })
}

// 删除收藏夹
export function deleteFav(fid, uid) {
  return http({
    method: 'GET',
    url: `/favlist/deleteFav/${fid}/${uid}`
  })
}