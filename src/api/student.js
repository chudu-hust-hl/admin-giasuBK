import post from '@/utils/request'

export function GetStudentLst(data) {
  return post({
    url: 'GSStudent/GetStudentLst',
    method: 'post',
    data
  })
}

export function GSUpdateStudent(data) {
  return post({
    url: 'GSStudent/GSUpdateStudent',
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
