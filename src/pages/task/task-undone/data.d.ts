export interface TaskUndoneItem {
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
    userName:string,
    createTime:string
}
export interface TaskUndoneParams {
    page:number;
    limit:number;
    status:string
}
export interface TTaskUndonePagination {
    total: number;
    page: number;
    limit: number | undefined;
  }