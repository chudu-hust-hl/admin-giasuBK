import post from '@/utils/request'

export function GetClassList(data) {
    return post({
        url: 'GSClass/GetClassList',
        method: 'post',
        data
    })
}

export function UpdateClassInfo(data) {
    return post({
      url: 'GSClass/UpdateClassInfo',
      method: 'post',
      data
    })
  }