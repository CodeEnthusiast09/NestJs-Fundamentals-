export class ApiResponseDto<Res> {
  status: string;
  message: string;
  data: Res;

  constructor(partial: Partial<ApiResponseDto<Res>>) {
    Object.assign(this, partial);
  }
}
