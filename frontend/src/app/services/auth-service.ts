import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'; //stocke une valeur + prévient les abonnés du changement

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = "/api/users";
  private connectedSubject = new BehaviorSubject<boolean>(false);
  isConnected$ = this.connectedSubject.asObservable(); 
  //transforme en observable pour que les composants s'abonnent + empêche les composants de modifier la valeur
  
  constructor (private http: HttpClient) {}

  setConnected(value:boolean) {
    console.log("Etat connexion :", value);
    this.connectedSubject.next(value); //envoie une nouvelle valeur aux abonnés
  }

  logout() {
    return this.http.post(`${this.url}/logout`, {}, { withCredentials: true });
  }

  //vérifie si l'user est connecté
  checkAuth() {
  return this.http.get<any>(`${this.url}/me`, {withCredentials: true}).subscribe({
    next: (res) => {
      this.setConnected(res.authenticated);
    },
    error: () => {
      this.setConnected(false);
    }
  });
}
}


