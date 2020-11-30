export interface TaskListItem {
    id: Number;
    createTime: Date;
    shopName:String;
    showPrice:Number;
    realPrice:Number;
    prefPrice:Number;
    taskTotal:Number;
    tesidueNum:Number;
    stayOprNum:Number;
    notAuditedNum:Number;
    yesAuditedNum:Number;
    status:string;

}
export interface TaskListParams {
    page:number;
    limit:number;
    status:string
}
export interface TaskListPagination {
    total: number;
    page: number;
    limit: number | undefined;
  }