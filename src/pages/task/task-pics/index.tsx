import React,{useEffect,useState,useRef} from 'react'
import { Dispatch, connect } from 'umi';
import styles from './style.less';
// import global from '../../../global.less'
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Button,Form,Input,Select,DatePicker,message,Modal,Popconfirm,Tag,Drawer,Row,Col,Radio,Image   } from 'antd';
import { SearchOutlined,RedoOutlined,DeleteOutlined,EditOutlined,PlusCircleOutlined,CloseCircleOutlined } from '@ant-design/icons';
const { Option } = Select;
const { RangePicker } = DatePicker;

const TaskPics:React.FC<any> = (props) => {
    const { dispatch } = props;
    const [taskPicList,setTaskPicList] = useState([])
    const [page,setPage] = useState(1)
    const [total,setTotal] = useState(0)
    const [limit,setLimit] = useState(10)
    const [loading,setLoading] = useState(false)
    const [taskPicsList,setTaskPicsList] = useState([])
    const [searchFormDetail,setSearchFormDetail] = useState({status:''})
    const [selectionType] = useState<any>('checkbox');
    const [selectedRowKeys,setSelectedRowKeys] = useState([])
    const [editDisable,setEditDisable] = useState(false)
    const [addDrawerVisible,setAddDrawerVisible] = useState(false)

    const [searchForm] = Form.useForm();
    const [addItemForm] = Form.useForm();

    const addItemRef = useRef<any>()

    const onFinish = () => {

    }
    const resetForm = () => {
        searchForm.resetFields()
    }
    const addItem = () => {
        setAddDrawerVisible(true)
    }
    const onAddDrawerClose = () => {
        setAddDrawerVisible(false)
    }
    const onAddDrawerComfirm = () => {
        setAddDrawerVisible(false)
    }
    const rowSelection = {
        selectedRowKeys,
        onChange: (keys:any, selectedRows:any) => {
            setSelectedRowKeys(keys)
        }
    };
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
                            label="状态"
                            name="status"
                            rules={[{ required: false, message: '请选择状态' }]}
                        >
                            <Select
                                placeholder="请选择平台类型"
                                allowClear
                            >
                                <Option value="0">全部</Option>
                                <Option value="E">启用</Option>
                                <Option value="P">停用</Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className={styles.formButtonRight}>
                            <div className={styles.btnItemRight}>
                                <Button type="primary" icon={<SearchOutlined />} htmlType="submit">搜索</Button>
                            </div>
                            <div className={styles.btnItemRight}>
                                <Button  style={{backgroundColor:'#00acc1',color:'#ffffff',border:'none'}} icon={<RedoOutlined />} onClick={resetForm}>重置</Button>
                            </div>
                        </div>
                </div>
                <div className={styles.form}>
                    <div className={styles.formButtonLeft}>
                        <div className={styles.btnItemLeft}>
                            <Button type="primary" icon={<PlusCircleOutlined />} onClick={addItem}>新增配置</Button>
                        </div>
                    </div>
                    
                    
                </div>
            </Form>
            <Table<any> 
                bordered
                columns={columns} 
                dataSource={taskPicsList}
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
                        setTaskPicsList([])
                    }
                }}
            ></Table>
            <Drawer
                title= '新增配置'
                width={720}
                onClose={onAddDrawerClose}
                visible={addDrawerVisible}
                bodyStyle={{ paddingBottom: 80 }}
                
                footer={
                    !editDisable?
                    <div
                    style={{
                        textAlign: 'right',
                    }}
                    >
                    <Button onClick={onAddDrawerClose} style={{ marginRight: 8 }}>
                        Cancel
                    </Button>
                    <Button onClick={onAddDrawerComfirm} type="primary">
                        确定
                    </Button>
                    </div>:
                    <></>
                    
                    
                }
            >
                <Form 
                    layout="vertical" 
                    hideRequiredMark
                    ref={ addItemRef }
                    initialValues={ addItemForm }
                ></Form>
            </Drawer>

        </PageContainer>
    )
}

export default connect(({taskPics}:any) => {
    taskPics
})(TaskPics)