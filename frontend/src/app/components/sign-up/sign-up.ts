import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users-service';

@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  signUpForm !: FormGroup;
  users:any[]=[];

  constructor(private formBuilder: FormBuilder, private router: Router){}
  userService = inject(UsersService);

  ngOnInit():void{
    this.signUpForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      cgu: [ false, Validators.requiredTrue]
    })
  }
  
  signUp() {
   this.userService.signup(this.signUpForm.value).subscribe({
    next : (res:any) => {
      localStorage.setItem('isConnected', 'true');
      localStorage.setItem('token', res.token);
      alert('Inscription réussie');
      this.router.navigate(['']);
    },
    error: (err) => {
      console.log(err);
      alert("Erreur lors de la création du compte");
    }
   });
  }
  
}
