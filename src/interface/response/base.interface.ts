export interface BaseRes {
  success: boolean;
  message: string;
  data: unknown;
}

export interface NullDataRes extends BaseRes {
  data: null;
}

export interface BaseErrorRes {
  message?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: Record<string, any>;
}

export interface PaginationBaseRes {
  from: number | null;
  to: number | null;
  currentPage: number | null;
  totalPages: number | null;
  totalItems: number | null;
  limit: number | null;
}
