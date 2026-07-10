import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "./auth-service";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";

//ajoute les cookies aux requêtes HTTP
export const authInterceptor: HttpInterceptorFn = (req,next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const authReq = req.clone({ withCredentials: true});
  
  //vérifie si l'user est connecté
  return next(authReq).pipe(
    catchError(error => {
      if (error.status === 401) {
        authService.setConnected(false);
        router.navigate(['/sign-in']);
      }
      return throwError(() => error);
    })
  );
};