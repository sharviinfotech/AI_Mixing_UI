import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-ai-mix-planner',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './ai-mix-planner.html',
  styleUrl: './ai-mix-planner.css'
})
export class AiMixPlanner implements OnInit {
  showMixOptions = false;
  sidebarOpen = true;
  userName: string = '';
  userInitials: string = '';
  userRole: string = '';
  userPhoto: string | null = null;

  // Form properties
  customerName: string = '';
  yarn: string = '';
  yarnCount: string = '';
  costPrice: string = '';
  waste: string = '';
  quality: string = '';
  rawCottonRequired: string = '0 kg';
  yarnCost: string = '₹0';

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.userName = this.userService.getUserFullName();
    this.userInitials = this.userService.getUserInitials();
    this.userRole = this.userService.getUserRole();
    this.userPhoto = this.userService.getUserPhoto();
  }

  generateMix() {
    // Calculate values based on form inputs
    if (this.yarn && this.waste && this.quality) {
      const yarnQty = parseFloat(this.yarn) || 0;
      const wastePercent = parseFloat(this.waste) || 0;
      const qualityPercent = parseFloat(this.quality) || 0;
      
      // Simple calculation for demonstration
      const required = yarnQty * (1 + wastePercent / 100) * (100 / qualityPercent);
      this.rawCottonRequired = `${required.toFixed(2)} kg`;
      
      if (this.costPrice) {
        const cost = required * (parseFloat(this.costPrice) || 0);
        this.yarnCost = `₹${cost.toFixed(2)}`;
      }
    }
    
    this.showMixOptions = true;
  }

  backToForm() {
    this.showMixOptions = false;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
