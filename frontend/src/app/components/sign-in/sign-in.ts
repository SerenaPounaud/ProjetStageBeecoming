import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router} from '@angular/router';
import { UsersService } from '../../services/users-service';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
})
export class SignIn {
signInForm !: FormGroup;
users:any[] = [];

constructor(private fb: FormBuilder, private router: Router){}
userService = inject(UsersService);
authService = inject(AuthService);

ngOnInit():void{

  this.signInForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  })
}

signIn() {
  const formValue = this.signInForm.value;
  this.userService.signin(formValue).subscribe({
    next: (res:any) => {
      localStorage.setItem('token', res.token);
      localStorage.setItem('isConnected','true');
      this.authService.autoLogout();

      const decoded = jwtDecode(res.token);
      this.router.navigate(['']);
    },
    error: (err) => {
      alert("Email ou mot de passe incorrect");
    }
  });
    
  }
}
