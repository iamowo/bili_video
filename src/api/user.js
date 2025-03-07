import http from ".";

export function getAllUser () {
  return http({
    method: 'GET',
    url: '/user/AllUser'
  })
}

export function login (data) {
  return http({
    method: 'POST',
    url: '/user/login',
    data: data
  })
}

export function register (data) {
  return http({
    method: 'POST',
    url: '/user/register',
    data: data
  })
}

export function findAccount (account) {
  return http({
    method: 'GET',
    url: `/user/findAccount/${account}`
  })
}

export function getByUid (uid) {
  return http({
    method: 'GET',
    url: `/user/getByUid/${uid}`
  })
}

// 带有 关注状态
export function getByUidFollowed (uid, myuid) {
  return http({
    method: 'GET',
    url: `/user/getByUidFollowed/${uid}/${myuid}`
  })
}

export function updateUserinfo(data) {
  return http({
    method: 'POST',
    url: '/user/updateUserinfo',
    data: data
  })
}

export function searchUser (keyword, uid, sort) {
  return http({
    method: 'GET',
    url: `/user/searchUser/${keyword}/${uid}/${sort}`
  })
}

// 关注用户
// uid2 关注了 uid1
export function toFollow(uid1, uid2) {
  return http({
    method: 'GET',
    url: `/user/toFollow/${uid1}/${uid2}`
  })
}

// 取关
export function toUnfollow(uid1, uid2) {
  return http({
    method: 'GET',
    url: `/user/toUnfollow/${uid1}/${uid2}`
  })
}

// 获取关注
export function getFollow(uid, page, nums, keyword) {
  return http({
    method: 'POST',
    url: '/user/getFollow',
    data: {
      uid: uid,
      page: page,
      nums: nums,
      keyword: keyword
    }
  })
}

// 获取粉丝
export function getFans(uid, page, nums, keyword) {
  return http({
    method: 'POST',
    url: '/user/getFans',
    data: {
      uid: uid,
      page: page,
      nums: nums,
      keyword: keyword
    }
  })
}

export function getSetting(uid) {
  return http({
    method: 'GET',
    url: `/user/getSetting/${uid}`
  })
}

// 空间设置
export function changeSetting(data) {
  return http({
    method: 'POST',
    url: '/user/changeSetting',
    data: data
  })
}

// 用户数据
export function getUserData(uid) {
  return http({
    method: 'GET',
    url: '/user/getUserData',
    params: {
      uid: uid
    }
  })
}

// 生成登录二维码
export function generateQrCode() {
  return http({
    method: 'GET',
    url: '/user/generateQrCode'
  })
}


