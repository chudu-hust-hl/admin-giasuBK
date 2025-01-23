import axios from "axios";

// import { useGlobalStore } from '@/stores/global-store'
import {
  getToken,
  getUserName,
  removeToken,
  removeUserName,
  removeFullName,
  removePhoneNumber,
  removeEmployCode,
} from "@/utils/auth";
// create an axios instance
import { useNotification } from "@kyvg/vue3-notification";

const notification = useNotification();
const service = axios.create({
  baseURL: "https://crm.icpc1hn.work/giasuapi/",
  // baseURL: "http://localhost:44375/",
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 20000, // request timeout
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    const token = getToken();

    if (token != "" && token) {
      config.data.Token = getToken();
      config.data.UserID = getUserName();
    }

    return config;
  },
  (error) => {
    // do something with request error
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  (response) => {
    if (response.data == null) {
      response.data = {};
    }
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    if (res.RespCode !== 0) {
      if (res.RespCode === -1) {
        // console.log("đã vào đây");
        notification.notify({
          type: "error",
          title: "Hết hạn",
          text: "Phiên đăng nhập hết hạn",
        });
        location.reload();
        removeToken();
        removeUserName();
        removeFullName();
        removePhoneNumber();
        removeEmployCode();
        store.dispatch("user/resetToken").then(() => {});
      } else {
        notification.notify({
          type: "error",
          title: "Lỗi",
          text: res.RespText,
        });
        return null;
      }
    } else {
      return res;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default service;
