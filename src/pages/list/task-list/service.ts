import request from 'umi-request'
import { TaskListParams } from './data.d'

// 查询任务列表
export async function queryTaskList(params:TaskListParams) {
    return request('/api/task/list',{
        method : 'GET',
        params : params
    })
}
// 批量发布
export async function runTasks(params:any) {
    return request('/api/task/runs',{
        method : 'POST',
        data : params
    })
}
// 批量暂停
export async function pauseTasks(params:any) {
    return request('/api/task/pauses',{
        method : 'POST',
        data : {
            ...params
        }
    })
}

// 删除任务
export async function deleteTasks(params:any) {
    return request('/api/task/deletes',{
        method : 'POST',
        data : params
    })
}