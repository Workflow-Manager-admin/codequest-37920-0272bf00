import {
  Component,
  ElementRef,
  NgZone,
  ViewChild,
  OnInit,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import * as THREE from 'three';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-ninja3d',
  standalone: true,
  template: `
    <div class="ninja-3d-canvas-wrap">
      <canvas #ninjaCanvas class="ninja-canvas"></canvas>
    </div>
  `,
  styles: [`
    .ninja-3d-canvas-wrap {
      width: 360px;
      height: 320px;
      max-width: 95vw;
      margin: 0 auto 1.5rem auto;
      background: rgba(24, 26, 32, 0.38);
      border-radius: 2rem;
      overflow: hidden;
      box-shadow: 0 0 24px 2px #00f2fe44, 0 2px 36px 0 #ed21fa33;
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid rgba(255,255,255,0.11);
      backdrop-filter: blur(10px);
    }
    .ninja-canvas {
      width: 100%;
      height: 100%;
      display: block;
      background: transparent;
      border-radius: 2rem;
      outline: none;
    }
  `]
})
export class Ninja3dComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('ninjaCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private animationId: any;

  private ninjaGroup = new THREE.Group();
  private swordGroup = new THREE.Group();
  private swordMesh!: THREE.Mesh;

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initThreeJs();
    // SSR Safe: Only run animation if running in the browser
    if (typeof window !== 'undefined') {
      this.ngZone.runOutsideAngular(() => this.animate());
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined' && this.animationId) {
      window.cancelAnimationFrame(this.animationId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  /**
   * Set up the Three.js renderer, camera, scene, and objects.
   */
  private initThreeJs() {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.offsetWidth || 360;
    const height = canvas.offsetHeight || 320;

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: false });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000000, 0); // Transparent bg
    this.renderer.setSize(width, height);

    // Set up scene
    this.scene = new THREE.Scene();

    // Add cartoon-style ambient and directional lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.85);
    const directional = new THREE.DirectionalLight(0xffffff, 1);
    directional.position.set(3, 6, 8);
    directional.castShadow = true;
    this.scene.add(ambient);
    this.scene.add(directional);

    // Add cartoon rim light for style
    const rimLight = new THREE.DirectionalLight(0x00f2fe, 0.66);
    rimLight.position.set(-5, 7, 9);
    this.scene.add(rimLight);

    // Camera
    this.camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    this.camera.position.set(0, 1, 7);
    this.camera.lookAt(0, 1, 0);

    // Build ninja mesh
    this.buildCartoonNinja();

    // Place ninja Group in scene
    this.scene.add(this.ninjaGroup);

    // Optionally enable glow/outline/trail hooks in future
    // (postprocessing composer could be added here)

    // Responsiveness
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.onResize());
    }
  }

  /**
   * Main ninja creation function (cartoon style, sharp and vibrant using Phong/ToonMaterial)
   */
  private buildCartoonNinja() {
    this.ninjaGroup.clear(); // Start fresh

    // Color palette
    const cBlack = 0x181B20;
    const cPurple = 0x533aaa;
    const cVibrantBlue = 0x00f2fe;
    const cSkin = 0xffe2b2;
    const cRed = 0xfb3640;
    const cWhite = 0xffffff;
    const cAccent = 0xed21fa;

    // Head
    const headGeom = new THREE.SphereGeometry(1, 56, 40);
    const headMat = new THREE.MeshToonMaterial({ color: cBlack });
    const head = new THREE.Mesh(headGeom, headMat);
    head.position.set(0, 1.68, 0);
    this.ninjaGroup.add(head);

    // Face mask
    const maskGeom = new THREE.TorusGeometry(0.8, 0.22, 16, 48, Math.PI * 1.14);
    const maskMat = new THREE.MeshToonMaterial({ color: cPurple });
    const faceMask = new THREE.Mesh(maskGeom, maskMat);
    faceMask.position.set(0, 1.38, 0.63);
    faceMask.rotation.x = Math.PI / 2.22;
    this.ninjaGroup.add(faceMask);

    // Face/skin
    const faceGeom = new THREE.SphereGeometry(0.49, 32, 24, 0, Math.PI * 2, 0, Math.PI * 1.23);
    const faceMat = new THREE.MeshToonMaterial({ color: cSkin });
    const face = new THREE.Mesh(faceGeom, faceMat);
    face.position.set(0, 1.68, 0.86);
    this.ninjaGroup.add(face);

    // Eyes (cartoon: slightly oversized)
    const eyeGeom = new THREE.SphereGeometry(0.13, 18, 18);
    const eyeWhiteMat = new THREE.MeshToonMaterial({ color: cWhite });
    const eyeballL = new THREE.Mesh(eyeGeom, eyeWhiteMat);
    const eyeballR = eyeballL.clone();

    eyeballL.position.set(-0.23, 1.80, 1.2);
    eyeballR.position.set(0.23, 1.80, 1.2);

    const irisGeom = new THREE.SphereGeometry(0.07, 8, 8);
    const irisMat = new THREE.MeshToonMaterial({ color: cPurple });
    const irisL = new THREE.Mesh(irisGeom, irisMat);
    irisL.position.set(-0.23, 1.80, 1.29);
    const irisR = irisL.clone();
    irisR.position.x = 0.23;

    this.ninjaGroup.add(eyeballL, eyeballR, irisL, irisR);

    // Brows
    const browGeom = new THREE.CylinderGeometry(0.10, 0.18, 0.048, 8);
    const browMat = new THREE.MeshToonMaterial({ color: cAccent });
    const browL = new THREE.Mesh(browGeom, browMat);
    browL.rotation.z = Math.PI / 12;
    browL.position.set(-0.22, 1.94, 1.13);
    const browR = browL.clone();
    browR.position.set(0.22, 1.94, 1.13);
    browR.rotation.z = -Math.PI / 12;
    this.ninjaGroup.add(browL, browR);

    // Body (torso)
    const bodyGeom = new THREE.CapsuleGeometry(0.61, 1.08, 24, 30);
    const bodyMat = new THREE.MeshToonMaterial({ color: cBlack });
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    body.position.set(0, 0.0, 0);
    this.ninjaGroup.add(body);

    // Belt
    const beltGeom = new THREE.TorusGeometry(0.45, 0.095, 10, 22);
    const beltMat = new THREE.MeshToonMaterial({ color: cRed });
    const belt = new THREE.Mesh(beltGeom, beltMat);
    belt.position.set(0, -0.7, 0);
    this.ninjaGroup.add(belt);

    // Arms
    const upperArmGeom = new THREE.CylinderGeometry(0.15, 0.2, 0.70, 16);
    const upperArmMat = new THREE.MeshToonMaterial({ color: cBlack });
    // Left arm
    const leftArm = new THREE.Mesh(upperArmGeom, upperArmMat);
    leftArm.position.set(-0.82, 0.85, 0.07);
    leftArm.rotation.z = Math.PI / 5.2;
    leftArm.rotation.x = Math.PI / 12;
    // Right arm - holding sword
    const rightArm = new THREE.Mesh(upperArmGeom, upperArmMat);
    rightArm.position.set(0.82, 0.88, 0.07);
    rightArm.rotation.z = -Math.PI / 5.2;
    rightArm.rotation.x = Math.PI / 16;
    this.ninjaGroup.add(leftArm, rightArm);

    // Hands (simple spheres)
    const handGeom = new THREE.SphereGeometry(0.16, 18, 16);
    const handMat = new THREE.MeshToonMaterial({ color: cSkin });
    const leftHand = new THREE.Mesh(handGeom, handMat);
    leftHand.position.set(-1.15, 0.49, 0.13);
    const rightHand = new THREE.Mesh(handGeom, handMat);
    rightHand.position.set(1.15, 0.52, 0.07);
    this.ninjaGroup.add(leftHand, rightHand);

    // Sword (held in right hand)
    this.swordGroup.clear();
    const swordHandleGeom = new THREE.CylinderGeometry(0.04, 0.05, 0.35, 10);
    const swordHandleMat = new THREE.MeshToonMaterial({ color: cAccent });
    const swordHandle = new THREE.Mesh(swordHandleGeom, swordHandleMat);
    swordHandle.position.set(0, 0.23, 0);

    const swordGuardGeom = new THREE.TorusGeometry(0.07, 0.018, 7, 12);
    const swordGuardMat = new THREE.MeshToonMaterial({ color: 0xdcd915 });
    const swordGuard = new THREE.Mesh(swordGuardGeom, swordGuardMat);
    swordGuard.position.set(0, 0.05, 0);

    const swordBladeGeom = new THREE.BoxGeometry(0.06, 0.70, 0.15);
    const swordBladeMat = new THREE.MeshToonMaterial({ color: 0xc0eaff });
    this.swordMesh = new THREE.Mesh(swordBladeGeom, swordBladeMat);
    this.swordMesh.position.set(0, -0.40, 0);
    this.swordMesh.castShadow = true;
    this.swordMesh.receiveShadow = false;

    this.swordGroup.add(swordHandle, swordGuard, this.swordMesh);
    this.swordGroup.position.set(1.32, 0.32, 0.04);
    this.swordGroup.rotation.set(0.22, 0, -Math.PI / 4.2);

    this.ninjaGroup.add(this.swordGroup);

    // Legs
    const legGeom = new THREE.CylinderGeometry(0.18, 0.19, 0.8, 16);
    const legMat = new THREE.MeshToonMaterial({ color: cBlack });
    const leftLeg = new THREE.Mesh(legGeom, legMat);
    leftLeg.position.set(-0.32, -1.17, 0);
    leftLeg.rotation.x = Math.PI / 14;
    const rightLeg = leftLeg.clone();
    rightLeg.position.x = 0.32;
    this.ninjaGroup.add(leftLeg, rightLeg);

    // Shoes
    const shoeGeom = new THREE.SphereGeometry(0.14, 14, 12, 0, Math.PI * 2, 0, Math.PI * 1.11);
    const shoeMat = new THREE.MeshToonMaterial({ color: cPurple });
    const leftShoe = new THREE.Mesh(shoeGeom, shoeMat);
    leftShoe.position.set(-0.32, -1.62, 0.07);
    const rightShoe = leftShoe.clone();
    rightShoe.position.x = 0.32;
    this.ninjaGroup.add(leftShoe, rightShoe);

    // Neon accent scarf
    const scarfGeom = new THREE.TorusGeometry(0.37, 0.09, 11, 29, 2.07);
    const scarfMat = new THREE.MeshToonMaterial({ color: cVibrantBlue });
    const scarf = new THREE.Mesh(scarfGeom, scarfMat);
    scarf.position.set(0, 1.05, 0.3);
    scarf.rotation.x = 2.15;
    this.ninjaGroup.add(scarf);

    // Overall pose & shadows
    this.ninjaGroup.position.set(0, 0.42, 0);
    this.ninjaGroup.scale.set(1.18, 1.18, 1.18);
    this.ninjaGroup.rotation.y = Math.PI / 13;
  }

  /**
   * Animation loop for real-time sword rotation and light cartoon bobble effect.
   */
  private animate = () => {
    let now = 0;
    if (typeof performance !== 'undefined') {
      now = performance.now();
    }
    // Animate sword rotation
    if (this.swordGroup) {
      // Let the sword rotate smoothly about Y (vertical axis)
      this.swordGroup.rotation.y += 0.055;
      // Optionally: add some up/down oscillation for more dynamic effect
      this.swordGroup.position.y = 0.32 + 0.09 * Math.sin(now * 0.0022);
    }
    // Ninja bobble
    if (this.ninjaGroup) {
      this.ninjaGroup.rotation.y = Math.PI / 13 + Math.sin(now / 1700) * 0.15;
      this.ninjaGroup.position.y = 0.42 + Math.sin(now / 1460) * 0.045;
    }

    this.renderer.render(this.scene, this.camera);
    if (typeof window !== 'undefined' && window.requestAnimationFrame) {
      this.animationId = window.requestAnimationFrame(this.animate);
    }
  };

  private onResize() {
    const canvas = this.canvasRef.nativeElement;
    if (!canvas || !this.camera || !this.renderer) return;
    const width = canvas.parentElement ? canvas.parentElement.clientWidth : canvas.width;
    const height = canvas.parentElement ? canvas.parentElement.clientHeight : canvas.height;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  // PUBLIC_INTERFACE
  public triggerSwordGlowEffect() {
    /** Hook: Triggers a sword glow effect (to be implemented in future: trails, particle, outline) */
    // Future ready: add glow postprocessing/effect logic here
  }

  // PUBLIC_INTERFACE
  public triggerInteraction() {
    /** Hook for external UI triggers (placeholder for future extensibility) */
    // Implement further effect triggers as wanted
  }
}
