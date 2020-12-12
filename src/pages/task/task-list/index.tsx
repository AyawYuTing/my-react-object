import React,{ useState,useRef, useEffect } from 'react'
import { PageContainer } from '@ant-design/pro-layout';
import { Dispatch, connect } from 'umi';
import { Table, Button,Form,Input,Select,DatePicker,message,Modal,Popconfirm,Tag,Drawer,Row,Col,Radio,Image   } from 'antd';
import { SearchOutlined,RedoOutlined,CheckOutlined,PauseOutlined,DeleteOutlined,ToTopOutlined,EditOutlined,StopOutlined,ExclamationCircleOutlined,PlusCircleOutlined,CloseCircleOutlined } from '@ant-design/icons';
import { TaskListItem } from './data.d'
import styles from './style.less';
const { Option } = Select;
const { RangePicker } = DatePicker;
const { confirm } = Modal;
interface TaskProps {
    dispatch: Dispatch;
}

const TaskList : React.FC<TaskProps> = (props) =>{
    const { dispatch } = props
    const [taskList,setTaskList] = useState([])
    const [page,setPage] = useState(1)
    const [total,setTotal] = useState(0)
    const [limit,setLimit] = useState(10)
    const [loading,setLoading] = useState(false)
    // const [pagination,setPagination] = useState<TaskListPagination>({ page:1,limit:10,total:0 })
    const [selectionType] = useState<any>('checkbox');
    const [selectedRowKeys,setSelectedRowKeys] = useState([])
    const [searchForm,setSearchForm] = useState({
        shopName:'',taskNumber:'',status:'RP',isTop:'',platformId:'0',taskTypeId:'0',taskResidue:'',userName:'',category:''
    })
    const [dateRange,setDateRange] = useState({beginDate:'',endDate:''})
    const [showTimeModel, setShowTimeModel] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [runTaskTime,setRunTaskTime] = useState('')
    const [pauseSelectedKey,setPauseSelectedKey] = useState('')
    const [runSelectedRowKey,setRunSelectedRowKey] = useState('')
    const [detailVisible,setDetailVisible] = useState(false)
    const [drawerTitle,setDrawerTitle] = useState('')
    const [detailForm,setDetailForm] = useState({
        id:'',isCard:'',taskTypeId:'',showPrice:'',taskNumber:'',prefPrice:'0',platformId:'',platformName:'0',realPrice:'',title:'',packages:'',link:'',
        formula:'',brokerage:'',keywords:'',number:0,taskTotal:'',serverPrice:'',time:'',receiptFlag:'',goodsKeywords:'',sellerAsk:'',taskKeyword:'',status:'',imgLink:''
    })
    const [editDisable,setEditDisable] = useState(false)
    const [keywordsList,setKeywordsList] = useState<any>([])
    
    const detailRef = useRef<any>()
    const keywordRef = useRef<any>()
    const [keywordForm] = Form.useForm();

    useEffect(() => {
        getList();
    },[page,limit,searchForm]);

    useEffect(() =>{
        if(pauseSelectedKey){
            confirm({
                title: '您确定要暂停该任务吗？',
                icon: <ExclamationCircleOutlined />,
                content: '',
                onOk() {
                    pauseTasks()
                },
                onCancel() {
                },
            });
        }
    },[pauseSelectedKey])
    useEffect(() =>{
        if(runSelectedRowKey){
            confirm({
                title: '您确定要运行该任务吗？',
                icon: <ExclamationCircleOutlined />,
                content: '',
                onOk() {
                    openRunTime()
                },
                onCancel() {
                },
            });
        }
        
    },[runSelectedRowKey])
    const getList = () => {
        // console.log(1)
        // if(searchForm.isTop=='0'){
        //     searchForm.isTop = false
        // }
        setLoading(true)
        dispatch({
            type: 'task/getList',   //task 为 model 中的namespace，getList为方法名
            payload: {
                page:page,
                limit:limit,
                ...searchForm
            },
            callback:(data:any)=>{
                setTaskList(data.list)
                setLoading(false)
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
                ids:selectedRowKeys.join(','),
                time:runTaskTime
            },
            callback:(res) =>{
                message.success('任务运行成功！');
                setConfirmLoading(false);
                setShowTimeModel(false)
                getList()
                setSelectedRowKeys([])
            }
        })
    }
    // 批量暂停
    const pauseTasks = () =>{

        dispatch({
            type:'task/pause',
            payload:{
                ids:selectedRowKeys.join(','),
            },
            callback:(res) =>{
                message.success('任务暂停成功！');
                getList()
                setSelectedRowKeys([])
            }
        })
    }
    const findKeywords = (id:any) =>{
        dispatch({
            type:'task/getKeywords',
            payload:{
                taskId:id
            },
            callback:(res:any) =>{
                let list:any = []
                res.forEach((val:any) => {
                    list.push({keyword:val.keyword,number:val.number,isCard:0})
                });
                setKeywordsList(list)
            }
        })
    }
    const columns:any = [
        {
            title: '序号',
            align:'center',
            width:'50',
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
            // dataIndex: 'showPrice',
            key: 'showPrice',
            align: 'center',
            render(text:any, record:any, index:any){
                return(
                <Tag color="orange">￥{record.showPrice}</Tag>
                )
            }
        },
        {
            title: '实付价',
            // dataIndex: 'realPrice',
            key: 'realPrice',
            align: 'center',
            render(text:any, record:any, index:any){
                return(
                <Tag color="volcano">￥{record.realPrice}</Tag>
                )
            }
        },
        {
            title: '优惠券',
            // dataIndex: 'prefPrice',
            key: 'prefPrice',
            align: 'center',
            render(text:any, record:any, index:any){
                return(
                <Tag color="magenta">￥{record.prefPrice}</Tag>
                )
            }
        },
        {
            title: '发布数',
            // dataIndex: 'taskTotal',
            key: 'taskTotal',
            align: 'center',
            render(text:any, record:any, index:any){
                return(
                <Tag color="#87d068">{record.taskTotal}</Tag>
                )
            }
        },
        {
            title: '剩余数',
            // dataIndex: 'tesidueNum',
            key: 'tesidueNum',
            align: 'center',
            render(text:any, record:any, index:any){
                return(
                <Tag color="#2db7f5">{record.tesidueNum}</Tag>
                )
            }
        },
        {
            title: '待操作',
            // dataIndex: 'stayOprNum',
            key: 'stayOprNum',
            align: 'center',
            render(text:any, record:any, index:any){
                return(
                <Tag color="#f50">{record.stayOprNum}</Tag>
                )
            }
        },
        
        {
            title: '待审核',
            // dataIndex: 'notAuditedNum',
            key: 'notAuditedNum',
            align: 'center',
            render(text:any, record:any, index:any){
                return(
                <Tag color="red">{record.notAuditedNum}</Tag>
                )
            }
        },
        {
            title: '完成数',
            dataIndex: 'yesAuditedNum',
            key: 'yesAuditedNum',
            align: 'center',
            render(text:any, record:any, index:any){
                return(
                <Tag color="#108ee9">{record.yesAuditedNum}</Tag>
                )
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render(text:any, record:any, index:any){
                if(record.status=='R'){
                    return( <Tag color="cyan">运行</Tag> )
                }else if(record.status=='P'){
                    return( <Tag color="red">暂停</Tag> )
                }else if(record.status=='C'){
                    return( <Tag color="green">草稿</Tag> )
                }else if(record.status=='N'){
                    return( <Tag color="red">终止</Tag> )
                }
                
            }
        },
        {
            title: '操作',
            // align: 'center',
            render(text:any, record:any, index:any){
                return(
                    <div className={styles.oprBtns}>
                        <Button type="primary" size='small' className={styles.oprBtns_item}  icon={<SearchOutlined />}  onClick={(value)=>{ openDetail(record,0) }}>详情</Button>
                        <Button type="primary" size='small' className={`${styles.oprBtns_item} ${styles.oprBtns_edit}`} icon={<EditOutlined />} onClick={(value)=>{ openDetail(record,1) }}>编辑</Button>
                        <Button size='small' className={record.status!='R'?styles.hide:`${styles.oprBtns_item} ${styles.oprBtns_stop}`} icon={<PauseOutlined />} onClick={(value)=>{ pauseOne(record) }}>暂停</Button>
                        <Button size='small' className={record.status=='P'||record.status=='N'?`${styles.oprBtns_item} ${styles.oprBtns_run}`:styles.hide}  icon={<CheckOutlined />}  onClick={(value)=>{ runOne(record) }}>运行</Button>
                        <Button type="primary" size='small' danger className={record.status=='N'?styles.hide:`${styles.oprBtns_item} ${styles.oprBtns_end}`}  icon={<StopOutlined />} onClick={(value)=>{ stopOne(record) }}>终止</Button>
                        <Button size='small' className={record.status!='R'?styles.hide:`${styles.oprBtns_item} ${styles.oprBtns_top}`}  icon={record.top?<RedoOutlined />:<ToTopOutlined />}  onClick={(value)=>{ setTop(record) }}>{record.top?'已置顶':'置顶'}</Button>
                        <Button type="primary" size='small' danger className={record.status!='N'?styles.hide:`${styles.oprBtns_item} ${styles.oprBtns_end}`} icon={<DeleteOutlined />}>删除</Button>
                    </div>
                    
                )
                
            }
        },
    ];
    const openDetail = (value:any,flag:any) =>{
        let ids:any =  [value.id]
        setSelectedRowKeys(ids)
        if(flag){
            setDrawerTitle('编辑任务')
            setEditDisable(false)
        }else{
            setDrawerTitle('任务详情')
            setEditDisable(true)
        }
        findKeywords(value.id)
        setDetailForm(value)
        setDetailVisible(true)
    }
    const onDrawerClose = async () =>{
        setDetailVisible(false)
    }
    const onDrawerComfirm = async () => {
        const formValue = await detailRef.current!.validateFields();
        let form = {
            id:detailForm.id,isCard:0,taskTypeId:detailForm.taskTypeId,
            platformId:detailForm.platformId,formula:'',keyword:keywordsList[0].keyword,number:keywordsList[0].number,
            taskKeyword:JSON.stringify(keywordsList),status:detailForm.status
        }
        form = Object.assign(formValue,form)
        dispatch({
            type:'task/edit',
            payload:{
                ...form
            },
            callback:() => {
                message.success('修改成功！')
                setDetailVisible(false)
                getList()
            }
        })
        // console.log('detailForm--',detailForm)
        // console.log('formValue--',formValue)
    }
    const onDetailFormChange = (value:any) =>{
        console.log('onDetailFormChange--',value)
        console.log('detailRef--',detailRef)
    }
    // 暂停一个任务
    const pauseOne = (value:any) =>{
        let ids:any =  [value.id]
        setSelectedRowKeys(ids)
        setPauseSelectedKey(value.id)
        
    }
    // 运行一个任务
    const runOne = (value:any) =>{
        let ids:any =  [value.id]
        setSelectedRowKeys(ids)
        setRunSelectedRowKey(value.id)
    }
    // 运行一个任务
    const stopOne = (value:any) =>{
        let ids:any =  [value.id]
        setSelectedRowKeys(ids)
        confirm({
            title: '您确定要终止该任务吗？',
            icon: <ExclamationCircleOutlined />,
            content: '',
            onOk() {
                dispatch({
                    type:'task/stop',
                    payload:{
                        taskId:value.id,
                        status:'N'
                    },
                    callback:(res) => {
                        message.success('任务已终止！')
                        getList()
                    }
                })
            },
            onCancel() {
              console.log('Cancel');
            },
        });
    }
    // 置顶任务/取消置顶
    const setTop = (value:any) =>{
        let title = value.top?'您确定要取消置顶该任务吗？':'您确定要置顶该任务吗？'
        let type = value.top?'task/cancelTop':'task/setTop'
        let msg = value.top?'任务取消置顶成功~':'任务置顶成功~'
        confirm({
            title: title,
            icon: <ExclamationCircleOutlined />,
            content: '',
            onOk() {
                dispatch({
                    type:type,
                    payload:{
                        taskId:value.id
                    },
                    callback:(res) => {
                        message.success(msg)
                        getList()
                    }
                })
            },
            onCancel() {
              console.log('Cancel');
            },
        });
    }
    const onIsTopChange = (value:any) =>{
        console.log('onIsTopChange---',value)
    }
    // 搜索
    const onFinish = (value:any) => {
        console.log('value--',value)
        let form = Object.assign(value,dateRange)
        setPage(1)
        setSearchForm(form)
    }
    // 搜索失败
    const onFinishFailed = () => {
        message.error('查询失败，请稍后重试~');
    }
    // 选择发布时间
    const openRunTime = () => {
        setShowTimeModel(true)
    }
    // 发布时间
    const onTaskTimeChange = (date:any, dateString:any) =>{
        console.log('dateString--',dateString)
        setRunTaskTime(dateString)
    }
    // 确认发布时间发布任务
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
    // 重置搜索框
    const resetForm = () => {
        setSearchForm({
            shopName:'',taskNumber:'',status:'RP',isTop:'',platformId:'0',taskTypeId:'0',taskResidue:'',userName:'',category:''
        })
        setDateRange({beginDate:'',endDate:''})
    }
    // 发布时间筛选
    const announceTimeChange:any = (date: any, dateString: string) => {
        console.log('date--',date,'dateString--',dateString)
        let dateForm = {beginDate:dateString[0],endDate:dateString[1]}
        setDateRange(dateForm)
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: (keys:any, selectedRows:any) => {
            console.log(`selectedRowKeys: ${keys}`, 'selectedRows: ', selectedRows);
            setSelectedRowKeys(keys)
            console.log('selectedRowKeys--',keys)
        }
    };
    const keywordList = keywordsList.map((item:any,index:any) => 
        <div className={styles.keywordsForm} key={item.id}>
            <div className={styles.keywordsForm_item}>
                <div className={styles.keywordsForm_item_keyword}>
                    <Input
                        style={{ width: '100%' }}
                        placeholder="请输入搜索词"
                        value={item.keyword}
                        disabled={editDisable}
                    />
                </div>
                <div className={styles.keywordsForm_item_number}>
                    <Input
                        style={{ width: '100%' }}
                        placeholder="请输入数量"
                        value={item.number}
                        disabled={editDisable}
                    />
                </div>
                {   
                    !editDisable?
                    <div className={styles.keywordsForm_item_btn} onClick={() => deleteKeywordItem(index)}>
                        <CloseCircleOutlined  className={`${styles.keywordsForm_item_btn_icon} ${styles.del}`} />
                    </div>
                    :<></>
                }
                
            </div>
        </div>
    )
    const deleteKeywordItem = (index:any) => {
        setKeywordsList(keywordsList.filter((val:any,idx:any)=>idx!==index))
    }
    const addKeywordItem = async () =>{
        // if(!keywordVal){
        //     message.warn('请输入关键词！')
        //     return false
        // }else if(!keywordNum){
        //     message.warn('请输入数量！')
        //     return false
        // }
        const formValue = await keywordRef.current!.validateFields();
        let list = JSON.parse(JSON.stringify(keywordsList))
        list.push({keyword:formValue.keyword,number:formValue.number,isCard:0})
        console.log('list--',list)
        keywordForm.resetFields()
        setKeywordsList(list)
    }
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
                                onChange={onIsTopChange}
                                allowClear
                            >
                                <Option value="">全部</Option>
                                <Option value='1'>已置顶</Option>
                                <Option value="0">未置顶</Option>
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
                <div className={styles.form}>
                    
                    <div className={styles.formItem}>
                        <Form.Item label="发布时间">
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
                    {selectedRowKeys&&selectedRowKeys.length>0?
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
                    {
                        !editDisable?
                        <div className={styles.formButtonRight}>
                            <div className={styles.btnItemRight}>
                                <Button type="primary" icon={<SearchOutlined />} htmlType="submit">搜索</Button>
                            </div>
                            <div className={styles.btnItemRight}>
                                <Button  style={{backgroundColor:'#00acc1',color:'#ffffff',border:'none'}} icon={<RedoOutlined />} onClick={resetForm}>重置</Button>
                            </div>
                        </div>
                        :<></>
                    }
                    
                    
                </div>
            </Form>
            <Table<TaskListItem> 
                bordered
                columns={columns} 
                dataSource={taskList}
                loading={loading}
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
                    onChange: ((page:any, pageSize:any) => {
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
            <Drawer
            title={drawerTitle}
            width={720}
            onClose={onDrawerClose}
            visible={detailVisible}
            bodyStyle={{ paddingBottom: 80 }}
            
            footer={
                !editDisable?
                <div
                style={{
                    textAlign: 'right',
                }}
                >
                <Button onClick={onDrawerClose} style={{ marginRight: 8 }}>
                    Cancel
                </Button>
                <Button onClick={onDrawerComfirm} type="primary">
                    确定
                </Button>
                </div>:
                <></>
                
                
            }
            >
                <Form 
                    layout="vertical" 
                    hideRequiredMark
                    onFinish={onDetailFormChange}
                    ref={ detailRef }
                    initialValues={ detailForm }
                >
                    <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                        name="taskTypeName"
                        label="任务类型"
                        // rules={[{ required: true, message: '请输入任务类型' }]}
                        >
                        <Select placeholder="请输入任务类型" disabled={editDisable}>
                            <Option value="0">全部</Option>
                            <Option value="1">现付单</Option>
                            <Option value="2">隔日单</Option>
                            <Option value="3">浏览单</Option>
                        </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                        name="showPrice"
                        label="搜索价格"
                        // rules={[{ required: true, message: 'Please enter url' }]}
                        >
                        <Input
                            style={{ width: '100%' }}
                            addonBefore="￥"
                            placeholder="请输入搜索价格"
                            disabled={editDisable}
                        />
                        </Form.Item>
                    </Col>
                    </Row>
                    <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                        name="taskNumber"
                        label="任务单号"
                        // rules={[{ required: true, message: 'Please select an owner' }]}
                        >
                            <Input
                            style={{ width: '100%' }}
                            placeholder="请输入任务单号"
                            disabled={editDisable}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                        name="prefPrice"
                        label="优惠价格"
                        >
                        <Input
                            style={{ width: '100%' }}
                            addonBefore="￥"
                            placeholder="请输入优惠价格"
                            disabled={editDisable}
                        />
                        </Form.Item>
                    </Col>
                    </Row>
                    <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                        name="platformName"
                        label="所属平台"
                        >
                        <Input
                            style={{ width: '100%' }}
                            disabled
                            value="淘宝"
                        />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                        name="realPrice"
                        label="实付价格"
                        // rules={[{ required: true, message: 'Please choose the dateTime' }]}
                        >
                        <Input
                            style={{ width: '100%' }}
                            disabled
                            addonBefore="￥"
                            placeholder="请输入搜索价格"
                        />
                        </Form.Item>
                    </Col>
                    
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                            name="title"
                            label="商品标题"
                            // rules={[{ required: true, message: 'Please choose the dateTime' }]}
                            >
                            <Input
                                style={{ width: '100%' }}
                                disabled
                                value="商品标题"
                            />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                            name="packages"
                            label="购买套餐"
                            // rules={[{ required: true, message: 'Please choose the dateTime' }]}
                            >
                            <Input
                                style={{ width: '100%' }}
                                placeholder="请输入购买套餐"
                                disabled={editDisable}
                            />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                            name="link"
                            label="商品链接"
                            // rules={[{ required: true, message: 'Please choose the dateTime' }]}
                            >
                            <Input
                                style={{ width: '100%' }}
                                disabled
                                value="商品链接"
                            />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                            name="brokerage"
                            label="任务佣金"
                            // rules={[{ required: true, message: 'Please choose the dateTime' }]}
                            >
                            <Input
                                style={{ width: '100%' }}
                                placeholder="请输入任务佣金"
                                addonBefore="￥"
                                disabled={editDisable}
                            />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                            name="taskTotal"
                            label="任务总数"
                            // rules={[{ required: true, message: 'Please choose the dateTime' }]}
                            >
                            <Input
                                style={{ width: '100%' }}
                                disabled
                                value="0"
                            />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                            name="serverPrice"
                            label="服务费"
                            // rules={[{ required: true, message: 'Please choose the dateTime' }]}
                            >
                            <Input
                                style={{ width: '100%' }}
                                placeholder="请输入服务费"
                                addonBefore="￥"
                                disabled={editDisable}
                            />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                            name="time"
                            label="发布时间"
                            // rules={[{ required: true, message: 'Please choose the dateTime' }]}
                            >
                            <DatePicker disabled={editDisable} style={{ width: '100%' }} onChange={onTaskTimeChange} showTime />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                            name="receiptFlag"
                            label="收货状态"
                            // rules={[{ required: true, message: 'Please choose the dateTime' }]}
                            >
                            <Radio.Group  disabled={editDisable}>
                                <Radio value={0}>确认收货</Radio>
                                <Radio value={1}>无需收货</Radio>
                            </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                            name="link"
                            label="商品主图"
                            >
                            <Image
                                width={150}
                                src={detailForm.imgLink}
                            />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            {/* <Form.Item
                            name="keywords"
                            label="搜索词"
                            >
                                
                            </Form.Item> */}
                            <Form
                                layout="vertical" 
                                hideRequiredMark
                                ref={ keywordRef }
                                form={ keywordForm }
                            >
                                <div className={styles.keywordsForm_name}>搜索词</div>
                                { keywordList }
                                { !editDisable?
                                <div className={styles.keywordsForm}>
                                    <div className={styles.keywordsForm_item}>
                                        <div className={styles.keywordsForm_item_keyword}>
                                            <Form.Item
                                            name="keyword"
                                            >
                                                <Input
                                                    style={{ width: '100%' }}
                                                    placeholder="请输入搜索词"
                                                    disabled={editDisable} 
                                                />
                                            </Form.Item>
                                            
                                        </div>
                                        <div className={styles.keywordsForm_item_number}>
                                            <Form.Item
                                            name="number"
                                            >
                                                <Input
                                                    style={{ width: '100%' }}
                                                    placeholder="请输入数量"
                                                    disabled={editDisable}
                                                    type='number'
                                                />
                                            </Form.Item>
                                            
                                        </div>
                                        <div className={styles.keywordsForm_item_btn} onClick={addKeywordItem}>
                                            <PlusCircleOutlined  className={`${styles.keywordsForm_item_btn_icon} ${styles.add}`}/>
                                        </div>
                                    </div>
                                </div>
                                :<></>
                                }
                            </Form>
                            
                            
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                            name="goodsKeywords"
                            label="查文内容"
                            >
                            <Input.TextArea rows={2} placeholder="请输入查文内容" disabled={editDisable} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                            name="sellerAsk"
                            label="商家要求"
                            >
                            <Input.TextArea rows={4} placeholder="请输入商家要求" disabled={editDisable} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </PageContainer>
    )
}
export default connect(({ task }:any) => ({
    task
}))(TaskList);