import { DefaultValuePipe } from '@nestjs/common';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
}

export const createPaginationDecorators = () => {
  return [
    new DefaultValuePipe(1),
    new DefaultValuePipe(10),
    new DefaultValuePipe('releaseDate'),
    new DefaultValuePipe('DESC'),
  ];
};

export const normalizePagination = (
  options: PaginationOptions,
): PaginationOptions => {
  const page = options.page > 0 ? options.page : 1;

  const limit =
    options.limit > 0 ? (options.limit > 100 ? 100 : options.limit) : 10;

  const sortBy = options.sortBy || 'releaseDate';

  const order =
    options.order === 'ASC' || options.order === 'DESC'
      ? options.order
      : 'DESC';

  return { page, limit, sortBy, order };
};
