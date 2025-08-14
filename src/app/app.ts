import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChatWidget } from './chat-widget/chat-widget';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, ChatWidget],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('ai-cotton-mix-planner');
  showChatWidget = true;
  private routerSubscription: Subscription | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    // Subscribe to router events to update chat widget visibility
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateChatWidgetVisibility();
      });
    
    // Initial check
    this.updateChatWidgetVisibility();
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private updateChatWidgetVisibility() {
    const currentRoute = this.router.url;
    console.log('Current route:', currentRoute);
    
    // Hide chat widget on login and signup pages, show on all other pages
    this.showChatWidget = currentRoute !== '/login' && currentRoute !== '/signup';
    console.log('Show chat widget:', this.showChatWidget);
  }
}
