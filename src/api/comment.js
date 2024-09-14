import http from ".";

export function getAllComment(vid) {
  return http({
    method: 'GET',
    url: `/comment/getAllComment/${vid}`
  })
}

export function addComment(data) {
  return http({
    method: 'POST',
    url: '/comment/addComment',
    data: data
  })
}

export function deleteComment(id, vid) {
  return http({
    method: 'GET',
    url: `/comment/deleteComment/${id}/${vid}`
  })
}
