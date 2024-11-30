import request from "@/utils/request";


export function Login(data) {
  return request({
    url: "GSUser/LoginAdmin",
    method: "post",
    data: data,
  });
}
export function GetEmployLst(data) {
  return request({
    url: "User/GetEmployLst",
    method: "post",
    data: data,
  });
}
