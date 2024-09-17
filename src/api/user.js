import http from ".";

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
export function getFollow(uid) {
  return http({
    method: 'GET',
    url: `/user/getFollow/${uid}`
  })
}

// 获取粉丝
export function getFans(uid) {
  return http({
    method: 'GET',
    url: `/user/getFans/${uid}`
  })
}



