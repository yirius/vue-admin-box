import request from '@/utils/system/request'

// 获取用户信息Api
export function getMenus(data: object) {
  return request({
    url: '/menus',
    method: 'post',
    baseURL: '/mock',
    data
  })
}
