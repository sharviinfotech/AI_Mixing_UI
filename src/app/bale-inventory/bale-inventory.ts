import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-bale-inventory',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bale-inventory.html',
  styleUrl: './bale-inventory.css'
})
export class BaleInventory implements OnInit {
  sidebarOpen = true;
  userName: string = '';
  userInitials: string = '';
  userRole: string = '';
  userPhoto: string | null = null;

  constructor(private router: Router, private userService: UserService) {
    console.log('BaleInventory component loaded, sidebarOpen:', this.sidebarOpen);
  }

  ngOnInit() {
    this.userName = this.userService.getUserFullName();
    this.userInitials = this.userService.getUserInitials();
    this.userRole = this.userService.getUserRole();
    this.userPhoto = this.userService.getUserPhoto();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    console.log('Sidebar toggled, sidebarOpen:', this.sidebarOpen);
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
