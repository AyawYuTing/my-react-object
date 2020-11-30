# 在 Ant Design Pro 中，一个完整的前端 UI 交互到服务端处理流程是这样的：

- 1、UI 组件交互操作；
- 2、调用 model 的 effect；
- 3、调用统一管理的 service 请求函数；
- 4、使用封装的 request.ts 发送请求；
- 5、获取服务端返回；
- 6、然后调用 reducer 改变 state；
- 7、更新 model。


- 假设接口地址：'http://baidu.com'

- 你想要用api指代这个地址

- 接口返回的数据
    {
    code:0;
    list:[]
    }


# 1.在proxy配置
    export default {
    dev: {
        '/api': {
        target: 'http://baidu.com',
        changeOrigin: true,
        pathRewrite: { '^/api: '' },
        },
    }

# 2.request进行处理
    try {
    request.interceptors.request.use((url, options) => {
        const accessToken = localStorage.getItem('accessToken');
    //地址是包含api的话就加token
        if (/api/.test(url)) {
        return {
            url,
            options: {
            ...options,
            // redirect: 'follow',
            headers: { Authorization: `Bearer ${accessToken}` }, //加token
            },
        };
        }
    }

# 3.写server 通过get拿数据
    export async function getList(params: ResourceCompressParamsType) {
    const { teamId, data } = params;
    return request(`/api/team/${teamId}/documents`, {
        method: 'get',
    });
    }

# 4.写models
    const ListModel: ContactsModelType = {
    namespace: 'test',
    state: {
        list: [],
    },
    effects: {
        *getlist({ payload, callback }, { call, put }) {
        const response = yield call(contacts, payload);
        if (response && response.code === 0) {
            yield put({
            type: 'save',
            payload: response,
            });
            if (callback) callback(formatListData(response.elems));
        }
        },
    },
    reducers: {
        save(state, action) {
        return {
            ...state,
            list: (action.payload.elems) || [],
        };
        },
    },
    };

# 5.页面调用
    const getList = () => {
        dispatch({
            type: 'test/getlist',
            payload: {
                teamId,
            },
            callback:(data)=>{
            //拿到后台数据data
            }
        });
    }

    const delRole=(id)=>{
    dispatch({
        type:'role/remove',
        payload: { id }
    })
    }
    const toEdit=(id)=>{
    history.push(`/account/team/teamControl/roleDetail?type=edit&id=${id}`)
    }
    const columns = [
    {
        title: '角色',
        dataIndex: 'roleName',
        key: 'roleName',
        width: 150
    },{
        title: '权限说明',
        dataIndex: 'authInfo',
        key: 'authInfo',
        width: 150
    },{
        title: '角色描述',
        dataIndex: 'roleDescription',
        key: 'roleDescription',
        width: 150
    },{
        title: '操作',
        dataIndex: 'opt',
        key: 'opt',
        width: 150,
        render:(text, record, index)=>{
        return <div>
            <Button data-permissions='13-02-01' type='text' onClick={()=>{toEdit(record.id)}} className={styles.textButton}>详情</Button>
            {Boolean(record.editAble) && <DelButton placement='left' className={styles.textButton} data-permissions='13-02-02' title='确认删除角色吗' onConfirm={() => {
            delRole(record.id);
            }} />}
        </div>
        }
    },
    ]
    return <div className={styles.wrap}>
    <Card bordered={false} title={<div className={styles.tableTitle}>角色管理</div>} extra={<Button data-permissions='13-02-00' type='primary' className={styles.button} onClick={addRole}>添加角色</Button>}>
        <PaginationTable columns={columns} modelNameSpace='role' />
    </Card>
    </div>
