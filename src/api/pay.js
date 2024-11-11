import http from ".";

const base = '/alipay'

export function pay(id) {
  return http({
    method: 'GET',
    url: `${base}/pay?id=${id}`
  })
}

export function addOrders(data) {
  return http({
    method: 'POST',
    url: `${base}/addOrders`,
    data: data
  })
}

export function queryOrderStatus(id) {
  return http({
    method: 'GET',
    url: `${base}/queryOrderStatus?id=${id}`
  })
}