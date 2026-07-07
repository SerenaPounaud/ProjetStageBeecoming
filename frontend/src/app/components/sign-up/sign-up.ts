import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users-service';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  signUpForm !: FormGroup;
  users:any[]=[];

  constructor(
    private formBuilder: FormBuilder, 
    private router: Router, 
    private userService : UsersService, 
    private authService: AuthService){}

  ngOnInit():void{
    this.signUpForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      firstname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      cgu: [ false, Validators.requiredTrue]
    })
  }
  
  signUp() {
   this.userService.signup(this.signUpForm.value).subscribe({
    next : () => {
      this.authService.setConnected(true);
      alert('Inscription réussie');
      this.router.navigate(['']);
    },
    error: (err) => {
      console.log(err);
      const message = err.error?.errors?.join(', ') // transforme en string + virgule
      || err.error?.message || "Erreur lors de la création du compte";
      alert(message);
    }
   });
  }
  
}
