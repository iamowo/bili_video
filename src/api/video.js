import http from ".";

export function getAllVideo() {
  return http({
    method: 'GET',
    url: '/video/getAllVideo'
  })
}

// 懒加载获取
export function getSomeVideos(vids, num) {
  return http({
    method: 'GET',
    url: '/video/getSomeVideos',
    params: {
      vids: vids,
      num: num
    }
  })
}


// 获取随机推荐
export function getRandom(num) {
  return http({
    method: 'GET',
    url: `/video/getRandom/${num}`
  })
}

// 获取一个视频
export function getByVid(vid, uid) {
  return http({
    method: 'GET',
    url: `/video/getByVid/${vid}/${uid}`
  })
}

// 获取某人的视频 nums = 0 ,全部
export function getVideoByUid(uid, nums) {
  return http({
    method: 'GET',
    url: `/video/getVideoByUid/${uid}/${nums}`
  })
}

// 获取全部视频， 包括未审核，未通过的
export function getAllv(uid) {
  return http({
    method: 'GET',
    url: `/video/getAllv/${uid}`
  })
}


// 获取一个视频的相关推荐
export function getVideoLikely(vid) {
  return http({
    method: 'GET',
    url: `/video/getVideoLikely/${vid}`
  })
}

// 获得二已经上传过的切片
export function getAlready(hashValue, uid) {
  return http ({
    method: 'GET',
    url: `/video/getAlready/${hashValue}/${uid}`
  })
}

// 上传视频信息
export function uploadVideoInfos(data) {
  return http ({
    method: 'POST',
    url: '/video/uploadVideoInfos',
    data: data
  })
}

//上传切片
export function uploadChunks(data) {
  return http ({
    method: 'POST',
    url: '/video/uploadChunks',
    data: data
  })
}

// 和并切片
export function mergeChunks(uid, vid, type) {
  return http ({
    method: 'GET',
    url: `/video/mergeChunks/${uid}/${vid}/${type}`
  })
}

// 更新视频数据
export function updateinfo(data) {
  return http({
    method: 'POST',
    url: '/video/updateinfo',
    data: data
  })
}

// 得到历史记录
export function getHistory(uid) {
  return http({
    method: 'GET',
    url: `/video/getHistory/${uid}`
  })
}

// 删除历史
export function deleteHistory(uid, vid) {
  return http({
    method: 'GET',
    url: `/video/deleteHistory/${uid}/${vid}`
  })
}

// sahnchu quan bu li shi
export function deleteAll(uid) {
  return http({
    method: 'GET',
    url: `/video/deleteAll/${uid}`
  })
}

// 获取排行榜
export function getRank(type) {
  return http({
    method: 'GET',
    url: `/video/getRank/${type}`
  })
}

// 根据视频标题搜索
// sort: 0 综合  1 播放 2 发布事件 3 收藏 4 弹幕
//       10：十分钟一下  11：10-30  12：30-60 13：60+
export function getByKeywordAll(keyword, sort1, sort2, sort3) {
  return http({
    method: 'GET',
    url: `/video/getByKeywordAll/${keyword}/${sort1}/${sort2}/${sort3}`
  })
}

// 根据作者名字搜索
export function getByKeywordName(keyword) {
  return http({
    method: 'GET',
    url: `/video/getByKeywordName/${keyword}`
  })
}

// 首页视频动态
export function getHomeDynamicVideo(uid, page, num, size) {
  return http({
    method: 'GET',
    url: `/video/getHomeDynamicVideo/${uid}/${page}/${num}/${size}`
  })
}

// 首页 观看历史
export function getHomeHistory(uid, page, num, size) {
  return http({
    method: 'GET',
    url: `/video/getHomeHistory/${uid}/${page}/${num}/${size}`
  })
}

// 获得弹幕
export function getDm(vid) {
  return http ({
    method: 'GET',
    url: `/video/getDm/${vid}`
  })
}

// 发送弹幕
export function sendDm(data) {
  return http ({
    method: 'POST',
    url: '/video/sendDm',
    data: data
  })
}

// 关键词搜索结果（标题）
export function searchKw(kw) {
  return http ({
    method: 'GET',
    url: `/video/searchKw/${kw}`
  })
}

// 多关键词搜索视频
export function searchVideoByMany(sort, maintag, pass) {
  return http ({
    method: 'GET',
    url: '/video/searchVideoByMany',
    params: {
      sort: sort,
      maintag: maintag,
      pass: pass
    }
  })
}

// 得到全部一级分类
export function getAllClassify() {
  return http ({
    method: 'GET',
    url: '/video/getAllClassify'
  })
}

// 代表作
export function getFamous(uid) {
  return http ({
    method: 'GET',
    url: `/video/getFamous/${uid}`
  })
}

// 非代表作
export function getUnfamous(uid, type) {
  return http ({
    method: 'GET',
    url: `/video/getUnfamous/${uid}/${type}`
  })
}

// 设置代表作
export function changeFamous(uid, vids) {
  return http ({
    method: 'GET',
    url: `/video/changeFamous/${uid}/${vids}`
  })
}

// 个人空间  获取带图片的动态，不带图片的不要
export function getHomeDynamic (uid, type) {
  return http({
    method: 'GET',
    url: `/video/getHomeDynamic/${uid}/${type}`
  })
}

// 个人删除视频
export function userdeletevideo (vid) {
  return http({
    method: 'GET',
    url: `/video/userdeletevideo/${vid}`
  })
}

// 个人修改视频信息
export function userChnageInfo (data) {
  return http({
    method: 'POST',
    url: '/video/userChnageInfo',
    data: data
  })
}

// 获取主标签tag类
export function getByMaintag (maintag) {
  return http({
    method: 'GET',
    url: `/video/getByMaintag/${maintag}`
  })
}

// 获取所有主标签
export function getAllMainTag () {
  return http({
    method: 'GET',
    url: '/video/getAllMainTag'
  })
}

// 根据关键词搜索某人视频
export function getVideoByKeyword (uid, keyword) {
  return http({
    method: 'GET',
    url: '/video/getVideoByKeyword',
    params: {
      uid: uid,
      keyword: keyword
    }
  })
}