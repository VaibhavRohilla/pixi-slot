// import { Container, Graphics } from 'pixi.js';
// import { Scene } from '../core/Scene';
// import { physicsManager } from '../core/PhysicsManager';
// import { global } from '../Global';

// export class PhysicsScene extends Scene {
//   private physicsBodies: Matter.Body[] = [];
//   private graphics: Graphics;

//   constructor() {
//     super('PhysicsScene');
//     this.graphics = new Graphics();
//     this.addChild(this.graphics);
//   }

//   public init(): void {
//     // Create some physics objects
//     const box1 = physicsManager.createBox(400, 200, 80, 80);
//     const box2 = physicsManager.createBox(500, 100, 60, 60);
//     const circle = physicsManager.createCircle(300, 300, 30);

//     this.physicsBodies.push(box1, box2, circle);

//     // Start the physics engine
//     physicsManager.start();
//   }

//   protected onUpdate(delta: number): void {
//     // Clear previous frame
//     this.graphics.clear();

//     // Draw all physics bodies
//     this.graphics.beginFill(0xff0000);
//     this.physicsBodies.forEach(body => {
//       if (body.circleRadius) {
//         // Draw circle
//         this.graphics.drawCircle(body.position.x, body.position.y, body.circleRadius);
//       } else {
//         // Draw rectangle
//         this.graphics.drawRect(
//           body.position.x - body.bounds.max.x + body.bounds.min.x,
//           body.position.y - body.bounds.max.y + body.bounds.min.y,
//           body.bounds.max.x - body.bounds.min.x,
//           body.bounds.max.y - body.bounds.min.y
//         );
//       }
//     });
//     this.graphics.endFill();
//   }

//   protected onResize(): void {
//     // Handle resize if needed
//   }

//   public stop(): void {
//     // Stop the physics engine
//     physicsManager.stop();

//     // Remove all physics bodies
//     this.physicsBodies.forEach(body => {
//       physicsManager.removeBody(body);
//     });
//     this.physicsBodies = [];
//   }
// }
