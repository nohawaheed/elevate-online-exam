import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import { MessageService } from 'primeng/api';
import { headerInterceptor } from './core/interceptors/header.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch(), 
    withInterceptors([headerInterceptor, errorInterceptor])),
    provideAnimationsAsync(),
    MessageService
  ],
};