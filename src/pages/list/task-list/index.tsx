import React,{ useState,useRef, useEffect } from 'react'
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { Dispatch, Link, connect } from 'umi';
import { Table, Button } from 'antd';
import { TaskListItem,TaskListPagination } from './data.d'
import { number } from 'prop-types';

interface TaskProps {
    dispatch: Dispatch;
}

const TaskList : React.FC<TaskProps> = (props) =>{
    const { dispatch } = props
    const [taskList,setTaskList] = useState([])
    const [pagination,setPagination] = useState<TaskListPagination>({ page:1,limit:10,total:0 })
    
    const getList = () => {
        // console.log(1)
        dispatch({
            type: 'task/getList',   //task 为 model 中的namespace，getList为方法名
            payload: {
                page:pagination.page,
                limit:pagination.limit,
                status:'RP'
            },
            callback:(data)=>{
                console.log('payload--',pagination)
                let listData = {
                    page:data.page,
                    total:data.total,
                    limit:data.limit
                }
                setTaskList(data.list)
                // setPagination(listData)
            }
        })
    }
    
    const columns = [
        {
            title: '序号',
            align:'center',
            render (text:any, record:any, index:any) {
                return(
                    <span>{(pagination.page-1)*10+index+1}</span>
                 )
            } 
        },
        {
            title: '定时发布',
            dataIndex: 'createTime',
            key: 'createTime',
            align: 'center',
        },
        {
            title: '店铺名称',
            dataIndex: 'shopName',
            key: 'shopName',
            align: 'center',
        },
        {
            title: '显示价',
            dataIndex: 'showPrice',
            key: 'showPrice',
            align: 'center',
        },
        {
            title: '实付价',
            dataIndex: 'realPrice',
            key: 'realPrice',
            align: 'center',
        },
        {
            title: '优惠券',
            dataIndex: 'prefPrice',
            key: 'prefPrice',
            align: 'center',
        },
        {
            title: '发布数',
            dataIndex: 'taskTotal',
            key: 'taskTotal',
            align: 'center',
        },
        {
            title: '剩余数',
            dataIndex: 'tesidueNum',
            key: 'tesidueNum',
            align: 'center',
        },
        {
            title: '待操作',
            dataIndex: 'stayOprNum',
            key: 'stayOprNum',
            align: 'center',
        },
        
        {
            title: '待审核',
            dataIndex: 'notAuditedNum',
            key: 'notAuditedNum',
            align: 'center',
        },
        {
            title: '完成数',
            dataIndex: 'yesAuditedNum',
            key: 'yesAuditedNum',
            align: 'center',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
        },
    ];
    // const rowSelection = {
    //     selectedRowKeys,
    //     onChange: this.onSelectChange,
    //   };
    useEffect(() => {
        getList();
    },[]);
    return(
        <PageContainer>
            <Table<TaskListItem> 
            columns={columns} 
            dataSource={taskList}
            pagination={{
                total:pagination.total,
                pageSizeOptions: ["10", "20", "50"],
                showTotal: total => `共 ${total} 条`,
                showSizeChanger: true,
                // 改变页码时
                onChange: ((page, pageSize) => {
                    console.log(page,pageSize)
                    setPagination({
                        page:page,
                        limit:pageSize,
                        total:pagination.total
                    })
                    
                    getList()
                }),
                // pageSize 变化的回调
                onShowSizeChange: (page) => {
                    console.log(page)
                }
            }}
            />
        </PageContainer>
    )
}
export default connect(({ task }:any) => ({
    task
}))(TaskList);