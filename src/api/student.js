import post from '@/utils/request'

export function GetStudentLst(data) {
  return post({
    url: 'GSStudent/GetStudentReqList',
    method: 'post',
    data
  })
}

export function GetStudentBasicLst(data) {
  return post({
    url: 'GSStudent/GetStudentBasicInfo',
    method: 'post',
    data
  })
}

export function UpdateStudentReqInfo(data) {
  return post({
    url: 'GSStudent/UpdateStudentReqInfo',
    method: 'post',
    data
  })
}

export function GSGetStudentsByParent(data) {
  return post({
    url: 'GSStudent/GetStudentLstByParentID',
    method: 'post',
    data
  });
}


export function GSAddStudentByParentID(data) {
  return post({
    url: 'GSStudent/AddStudentByParantID',
    method: 'post',
    data
  });
}
