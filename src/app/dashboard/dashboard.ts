import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  sidebarOpen = true;
  userName: string = '';
  userInitials: string = '';
  userRole: string = '';
  userPhoto: string | null = null;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.userName = this.userService.getUserFullName();
    this.userInitials = this.userService.getUserInitials();
    this.userRole = this.userService.getUserRole();
    this.userPhoto = this.userService.getUserPhoto();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
