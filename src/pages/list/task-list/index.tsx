import React,{ useState,useRef, useEffect } from 'react'
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { Dispatch, Link, connect } from 'umi';
import { Table, Button,Form,Input,Select ,Row, Col,DatePicker  } from 'antd';
import { SearchOutlined,RedoOutlined,CheckOutlined,PauseOutlined,DeleteOutlined } from '@ant-design/icons';
import { TaskListItem,TaskListPagination } from './data.d'
import styles from './style.less';
import { BackgroundColor } from 'chalk';
const { Option } = Select;
const { RangePicker } = DatePicker;
interface TaskProps {
    dispatch: Dispatch;
}

const TaskList : React.FC<TaskProps> = (props) =>{
    const { dispatch } = props
    const [taskList,setTaskList] = useState([])
    const [page,setPage] = useState(1)
    const [total,setTotal] = useState(0)
    const [limit,setLimit] = useState(10)
    // const [pagination,setPagination] = useState<TaskListPagination>({ page:1,limit:10,total:0 })
    const [selectionType,setSelectionType] = useState('checkbox');
    const [selectedRowKeys,setSelectedRowKeys] = useState('')
    useEffect(() => {
        getList();
    },[page,limit]);
    const getList = () => {
        // console.log(1)
        dispatch({
            type: 'task/getList',   //task 为 model 中的namespace，getList为方法名
            payload: {
                page:page,
                limit:limit,
                status:'RP'
            },
            callback:(data)=>{
                setTaskList(data.list)
                
                if(total===0){
                    setTotal(data.total)
                }
                
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
                    <span>{(page-1)*10+index+1}</span>
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

    const onFinish = () => {

    }
    const onFinishFailed = () => {
        
    }
    const onTaskStatusChange = () => {
        
    }
    const onTopStatusChange = () => {
        
    }
    const rangeConfig = {
        rules: [{ type: 'array', required: false, message: 'Please select time!' }],
      };
    const rowSelection = {
        onChange: (selectedRowKeys:any, selectedRows:any) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedRowKeys(selectedRowKeys)
        }
    };
   
    return(
        <PageContainer>
            <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <div className={styles.form}>
                    <div className={styles.formItem}>
                        <Form.Item
                            label="店铺名称"
                            name="shopName"
                            rules={[{ required: false, message: '请输入店铺名称' }]}
                        >
                            <Input placeholder='请输入店铺名称'/>
                        </Form.Item>
                    </div>
                    <div className={styles.formItem}>
                        <Form.Item
                            label="任务单号"
                            name="shopName"
                            rules={[{ required: false, message: '请输入任务单号' }]}
                        >
                            <Input placeholder='请输入任务单号'/>
                        </Form.Item>
                    </div>
                    <div className={styles.formItem}>
                        <Form.Item
                            label="任务状态"
                            name="shopName"
                            rules={[{ required: false, message: '请选择任务状态' }]}
                        >
                            <Select
                                placeholder="请选择任务状态"
                                onChange={onTaskStatusChange}
                                allowClear
                            >
                                <Option value="male">运行&暂停</Option>
                                <Option value="male">运行</Option>
                                <Option value="female">暂停</Option>
                                <Option value="other">草稿</Option>
                                <Option value="other">终止</Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className={styles.formItem}>
                        <Form.Item
                            label="置顶状态"
                            name="shopName"
                            rules={[{ required: false, message: '请选择置顶状态' }]}
                        >
                            <Select
                                placeholder="请选择置顶状态"
                                onChange={onTopStatusChange}
                                allowClear
                            >
                                <Option value="male">已置顶</Option>
                                <Option value="male">未置顶</Option>
                            </Select>
                        </Form.Item>
                    </div>
                </div>
                <div className={styles.form}>
                    <div className={styles.formItem}>
                        <Form.Item
                            label="平台类型"
                            name="shopName"
                            rules={[{ required: false, message: '请选择平台类型' }]}
                        >
                            <Select
                                placeholder="请选择平台类型"
                                onChange={onTaskStatusChange}
                                allowClear
                            >
                                <Option value="male">全部</Option>
                                <Option value="male">淘宝</Option>
                                <Option value="female">京东</Option>
                                <Option value="other">阿里巴巴</Option>
                                <Option value="other">拼多多</Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className={styles.formItem}>
                        <Form.Item
                            label="任务类型"
                            name="shopName"
                            rules={[{ required: false, message: '请选择任务类型' }]}
                        >
                            <Select
                                placeholder="请选择任务类型"
                                onChange={onTopStatusChange}
                                allowClear
                            >
                                <Option value="male">全部</Option>
                                <Option value="male">现付单</Option>
                                <Option value="male">隔日单</Option>
                                <Option value="male">浏览单</Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className={styles.formItem}>
                        <Form.Item
                            label="剩余数量"
                            name="shopName"
                            rules={[{ required: false, message: '请输入剩余数' }]}
                        >
                            <Input placeholder='请输入剩余数'/>
                        </Form.Item>
                    </div>
                    <div className={styles.formItem}>
                        <Form.Item
                            label="商家名称"
                            name="shopName"
                            rules={[{ required: false, message: '请输入商家名称' }]}
                        >
                            <Input placeholder='请输入商家名称'/>
                        </Form.Item>
                    </div>
                    
                </div>
                <div  className={styles.form}>
                    
                    <div className={styles.formItem}>
                        <Form.Item name="range-time-picker" label="发布时间" {...rangeConfig}>
                            <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                        </Form.Item>
                    </div>
                    <div className={styles.formItem}>
                        <Form.Item
                            label="商品类目"
                            name="shopName"
                            rules={[{ required: false, message: '请输入商品类目' }]}
                        >
                            <Input placeholder='请输入商品类目'/>
                        </Form.Item>
                    </div>
                </div>
                <div className={styles.form}>
                    {/* <div className={ selectedRowKeys?'':styles.hide}>
                        <div className={styles.formButtonLeft}>
                            <div className={styles.btnItemLeft}>
                                <Button  style={{backgroundColor:'#00897b',color:'#ffffff',border:'none'}} icon={<CheckOutlined />}>批量发布</Button>
                            </div>
                            <div className={styles.btnItemLeft}>
                                <Button  style={{backgroundColor:'#ff8f00',color:'#ffffff',border:'none'}}  icon={<PauseOutlined />}>批量暂停</Button>
                            </div>
                            <div className={styles.btnItemLeft}>
                                <Button danger type="primary" icon={<DeleteOutlined />}>删除所选</Button>
                            </div>
                        </div>
                    </div> */}
                    {selectedRowKeys.length>0?
                        <div className={styles.formButtonLeft}>
                            <div className={styles.btnItemLeft}>
                                <Button  style={{backgroundColor:'#00897b',color:'#ffffff',border:'none'}} icon={<CheckOutlined />}>批量发布</Button>
                            </div>
                            <div className={styles.btnItemLeft}>
                                <Button  style={{backgroundColor:'#ff8f00',color:'#ffffff',border:'none'}}  icon={<PauseOutlined />}>批量暂停</Button>
                            </div>
                            <div className={styles.btnItemLeft}>
                                <Button danger type="primary" icon={<DeleteOutlined />}>删除所选</Button>
                            </div>
                        </div>
                        :<div className={styles.formButtonLeft}></div>
                    }
                    
                    <div className={styles.formButtonRight}>
                        <div className={styles.btnItemRight}>
                            <Button type="primary" icon={<SearchOutlined />}>搜索</Button>
                        </div>
                        <div className={styles.btnItemRight}>
                            <Button  style={{backgroundColor:'#00acc1',color:'#ffffff',border:'none'}} icon={<RedoOutlined />}>重置</Button>
                        </div>
                    </div>
                    
                </div>
            </Form>
            <Table<TaskListItem> 
                columns={columns} 
                dataSource={taskList}
                rowKey='id'
                rowSelection={{
                    type: selectionType,
                    ...rowSelection,
                }}
                pagination={{
                    total:total,
                    pageSizeOptions: ["10", "20", "50"],
                    showTotal: total => `共 ${total} 条`,
                    showSizeChanger: true,
                    // 改变页码时
                    onChange: ((page, pageSize) => {
                        console.log(page,pageSize)
                        setPage(page)
                        setLimit(pageSize)
                    }),
                    // pageSize 变化的回调
                    onShowSizeChange: (page) => {
                        setPage(1)
                        setTaskList([])
                    }
                }}
            />
        </PageContainer>
    )
}
export default connect(({ task }:any) => ({
    task
}))(TaskList);