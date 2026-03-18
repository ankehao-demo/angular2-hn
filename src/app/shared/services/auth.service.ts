import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  get isLoggedIn(): boolean {
    return this.loggedIn.value;
  }

  get isLoggedIn$() {
    return this.loggedIn.asObservable();
  }

  constructor(private router: Router) {
    const stored = localStorage.getItem('auth_logged_in');
    if (stored === 'true') {
      this.loggedIn.next(true);
    }
  }

  login(username: string, password: string): boolean {
    if (username === environment.authCredentials.username && password === environment.authCredentials.secret) {
      localStorage.setItem('auth_logged_in', 'true');
      this.loggedIn.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('auth_logged_in');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }
}
