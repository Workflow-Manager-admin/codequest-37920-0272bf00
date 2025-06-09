import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-ninjacut',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ninja-cut-hero-glassy" (click)="onClick()" tabindex="0" role="button" aria-label="Replay Ninja Animation">
      <!-- Modern Ninja Illustration: More realism and dynamic lifelike pose, glassmorphism harmonized -->
      <svg class="ninja-svg" viewBox="0 0 370 320" fill="none" xmlns="http://www.w3.org/2000/svg"
            [class.animate-swing]="isSwinging()" (animationend)="onSwingEnd()">
        <!-- Dynamic ground shadow -->
        <ellipse cx="185" cy="298" rx="78" ry="16" fill="#101E3B" opacity="0.24"/>
        <!-- Rear (support) leg, foreshortened with shoe -->
        <g filter="url(#subtleShadow)">
          <rect x="220" y="238" width="22" height="52" rx="10" fill="#1b2230" stroke="#12171f" stroke-width="2.5"/>
          <ellipse cx="230.5" cy="288" rx="13.2" ry="7.6" fill="#11eefd" stroke="#15181b" stroke-width="1.4"/>
        </g>
        <!-- Fore leg, angled, dynamic -->
        <g>
          <rect x="115" y="223" width="29" height="62" rx="10" fill="#242c32" stroke="#11151b" stroke-width="2.3"/>
          <ellipse cx="129" cy="285" rx="14.7" ry="8.2" fill="#21fbfc" stroke="#13161b" stroke-width="1.3"/>
        </g>
        <!-- Torso and hips (dynamic twist) -->
        <g>
          <path
            d="M184 110 Q201 144 198 210 Q195 282 154 253 Q144 216 153 158 Q163 120 184 110 Z"
            fill="url(#TorsoSkin)" stroke="#232b38" stroke-width="3.1" opacity="0.99"/>
          <ellipse cx="178" cy="200" rx="39" ry="23" fill="#23273a" />
        </g>
        <!-- Main belt and wrap -->
        <g>
          <rect x="142" y="210" rx="14" width="68" height="16" fill="#ff387a" opacity="0.84" filter="url(#pelvisshadow)"/>
          <ellipse cx="177" cy="220" rx="37" ry="13" fill="#1f2232" opacity="0.95"/>
        </g>
        <!-- Chest muscle highlight -->
        <path d="M182,152 Q192,183 207,179 Q188,187 181,174" fill="none" stroke="#54dbe7" stroke-width="6.5" opacity="0.13"/>
        <!-- Shoulders and arms -->
        <g id="forearm-left">
          <path d="M111,122 Q93,192 126,227 Q143,182 140,126 Z"
              fill="#191d29" stroke="#0b0e14" stroke-width="2.9" />
          <ellipse cx="117" cy="215" rx="14" ry="16.2" fill="#e3b687" stroke="#a37a41" stroke-width="1.5"/>
        </g>
        <!-- Sword arm: Animated! (slashing forward, perspective) -->
        <g class="sword-arm-group" [ngClass]="{ 'swinging': isSwinging() }">
          <path
            d="M229,122 Q248,164 262,210 Q293,211 266,157 Q238,120 229,122 Z"
            fill="#1a202b" stroke="#232b38" stroke-width="3.2" filter="url(#blurarm2)"/>
          <!-- Forearm and palm -->
          <ellipse cx="267" cy="210" rx="15.5" ry="12" fill="#efd2a8" stroke="#ba9155" stroke-width="1.6"/>
          <!-- Fingers gripping -->
          <ellipse cx="268" cy="220" rx="7.2" ry="2.2" fill="#fbe2c9" opacity="0.87" />
          <ellipse cx="273" cy="215" rx="2.4" ry="4.2" fill="#b4874a" opacity="0.28"/>
          <!-- Sword -->
          <g class="sword-group">
            <path *ngIf="isSwinging()" class="sword-trail"
              d="M 284 232 Q 322 155 346 29"
              stroke="#00fcff" stroke-width="19" stroke-linecap="round"
              filter="url(#trailglow)" opacity="0.44"/>
            <rect x="274" y="187" width="19" height="83" rx="3.2"
              fill="url(#blade)" stroke="url(#bladestroke)" stroke-width="2.6"
              transform="rotate(-13 283 187)" filter="url(#swordshine)"/>
            <rect x="285.6" y="194" width="4.3" height="66" rx="1.5"
              fill="#fff" opacity="0.17"
              transform="rotate(-13 285.5 194)"/>
            <rect x="281" y="258" width="8" height="27" rx="3.6"
              fill="url(#handlewrap)" stroke="#23232a" stroke-width="1.2"/>
            <ellipse cx="285.7" cy="283" rx="8.1" ry="3.5"
              fill="#ffd984" stroke="#fff" stroke-width="1.2"/>
          </g>
        </g>
        <!-- Hooded head: highly realistic anatomy and glassy rim light -->
        <g>
          <!-- Rear cowl shadow -->
          <ellipse cx="178" cy="64" rx="69" ry="63" fill="url(#hoodDarkGrad)" stroke="#11ffe9" stroke-width="2.2"/>
          <!-- Hood detail/hightlighted fold -->
          <path d="M111,51 Q150,28 208,43 Q266,64 241,105 Q208,90 120,90" fill="none" stroke="#67fff8" stroke-width="6" opacity="0.13"/>
          <ellipse cx="170" cy="46" rx="29" ry="9" fill="#353a66" opacity="0.15"/>
        </g>
        <!-- Face and mask, strong features and shadows -->
        <g>
          <ellipse cx="179" cy="88" rx="41" ry="30" fill="#e9ceab" stroke="#b4884a" stroke-width="1.8"/>
          <rect x="136" y="74" rx="10.75" width="90" height="34.5" fill="#191753"
             stroke="#18fff2" stroke-width="1.7" opacity="0.93"/>
          <!-- Left eye (alert, sharp) -->
          <ellipse cx="166.2" cy="92" rx="10" ry="6.6" fill="#fff"/>
          <ellipse cx="167.3" cy="93.3" rx="2.8" ry="3.2" fill="#27272a"/>
          <ellipse cx="168.8" cy="91.1" rx="1.2" ry="1.5" fill="#ccd" />
          <!-- Right eye (alert, sharp) -->
          <ellipse cx="193.4" cy="93" rx="10.1" ry="6.7" fill="#fff"/>
          <ellipse cx="192.1" cy="93.5" rx="2.2" ry="3.5" fill="#23242e"/>
          <ellipse cx="194.2" cy="90.2" rx="1.2" ry="1.6" fill="#ccd" />
          <!-- Eyebrows (focused, thick and slanted for aggression) -->
          <path d="M160,80 Q166,77 170,84" stroke="#181819" stroke-width="3.5" />
          <path d="M189,84 Q193,80 200,83" stroke="#232323" stroke-width="3.2" />
          <!-- Jaw, shadows, cheekbones -->
          <ellipse cx="155" cy="105" rx="8" ry="4.5" fill="#232128" opacity="0.15"/>
          <ellipse cx="204" cy="105" rx="7" ry="4.8" fill="#23212C" opacity="0.12"/>
          <path d="M180,98 Q180,105 177,110" stroke="#efdcb8" stroke-width="1.3"/>
        </g>
        <!-- Dynamic scarf trailing to side, with neon tint -->
        <path d="M99,69 Q75,60 161,62 Q123,63 85,74 Q104,90 131,88"
          stroke="#d42fff" stroke-width="13" fill="none" opacity="0.81"/>
        <path d="M246,75 Q328,60 340,47 Q344,66 256,107" stroke="#bb20fa" stroke-width="8" fill="none" opacity="0.47"/>
        <!-- On sword cut, animate neon glassy slash with text -->
        <g *ngIf="cutActive()">
          <rect x="149" y="51" width="117" height="32" rx="16"
              fill="url(#glasscut)" filter="url(#cardblur)"/>
          <text x="162" y="74" font-size="22" font-family="Oxanium,Inter,sans-serif"
            fill="#25fcff" font-weight="bolder" opacity="0.99" style="filter: drop-shadow(0 0 11px #19f9ffbb) drop-shadow(0 2px 8px #b25dffcc); letter-spacing:0.06em;">CodeQuest!</text>
          <path d="M267,104 L172,63" stroke="#23e4fd" stroke-width="4.6" filter="url(#cutglow)"/>
        </g>
        <defs>
          <filter id="pelvisshadow"><feGaussianBlur stdDeviation="2.7"/></filter>
          <filter id="blurarm2"><feGaussianBlur stdDeviation="2.8" /></filter>
          <filter id="subtleShadow"><feDropShadow dx="0" dy="8" stdDeviation="7" flood-color="#00f2fe" flood-opacity="0.16" /></filter>
          <filter id="trailglow"><feGaussianBlur stdDeviation="9.8" /></filter>
          <filter id="swordshine"><feGaussianBlur stdDeviation="2.5"/><feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#00f2fe" flood-opacity="0.39" /></filter>
          <filter id="cutglow"><feGaussianBlur stdDeviation="4.5" /></filter>
          <filter id="cardblur"><feGaussianBlur stdDeviation="13" /></filter>
          <radialGradient id="hoodDarkGrad" cx="60%" cy="47%" r="81%">
            <stop offset="0%" stop-color="#181c23" />
            <stop offset="55%" stop-color="#1d2430" />
            <stop offset="100%" stop-color="#0e061a" />
          </radialGradient>
          <linearGradient id="TorsoSkin" x1="140" y1="85" x2="220" y2="260" gradientUnits="userSpaceOnUse">
            <stop stop-color="#1b263d"/>
            <stop offset="0.34" stop-color="#0f162e"/>
            <stop offset="1" stop-color="#23282F"/>
          </linearGradient>
          <linearGradient id="blade" x1="274" y1="187" x2="295" y2="270">
            <stop stop-color="#f6fafe"/>
            <stop offset="0.44" stop-color="#b4e8fc"/>
            <stop offset="0.8" stop-color="#b7e7fb"/>
            <stop offset="1" stop-color="#91b8ca"/>
          </linearGradient>
          <linearGradient id="bladestroke" x1="274" y1="187" x2="298" y2="270">
            <stop stop-color="#85c7f2"/>
            <stop offset="1" stop-color="#18fffd"/>
          </linearGradient>
          <linearGradient id="handlewrap" x1="281" y1="258" x2="281" y2="285">
            <stop stop-color="#6f5641"/>
            <stop offset="0.5" stop-color="#dfd6b4"/>
            <stop offset="1" stop-color="#4e3720"/>
          </linearGradient>
          <linearGradient id="glasscut" x1="149" y1="67" x2="266" y2="89" gradientUnits="userSpaceOnUse">
            <stop stop-color="#25fcff" stop-opacity="0.39"/>
            <stop offset="0.54" stop-color="#b25dff" stop-opacity="0.21"/>
            <stop offset="1" stop-color="#fff" stop-opacity="0.31"/>
          </linearGradient>
        </defs>
      </svg>
      <!-- Interactive hint overlay -->
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
