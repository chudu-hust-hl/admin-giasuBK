import request from "@/utils/request";

export function GetDefaultValue(data) {
  return request({
    url: "Default/GetDefaultValue",
    method: "post",
    data: data,
  });
}

export function GetDefaultLst(data) {
  return request({
    url: "Default/GetDefaultLst",
    method: "post",
    data: data,
  });
}

export function CreateDefaultValue(data) {
  return request({
    url: "Default/CreateDefaultValue",
    method: "post",
    data: data,
  });
}

export function UpdateDefaultValue(data) {
  return request({
    url: "Default/UpdateDefaultValue",
    method: "post",
    data: data,
  });
}

export function DelDefaultValue(data) {
  return request({
    url: "Default/DelDefaultValue",
    method: "post",
    data: data,
  });
}

