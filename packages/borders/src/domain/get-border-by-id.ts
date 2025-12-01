import { Border } from './border';

export type BorderOrder = 'RANK' | 'DATE';
export type BorderSort = 'ASC' | 'DESC';

export type BorderPaginationParams = {
  userId: string;
  page: number;
  pageSize: number;
  filterByName: string;
  orderBy: BorderOrder;
  sort: BorderSort;
};

export type BordersPagination = {
  borders: Border[];
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
};
