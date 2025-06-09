import { Component, AfterViewInit } from '@angular/core';
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
export class AppComponent implements AfterViewInit {
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

  // After view init: draw night sky and handle parallax for shadow ninja 
  ngAfterViewInit(): void {
    this.initNightSkyStars();
    this.initNinjaParallax();
  }

  /**
   * Draw and animate stars in the #night-sky-canvas above dashboard
   */
  private initNightSkyStars(): void {
    // Use globalThis for browser APIs for SSR safety
    if (typeof globalThis === 'undefined' || !globalThis.document) return;
    const canvas = globalThis.document.getElementById('night-sky-canvas') as HTMLCanvasElement | null;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const devicePixelRatio = (typeof globalThis.devicePixelRatio === 'number' ? globalThis.devicePixelRatio : 1);
    let w = (typeof globalThis.innerWidth === 'number' ? globalThis.innerWidth : 1200) * devicePixelRatio;
    let h = (typeof globalThis.innerHeight === 'number' ? globalThis.innerHeight : 900) * devicePixelRatio;
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = (typeof globalThis.innerWidth === 'number' ? globalThis.innerWidth : 1200) + "px";
    canvas.style.height = (typeof globalThis.innerHeight === 'number' ? globalThis.innerHeight : 900) + "px";
    const starCount = Math.floor(w * h / 17000) + 48;
    let stars: {x:number, y:number, r:number, spd:number, tw:number, t0:number}[] = []; // CORRECT 'int' to 'number'
    for (let i = 0; i < starCount; ++i) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random()*1.2 + 0.7 + Math.pow(Math.random(),1.7)*1.6,
        spd: 0.07 + Math.pow(Math.random(), 2.6) * 0.30,
        tw: (Math.random()*0.85+0.12), // twinkle factor
        t0: Math.random() * 100
      });
    }
    function animateStars(ts: number) {
      if (!ctx) return;
      ctx.clearRect(0,0,w,h);
      for (let i = 0; i < stars.length; ++i) {
        let star = stars[i];
        // twinkle math: 0.45..1.1 opacity
        let t = ((ts/1000+star.t0)*star.tw*1.8)%Math.PI;
        let alpha = 0.45 + 0.55*Math.abs(Math.cos(t));
        ctx.globalAlpha = 0.18+alpha*0.76;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI*2, false);
        ctx.closePath();
        ctx.fillStyle = "#fff";
        ctx.shadowColor = (star.r>1.45?"#00fffbe7":"#fff9");
        ctx.shadowBlur = star.r*7.2;
        ctx.fill();
        // drift stars down a bit
        star.y += star.spd;
        if (star.y > h) {
          star.y = -star.r*2.2;
          star.x = Math.random()*w;
        }
      }
      ctx.globalAlpha = 1;
      if (typeof globalThis.requestAnimationFrame === 'function') {
        globalThis.requestAnimationFrame(animateStars);
      }
    }
    animateStars(0);

    // Redraw canvas on resize (mobile, orientation change, SSR safe)
    if (typeof globalThis.addEventListener === 'function') {
      globalThis.addEventListener('resize', () => {
        let w = (typeof globalThis.innerWidth === 'number' ? globalThis.innerWidth : 1200) * devicePixelRatio;
        let h = (typeof globalThis.innerHeight === 'number' ? globalThis.innerHeight : 900) * devicePixelRatio;
        canvas.width = w;
        canvas.height = h;
        canvas.style.width = (typeof globalThis.innerWidth === 'number' ? globalThis.innerWidth : 1200) + "px";
        canvas.style.height = (typeof globalThis.innerHeight === 'number' ? globalThis.innerHeight : 900) + "px";
      });
    }
  }

  /**
   * Subtle parallax for large shadow ninja in background using mouse
   */
  private initNinjaParallax() {
    if (typeof globalThis === 'undefined' || !globalThis.document) return;
    // Only run if .app-background bg present
    const root = globalThis.document.querySelector('.app-background') as HTMLElement;
    if (!root) return;
    let isMobile = false;
    if (typeof globalThis.navigator !== 'undefined') {
      isMobile = /(android|iphone|ipad|mobile)/i.test(globalThis.navigator.userAgent);
    }

    function updateParallax(e: MouseEvent | TouchEvent) {
      let x: number, y: number;
      if (e instanceof MouseEvent) {
        x = e.clientX / (typeof globalThis.innerWidth === 'number' ? globalThis.innerWidth : 1200);
        y = e.clientY / (typeof globalThis.innerHeight === 'number' ? globalThis.innerHeight : 900);
      } else if (e instanceof TouchEvent && e.touches && e.touches.length > 0) {
        x = e.touches[0].clientX / (typeof globalThis.innerWidth === 'number' ? globalThis.innerWidth : 1200);
        y = e.touches[0].clientY / (typeof globalThis.innerHeight === 'number' ? globalThis.innerHeight : 900);
      } else {
        x = 0.5; y = 0.5;
      }
      // Animate CSS bg-position for ::before
      root.style.setProperty('--ninjashadow-x', ((x-0.5)*34)+"px");
      root.style.setProperty('--ninjashadow-y', ((y-0.5)*22)+"px");
      // Animate opacity subtly based on center/edge
      root.style.setProperty('--shadow-opacity', ((0.09 + Math.abs(x-0.5)*0.14 + Math.abs(y-0.5)*0.11).toFixed(2)));
    }

    // Use mousemove or device orientation
    if (isMobile && typeof globalThis.DeviceOrientationEvent !== 'undefined') {
      globalThis.addEventListener('deviceorientation', function(event: DeviceOrientationEvent) {
        let x = (event.gamma ?? 0) / 45; // left/right
        let y = (event.beta ?? 0 - 45) / 45; // up/down: 0..90 maps 0..2
        root.style.setProperty('--ninjashadow-x', `${x*26}px`);
        root.style.setProperty('--ninjashadow-y', `${y*14}px`);
      });
    } else {
      if (typeof globalThis.addEventListener === 'function') {
        globalThis.addEventListener('mousemove', updateParallax);
        globalThis.addEventListener('touchmove', updateParallax);
      }
    }
  }

  // On next steps, backend data fetch integration goes here.
}
