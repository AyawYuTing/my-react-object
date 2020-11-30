import request from 'umi-request'
import { TaskListParams } from './data.d'

export async function queryTaskList(params:TaskListParams) {
    return request('/api/task/list',{
        method : 'POST',
        data : params
    })
}
