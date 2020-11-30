import { history, Reducer, Effect } from 'umi';
import { queryTaskList } from './service'


export interface StateType {
    list?: [];
}
export interface TaskListModelType{
    namespace: string;
    state: StateType;
    effects: {
        getList: Effect;
    };
    reducers: {
        changeTaskList: Reducer<StateType>;
    };
}
const Model : TaskListModelType = {
    namespace : 'task',
    state : {
        list:undefined
    },
    effects:{
        // @param payload 参数
        // @param call 执行异步函数调用接口
        // @param put 发出一个 Action，类似于 dispatch 将服务端返回的数据传递给上面的state
        *getList({ payload,callback }, { call, put }) {
            const response = yield call(queryTaskList, payload);
            if(response.code===0){
                yield put({
                    type: 'changeTaskList',
                    payload: response,
                });
                if(callback){
                    callback(response.list)
                }
            }   
            
        }
    },
    reducers:{
        changeTaskList(state,action) {
            return {
                ...state,
                list:action.payload.list || []
            }
        }
    }
}
export default Model;