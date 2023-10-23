import { HttpStatus } from "@nestjs/common";

export interface Pagination {
  current_page: number;
  total_pages: number;
  per_page: number;
}

export interface DataWithPagination<T> {
  data: T;
  pagination: Pagination;
}

export function SuccessResponse<T>(response: {
  data?: T;
  pagination?: Pagination;
  statusCode?: HttpStatus;
  message?: string;
}) {
  const {
    data = null,
    pagination = null,
    statusCode = HttpStatus.OK,
    message = null,
  } = response;
  return {
    ...(data && { data }),
    ...(pagination && { pagination }),
    ...(message && { message }),
    statusCode,
  };
}
