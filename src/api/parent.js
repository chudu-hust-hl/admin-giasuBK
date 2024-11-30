import post from '@/utils/request'

export function GetParentLst(data) {
  return post({
    url: 'GSParent/GetParentLst',
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
