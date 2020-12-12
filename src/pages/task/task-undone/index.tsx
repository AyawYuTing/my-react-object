import React,{ useState,useRef, useEffect } from 'react'
import { Dispatch, connect } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Button,Form,Input,Select,DatePicker,message,Modal,Popconfirm,Tag,Drawer,Row,Col,Radio,Image   } from 'antd';
import { SearchOutlined,RedoOutlined,DeleteOutlined,EditOutlined,PlusCircleOutlined,CloseCircleOutlined } from '@ant-design/icons';
import styles from './style.less';
import { TaskUndoneItem } from './data.d'
const { Option } = Select;
const { RangePicker } = DatePicker;
// const { confirm } = Modal;
interface TaskUndoneProps {
    dispatch: Dispatch;
}


const TaskUndone :React.FC<TaskUndoneProps> = (props) => {
    const { dispatch } = props;
    const [taskUndoneList,setTaskUndoneList] = useState([])
    const [page,setPage] = useState(1)
    const [total,setTotal] = useState(0)
    const [limit,setLimit] = useState(10)
    const [loading,setLoading] = useState(false)
    const [searchFormDetail,setSearchFormDetail] = useState({
        shopName:'',taskNumber:'',status:'',platformId:'0',taskTypeId:'0',category:''
    })
    const [dateRange,setDateRange] = useState({beginDate:'',endDate:''})
    const [selectionType] = useState<any>('checkbox');
    const [selectedRowKeys,setSelectedRowKeys] = useState([])
    const [delId,setDelId] = useState('')
    const [editDisable,setEditDisable] = useState(false)
    const [drawerTitle,setDrawerTitle] = useState('')
    const [detailForm,setDetailForm] = useState({
        id:'',isCard:'',taskTypeId:'',showPrice:'',taskNumber:'',prefPrice:'0',platformId:'',platformName:'0',realPrice:'',title:'',packages:'',link:'',
        formula:'',brokerage:'',keywords:'',number:0,taskTotal:'',serverPrice:'',time:'',receiptFlag:'',goodsKeywords:'',sellerAsk:'',taskKeyword:'',status:'',imgLink:''
    })
    const [detailVisible,setDetailVisible] = useState(false)
    const [keywordsList,setKeywordsList] = useState<any>([])
    const [runTaskTime,setRunTaskTime] = useState('')
    const [searchForm] = Form.useForm();
    const [keywordForm] = Form.useForm();
    const detailRef = useRef<any>()
    const keywordRef = useRef<any>()
    useEffect(() => {
        getList();
    },[page,limit,searchFormDetail]);
    useEffect(() =>{
        delSelected()
    },[delId])
    const getList = () =>{
        setLoading(true)
        dispatch({
            type:'taskUndone/getList',
            payload:{
                page:page,
                limit:limit,
                ...searchFormDetail
            },
            callback:(res:any) =>{
                setLoading(false)
                setTaskUndoneList(res.list)
                if(total===0){
                    setTotal(res.total)
                }
            }
        })
    }
    const editDetail = () => {
        // dispatch
    }
    const onFinish = (value:any) =>{
        let form = Object.assign(value,dateRange);
        setSearchFormDetail(form);
    }
    const createTimeChange:any = (date: any, dateString: string) => {
        console.log('date--',date,'dateString--',dateString)
        let dateForm = {beginDate:dateString[0],endDate:dateString[1]}
        setDateRange(dateForm)
    }
    const resetForm = () => {
        searchForm.resetFields()
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: (keys:any, selectedRows:any) => {
            setSelectedRowKeys(keys)
        }
    };
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
    const findKeywords = (id:any) =>{
        dispatch({
            type:'taskUndone/getKeywords',
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
            type:'taskUndone/edit',
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
    const delSelected = () => {
        dispatch({
            type:'taskUndone/delItems',
            payload:{
                ids:selectedRowKeys.join(',')
            },
            callback:(res:any) => {
                message.success('删除成功！')
                setSelectedRowKeys([])
                setDelId('')
                getList()
            }
        })
    }
    const delOne = (value:any) =>{
        let ids:any =  [value.id]
        setSelectedRowKeys(ids)
        setDelId(value.id)
    }
    // 发布时间
    const onTaskTimeChange = (date:any, dateString:any) =>{
        console.log('dateString--',dateString)
        setRunTaskTime(dateString)
    }
    const deleteKeywordItem = (index:any) => {
        setKeywordsList(keywordsList.filter((val:any,idx:any)=>idx!==index))
    }
    const addKeywordItem = async () =>{
        const formValue = await keywordRef.current!.validateFields();
        let list = JSON.parse(JSON.stringify(keywordsList))
        list.push({keyword:formValue.keyword,number:formValue.number,isCard:0})
        console.log('list--',list)
        keywordForm.resetFields()
        setKeywordsList(list)
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
            title: '任务类型',
            // dataIndex: 'taskTypeId',
            key: 'taskTypeId',
            align: 'center',
            render(text:any, record:any, index:any){
                if(record.taskTypeId=='9'){
                    return(
                        <Tag color="purple">现付单</Tag>
                    )
                }else if(record.taskTypeId=='10'){
                    return(
                        <Tag color="purple">隔日单</Tag>
                    )
                }else if(record.taskTypeId=='11'){
                    return(
                        <Tag color="purple">浏览单</Tag>
                    )
                }
                
            }
        },
        {
            title: '店铺名称',
            dataIndex: 'shopName',
            key: 'shopName',
            align: 'center',
        },
        {
            title: '商家名称',
            dataIndex: 'createTime',
            key: 'createTime',
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
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
            align: 'center',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render(text:any, record:any, index:any){
                if(record.status=='NC'){
                    return( <Tag color="cyan">未完成</Tag> )
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
                        <Popconfirm
                            title="你确定要删除该任务吗？"
                            onConfirm={()=>{delOne(record)}}
                            onCancel={()=>{}}
                            okText="确定"
                            cancelText="取消"
                        >
                            <Button type="primary" size='small' danger className={styles.oprBtns_end} icon={<DeleteOutlined />}>删除</Button>
                        </Popconfirm>
                        
                    </div>
                    
                )
                
            }
        },
    ]
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

    return(
        <PageContainer>
            <Form
                name="basic"
                initialValues={ searchFormDetail }
                onFinish={onFinish}
                form={ searchForm }
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
                                <Option value="">全部</Option>
                                <Option value="NC">未完成</Option>
                                <Option value="N">终止</Option>
                            </Select>
                        </Form.Item>
                    </div>
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
                </div>
                <div className={styles.form}>
                    <div className={styles.formItem}>
                        <Form.Item label="创建时间">
                            <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange={createTimeChange}/>
                        </Form.Item>
                    </div>
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
                            label="商品类目"
                            name="category"
                            rules={[{ required: false, message: '请输入商品类目' }]}
                        >
                            <Input placeholder='请输入商品类目'/>
                        </Form.Item>
                    </div>
                </div>
                <div className={styles.form}>
                    {selectedRowKeys&&selectedRowKeys.length>0?
                        <div className={styles.formButtonLeft}>
                            <div className={styles.btnItemLeft}>
                                <Popconfirm
                                    title="你确定要批量删除所选任务吗？"
                                    onConfirm={delSelected}
                                    onCancel={()=>{}}
                                    okText="确定"
                                    cancelText="取消"
                                >
                                    <Button danger type="primary" icon={<DeleteOutlined />}>删除所选</Button>
                                </Popconfirm>
                                
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
            <Table<TaskUndoneItem> 
                bordered
                columns={columns} 
                dataSource={taskUndoneList}
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
                        setTaskUndoneList([])
                    }
                }}
            ></Table>

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

export default connect(({ taskUndone } :any) =>({
    taskUndone
}))(TaskUndone)