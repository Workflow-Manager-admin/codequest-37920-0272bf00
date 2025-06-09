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

  // Animate the ninja patrol
  private patrolTimer: any = null;
  private ninjaEl: HTMLElement | null = null;
  private isNinjaBusy = false;
  private originalNinjaTransition = '';
  private pendingNavigation: (() => void) | null = null;

  constructor() {}

  // PUBLIC_INTERFACE
  toggleDarkMode() {
    /** Toggles between dark and light mode (glassy UI). */
    this.darkMode = !this.darkMode;
  }

  // After view init: draw night sky and handle parallax for shadow ninja and animate ninja patrol
  ngAfterViewInit(): void {
    this.initAnimatedNightSky();
    this.initNinjaParallax();
    this.initNinjaPatrol();
    // Attach listeners for dashboard card actions (for demo: all .glass-card)
    globalThis.setTimeout(() => this.setupDashboardCardListeners(), 350);
  }

  // PUBLIC_INTERFACE
  onDashboardActionClick(targetSelector?: string) {
    // Defensive: SSR/platform check
    if (typeof globalThis === 'undefined' || !globalThis.document) return;
    if (this.isNinjaBusy) return; // Prevent double-trigger

    let targetEl: HTMLElement | null = null;
    if (targetSelector) {
      targetEl = globalThis.document.querySelector(targetSelector) as HTMLElement | null;
    }

    if (!targetEl) return;
    this.isNinjaBusy = true;

    // Calculate center of target element in viewport
    const rect = targetEl.getBoundingClientRect();
    const vw = globalThis.innerWidth || 1200;

    // Setup ninja element
    if (!this.ninjaEl) {
      this.ninjaEl = globalThis.document.getElementById('ninja-patrol') as HTMLElement | null;
      if (!this.ninjaEl) { this.isNinjaBusy = false; return; }
    }

    // Pause patrol
    if (this.patrolTimer) globalThis.clearTimeout(this.patrolTimer);

    // Get ninja's current position in screen coordinates
    const ninjaRect = this.ninjaEl.getBoundingClientRect();
    const targetCenter = {
      x: rect.left + rect.width/2,
      y: rect.top + rect.height*0.68   // sword aims mid-lower
    };

    // Calculate translation required (current transform may need consideration)
    // We'll use translate(x, y) from top-left of #ninja-patrol-layer
    const layerRect = (this.ninjaEl.parentElement as HTMLElement).getBoundingClientRect();
    // Calculate new (x, y) relative to the parent
    const nx = targetCenter.x - layerRect.left - ninjaRect.width/2;
    const ny = targetCenter.y - layerRect.top - ninjaRect.height/2;

    // Save original transition
    this.originalNinjaTransition = this.ninjaEl.style.transition;
    // Move ninja to target with animation
    const dist = Math.sqrt(Math.pow(nx - this.ninjaEl.offsetLeft,2) + Math.pow(ny - this.ninjaEl.offsetTop,2));
    const baseDuration = 0.45 + Math.min(1.15, Math.max(0.24, dist / 580));
    this.ninjaEl.style.transition = `transform ${baseDuration.toFixed(2)}s cubic-bezier(.61,.18,.3,.91)`;

    // Flip ninja if moving leftward
    const scaleX = nx + ninjaRect.width/2 > vw/2 ? -1 : 1;
    this.ninjaEl.style.transform = `translate(${nx}px, ${ny}px) scaleX(${scaleX})`;

    // After movement completes, trigger ninja swing and button break
    globalThis.setTimeout(() => {
      // Signal sword swing using NinjacutComponent API: call startAnimation on its instance
      let appNinjaComp: any = undefined;
      if ('ng' in globalThis && typeof (globalThis as any).ng.getComponent === 'function') {
        appNinjaComp = (globalThis as any).ng.getComponent(this.ninjaEl);
      }
      if (appNinjaComp && typeof appNinjaComp.startAnimation === 'function') {
        appNinjaComp.startAnimation();
      } else {
        // fallback: dispatch event so angular picks up
        this.ninjaEl?.dispatchEvent(new CustomEvent('triggerNinjaSwing', { bubbles: true }));
      }

      // Add break/shatter style to button
      targetEl.classList.add('card-break-shatter');
      // Remove after a delay to allow CSS animation
      globalThis.setTimeout(() => {
        targetEl.classList.remove('card-break-shatter');
      }, 650);

      // Wait for sword swing to visually finish before navigating
      globalThis.setTimeout(() => {
        // Clean up ninja transition; resume patrol after little delay
        this.ninjaEl!.style.transition = this.originalNinjaTransition;
        this.isNinjaBusy = false;
        // Skipping navigation/redirect for demonstration;
        this.patrolTimer = globalThis.setTimeout(() => this.moveNinjaRandomly(), 600);
      }, 950);
    }, baseDuration * 1000 + 90);
  }

  // Attach click handlers to all dashboard cards generically
  private setupDashboardCardListeners() {
    if (typeof globalThis === 'undefined' || !globalThis.document) return;
    // All actionable dashboard cards (add more selectors as needed)
    const cardSelectors = [
      '#prs-card', '#points-card', '#bugs-card', '#redeem-card'
    ];
    cardSelectors.forEach(sel => {
      const el = globalThis.document.querySelector(sel) as HTMLElement | null;
      if (!el) return;
      el.style.cursor = "pointer";
      // Remove pre-existing listener to avoid duplicates
      el.removeEventListener('click', () => {});
      el.addEventListener('click', () => {
        this.onDashboardActionClick(sel);
      }, { passive: false });
    });
  }

  /**
   * Ninja patrol: Animates the ninja SVG to randomly move across the dashboard background,
   * with smooth, variable speed transitions and random pauses.
   */
  private initNinjaPatrol() {
    // SSR safety
    if (typeof globalThis === 'undefined' || !globalThis.document) return;
    // Wait for ninja patrol element
    const tryAttach = () => {
      this.ninjaEl = globalThis.document.getElementById('ninja-patrol') as HTMLElement | null;
      if (!this.ninjaEl) {
        globalThis.setTimeout(tryAttach, 100);
        return;
      }
      // Set initial style
      this.ninjaEl.style.transition = 'transform 0.85s cubic-bezier(.62,.23,.48,.99)';
      this.ninjaEl.style.pointerEvents = 'auto';
      this.moveNinjaRandomly();
    };
    tryAttach();
    // Responsive: Re-run on resize to keep ninja within bounds
    if (typeof globalThis.addEventListener === 'function') {
      globalThis.addEventListener('resize', () => {
        if (this.ninjaEl) {
          // Clamp ninja to window
          this.clampNinjaToBounds();
        }
      });
    }
  }

  /**
   * Move ninja to a random location inside the window, with smooth and variable timing.
   */
  private moveNinjaRandomly() {
    if (!this.ninjaEl) return;
    // Get window and ninja size (ninjaEl is display:block, SVG width/height is about 361x320, but use actual size)
    const pad = 28;
    const vw = globalThis.innerWidth || 1200;
    const vh = globalThis.innerHeight || 800;
    const ninjaRect = this.ninjaEl.getBoundingClientRect();
    const ninjaW = ninjaRect.width || 361;
    const ninjaH = ninjaRect.height || 320;
    // Target positions (don't allow ninja to go off screen or overlap cards too much)
    // Safe range: [pad, w - ninjaW - pad], [pad, h - ninjaH - pad]
    const minX = pad;
    const maxX = Math.max(pad, vw - ninjaW - pad);
    const minY = pad + 16;
    const maxY = Math.max(pad + 16, vh - ninjaH - pad - 28);
    // Random target
    const tx = Math.floor(Math.random() * (maxX - minX)) + minX;
    const ty = Math.floor(Math.random() * (maxY - minY)) + minY;
    // Variable movement duration: ninja moves faster for short hops, slower for long dashes
    const dx = tx - (this.ninjaEl.offsetLeft || 0);
    const dy = ty - (this.ninjaEl.offsetTop || 0);
    const dist = Math.sqrt(dx*dx + dy*dy);
    // Min duration 0.7s, max 2.2s based on max possible distance (diagonal of viewport)
    const viewportDiag = Math.sqrt(vw*vw + vh*vh);
    const baseDuration = 0.7 + (1.9 * (dist / (viewportDiag || 1450)));
    // Make it slightly random for lively feel
    const duration = baseDuration * (0.85 + Math.random() * 0.55);
    this.ninjaEl.style.transition = `transform ${duration.toFixed(2)}s cubic-bezier(.58,.12,.37,1.07)`;
    this.ninjaEl.style.transform = `translate(${tx}px, ${ty}px) scaleX(${tx > vw/2 ? -1 : 1})`;
    // Schedule next move with random pause (ninja "waits" or "patrols" at each stop)
    if (this.patrolTimer) globalThis.clearTimeout(this.patrolTimer);
    const pause = 600 + Math.random()*1200; // 0.6-2s stationary between moves
    this.patrolTimer = globalThis.setTimeout(() => this.moveNinjaRandomly(), duration*1000 + pause);
  }

  private clampNinjaToBounds() {
    if (!this.ninjaEl) return;
    const pad = 28;
    const vw = globalThis.innerWidth || 1200;
    const vh = globalThis.innerHeight || 800;
    const ninjaRect = this.ninjaEl.getBoundingClientRect();
    const ninjaW = ninjaRect.width || 361;
    const ninjaH = ninjaRect.height || 320;
    let tx = this.ninjaEl.offsetLeft;
    let ty = this.ninjaEl.offsetTop;
    if (tx + ninjaW > vw - pad) tx = vw - ninjaW - pad;
    if (ty + ninjaH > vh - pad) ty = vh - ninjaH - pad;
    tx = Math.max(tx, pad);
    ty = Math.max(ty, pad);
    this.ninjaEl.style.transform = `translate(${tx}px, ${ty}px)`;
  }

  /**
   * Draw and animate the night sky with moving gradient and starfield,
   * placing both effects into the background canvas for immersive dynamism.
   */
  private initAnimatedNightSky(): void {
    // SSR safety
    if (typeof globalThis === 'undefined' || !globalThis.document) return;
    const canvas = globalThis.document.getElementById('night-sky-canvas') as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Convenience helpers for device size detection
    const getSize = () => {
      const dpr = (typeof globalThis.devicePixelRatio === 'number' ? globalThis.devicePixelRatio : 1);
      return {
        w: ((typeof globalThis.innerWidth === 'number' ? globalThis.innerWidth : 1200) * dpr) || 1200,
        h: ((typeof globalThis.innerHeight === 'number' ? globalThis.innerHeight : 900) * dpr) || 900,
        dpr
      }
    };

    // Star storage and gradient state
    let { w, h, dpr } = getSize();
    canvas.width = w; canvas.height = h;
    canvas.style.width = (w / dpr) + "px";
    canvas.style.height = (h / dpr) + "px";
    let starCount = Math.floor(w * h / 19000) + 54;
    let stars: {x:number, y:number, r:number, spd:number, tw:number, t0:number}[] = [];
    for (let i = 0; i < starCount; ++i) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random()*1.35 + 0.85 + Math.pow(Math.random(),1.6)*1.5,
        spd: 0.06 + Math.pow(Math.random(), 2.1) * 0.25,
        tw: (Math.random()*0.81+0.16),
        t0: Math.random() * 90
      });
    }

    // Sky gradient parameters (move horizontally to simulate cloud drift)
    let gradOffset = 0;
    let gradVel = 0.12; // px per frame drift

    // Draw frame: gradient, stars, subtle clouds
    function drawFrame(ts: number) {
      // Defensive: If ctx is missing, abort the frame (TS strict null safety)
      if (!ctx) return;

      // Animate gradient offset for "moving sky"
      gradOffset += gradVel + 0.7*Math.sin(ts/3900);
      // To avoid overflow
      if (gradOffset > w*0.4) gradOffset = -w*0.4;

      // Draw animated night gradient (deep blue, purple, navy, parallax)
      const grad = ctx.createLinearGradient(
        gradOffset, 0,
        w * 0.9 + gradOffset, h * (0.62 + 0.11 * Math.cos(ts/7000))
      );
      grad.addColorStop(0, "#0f1327");
      grad.addColorStop(0.19, "#13213D");
      grad.addColorStop(0.37, "#232f5d");
      grad.addColorStop(0.49 + (Math.sin(ts/3700)*0.07), "#311a35");
      grad.addColorStop(0.72, "#1c2037");
      grad.addColorStop(1, "#101121");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Draw stars
      for (let i = 0; i < stars.length; ++i) {
        const star = stars[i];
        // twinkle math with more variety, more randomness
        const t = ((ts/870 + star.t0) * star.tw * 2.5) % Math.PI;
        const alpha = 0.41 + 0.59 * Math.abs(Math.cos(t)) * (0.83 + Math.sin(ts/2500 + star.t0));
        ctx.globalAlpha = 0.13 + alpha * 0.83;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fillStyle = "#fff";
        ctx.shadowColor = (star.r > 1.65 ? "#4ffcffb3" : "#eef7fcbb");
        ctx.shadowBlur = star.r * 7.9;
        ctx.fill();
        // drift stars in gentle "parallax" (y, with subpixel phase so all stars don't move in sync)
        const ydrift = star.spd * (1.1 + Math.sin(ts/3100 + i*0.13)*0.34);
        star.y += ydrift;
        if (star.y > h) {
          star.y = -star.r*2.1;
          star.x = Math.random() * w;
        }
      }
      ctx.globalAlpha = 1;

      // Very subtle moving cloud overlay using semi-transparent sine wave (simulate clouds)
      ctx.save();
      ctx.globalAlpha = 0.18 + 0.11 * Math.sin(ts/4000); // subtle opacity
      ctx.beginPath();
      const cloud_mid = h * (0.23 + Math.sin(ts/8000)*0.04);
      const amp = 18 + 10 * Math.sin(ts/5080); // amplitude
      const waveLen = 220 + 80 * Math.sin(ts/6000);
      ctx.moveTo(0, cloud_mid);
      for (let x = 0; x <= w+5; x += 7) {
        ctx.lineTo(x, cloud_mid + Math.sin((x+ts/11)/waveLen)*amp + 7*Math.cos((x+ts/8)/112));
      }
      ctx.lineTo(w+10, h);
      ctx.lineTo(-10, h);
      ctx.closePath();
      ctx.fillStyle = "#2c284050";
      ctx.filter = "blur(3.3px)";
      ctx.fill();
      ctx.filter = "none";
      ctx.restore();

      // Request next frame
      if (typeof globalThis.requestAnimationFrame === 'function') {
        globalThis.requestAnimationFrame(drawFrame);
      }
    }
    drawFrame(0);

    // Responsive: redraw and refill on resize
    if (typeof globalThis.addEventListener === 'function') {
      globalThis.addEventListener('resize', () => {
        let newSize = getSize();
        w = newSize.w; h = newSize.h; dpr = newSize.dpr;
        canvas.width = w;
        canvas.height = h;
        canvas.style.width = (w/dpr) + "px";
        canvas.style.height = (h/dpr) + "px";
        // Reinit stars for new size
        starCount = Math.floor(w * h / 19000) + 54;
        stars = [];
        for (let i = 0; i < starCount; ++i) {
          stars.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random()*1.35 + 0.85 + Math.pow(Math.random(),1.6)*1.5,
            spd: 0.06 + Math.pow(Math.random(), 2.1) * 0.25,
            tw: (Math.random()*0.81+0.16),
            t0: Math.random() * 90
          });
        }
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
