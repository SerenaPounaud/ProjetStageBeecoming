import { HttpInterceptorFn } from "@angular/common/http";

//ajoute les cookies aux requêtes HTTP
export const authInterceptor: HttpInterceptorFn = (req,next) => {

  const authReq = req.clone({ withCredentials: true});
  
  return next(authReq);
};