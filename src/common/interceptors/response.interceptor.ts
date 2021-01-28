import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from './response.interface';

@Injectable()
export class HttpResponseInterceptor<T> implements NestInterceptor<T> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        const timestamp = new Date().getTime();
        return next.handle().pipe(map(payload => {
            return { payload, timestamp };
        }));
    }
}
