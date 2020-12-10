import React,{ useState,useRef, useEffect } from 'react'
import { Dispatch, connect } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Button,Form,Input,Select,DatePicker,message,Modal,Popconfirm,Tag,Drawer,Row,Col,Radio,Image   } from 'antd';
import { SearchOutlined,RedoOutlined,CheckOutlined,PauseOutlined,DeleteOutlined,ToTopOutlined,EditOutlined,StopOutlined,ExclamationCircleOutlined,PlusCircleOutlined,CloseCircleOutlined } from '@ant-design/icons';
import styles from './style.less';
import { TaskUndoneItem } from './data.d'
const { Option } = Select;
const { RangePicker } = DatePicker;
const { confirm } = Modal;
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
    const [editDisable,setEditDisable] = useState(false)
    const [searchForm] = Form.useForm();

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
    const columns:any = [
        
    ]
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
                    
                </div>
            </Form>
        </PageContainer>
    )
}

export default connect(({ taskUndone } :any) =>({
    taskUndone
}))(TaskUndone)