import { Component, signal } from '@angular/core';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-ninjacut',
  standalone: true,
  template: `
    <div class="ninja-cut-hero-glassy">
      <!-- Ninja Illustration (Realistic-styled SVG) -->
      <svg class="ninja-svg" viewBox="0 0 350 300" fill="none" xmlns="http://www.w3.org/2000/svg"
            [class.animate-swing]="isSwinging" (animationend)="onSwingEnd()">
        <!-- BODY (dark suit, glass-shadow) -->
        <ellipse cx="170" cy="215" rx="55" ry="68" fill="#25252C" filter="url(#shadow1)" opacity="0.98"/>
        <!-- FACE HOOD -->
        <ellipse cx="170" cy="110" rx="55" ry="61" fill="#171b21" stroke="#1dd8cf" stroke-width="2.5"/>
        <!-- Mask highlight -->
        <path d="M154,107 Q170,80 186,108" fill="none" stroke="#eaeaea" stroke-width="3"/>
        <!-- Skin (eye region) -->
        <ellipse cx="170" cy="116" rx="36" ry="18" fill="#ffe2b2" />
        <!-- Mask band -->
        <rect x="113" y="97" width="114" height="29" fill="#191d46" opacity="0.87" rx="10"/>
        <!-- Eyes -->
        <ellipse cx="158" cy="116" rx="9.5" ry="7" fill="#fff" />
        <ellipse cx="183" cy="116" rx="9.5" ry="7" fill="#fff" />
        <!-- Pupils -->
        <ellipse cx="158" cy="116" rx="3.2" ry="3.8" fill="#474787"/>
        <ellipse cx="183" cy="116" rx="3.2" ry="3.8" fill="#474787"/>
        <!-- Eye glare -->
        <ellipse cx="160" cy="115" rx="0.9" ry="1.1" fill="#ccd" />
        <ellipse cx="185" cy="115" rx="0.9" ry="1.1" fill="#ccd" />
        <!-- Left ARM -->
        <rect x="75" y="160" width="21" height="68" rx="12" transform="rotate(-25 75 160)" fill="#232328" filter="url(#blurarm1)"/>
        <!-- Right ARM (SWORD, animated via group) -->
        <g class="sword-arm-group" [ngClass]="{ 'swinging': isSwinging }">
          <!-- Right ARM -->
          <rect x="206" y="158" width="20" height="72" rx="13" transform="rotate(23 206 158)" fill="#232328" filter="url(#blurarm2)"/>
          <!-- HAND -->
          <ellipse cx="221" cy="208" rx="11" ry="12.5" fill="#ffe2b2" />
          <!-- SWORD -->
          <g class="sword-group">
            <!-- Sword trail animation (shows during swing) -->
            <path *ngIf="isSwinging"
                class="sword-trail"
                d="M 234 225 Q 272 173, 292 95" stroke="#00f2fe" stroke-width="12" stroke-linecap="round"
                filter="url(#trailglow)" opacity="0.33"/>
            <!-- Sword blade -->
            <rect x="227" y="189" width="10" height="52" rx="4" fill="#dbecf6" stroke="#ccc" stroke-width="2"
                  transform="rotate(-20 227 189)" filter="url(#swordshine)"/>
            <!-- Sword handle -->
            <rect x="230" y="238" width="4.5" height="20" rx="2.2" fill="#c29f60" />
          </g>
        </g>
        <!-- TORSO BELT -->
        <rect x="139" y="187" width="60" height="17" rx="7.5" fill="#e1364f" opacity="0.73"/>
        <!-- LEG Shadows -->
        <ellipse cx="130" cy="265" rx="17" ry="11" fill="#222d33" opacity="0.5" />
        <ellipse cx="203" cy="265" rx="17" ry="11" fill="#222d33" opacity="0.5" />
        <!-- LEGS -->
        <rect x="118" y="210" width="15" height="55" rx="7.8" fill="#24292B" />
        <rect x="197" y="210" width="15" height="55" rx="7.8" fill="#24292B" />
        <!-- SHOES -->
        <ellipse cx="125" cy="272" rx="11" ry="6" fill="#1dd8cf"/>
        <ellipse cx="205" cy="272" rx="11" ry="6" fill="#1dd8cf"/>
        <!-- NINJA SCARF tail -->
        <path d="M110,90 Q106,68 130,79" stroke="#ed21fa" stroke-width="8" fill="none" opacity="0.74"/>
        <!-- Sword cut EFFECT (show on swing) -->
        <g *ngIf="cutActive">
          <rect x="126" y="55" width="110" height="27" rx="13.5"
                fill="url(#glasscut)" filter="url(#cardblur)"/>
          <text x="135" y="75" font-size="18" font-family="Inter,sans-serif" fill="#ed21fa" font-weight="bold" opacity="0.93">CodeQuest!</text>
          <path d="M230,87 L144,59" stroke="#fb3640" stroke-width="4.2" filter="url(#cutglow)"/>
        </g>
        <!-- FILTERS & GRADIENTS -->
        <defs>
          <filter id="shadow1" x="-30%" y="-30%" width="180%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="9" flood-color="#00f2fe" flood-opacity="0.11" />
          </filter>
          <filter id="blurarm1"><feGaussianBlur stdDeviation="2" /></filter>
          <filter id="blurarm2"><feGaussianBlur stdDeviation="1.3" /></filter>
          <filter id="carve"><feDropShadow dx="3" dy="2" stdDeviation="3" flood-color="#fff" flood-opacity="0.08"/></filter>
          <filter id="trailglow"><feGaussianBlur stdDeviation="4" /></filter>
          <filter id="swordshine"><feGaussianBlur stdDeviation="0.6"/><feDropShadow dx="0" dy="0" stdDeviation="1" flood-color="#00f2fe" flood-opacity="0.25" /></filter>
          <filter id="cutglow"><feGaussianBlur stdDeviation="2.4" /></filter>
          <filter id="cardblur"><feGaussianBlur stdDeviation="7" /></filter>
          <linearGradient id="glasscut" x1="126" y1="67" x2="236" y2="59" gradientUnits="userSpaceOnUse">
            <stop stop-color="#ed21fa" stop-opacity="0.20"/>
            <stop offset="1" stop-color="#fff" stop-opacity="0.38"/>
          </linearGradient>
        </defs>
      </svg>
      <!-- Animate cut button for demo (tap anywhere to replay) -->
      <div class="ninja-text-overlay glass-card">
        <span class="cut-exclam">The Ninja strikes! <span class="swing-signal" *ngIf="isSwinging">⚡</span></span>
        <span class="cut-click-hint">(Click/tap to see the cut!)</span>
      </div>
    </div>
  `,
  styleUrls: ['./ninjacut.component.css']
})
export class NinjacutComponent {
  isSwinging = signal(false);
  cutActive = signal(false);

  constructor() {}

  // PUBLIC_INTERFACE
  startAnimation() {
    // Start sword swing and cut animation
    if (this.isSwinging.value) return;
    this.isSwinging.value = true;
    setTimeout(() => {
      this.cutActive.value = true; // Show cut halfway through swing
    }, 400);
    setTimeout(() => {
      this.cutActive.value = false;
    }, 1400);
  }

  // PUBLIC_INTERFACE
  onSwingEnd() {
    this.isSwinging.value = false;
    this.cutActive.value = false;
  }

  // On init, trigger swing after a short delay for entry, and tap to replay
  ngOnInit() {
    setTimeout(() => this.startAnimation(), 550);
  }
  // PUBLIC_INTERFACE
  // Allow tap anywhere on component to replay swing/cut
  // use host binding for accessibility
  onClick() {
    this.startAnimation();
  }
}

