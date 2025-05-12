export interface Pagination<T>{
  pageSize:number;
  totalCount:number;
  data:T[];
  isLastPage:boolean;
}
