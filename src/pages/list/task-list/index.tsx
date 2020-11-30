import React,{ useState,useRef, useEffect } from 'react'
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { Dispatch, Link, connect } from 'umi';
import { Table, Button } from 'antd';

interface TaskProps {
    dispatch: Dispatch;
}

const TaskList : React.FC<TaskProps> = (props) =>{
    const { dispatch } = props
    const [data,setData] = useState({})
    
    const getList = () => {
        console.log(1)
        dispatch({
            type: 'task/getlist',
            payload: {
                page:1,
                limit:10,
                status:''
            },
            callback:(data)=>{
                console.log('data--',data)
                setData(data)
            }
        })
    }
    
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: '定时发布',
            dataIndex: 'createTime',
        },
        {
            title: '店铺名称',
            dataIndex: 'shopName',
        },
        {
            title: '显示价',
            dataIndex: 'showPrice',
        },
        {
            title: '实付价',
            dataIndex: 'realPrice',
        },
        {
            title: '优惠券',
            dataIndex: 'prefPrice',
        },
        {
            title: '发布数',
            dataIndex: 'taskTotal',
        },
        {
            title: '剩余数',
            dataIndex: 'tesidueNum',
        },
        {
            title: '待操作',
            dataIndex: 'stayOprNum',
        },
        
        {
            title: '待审核',
            dataIndex: 'notAuditedNum',
        },
        {
            title: '完成数',
            dataIndex: 'yesAuditedNum',
        },
        {
            title: '状态',
            dataIndex: 'status',
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
            <Table  columns={columns} />
        </PageContainer>
    )
}
export default connect(({ task }:any) => ({
    task
}))(TaskList);