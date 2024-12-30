import post from '@/utils/request'

export function GetParentLst(data) {
  return post({
    url: 'GSParent/GetParentReqList',
    method: 'post',
    data
  })
}

export function UpdateParentInfo(data) {
  return post({
    url: 'GSParent/UpdateParentInfo',
    method: 'post',
    data
  })
}
