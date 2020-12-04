import { history, Reducer, Effect } from 'umi';
import { queryTaskList,runTasks,pauseTasks,deleteTasks,setTaskTop,cancelTaskTop,stopTask,getTasktype,findKeywords } from './service'


export interface StateType {
    taskListData?: [];
}
export interface TaskListModelType{
    namespace: string;
    state: StateType;
    effects: {
        getList: Effect;
        run:Effect;
        pause:Effect;
        delete:Effect;
        setTop:Effect;
        cancelTop:Effect;
        stop:Effect;
        getType:Effect;
        getKeywords:Effect
    };
    reducers: {
        changeTaskList: Reducer<StateType>;
        
    };
}
const Model : TaskListModelType = {
    namespace : 'task',
    state : {
        taskListData:undefined
    },
    effects:{
        // @param payload 参数
        // @param call 执行异步函数调用接口
        // @param put 发出一个 Action，类似于 dispatch 将服务端返回的数据传递给上面的state
        *getList({ payload,callback }, { call, put }) {
            const response = yield call(queryTaskList, payload);
            if(response.retCode===0){
                yield put({
                    type: 'changeTaskList',
                    payload: response,
                });
                if(callback){
                    callback(response.data)
                }
            }   
            
        },
        *run({ payload,callback },{ call,put }) {
            const response = yield call(runTasks,payload);
            if(response.retCode===0){
                if(callback){
                    callback(response.data)
                }
            }
        },
        *pause({ payload,callback },{ call,put }) {
            const response = yield call(pauseTasks,payload);
            if(response.retCode===0){
                if(callback){
                    callback(response.data)
                }
            }
        },
        *delete({ payload,callback },{ call,put }) {
            const response = yield call(deleteTasks,payload);
            if(response.retCode===0){
                if(callback){
                    callback(response.data)
                }
            }
        },
        *setTop({ payload,callback},{call,put}) {
            const response = yield call(setTaskTop,payload);
            if(response.retCode===0){
                if(callback){
                    callback(response.data)
                }
            }
        },
        *cancelTop({ payload,callback},{call,put}) {
            const response = yield call(cancelTaskTop,payload);
            if(response.retCode===0){
                if(callback){
                    callback(response.data)
                }
            }
        },
        *stop({ payload,callback},{call,put}) {
            const response = yield call(stopTask,payload);
            if(response.retCode===0){
                if(callback){
                    callback(response.data)
                }
            }
        },
        *getType({ payload,callback},{call,put}) {
            const response = yield call(getTasktype,payload);
            if(response.retCode===0){
                if(callback){
                    callback(response.data)
                }
            }
        },
        *getKeywords({ payload,callback},{call,put}) {
            const response = yield call(findKeywords,payload);
            if(response.retCode===0){
                if(callback){
                    callback(response.data)
                }
            }
        },
    },
    reducers:{
        changeTaskList(state,action) {
            return {
                ...state,
                taskListData:action.payload.data || []
            }
        }
    }
}
export default Model;