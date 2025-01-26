import http from ".";

const base = '/imgs/'

// 上传图像信息
export function uploadImgInfon(data) {
  return http({
    method: 'POST',
    url: base + 'uploadImgInfon',
    data: data
  })
}

// 上传图像
export function uploadImgs(data) {
  return http({
    method: 'POST',
    url: base + 'uploadImgs',
    data: data
  })
}

//  获取全部
export function getAllImg(uid) {
  return http({
    method: 'GET',
    url: base + `getAllImg/${uid}`
  })
}

// 根据id获取一个
export function getOneById(imgid, uid) {
  return http({
    method: 'GET',
    url: base + `getOneById/${imgid}/${uid}`
  })
}

// 收藏一个图片到收藏夹
export function collectOneImg(data) {
  return http({
    method: 'GET',
    url: base + `collectOneImg/${data.uid}/${data.imgid}/${data.boardid}`
  })
}
// 取消收藏一个图片到收藏夹

// 创建收藏夹
export function createNewBoard(data) {
  return http({
    method: 'POST',
    url: base + 'createNewBoard',
    data: data
  })
}
// 删除收藏夹

// 修改收藏夹

// 获得一个用户的收藏夹
export function getAllBoards(uid) {
  return http({
    method: 'GET',
    url: base + `getAllBoards/${uid}`
  })
}