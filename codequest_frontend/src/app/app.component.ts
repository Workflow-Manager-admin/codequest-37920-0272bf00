import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NinjacutComponent } from './ninjacut.component';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NinjacutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
})
export class AppComponent {
  // Dashboard UI state
  prsCount = 3;           // Example: active PRs
  points = 2200;          // Example: gamification points
  bugsLogged = "2/8";     // open/total - stubbed for now

  streakActive = true;    // For flame streak animation
  streakCount = 7;        // Days/hits for streak

  showConfetti = false;   // Confetti animation for actions

  darkMode = true;        // Default to dark mode
  currentYear = new Date().getFullYear();

  // PUBLIC_INTERFACE
  toggleDarkMode() {
    /** Toggles between dark and light mode (glassy UI). */
    this.darkMode = !this.darkMode;
  }

  // On next steps, backend data fetch integration goes here.
}
