import http from ".";

// 只获得一个人的 flag === 1 的话，还会获取关注的人的动态
export function getDyanmciList (uid, flag) {
  return http({
    method: 'GET',
    url: `/dynamic/getDyanmciList/${uid}/${flag}`
  })
}

// 个人空间  获取带图片的动态，不带图片的不要
export function getDyanmciListWidthImg (uid) {
  return http({
    method: 'GET',
    url: `/dynamic/getDyanmciListWidthImg/${uid}`
  })
}

// 首页动态视频
export function getHomeDynamic (uid) {
  return http({
    method: 'GET',
    url: `/dynamic/getHomeDynamic/${uid}`
  })
}

export function sendDynamic (data) {
  return http({
    method: 'POST',
    url: '/dynamic/sendDynamic',
    data: data
  })
}

export function sendDyimgs (data) {
  return http({
    method: 'POST',
    url: '/dynamic/sendDyimgs',
    data: data
  })
}

export function shareDynamic (id) {
  return http({
    method: 'GET',
    url: `/dynamic/sendImg/${id}`
  })
}

export function getDynamic (did) {
  return http({
    method: 'GET',
    url: `/dynamic/getDynamic/${did}`
  })
}
