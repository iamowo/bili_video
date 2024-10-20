import http from ".";

// 分页获取收藏
export function getAllKeyword(uid) {
  return http({
    method: "GET",
    url: `search/getAllKeyword/${uid}`
  })
}

export function addKeyword(uid, keyword) {
  return http({
    method: "GET",
    url: `search/addKeyword/${uid}/${keyword}`
  })
}

export function deleteKeyword(kid) {
  return http({
    method: "GET",
    url: `search/deleteKeyword/${kid}`
  })
}

export function deleteAllKeyword(uid) {
  return http({
    method: "GET",
    url: `search/deleteAllKeyword/${uid}`
  })
}

export function getHotRanking() {
  return http({
    method: "GET",
    url: `search/getHotRanking`
  })
}