import request from "@/utils/request";


export function Login(data) {
  return request({
    url: "GSUser/LoginAdmin",
    method: "post",
    data: data,
  });
}