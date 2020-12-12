import request from 'umi-request'


export async function getTaskPicsList(params:any){
    return request('/api/task/picture/type/setting/list',{
        method : 'POST',
        body : params
    })
}