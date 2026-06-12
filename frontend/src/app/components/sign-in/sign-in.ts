import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router} from '@angular/router';

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

ngOnInit():void{

  this.users = JSON.parse(localStorage.getItem("users") || "[]");

  this.signInForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  })
}

signIn() {
  const user = this.users.find((u:any) => u.email === this.signInForm.value.email && u.password === this.signInForm.value.password);
  if (!user) {
    alert('Email ou mot de passe incorrect');
    return;
  } 
    localStorage.setItem('isConnected','true');
    localStorage.setItem('connectedUser', JSON.stringify(user));

    this.router.navigate(['']);
    
  }
}
