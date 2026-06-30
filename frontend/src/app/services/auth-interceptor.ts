import { HttpInterceptorFn } from "@angular/common/http";

//modifie toutes les requêtes HTTP sortantes pour y ajouter un token d’authen si celui-ci existe
export const authInterceptor: HttpInterceptorFn = (req,next) => {
  const token = localStorage.getItem('token');
  if(!token) {
    return next(req);
  }
  const authReq = req.clone({ //copie req + ajout header http
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
  return next(authReq); //envoi req modif + token
};