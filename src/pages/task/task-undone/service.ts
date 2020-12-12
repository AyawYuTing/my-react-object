import request from 'umi-request'


export async function getTaskUndoneList(params:any){
    return request('/api/task/undone/list',{
        method : 'POST',
        body : params
    })
}

export async function delTaskUndone(params:any){
    return request('/api/task/deletes',{
        method : 'POST',
        body : params
    })
}
// 获取搜索词列表
export async function findKeywords(params:any) {
    return request('/api/task/findkeyword',{
        method:'POST',
        body:params
    })
}
// 编辑任务
export async function editForm(params:any) {
    return request('/api/task/update',{
        method:'POST',
        body:params
    })
}