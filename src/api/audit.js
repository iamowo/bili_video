import http from ".";

export function getAuditList() {
  return http({
    method: 'GET',
    url: '/video/getAuditList'
  })
}

// 一个视频的审核结果
export function oneResult(data) {
  return http({
    method: 'POST',
    url: '/video/oneResult',
    data: data
  })
}