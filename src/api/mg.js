import http from ".";

export function uploadMgInfo (data) {
  return http({
    method: "POST",
    url: '/mg/uploadMgInfo',
    data: data
  })
}

export function uploadMgImg (data) {
  return http({
    method: "POST",
    url: '/mg/uploadMgImg',
    data: data
  })
}

export function getByTitle (keyword) {
  return http({
    method: "GET",
    url: `/mg/getByTitle/${keyword}`
  })
}

export function updateMg (data) {
  return http({
    method: "POST",
    url: '/mg/updateMg',
    data: data
  })
}