import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { HttpInterceptorService } from '../HttpInterceptor/http-interceptor-service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(withInterceptorsFromDi()),
  {
  provide: HTTP_INTERCEPTORS,
  useClass: HttpInterceptorService,
  multi: true
}, provideAnimationsAsync()
]

};
