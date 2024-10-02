import http from ".";

export function getAllComment(vid, uid, type) {
  return http({
    method: 'GET',
    url: `/comment/getAllComment/${vid}/${uid}/${type}`
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

export function addLikeinfo (data) {
  return http({
    method: 'POST',
    url: '/comment/addLikeinfo',
    data: data
  })
}

export function deletelikeinfo (cid, uid) {
  return http({
    method: 'GET',
    url: `/comment/deletelikeinfo/${cid}/${uid}`
  })
}