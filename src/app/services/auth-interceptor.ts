import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authToken = this.authService.getToken();
        const language = window.location.href.split('/')[3];
        const authRequest = req.clone({
            headers: req.headers.set('Authorization', 'jdklGOA23fGKL23sfd34GKDL2')
            .set('auth-token', ''+authToken)
            .set('Accept-Language', language)
        });
        return next.handle(authRequest);
    }
}