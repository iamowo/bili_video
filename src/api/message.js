import http from ".";

// 聊天列表
export function getWhisperList (uid) {
  return http({
    method: 'GET',
    url: `/message/getWhisperList/${uid}`
  })
}

// 获取聊天内容
export function getWhisperConent (uid, hisuid) {
  return http({
    method: 'GET',
    url: `/message/getWhisperConent/${uid}/${hisuid}`
  })
}

export function sendMessage (data) {
  return http({
    method: 'POST',
    url: '/message/sendMessage',
    data: data
  })
}

export function sendImg (data) {
  return http({
    method: 'POST',
    url: '/message/sendImg',
    data: data
  })
}

export function getSysinfo (uid) {
  return http({
    method: 'GET',
    url: `/message/getSysinfo/${uid}`
  })
}

export function getLikeinfo (uid) {
  return http({
    method: 'GET',
    url: `/message/getLikeinfo/${uid}`
  })
}


