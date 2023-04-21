import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private path = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  public signOutExternal = () => {
    localStorage.removeItem('token');
    console.log('token deleted');
  };


  LoginWithGoogle(credentials: string): Observable<any> {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.httpClient.post(this.path + 'LoginWithGoogle', JSON.stringify(credentials), { headers: header, withCredentials: true });
  }


}
