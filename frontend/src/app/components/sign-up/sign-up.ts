import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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

  ngOnInit():void{
    this.signUpForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      cgu: [ false, Validators.requiredTrue]
    })
  }
  
  signUp() {
    if(this.signUpForm.valid){
      this.users = JSON.parse(localStorage.getItem('users') || '[]');
      this.users.push(this.signUpForm.value);
      localStorage.setItem('users', JSON.stringify(this.users));
      alert('Inscription réussie');

      localStorage.setItem('isConnected', 'true');
      localStorage.setItem('connectedUser', JSON.stringify(this.signUpForm.value));

      this.signUpForm.reset();
      this.router.navigate(['']);
    }
  }
  
}
