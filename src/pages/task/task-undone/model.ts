import { history, Reducer, Effect } from 'umi';
import { getTaskUndoneList,delTaskUndone,editForm,findKeywords } from './service'


export interface StateType {
    taskUndoneListData?: [];
}
export interface TaskListModelType{
    namespace: string;
    state: StateType;
    effects: {
        getList: Effect;
        delItems:Effect;
        getKeywords:Effect;
        edit:Effect;
    };
    reducers: {
        changeList: Reducer<StateType>;
        
    };
}
const Model : TaskListModelType = {
    namespace : 'taskUndone',
    state : {
        taskUndoneListData:undefined
    },
    effects:{
        // @param payload 参数
        // @param call 执行异步函数调用接口
        // @param put 发出一个 Action，类似于 dispatch 将服务端返回的数据传递给上面的state
        *getList({ payload,callback }, { call, put }) {
            const response = yield call(getTaskUndoneList, payload);
            if(response.retCode===0){
                yield put({
                    type: 'changeList',
                    payload: response,
                });
                if(callback){
                    callback(response.data)
                }
            }   
            
        },
        *delItems({ payload,callback }, { call, put }) {
            const response = yield call(delTaskUndone, payload);
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
        *edit({payload,callback},{call,put}) {
            const response = yield call(editForm,payload);
            if(response.retCode==0){
                if(callback){
                    callback(response.data)
                }
            }
        }
    },
    reducers:{
        changeList(state,action) {
            return {
                ...state,
                taskUndoneListData:action.payload.data || []
            }
        }
    }
}
export default Model;