import { Component, signal } from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  isLoading = signal(false);

  errorMessage = signal('');

  hidePassword = signal(true);

  loginForm = new FormGroup({

    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email
      ]
    }),

    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(6)
      ]
    })

  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  login(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const credentials =
      this.loginForm.getRawValue();

    this.authService
      .login(credentials)
      .subscribe({

        next: (response) => {

          this.authService.saveSession(
            response
          );

          this.isLoading.set(false);

          const returnUrl =
            this.route.snapshot.queryParamMap
              .get('returnUrl');

          this.router.navigateByUrl(
            returnUrl ?? '/dashboard'
          );

        },

        error: (error) => {

          console.error(
            'Login failed:',
            error
          );

          this.errorMessage.set(
            error.message ??
            'Unable to login.'
          );

          this.isLoading.set(false);
        }

      });
  }

  togglePassword(): void {
    this.hidePassword.update(
      hidden => !hidden
    );
  }
}