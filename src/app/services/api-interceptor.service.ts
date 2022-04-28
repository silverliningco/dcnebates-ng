import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import {API_KEY} from '../config/config';

@Injectable({
  providedIn: 'root'
})

export class ApiInterceptorService implements HttpInterceptor{

  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    request = request.clone({
      setHeaders: {
        'x-api-key': API_KEY
      }
    });

    return next.handle(request);
  }
}
