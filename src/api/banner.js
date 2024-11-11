import http from ".";

const baseurl = 'banner'

export function getBanner () {
  return http({
    method: 'GET',
    url: baseurl + '/getBanner'
  })
}

export function getBannerUnselected () {
  return http({
    method: 'GET',
    url: baseurl + '/getBannerUnselected'
  })
}

export function setBanner (ind) {
  return http({
    method: 'GET',
    url: baseurl + `/setBanner/${ind}`
  })
}