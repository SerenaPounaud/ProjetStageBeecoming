import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  httpClient = inject(HttpClient);

  userURL: string = "/api/users";

  signup(userObj:any){
    return this.httpClient.post<any>(this.userURL + "/signup", userObj, {withCredentials: true});
  }

  signin(userObj:any){
    return this.httpClient.post<any>(this.userURL + "/signin", userObj, {withCredentials: true});
  }

  me(){
    return this.httpClient.get(this.userURL + "/me", {withCredentials: true});
  }
  
  //vérifie si l'user connecté est admin
  isAdmin(){
    return this.me().pipe( //permet les opérateurs
      map((res:any) => res.role === "admin"), //transforme en boolean
      catchError(() => of(false))
    );
  }

}
