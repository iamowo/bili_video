import http from ".";

export function getOneTagType (type) {
  return http({
    method: 'GET',
    url: `/tag/getOneTagType/${type}`
  })
}