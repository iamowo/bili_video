import http from ".";


// 得到全部一级分类
export function getMainTag (type, limit) {
  return http({
    method: 'GET',
    url: `/tag/getMainTag/${type}/${limit}`
  })
}

// 获取标签(二级)
// flag = 0, fid
// flag = 1, type
// flag = 2, name
export function getTags (fid, type, name, flag, page, limit) {
  return http({
    method: 'GET',
    url: `/tag/getTags/${fid}/${type}/${name}/${flag}/${page}/${limit}`
  })
}

// 根据tag获取视频
export function getResourceByTag (type, tag, page, limit) {
  return http({
    method: 'GET',
    url: `/tag/getResourceByTag/${type}/${tag}/${page}/${limit}`
  })
}