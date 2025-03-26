import { DefaultValuePipe, ParseIntPipe } from '@nestjs/common';

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export const createPaginationDecorators = () => {
  return [new DefaultValuePipe(1), ParseIntPipe];
};

export const normalizePagination = (
  options: PaginationOptions,
): PaginationOptions => {
  const page = options.page > 0 ? options.page : 1;
  const limit =
    options.limit > 0 ? (options.limit > 100 ? 100 : options.limit) : 10;

  return { page, limit };
};
