import { any } from 'prop-types'
import request from 'umi-request'
import { TaskListParams } from './data.d'

// 查询任务列表
export async function queryTaskList(params:any) {
    return request('/api/task/list',{
        method : 'POST',
        body:params
        // method : 'GET',
        // params : params
    })
}
// 批量发布
export async function runTasks(params:any) {
    return request('/api/task/runs',{
        method : 'POST',
        // data : params
        body:params
    })
}
// 批量暂停
export async function pauseTasks(params:any) {
    return request('/api/task/pauses',{
        method : 'POST',
        body:params
    })
}

// 删除任务
export async function deleteTasks(params:any) {
    return request('/api/task/deletes',{
        method : 'POST',
        body:params
    })
}

// 置顶任务
export async function setTaskTop(params:any) {
    return request('/api/task/settop',{
        method : 'POST',
        body:params
    })
}
// 取消置顶任务
export async function cancelTaskTop(params:any) {
    return request('/api/task/canceltop',{
        method : 'POST',
        body:params
    })
}

// 终止任务
export async function stopTask(params:any) {
    return request('/api/task/status',{
        method : 'POST',
        body:params
    })
}