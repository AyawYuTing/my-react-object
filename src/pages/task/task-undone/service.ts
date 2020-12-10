import request from 'umi-request'


export async function getTaskUndoneList(params:any){
    return request('/api/task/undone/list',{
        method : 'GET',
        params : params
    })
}