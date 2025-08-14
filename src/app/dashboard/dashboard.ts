import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { DashboardService, DashboardStats, RecentActivity, QuickAction, ChartData } from '../services/dashboard.service';
import { Subscription } from 'rxjs';

// Import Chart.js dynamically to avoid SSR issues
let Chart: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy, AfterViewInit {
  sidebarOpen = true;
  userName: string = '';
  userInitials: string = '';
  userRole: string = '';
  userPhoto: string | null = null;
  
  // Dashboard data
  stats: DashboardStats | null = null;
  activities: RecentActivity[] = [];
  quickActions: QuickAction[] = [];
  
  // Chart references
  @ViewChild('dailySalesChart') dailySalesChartRef!: ElementRef;
  @ViewChild('globalReferralsChart') globalReferralsChartRef!: ElementRef;
  @ViewChild('completedTasksChart') completedTasksChartRef!: ElementRef;
  @ViewChild('qualityTrendChart') qualityTrendChartRef!: ElementRef;
  @ViewChild('productionEfficiencyChart') productionEfficiencyChartRef!: ElementRef;
  @ViewChild('inventoryLevelsChart') inventoryLevelsChartRef!: ElementRef;
  
  // Chart instances
  private charts: any[] = [];
  private isBrowser: boolean;
  private chartInitialized = false;
  
  // Subscriptions
  private statsSubscription: Subscription | null = null;
  private activitiesSubscription: Subscription | null = null;
  private quickActionsSubscription: Subscription | null = null;

  constructor(
    private router: Router, 
    private userService: UserService,
    private dashboardService: DashboardService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.userName = this.userService.getUserFullName();
    this.userInitials = this.userService.getUserInitials();
    this.userRole = this.userService.getUserRole();
    this.userPhoto = this.userService.getUserPhoto();
    
    // Subscribe to dashboard data
    this.statsSubscription = this.dashboardService.getStats().subscribe(stats => {
      this.stats = stats;
      console.log('Stats loaded:', stats);
    });
    
    this.activitiesSubscription = this.dashboardService.getActivities().subscribe(activities => {
      this.activities = activities;
      console.log('Activities loaded:', activities);
    });
    
    this.quickActionsSubscription = this.dashboardService.getQuickActions().subscribe(actions => {
      this.quickActions = actions;
      console.log('Quick actions loaded:', actions);
    });
  }

  async ngAfterViewInit() {
    if (this.isBrowser && !this.chartInitialized) {
      console.log('ngAfterViewInit called, isBrowser:', this.isBrowser);
      try {
        // Dynamically import Chart.js
        console.log('Loading Chart.js...');
        const chartModule = await import('chart.js/auto');
        Chart = chartModule.default;
        console.log('Chart.js loaded successfully:', Chart);
        
        // Wait a bit for DOM to be ready
        setTimeout(() => {
          this.initializeCharts();
        }, 500);
      } catch (error) {
        console.error('Failed to load Chart.js:', error);
      }
    }
  }

  ngOnDestroy() {
    // Clean up subscriptions
    if (this.statsSubscription) {
      this.statsSubscription.unsubscribe();
    }
    if (this.activitiesSubscription) {
      this.activitiesSubscription.unsubscribe();
    }
    if (this.quickActionsSubscription) {
      this.quickActionsSubscription.unsubscribe();
    }
    
    // Destroy charts only on browser
    if (this.isBrowser && this.charts.length > 0) {
      this.charts.forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
          chart.destroy();
        }
      });
    }
  }

  private initializeCharts() {
    if (!this.isBrowser || !Chart || this.chartInitialized) {
      console.log('Charts initialization skipped:', {
        isBrowser: this.isBrowser,
        hasChart: !!Chart,
        alreadyInitialized: this.chartInitialized
      });
      return;
    }
    
    try {
      console.log('Initializing charts...');
      console.log('Chart references:', {
        dailySales: this.dailySalesChartRef,
        globalReferrals: this.globalReferralsChartRef,
        completedTasks: this.completedTasksChartRef,
        qualityTrend: this.qualityTrendChartRef,
        productionEfficiency: this.productionEfficiencyChartRef,
        inventoryLevels: this.inventoryLevelsChartRef
      });
      
      // Test canvas functionality first
      this.testCanvasFunctionality();
      
      // Initialize all charts
      this.createLineChart(this.dailySalesChartRef, this.dashboardService.getDailySalesData(), 'Daily Sales');
      this.createBarChart(this.globalReferralsChartRef, this.dashboardService.getGlobalReferralsData(), 'Global Referrals');
      this.createLineChart(this.completedTasksChartRef, this.dashboardService.getCompletedTasksData(), 'Completed Tasks');
      this.createLineChart(this.qualityTrendChartRef, this.dashboardService.getQualityTrendData(), 'Quality Trend');
      this.createLineChart(this.productionEfficiencyChartRef, this.dashboardService.getProductionEfficiencyData(), 'Production Efficiency');
      this.createDoughnutChart(this.inventoryLevelsChartRef, this.dashboardService.getInventoryLevelsData(), 'Inventory Levels');
      
      this.chartInitialized = true;
      console.log('Charts initialized successfully. Total charts:', this.charts.length);
    } catch (error) {
      console.error('Error initializing charts:', error);
    }
  }

  private testCanvasFunctionality() {
    console.log('Testing canvas functionality...');
    
    const testCanvas = this.dailySalesChartRef?.nativeElement;
    if (testCanvas) {
      const ctx = testCanvas.getContext('2d');
      if (ctx) {
        // Draw a simple test rectangle
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(10, 10, 100, 50);
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText('Canvas Test', 20, 35);
        console.log('Canvas test successful - drew test rectangle');
      } else {
        console.error('Failed to get 2D context for test canvas');
      }
    } else {
      console.error('Test canvas not found');
    }
  }

  private createLineChart(canvasRef: ElementRef, data: ChartData, title: string) {
    if (!this.isBrowser || !Chart || !canvasRef?.nativeElement) {
      console.log(`Failed to create line chart for ${title}:`, {
        isBrowser: this.isBrowser,
        hasChart: !!Chart,
        hasCanvas: !!canvasRef?.nativeElement
      });
      return;
    }
    
    const ctx = canvasRef.nativeElement.getContext('2d');
    if (!ctx) {
      console.log(`No 2D context for ${title}`);
      return;
    }
    
    console.log(`Creating line chart for ${title} with data:`, data);
    
    const chart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: false
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            ticks: {
              color: 'white'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          y: {
            ticks: {
              color: 'white'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        }
      }
    });
    this.charts.push(chart);
    console.log(`Line chart created for ${title}`);
  }

  private createBarChart(canvasRef: ElementRef, data: ChartData, title: string) {
    if (!this.isBrowser || !Chart || !canvasRef?.nativeElement) {
      console.log(`Failed to create bar chart for ${title}:`, {
        isBrowser: this.isBrowser,
        hasChart: !!Chart,
        hasCanvas: !!canvasRef?.nativeElement
      });
      return;
    }
    
    const ctx = canvasRef.nativeElement.getContext('2d');
    if (!ctx) {
      console.log(`No 2D context for ${title}`);
      return;
    }
    
    console.log(`Creating bar chart for ${title} with data:`, data);
    
    const chart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: false
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            ticks: {
              color: 'white'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          y: {
            ticks: {
              color: 'white'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        }
      }
    });
    this.charts.push(chart);
    console.log(`Bar chart created for ${title}`);
  }

  private createDoughnutChart(canvasRef: ElementRef, data: ChartData, title: string) {
    if (!this.isBrowser || !Chart || !canvasRef?.nativeElement) {
      console.log(`Failed to create doughnut chart for ${title}:`, {
        isBrowser: this.isBrowser,
        hasChart: !!Chart,
        hasCanvas: !!canvasRef?.nativeElement
      });
      return;
    }
    
    const ctx = canvasRef.nativeElement.getContext('2d');
    if (!ctx) {
      console.log(`No 2D context for ${title}`);
      return;
    }
    
    console.log(`Creating doughnut chart for ${title} with data:`, data);
    
    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: false
          },
          legend: {
            position: 'bottom',
            labels: {
              color: 'white',
              padding: 20
            }
          }
        }
      }
    });
    this.charts.push(chart);
    console.log(`Doughnut chart created for ${title}`);
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

  navigateToAction(action: QuickAction) {
    this.router.navigate([action.route]);
  }

  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }

  getSuccessRate(): number {
    if (!this.stats) return 0;
    return this.stats.mixPlans > 0 ? (this.stats.completedPlans / this.stats.mixPlans) * 100 : 0;
  }
}
