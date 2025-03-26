import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Get HTTP response
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        // Determine message based on route and method
        let message = 'Operation successful';
        if (data?.message) {
          message = data.message;
        }

        return {
          status: response.statusCode >= 400 ? 'error' : 'success',
          message: message,
          data: data?.data || data || null,
          path: request.url,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
