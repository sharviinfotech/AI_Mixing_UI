import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  companyName: string;
  role?: string;
  photo?: string; // Base64 encoded photo
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check if user data exists in localStorage (only in browser)
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        this.currentUserSubject.next(JSON.parse(savedUser));
      }
    }
  }

  // Store registered users (for demo purposes)
  private registeredUsers: User[] = [];

  // Register a new user
  registerUser(user: User) {
    // Check if user already exists
    const existingUser = this.registeredUsers.find(u => u.username === user.username);
    if (existingUser) {
      return false; // User already exists
    }
    
    this.registeredUsers.push(user);
    
    // Save to localStorage (only in browser)
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('registeredUsers', JSON.stringify(this.registeredUsers));
    }
    
    return true; // Registration successful
  }

  // Authenticate user
  authenticateUser(username: string, password: string): User | null {
    // Load registered users from localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedUsers = localStorage.getItem('registeredUsers');
      if (savedUsers) {
        this.registeredUsers = JSON.parse(savedUsers);
      }
    }
    
    // Find user with matching username and password
    const user = this.registeredUsers.find(u => u.username === username && u.password === password);
    return user || null;
  }

  setCurrentUser(user: User) {
    // Set default role if not provided
    if (!user.role) {
      user.role = 'Manager';
    }
    
    // Save to localStorage (only in browser)
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserFullName(): string {
    const user = this.getCurrentUser();
    if (user) {
      return `${user.firstName} ${user.lastName}`;
    }
    return 'John Doe'; // Fallback
  }

  getUserInitials(): string {
    const user = this.getCurrentUser();
    if (user) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    return 'JD'; // Fallback
  }

  getUserRole(): string {
    const user = this.getCurrentUser();
    return user?.role || 'Manager';
  }

  getUserPhoto(): string | null {
    const user = this.getCurrentUser();
    return user?.photo || null;
  }

  logout() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }
}
