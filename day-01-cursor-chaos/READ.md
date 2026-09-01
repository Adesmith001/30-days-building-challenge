## What I Learned Technically

Building Cursor Chaos taught me a lot about combining a physics engine with a real-time 3D rendering system.

The biggest lesson was learning how to keep **Matter.js and Three.js synchronized**. Matter.js handled the actual physics — position, velocity, collisions, gravity and rotation — while Three.js handled what the user saw. On every animation frame, I had to update each Three.js mesh using the position and angle of its corresponding Matter.js body.

I also learned more about **real-time animation loops** and why simulation logic should not depend directly on React's render cycle. The physics world needs to update continuously, often around 60 times per second, so keeping that logic separate from regular React state helped avoid unnecessary re-renders and made the simulation much smoother.

Another major area was **pointer velocity and force calculations**. Instead of simply making objects follow the cursor, I tracked the cursor's previous and current positions to calculate its speed and direction. That velocity could then be converted into forces applied to nearby objects, which made fast cursor movements feel much more powerful than slow movements.

I also experimented with different types of **force fields**. Attraction pulls objects toward the cursor, repulsion pushes them away, while the vortex combines inward force with sideways or tangential force to create an orbiting effect. This helped me better understand how combining relatively simple vectors can produce much more interesting physical behaviour.

Working with gravity also made me think beyond the usual downward force. By changing the gravity vector itself, the same physics world could suddenly behave completely differently — objects could fall upward, sideways or float with gravity disabled.

I got more practical experience with **collision behaviour, friction, restitution, mass and momentum** as well. Small changes to these values completely changed how satisfying the simulation felt, so tuning physics became as much of a design problem as a technical one.

Another important lesson was **coordinate-system mapping**. Browser pointer coordinates, Matter.js world coordinates and Three.js scene coordinates do not automatically represent space in exactly the same way, so translating pointer positions correctly into the physics world was necessary for accurate interaction.

I also had to think about **performance**. Real-time physics, 3D meshes, shadows, collisions and visual effects can become expensive quickly. This meant limiting the number of bodies, avoiding unnecessary React state updates and keeping most updates inside the animation loop.

Overall, the project gave me practical experience with:

- Three.js and WebGL-based rendering
- Matter.js physics simulation
- synchronizing physics bodies with 3D meshes
- `requestAnimationFrame` and real-time update loops
- pointer tracking and cursor-velocity calculations
- vector-based forces
- attraction, repulsion and vortex mechanics
- gravity vectors
- collision detection and response
- mass, momentum, friction and restitution
- coordinate-system conversion
- performance optimization for interactive graphics
- separating React UI state from high-frequency simulation state

The biggest takeaway was that interactive experiences often look simple from the outside, but making them feel natural requires a combination of **physics, mathematics, rendering, performance work and interaction design**.