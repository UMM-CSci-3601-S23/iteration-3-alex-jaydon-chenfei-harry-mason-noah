import {Component, NgZone, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home-component',
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: []
})
export class HomeComponent implements OnInit {
  public userRole: 'client' | 'donor' | 'volunteer' ;

  constructor(private router: Router,
    private service: AuthService,
    private ngZone: NgZone) {}

  changeRole(newRole: HomeComponent['userRole']){
    this.userRole = newRole;
  }

  ngOnInit(): void {

  }

  public logout(){
    this.service.signOutExternal();
    this.ngZone.run(() => {
      this.router.navigate(['sign-in-page/sign-in-page']).then(() => window.location.reload());
    });
  }

}

