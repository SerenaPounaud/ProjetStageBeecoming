import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  httpClient = inject(HttpClient);

  userURL: string = "http://localhost:3000/api/users";

  signup(userObj:any){
    return this.httpClient.post(this.userURL + "/signup", userObj);
  }
  signin(userObj:any){
    return this.httpClient.post(this.userURL + "/signin", userObj);
  }
}
