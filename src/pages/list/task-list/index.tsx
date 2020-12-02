import React,{ useState,useRef, useEffect } from 'react'
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { Dispatch, Link, connect } from 'umi';
import { Table, Button,Form,Input,Select,DatePicker,message,Modal,Popconfirm  } from 'antd';
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
    const [selectionType] = useState('checkbox');
    const [selectedRowKeys,setSelectedRowKeys] = useState('')
    const [searchForm,setSearchForm] = useState({
        shopName:'',taskNumber:'',status:'RP',isTop:'',platformId:'0',taskTypeId:'0',taskResidue:'',userName:'',category:''
    })
    const [dateRange,setDateRange] = useState({beginDate:'',endDate:''})
    const [showTimeModel, setShowTimeModel] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [runTaskTime,setRunTaskTime] = useState('')
    useEffect(() => {
        getList();
    },[page,limit,searchForm]);
    const getList = () => {
        // console.log(1)
        dispatch({
            type: 'task/getList',   //task 为 model 中的namespace，getList为方法名
            payload: {
                page:page,
                limit:limit,
                ...searchForm
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
    // 批量发布
    const runTasks = () =>{
        dispatch({
            type:'task/run',
            payload:{
                ids:selectedRowKeys,
                time:''
            },
            callback:(res) =>{
                message.success('任务运行成功！');
                setConfirmLoading(false);
                setShowTimeModel(false)
            }
        })
    }
    // 批量暂停
    const pauseTasks = () =>{

        dispatch({
            type:'task/pause',
            payload:{
                ids:selectedRowKeys,
            },
            callback:(res) =>{
                message.success('任务暂停成功！');
                getList()
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

    const onFinish = (value:any) => {
        console.log('value--',value)
        let form = Object.assign(value,dateRange)
        setPage(1)
        setSearchForm(form)
        // setTimeout(() => {
        //     getList()
        // }, 500);
        
    }
    const onFinishFailed = () => {
        
    }
    const onTaskStatusChange = () => {
        
    }
    const onTopStatusChange = () => {
        
    }
    const onPlatformChange = () => {

    }
    const onTasktypeChange = () => {

    }
    const openRunTime = () => {
        setShowTimeModel(true)
    }
    const onTaskTimeChange = (date:any, dateString:any) =>{
        console.log('dateString--',dateString)
    }
    const handleTimeModelComfirm = () =>{
        // setShowTimeModel(false)
        if(!runTaskTime){
            message.error('请选择发布时间！')
        }else{
            setConfirmLoading(true);
            runTasks();
        }

    }
    const handleTimeModelCancel = () =>{
        setShowTimeModel(false)
    }
    const resetForm = () => {
        setSearchForm({
            shopName:'',taskNumber:'',status:'RP',isTop:'',platformId:'0',taskTypeId:'0',taskResidue:'',userName:'',category:''
        })
        setDateRange({beginDate:'',endDate:''})
    }
    const announceTimeChange = (date: any, dateString: string) => {
        console.log('date--',date,'dateString--',dateString)
        let dateForm = {beginDate:dateString[0],endDate:dateString[1]}
        setDateRange(dateForm)
    }
    const rangeConfig = {
        rules: [{ type: 'array', required: false, message: 'Please select time!' }],
      };
    const rowSelection = {
        onChange: (selectedRowKeys:any, selectedRows:any) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedRowKeys(selectedRowKeys.join(','))
        }
    };
   
    return(
        <PageContainer>
            <Form
                name="basic"
                initialValues={ searchForm }
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
                            name="taskNumber"
                            rules={[{ required: false, message: '请输入任务单号' }]}
                        >
                            <Input placeholder='请输入任务单号'/>
                        </Form.Item>
                    </div>
                    <div className={styles.formItem}>
                        <Form.Item
                            label="任务状态"
                            name="status"
                            rules={[{ required: false, message: '请选择任务状态' }]}
                        >
                            <Select
                                placeholder="请选择任务状态"
                                onChange={onTaskStatusChange}
                                allowClear
                            >
                                <Option value="RP">运行&暂停</Option>
                                <Option value="R">运行</Option>
                                <Option value="P">暂停</Option>
                                <Option value="C">草稿</Option>
                                <Option value="N">终止</Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className={styles.formItem}>
                        <Form.Item
                            label="置顶状态"
                            name="isTop"
                            rules={[{ required: false, message: '请选择置顶状态' }]}
                        >
                            <Select
                                placeholder="请选择置顶状态"
                                onChange={onTopStatusChange}
                                allowClear
                            >
                                <Option value="">全部</Option>
                                <Option value="true">已置顶</Option>
                                <Option value="false">未置顶</Option>
                            </Select>
                        </Form.Item>
                    </div>
                </div>
                <div className={styles.form}>
                    <div className={styles.formItem}>
                        <Form.Item
                            label="平台类型"
                            name="platformId"
                            rules={[{ required: false, message: '请选择平台类型' }]}
                        >
                            <Select
                                placeholder="请选择平台类型"
                                onChange={onPlatformChange}
                                allowClear
                            >
                                <Option value="0">全部</Option>
                                <Option value="2">淘宝</Option>
                                <Option value="1">京东</Option>
                                <Option value="3">阿里巴巴</Option>
                                <Option value="4">拼多多</Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className={styles.formItem}>
                        <Form.Item
                            label="任务类型"
                            name="taskTypeId"
                            rules={[{ required: false, message: '请选择任务类型' }]}
                        >
                            <Select
                                placeholder="请选择任务类型"
                                onChange={onTasktypeChange}
                                allowClear
                            >
                                <Option value="0">全部</Option>
                                <Option value="1">现付单</Option>
                                <Option value="2">隔日单</Option>
                                <Option value="3">浏览单</Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className={styles.formItem}>
                        <Form.Item
                            label="剩余数量"
                            name="taskResidue"
                            rules={[{ required: false, message: '请输入剩余数' }]}
                        >
                            <Input placeholder='请输入剩余数'/>
                        </Form.Item>
                    </div>
                    <div className={styles.formItem}>
                        <Form.Item
                            label="商家名称"
                            name="userName"
                            rules={[{ required: false, message: '请输入商家名称' }]}
                        >
                            <Input placeholder='请输入商家名称'/>
                        </Form.Item>
                    </div>
                    
                </div>
                <div  className={styles.form}>
                    
                    <div className={styles.formItem}>
                        <Form.Item label="发布时间" {...rangeConfig}>
                            <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange={announceTimeChange}/>
                        </Form.Item>
                    </div>
                    <div className={styles.formItem}>
                        <Form.Item
                            label="商品类目"
                            name="category"
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
                    {selectedRowKeys?
                        <div className={styles.formButtonLeft}>
                            <div className={styles.btnItemLeft}>
                                <Button  style={{backgroundColor:'#00897b',color:'#ffffff',border:'none'}} icon={<CheckOutlined />}  onClick={openRunTime}>批量发布</Button>
                            </div>
                            <div className={styles.btnItemLeft}>
                            <Popconfirm
                                title="你确定要批量暂停所选任务吗？"
                                onConfirm={pauseTasks}
                                onCancel={()=>{}}
                                okText="确定"
                                cancelText="取消"
                            >
                                <Button  style={{backgroundColor:'#ff8f00',color:'#ffffff',border:'none'}}  icon={<PauseOutlined />}>批量暂停</Button>
                            </Popconfirm>
                                
                            </div>
                            <div className={styles.btnItemLeft}>
                                <Button danger type="primary" icon={<DeleteOutlined />}>删除所选</Button>
                            </div>
                        </div>
                        :<div className={styles.formButtonLeft}></div>
                    }
                    
                    <div className={styles.formButtonRight}>
                        <div className={styles.btnItemRight}>
                            <Button type="primary" icon={<SearchOutlined />} htmlType="submit">搜索</Button>
                        </div>
                        <div className={styles.btnItemRight}>
                            <Button  style={{backgroundColor:'#00acc1',color:'#ffffff',border:'none'}} icon={<RedoOutlined />} onClick={resetForm}>重置</Button>
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
                    current:page,
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

            <Modal
                title="任务批量发布"
                visible={ showTimeModel }
                onOk={handleTimeModelComfirm}
                confirmLoading={confirmLoading}
                onCancel={handleTimeModelCancel}
            >
                <div className={styles.modal}>
                    <div className={styles.modal_name}>发布时间：</div>
                    <DatePicker onChange={onTaskTimeChange} showTime />
                </div>
            </Modal>
            
        </PageContainer>
    )
}
export default connect(({ task }:any) => ({
    task
}))(TaskList);