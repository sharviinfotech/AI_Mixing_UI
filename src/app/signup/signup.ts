import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  constructor(private router: Router, private userService: UserService) {}

  // Form properties
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  companyName: string = '';
  photoPreview: string = '';
  selectedPhoto: string = '';

  onSignup(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    
    console.log('Signup attempt:', { 
      firstName: this.firstName, 
      lastName: this.lastName,
      email: this.email,
      username: this.username, 
      password: this.password,
      confirmPassword: this.confirmPassword,
      companyName: this.companyName
    });
    
    // Validate passwords match
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    // Validate all fields are filled
    if (this.firstName && this.lastName && this.email && this.username && this.password && this.companyName) {
      console.log('Signup successful!');
      
      // Register new user
      const registrationSuccess = this.userService.registerUser({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        username: this.username,
        password: this.password,
        companyName: this.companyName,
        role: 'Manager',
        photo: this.selectedPhoto
      });

      if (!registrationSuccess) {
        alert('Username already exists! Please choose a different username.');
        return;
      }

      // Set as current user
      this.userService.setCurrentUser({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        username: this.username,
        password: this.password,
        companyName: this.companyName,
        role: 'Manager',
        photo: this.selectedPhoto
      });
      
      alert('Account created successfully! Redirecting to dashboard...');
      
      // Clear the form
      this.firstName = '';
      this.lastName = '';
      this.email = '';
      this.username = '';
      this.password = '';
      this.confirmPassword = '';
      this.companyName = '';
      this.photoPreview = '';
      this.selectedPhoto = '';
      
      // Navigate to dashboard to show the user data
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1000);
    } else {
      console.log('Some fields are empty');
      alert('Please fill in all required fields.');
    }
  }

  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result;
        this.selectedPhoto = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
