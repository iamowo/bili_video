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

export function getDynamic (did, uid) {
  return http({
    method: 'GET',
    url: `/dynamic/getDynamic/${did}/${uid}`
  })
}

// 更新信息， 删除动态
export function updateDyinfo (data) {
  return http({
    method: 'POST',
    url: '/dynamic/updateDyinfo',
    data: data
  })
}

// like
export function addDynamicLike (data) {
  return http({
    method: 'POST',
    url: '/dynamic/addDynamicLike',
    data: data
  })
}

export function getAllTopical () {
  return http({
    method: 'GET',
    url: '/dynamic/getAllTopical'
  })
}

export function addTopical (data) {
  return http({
    method: 'POST',
    url: '/dynamic/addTopical',
    data: data
  })
}

export function addTopicalCount (tid) {
  return http({
    method: 'GET',
    url: `/dynamic/addTopicalCount/${tid}`
  })
}

export function addTopicalWatchs (tid, topical) {
  return http({
    method: 'GET',
    url: `/dynamic/addTopicalWatchs/${tid}/${topical}`
  })
}

// 获取一个topical的信息
export function getOneTopical (topical) {
  return http({
    method: 'GET',
    url: `/dynamic/getOneTopical/${topical}`
  })
}

// 获取一个topical中的所有动态
export function getDynamicByTopical (topical, uid, sort) {
  return http({
    method: 'GET',
    url: `/dynamic/getDynamicByTopical/${topical}/${uid}/${sort}`
  })
}
