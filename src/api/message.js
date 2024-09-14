import http from ".";

export function getWhisperList (uid) {
  return http({
    method: 'GET',
    url: `/message/getWhisperList/${uid}`
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


