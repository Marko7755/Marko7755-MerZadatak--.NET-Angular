import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, finalize, Observable, throwError } from "rxjs";
import { NotificationService } from "../services/NotificationService/notification-service.service";
import { Injectable } from "@angular/core";
import { LoadingService } from "../services/loading.service";

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

    

    constructor(private notificationService: NotificationService, private loadingService: LoadingService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        this.loadingService.show();

        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                const message = error.error?.message || 'Unknown error occurred';

                if (error.status === 500) {
                    this.notificationService.errorNotification('Server error', message);
                }

                else if (!error.status) {
                    this.notificationService.errorNotification('Error', 'Server connection failure');
                }
                return throwError(() => error);
            }),

            finalize(() => {
                this.loadingService.hide();
            })
            
        )
    }





}
