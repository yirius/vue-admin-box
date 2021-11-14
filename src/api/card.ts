import {postRequest} from "@/api/request";


// 获取数据api
export function getData(data: object) {
  return postRequest("/mock/card/list", data);
}

// 新增
export function add(data: object) {
  return postRequest("/mock/card/add", data);
}

// 编辑
export function update(data: object) {
  return postRequest("/mock/card/update", data);
}

// 删除
export function del(data: object) {
  return postRequest("/mock/card/del", data);
}