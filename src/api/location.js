import post from "@/utils/request-location";

export function GetCity(data) {
  return post({
    url: "api-t/User/GetLocation",
    method: "post",
    data: data,
  });
}

export function GetDistrictByCity(data) {
  return post({
    url: "api-t/User/GetLocation",
    method: "post",
    data: data,
  });
}

export function GetCommuneByCityAndDistrict(data) {
  return post({
    url: "api-t/User/GetLocation",
    method: "post",
    data: data,
  });
}