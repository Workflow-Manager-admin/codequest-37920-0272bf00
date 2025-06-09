import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-ninjacut',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ninja-cut-hero-glassy" (click)="onClick()" tabindex="0" role="button" aria-label="Replay Ninja Animation">
      <!-- Ninja Illustration (Highly realistic SVG) -->
      <svg class="ninja-svg" viewBox="0 0 350 300" fill="none" xmlns="http://www.w3.org/2000/svg"
            [class.animate-swing]="isSwinging()" (animationend)="onSwingEnd()">
        <!-- Shadow below foot -->
        <ellipse cx="170" cy="275" rx="62" ry="15" fill="#26364B" opacity="0.29" />
        <!-- Ninja Body (more anatomical, muscled definition, body suit highlights, complex gradients) -->
        <g>
          <!-- Torso -->
          <path
            d="M154,165 Q150,204 172,256 Q204,242 202,180 Q200,145 154,165 Z"
            fill="url(#bodyGradient)"
            stroke="#191f24" stroke-width="2.8"
            filter="url(#bodyshadow)"
            opacity="0.98"/>
          <!-- Chest/abs highlight -->
          <path
            d="M162,182 Q172,223 182,182"
            fill="none"
            stroke="#316979"
            stroke-width="8"
            opacity="0.06"/>
        </g>
        <!-- Pelvis and wrap -->
        <ellipse cx="174" cy="210" rx="35" ry="21" fill="#24272E" opacity="0.93" filter="url(#pelvisshadow)"/>
        <rect x="144" y="203" rx="7" width="54" height="13" fill="#d63a45" opacity="0.77"/>
        <!-- Hips contour -->
        <path d="M139,211 Q153,234 174,227 Q194,231 206,212" fill="none" stroke="#2f384c" stroke-width="6" opacity="0.20"/>
        <!-- Highly detailed HEAD: nose, brow, muscle lines, shadowed mask, cheekbone -->
        <g>
          <!-- Hood/cowl -->
          <ellipse cx="174" cy="96" rx="63" ry="64" fill="url(#hoodColorDark)" stroke="#0ff2dc" stroke-width="2.2"/>
          <!-- Hood folds/highlights -->
          <path d="M108,87 Q142,53 190,58 Q225,64 230,104 Q215,110 175,117" fill="none" stroke="#3de2d6" stroke-width="5.3" opacity="0.12"/>
          <ellipse cx="163" cy="66" rx="19" ry="7" fill="#242d3e" opacity="0.26" />
        </g>
        <!-- Face (realistic, strong jaw, visible eyebrows, shaded) -->
        <g>
          <!-- Face skin (visible under mask) -->
          <ellipse cx="174" cy="99" rx="38" ry="27" fill="#e8cdab" stroke="#b4874a" stroke-width="1.5" />
          <!-- Mask band high-res -->
          <rect x="111" y="86.5" rx="9.5" width="127" height="32" fill="#161943" stroke="#2ceed0" stroke-width="1.6" opacity="0.87"/>
          <!-- Eyes left -->
          <ellipse cx="160" cy="98" rx="11.5" ry="7.2" fill="#fff"/>
          <ellipse cx="159.9" cy="99.7" rx="3.2" ry="3.8" fill="#24252a"/>
          <ellipse cx="162" cy="96.8" rx="1.0" ry="1.5" fill="#ccd" />
          <!-- Eyes right -->
          <ellipse cx="188" cy="98" rx="11.5" ry="7.1" fill="#fff"/>
          <ellipse cx="188.2" cy="99.7" rx="3.2" ry="3.8" fill="#24252a"/>
          <ellipse cx="190" cy="96.8" rx="1.0" ry="1.5" fill="#ccd" />
          <!-- Brows (intense, thick) -->
          <path d="M152,91 Q158,90 164,95" stroke="#343936" stroke-width="3.1" />
          <path d="M182,94 Q186,88 195,91" stroke="#343936" stroke-width="3.1" />
          <!-- Nose bridge highlight -->
          <path d="M174,100 Q178,103 174,108" stroke="#e8cdab" stroke-width="1.2"/>
          <!-- Masked cheek shadow -->
          <ellipse cx="154" cy="108" rx="6.5" ry="3.5" fill="#24212C" opacity="0.22"/>
          <ellipse cx="194" cy="108" rx="6.5" ry="3.5" fill="#24212C" opacity="0.20"/>
        </g>
        <!-- Realistic scarf, winding around head with trailing -->
        <path d="M110,68 Q98,48 143,55 Q121,60 107,63 Q115,82 128,84" stroke="#ed21fa" stroke-width="10" fill="none" opacity="0.82"/>
        <path d="M238,98 Q296,82 310,69 Q307,82 242,115" stroke="#ed21fa" stroke-width="7" fill="none" opacity="0.44"/>
        <!-- Left arm (realistic muscles) -->
        <g>
          <path d="M114,133 Q96,186 122,216 Q138,177 137,133" fill="#181c23" stroke="#0d131a" stroke-width="2.5"/>
          <ellipse cx="120" cy="200" rx="13.5" ry="15.5" fill="#e5c6ac" stroke="#b4874a" stroke-width="1.2"/>
        </g>
        <!-- Right arm with SWORD (animated group, realistic form) -->
        <g class="sword-arm-group" [ngClass]="{ 'swinging': isSwinging() }">
          <!-- Right upper arm & forearm -->
          <path d="M212,120 Q225,175 237,196 Q255,189 247,146 Q236,122 212,120 Z"
                fill="#181c21" stroke="#3f4245" stroke-width="2.4" filter="url(#blurarm2)"/>
          <!-- Hand (gripping sword, knuckles detailed, wrist) -->
          <ellipse cx="243" cy="201" rx="13" ry="10.5" fill="#e4c29f" stroke="#b4874a" stroke-width="1.2"/>
          <!-- SWORD: Handle and blade -->
          <g class="sword-group">
            <!-- Sword trail animation (shows during swing) -->
            <path *ngIf="isSwinging()"
                  class="sword-trail"
                  d="M 256 225 Q 292 172 320 77"
                  stroke="#00f2fe" stroke-width="16" stroke-linecap="round"
                  filter="url(#trailglow)" opacity="0.33"/>
            <!-- Sword blade, metallic gradients and shine -->
            <rect x="251" y="174" width="14" height="70" rx="2.8"
              fill="url(#blade)" stroke="url(#bladestroke)" stroke-width="2.2"
              transform="rotate(-18 251 174)" filter="url(#swordshine)"/>
            <!-- Blade edge -->
            <rect x="258.5" y="175.5" width="3.8" height="66" rx="1.3"
              fill="#fff" opacity="0.24"
              transform="rotate(-18 258.5 175.5)"/>
            <!-- Sword handle (fabric-wrapped + pommel) -->
            <rect x="257" y="238" width="6.8" height="27" rx="3"
              fill="url(#handlewrap)" stroke="#24252a" stroke-width="1"/>
            <ellipse cx="260.2" cy="263.2" rx="7.2" ry="2.8"
              fill="#e5c983" stroke="#fff" stroke-width="1"/>
          </g>
        </g>
        <!-- Right leg -->
        <rect x="191" y="233" width="16" height="43" rx="8" fill="#222931" stroke="#191f24" stroke-width="2"/>
        <!-- Left leg -->
        <rect x="143" y="238" width="15.5" height="41" rx="7.2" fill="#222931" stroke="#191f24" stroke-width="2"/>
        <!-- Right shoe -->
        <ellipse cx="199.2" cy="274" rx="12.2" ry="7.2" fill="#18d8de" stroke="#10151b" stroke-width="1.1"/>
        <!-- Left shoe -->
        <ellipse cx="150.8" cy="276" rx="12.2" ry="7.2" fill="#18d8de" stroke="#10151b" stroke-width="1.1"/>
        <!-- On sword cut, animate neon glassy slash with text -->
        <g *ngIf="cutActive()">
          <rect x="129" y="71" width="117" height="32" rx="15"
              fill="url(#glasscut)" filter="url(#cardblur)"/>
          <text x="145" y="93" font-size="22" font-family="Inter,sans-serif"
            fill="#ed21fa" font-weight="bolder" opacity="0.95">CodeQuest!</text>
          <path d="M239,115 L168,87" stroke="#fb3640" stroke-width="4.6" filter="url(#cutglow)"/>
        </g>
        <defs>
          <filter id="bodyshadow" x="-20%" y="-25%" width="140%" height="140%">
            <feDropShadow dx="0" dy="12" stdDeviation="13" flood-color="#00f2fe" flood-opacity="0.09" />
          </filter>
          <filter id="pelvisshadow"><feGaussianBlur stdDeviation="2.4"/></filter>
          <filter id="blurarm2"><feGaussianBlur stdDeviation="2.1" /></filter>
          <filter id="trailglow"><feGaussianBlur stdDeviation="9" /></filter>
          <filter id="swordshine"><feGaussianBlur stdDeviation="1.7"/><feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#00f2fe" flood-opacity="0.24" /></filter>
          <filter id="cutglow"><feGaussianBlur stdDeviation="3.6" /></filter>
          <filter id="cardblur"><feGaussianBlur stdDeviation="11" /></filter>
          <radialGradient id="hoodColorDark" cx="60%" cy="48%" r="83%">
            <stop offset="0%" stop-color="#181c23" />
            <stop offset="66%" stop-color="#131821" />
            <stop offset="100%" stop-color="#222630" />
          </radialGradient>
          <linearGradient id="bodyGradient" x1="130" y1="150" x2="205" y2="260" gradientUnits="userSpaceOnUse">
            <stop stop-color="#23272E" />
            <stop offset="1" stop-color="#22252B" />
          </linearGradient>
          <linearGradient id="blade" x1="251" y1="174" x2="265" y2="245">
            <stop stop-color="#e6eef1"/>
            <stop offset="0.44" stop-color="#bfc8cb"/>
            <stop offset="0.7" stop-color="#d1eeff"/>
            <stop offset="1" stop-color="#aabac6"/>
          </linearGradient>
          <linearGradient id="bladestroke" x1="251" y1="174" x2="265" y2="245">
            <stop stop-color="#8dc4e6"/>
            <stop offset="1" stop-color="#1caedd"/>
          </linearGradient>
          <linearGradient id="handlewrap" x1="257" y1="238" x2="257" y2="265">
            <stop stop-color="#514324"/>
            <stop offset="0.5" stop-color="#cfb684"/>
            <stop offset="1" stop-color="#6a5740"/>
          </linearGradient>
          <linearGradient id="glasscut" x1="129" y1="97" x2="246" y2="75" gradientUnits="userSpaceOnUse">
            <stop stop-color="#ed21fa" stop-opacity="0.22"/>
            <stop offset="1" stop-color="#fff" stop-opacity="0.42"/>
          </linearGradient>
        </defs>
      </svg>
      <!-- Animate cut button for demo (tap anywhere to replay) -->
      <div class="ninja-text-overlay glass-card">
        <span class="cut-exclam">The Ninja strikes! <span class="swing-signal" *ngIf="isSwinging()">⚡</span></span>
        <span class="cut-click-hint">(Click/tap to see the cut!)</span>
      </div>
    </div>
  `,
  styleUrls: ['./ninjacut.component.css']
})
export class NinjacutComponent {
  // Boolean signals for animation state
  isSwinging = signal(false);
  cutActive = signal(false);

  // PUBLIC_INTERFACE
  startAnimation() {
    // Start sword swing and cut animation
    if (this.isSwinging()) return;
    this.isSwinging.set(true);
    globalThis.setTimeout(() => {
      this.cutActive.set(true);
    }, 400);
    globalThis.setTimeout(() => {
      this.cutActive.set(false);
    }, 1400);
  }

  // PUBLIC_INTERFACE
  onSwingEnd() {
    this.isSwinging.set(false);
    this.cutActive.set(false);
  }

  ngOnInit() {
    globalThis.setTimeout(() => this.startAnimation(), 550);
  }

  // PUBLIC_INTERFACE
  onClick() {
    this.startAnimation();
  }
}
