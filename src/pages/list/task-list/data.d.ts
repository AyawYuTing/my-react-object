export interface TaskListItem {
    key: Number;
    createTime: Date;
    shopName:String;
    showPrice:Number;
    realPrice:Number;
    prefPrice:Number;
    taskTotal:Number;
    tesidueNum:Number;
}
export interface TaskListParams {
    page:number;
    limit:number;
    status:string
}