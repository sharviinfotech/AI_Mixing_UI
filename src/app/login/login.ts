import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  constructor(private router: Router, private userService: UserService) {}

  username: string = '';
  password: string = '';

  onLogin() {
    console.log('Login attempt:', { username: this.username, password: this.password });
    console.log('Form submitted successfully');
    
    if (this.username && this.password) {
      console.log('Username and password are provided, attempting authentication...');
      
      // Authenticate user with username and password
      const authenticatedUser = this.userService.authenticateUser(this.username, this.password);
      
      if (authenticatedUser) {
        console.log('Authentication successful:', authenticatedUser);
        
        // Set as current user
        this.userService.setCurrentUser(authenticatedUser);
        
        this.router.navigate(['/dashboard']).then(() => {
          console.log('Navigation successful');
        }).catch(err => {
          console.error('Navigation failed:', err);
        });
      } else {
        console.log('Authentication failed - invalid credentials');
        alert('Invalid username or password. Please try again.');
      }
    } else {
      console.log('Username or password is empty');
      console.log('Username length:', this.username?.length);
      console.log('Password length:', this.password?.length);
      alert('Please enter both username and password.');
    }
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
