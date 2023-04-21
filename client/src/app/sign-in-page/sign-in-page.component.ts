import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-in-page',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.scss']
})
export class SignInPageComponent implements OnInit {

  constructor(
    private router: Router,
    private service: AuthService,
    private ngZone: NgZone,
    private fb: FormBuilder) { }

    ngOnInit(): void {
      // @ts-ignore
      window.onGoogleLibraryLoad = () => {
        // @ts-ignore
        google.accounts.id.initialize({
          client_id: '662107657916-qr702be6n57p43kig8e2ub74esc1da5j.apps.googleusercontent.com',
          callback: this.handleCredentialResponse.bind(this),
          auto_select: false,
          cancel_on_tap_outside: true
        });
        // @ts-ignore
        google.accounts.id.renderButton(
        // @ts-ignore
        document.getElementById('buttonDiv'),
          { theme: 'outline', size: 'large', width: 200 }
        );
        // @ts-ignore
        google.accounts.id.prompt((notification: PromptMomentNotification) => {});
      };
    }
    async handleCredentialResponse(response: CredentialResponse) {
      await this.service.LoginWithGoogle(response.credential).subscribe(
        (x: any) => {
          this.ngZone.run(() => {
            this.router.navigate(['/logout']);
          });},
        (error: any) => {
            console.log(error);
          }
        );
    }
}
