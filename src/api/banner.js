import http from ".";

const baseurl = '/banner'

export function getBanner () {
  return http({
    method: 'GET',
    url: '/banner/getBanner'
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

export function addNewBanner (data) {
  return http({
    method: 'POST',
    url: baseurl + `/addNewBanner`,
    data: data
  })
}

export function updateOneBanner (data) {
  return http({
    method: 'POST',
    url: baseurl + `/updateOneBanner`,
    data: data
  })
}

export function deleteThisBanner (ind) {
  return http({
    method: 'GET',
    url: baseurl + `/deleteThisBanner/${ind}`,
  })
}

export function addBannerToList (id, len) {
  return http({
    method: 'GET',
    url: baseurl + `/addBannerToList/${id}/${len}`,
  })
}
