export const generateExportedHTML = (
  modelUrl: string,
  includeScrollControls: boolean,
  includeMovementInstructions: boolean,
  waypoints: Array<{
    x: number;
    y: number;
    z: number;
    rotation: { x: number; y: number; z: number; w: number };
    interactions: Array<{ type: string; data: any }>;
  }>,
  backgroundColor: string,
  cameraMovementSpeed: number,
  cameraRotationSensitivity: number,
  scrollSpeed: number,
  animationFrames: number,
  hotspots: Array<{
    id: string;
    position: { _x: number; _y: number; _z: number };
    scale: { _x: number; _y: number; _z: number };
    title: string;
    information?: string;
    photoUrl?: string;
    activationMode: "click" | "hover";
    color: string;
  }>,
  defaultCameraMode: "tour" | "explore" | "auto" = "explore",
  cameraDampeningRef: number,
  uiColor: string,
) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Exported Scene</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <style>
    body, html { margin: 0; padding: 0; overflow: hidden; width: 100%; height: 100%; font-family: Arial, sans-serif; }
    #renderCanvas { width: 100%; height: 100%; touch-action: none; }
    ${
      includeMovementInstructions
        ? `
    .ui-overlay {
      position: absolute;
      top: 10px;
      left: 10px;
      background-color: rgba(0,0,0,0.7);
      padding: 15px;
      border-radius: 10px;
      color: white;
      z-index: 10;
      font-size: 14px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    `
        : ""
    }
    #hotspotContent {
      position: fixed;
      background-color: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 20px;
      border-radius: 10px;
      z-index: 1001;
      max-width: 300px;
      box-shadow: 0 0 10px rgba(0,0,0,0.5);
      display: none;
      font-size: 14px;
    }
    #infoPopup {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 20px;
      border-radius: 10px;
      z-index: 1002;
      max-width: 80%;
      box-shadow: 0 0 10px rgba(0,0,0,0.5);
      display: none;
      font-size: 16px;
    }
    #scrollControls {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    #toggleCameraModeContainer {
      margin-bottom: 10px;
    }

    #scrollControlsContent,
    #exploreControlsContent {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: opacity 0.3s ease-in-out;
      width: 100%;
    }

    #scrollControlsContent.hidden,
    #exploreControlsContent.hidden {
      opacity: 0;
      pointer-events: none;
      position: absolute;
    }

    #exploreControlsContent p {
      color: white;
      font-size: 14px;
      text-align: center;
      margin: 0;
    }
    ${
      includeScrollControls
        ? `
    #scrollControls {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: rgba(0,0,0,0.7);
      padding: 15px;
      border-radius: 10px;
      color: white;
      z-index: 10;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    #scrollPercentage {
      font-size: 18px;
      margin-bottom: 10px;
    }
    #progressBarContainer {
      width: 200px;
      height: 10px;
      background-color: rgba(255,255,255,0.3);
      border-radius: 5px;
      overflow: hidden;
      margin-bottom: 10px;
    }
    #progressBar {
      width: 0%;
      height: 100%;
      background-color: ${uiColor};
      transition: width 0.3s ease;
    }
    .button {
      background-color: ${uiColor};
      border: none;
      color: white;
      padding: 10px 20px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      cursor: pointer;
      border-radius: 5px;
      transition: background-color 0.3s;
    }
    .button:hover {
       background-color: ${adjustColorBrightness(uiColor, -20)};
    }
    #scrollButtons {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
    `
        : ""
    }
    #muteButton {
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: rgba(0,0,0,0.7);
      color: white;
      border: none;
      padding: 10px;
      border-radius: 5px;
      cursor: pointer;
      z-index: 1000;
    }

    #preloader {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #1e1e1e;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 100000;
      transition: opacity 0.5s ease-out;
    }

    #preloader.hidden {
      opacity: 0;
      pointer-events: none;
    }

    #preloader h1 {
      font-size: 48px;
      color: #ffffff;
      text-align: center;
      font-family: 'Courier New', monospace;
    }

    #preloader .spinner {
      width: 25px;
      height: 25px;
      border: 5px solid #ffffff;
      border-top: 5px solid #F76900;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Start Screen Frosted Glass Effect */
    #startButtonContainer {
      position: absolute; 
      width: 100%; 
      height: 100%; 
      background-color: rgba(255, 255, 255, 0.2); 
      display: flex; 
      justify-content: center; 
      align-items: center; 
      z-index: 10000; 
      backdrop-filter: blur(10px); 
      -webkit-backdrop-filter: blur(10px);
    }
    #startButton {
      padding: 20px 40px; 
      font-size: 24px; 
      background-color: rgba(255, 255, 255, 0.25); 
      color: white; 
      border: none; 
      border-radius: 5px; 
      cursor: pointer;
    }
    ${
      includeMovementInstructions
        ? `
    .ui-overlay {
      position: absolute;
      top: 10px;
      left: 10px;
      background-color: rgba(0,0,0,0.7);
      padding: 15px;
      border-radius: 10px;
      color: white;
      z-index: 10;
      font-size: 14px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    `
        : ""
    }

    /* Ensure the toggleCameraMode button has consistent styling */
    #toggleCameraMode {
      background-color: ${uiColor};
      border: none;
      color: white;
      padding: 10px 20px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      cursor: pointer;
      border-radius: 5px;
      transition: background-color 0.3s;
    }
    #toggleCameraMode:hover {
       background-color: ${adjustColorBrightness(uiColor, -20)};
    }
      
  </style>
</head>
<body>
  <div id="preloader">
        <h1>Story Splat</h1>
        <div class="spinner"></div>
    </div>
      <!-- Start Screen -->
    <div id="startButtonContainer">
      <button id="startButton">Start Experience</button>
    </div>
  <canvas id="renderCanvas"></canvas>
  ${
    includeMovementInstructions
      ? `
  <div class="ui-overlay">
    <p><strong>Controls:</strong></p>
    <p>• W/A/S/D: Move camera</p>
    <p>• Q/E: Up and Down</p>
    <p>• Mouse: Look around</p>
    <p>• Scroll: Move along path</p>
  </div>
  `
      : ""
  }
  <div id="hotspotContent"></div>
  <div id="infoPopup"></div>
  ${
    includeScrollControls
      ? `
  <div id="scrollControls">
    <div id="toggleCameraModeContainer">
      <button id="toggleCameraMode" onclick="toggleCameraMode()">Mode: ${defaultCameraMode.charAt(0).toUpperCase() + defaultCameraMode.slice(1)}</button>
    </div>
    <div id="scrollControlsContent">
      <div id="scrollPercentage">0%</div>
      <div id="progressBarContainer">
        <div id="progressBar"></div>
      </div>
      <div id="scrollButtons">
        <button class="button" onclick="adjustScroll(-1)">◀ Backward</button>
        <button class="button" onclick="adjustScroll(1)">Forward ▶</button>
      </div>
    </div>
    <div id="exploreControlsContent">
      <p>Use WASD to move and mouse to look around</p>
    </div>
  </div>

  `
      : ""
  }
  <button id="muteButton">🔊 Mute</button>
  <!-- Babylon.js CDN -->
  <script src="https://cdn.babylonjs.com/babylon.js"></script>
  <script src="https://preview.babylonjs.com/loaders/babylonjs.loaders.min.js"></script>
  <script>
    // Initialize cameraMode
    let cameraMode = '${defaultCameraMode}';
      function updateScrollControlsVisibility() {
        const scrollControlsContent = document.getElementById('scrollControlsContent');
        const exploreControlsContent = document.getElementById('exploreControlsContent');
        if (cameraMode === 'explore') {
          scrollControlsContent.classList.add('hidden');
          exploreControlsContent.classList.remove('hidden');
        } else {
          scrollControlsContent.classList.remove('hidden');
          exploreControlsContent.classList.add('hidden');
        }
      }

    // Function to toggle camera mode
    function toggleCameraMode() {
      switch (cameraMode) {
        case 'tour':
          cameraMode = 'explore';
          break;
        case 'explore':
          cameraMode = 'auto';
          break;
        case 'auto':
          cameraMode = 'tour';
          break;
      }
      const toggleButton = document.getElementById('toggleCameraMode');
      if (toggleButton) {
        toggleButton.textContent = 'Mode: ' + cameraMode.charAt(0).toUpperCase() + cameraMode.slice(1);
      }
      // Additional logic to handle camera mode change
      if (cameraMode === 'tour') {
        userControl = false;
      } else if (cameraMode === 'explore') {
        userControl = true;
      }
      // For 'auto' mode, userControl will be dynamically updated based on user interactions
      updateScrollControlsVisibility();
      console.log('Camera Mode:', cameraMode);
    }

    updateScrollControlsVisibility();

    const preloader = document.getElementById('preloader');
    // Get the canvas element
    const canvas = document.getElementById('renderCanvas');

    // Generate the Babylon.js 3D engine
    const engine = new BABYLON.Engine(canvas, true);

    // Create the scene
    const scene = new BABYLON.Scene(engine);
    window.scene = scene; // Make scene accessible globally

    // Set the background color
    scene.clearColor = BABYLON.Color3.FromHexString('${backgroundColor}').toColor4(1);

    // Create a universal camera and position it
    const camera = new BABYLON.UniversalCamera(
      'camera',
      new BABYLON.Vector3(${waypoints[0].x}, ${waypoints[0].y}, ${waypoints[0].z}),
      scene
    );
    camera.attachControl(canvas, true);

    // Adjust camera sensitivity
    camera.speed = ${cameraMovementSpeed};
    camera.angularSensibility = ${cameraRotationSensitivity};

    // Initialize rotationQuaternion with the first waypoint's rotation
    camera.rotationQuaternion = new BABYLON.Quaternion(
      ${waypoints[0].rotation.x},
      ${waypoints[0].rotation.y},
      ${waypoints[0].rotation.z},
      ${waypoints[0].rotation.w}
    ).normalize();

    // Ensure Euler angles match the quaternion
    camera.rotation = camera.rotationQuaternion.toEulerAngles();

    // Enable WASD keys for movement
    camera.keysUp.push(87); // W
    camera.keysDown.push(83); // S
    camera.keysLeft.push(65); // A
    camera.keysRight.push(68); // D

    //add q and e to move up and down
    camera.keysUpward.push(81); // Q
    camera.keysDownward.push(69); // E

    // Create a basic light
    new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);

    // Variables to manage camera control state
    let userControl = cameraMode === 'explore';
    let animatingToPath = false;

    // Variables for scroll position and target
    let scrollPosition = 0;
    let scrollTarget = 0.01; // Start with a small value to enable scrolling

    // Prepare waypoints and rotations
    const waypoints = ${JSON.stringify(waypoints)};
    const controlPoints = waypoints.map(
      (wp) => new BABYLON.Vector3(wp.x, wp.y, wp.z)
    );
    const rotations = waypoints.map(
      (wp) => new BABYLON.Quaternion(wp.rotation._x, wp.rotation._y, wp.rotation._z, wp.rotation._w).normalize()
    );

    let path = [];

    if (controlPoints.length >= 2) {
      const positionCurve = BABYLON.Curve3.CreateCatmullRomSpline(
        controlPoints,
        (waypoints.length - 1) * 20, // Increased resolution from 10 to 20
        false
      );
      path = positionCurve.getPoints();
    } else if (controlPoints.length === 1) {
      path = [controlPoints[0]];
    }

    // Create hotspots
    const hotspots = ${JSON.stringify(hotspots)};

    hotspots.forEach(hotspot => {
      const scale = (hotspot.scale._x === 0 && hotspot.scale._y === 0 && hotspot.scale._z === 0)
        ? new BABYLON.Vector3(1, 1, 1) 
        : new BABYLON.Vector3(hotspot.scale._x, hotspot.scale._y, hotspot.scale._z);

      const sphere = BABYLON.MeshBuilder.CreateSphere(\`hotspot-\${hotspot.id}\`, { diameter: 0.2 }, scene);
      sphere.position = new BABYLON.Vector3(hotspot.position._x, hotspot.position._y, hotspot.position._z);
      sphere.scaling = scale;
      
      const material = new BABYLON.StandardMaterial(\`hotspot-material-\${hotspot.id}\`, scene);
      material.diffuseColor = BABYLON.Color3.FromHexString(hotspot.color);
      material.emissiveColor = BABYLON.Color3.FromHexString(hotspot.color).scale(0.5);
      sphere.material = material;

      sphere.isPickable = true;

      sphere.actionManager = new BABYLON.ActionManager(scene);
      sphere.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnPointerOverTrigger,
          () => {
            material.emissiveColor = BABYLON.Color3.FromHexString(hotspot.color);
            if (hotspot.activationMode === 'hover') {
              showHotspotContent(hotspot);
            }
          }
        )
      );
      sphere.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnPointerOutTrigger,
          () => {
            material.emissiveColor = BABYLON.Color3.FromHexString(hotspot.color).scale(0.5);
            if (hotspot.activationMode === 'hover') {
              hideHotspotContent();
            }
          }
        )
      );
      if (hotspot.activationMode === 'click') {
        sphere.actionManager.registerAction(
          new BABYLON.ExecuteCodeAction(
            BABYLON.ActionManager.OnPickTrigger,
            () => {
              showHotspotContent(hotspot);
            }
          )
        );
      }
    });

    // Function to show hotspot content
    function showHotspotContent(hotspot) {
      const hotspotContent = document.getElementById('hotspotContent');
      hotspotContent.innerHTML = \`
        <h3>\${hotspot.title}</h3>
        \${hotspot.photoUrl ? \`<img src="\${hotspot.photoUrl}" alt="\${hotspot.title}" style="width: 100%; margin-bottom: 10px; border-radius: 5px;">\` : ''}
        \${hotspot.information ? \`<p>\${hotspot.information}</p>\` : ''}
        \${hotspot.activationMode === 'click' ? '<button onclick="hideHotspotContent()" style="width: 100%; padding: 10px; background-color: #4CAF50; border: none; color: white; cursor: pointer; border-radius: 5px;">Close</button>' : ''}
      \`;
      hotspotContent.style.display = 'block';
      positionHotspotContent(hotspotContent);
    }

    // Function to hide hotspot content
    function hideHotspotContent() {
      const hotspotContent = document.getElementById('hotspotContent');
      hotspotContent.style.display = 'none';
    }

    // Function to position hotspot content near the mouse
    function positionHotspotContent(element) {
      const rect = element.getBoundingClientRect();
      let left = scene.pointerX + 10;
      let top = scene.pointerY + 10;

      if (left + rect.width > window.innerWidth) {
        left = window.innerWidth - rect.width - 10;
      }
      if (top + rect.height > window.innerHeight) {
        top = window.innerHeight - rect.height - 10;
      }

      element.style.left = \`\${left}px\`;
      element.style.top = \`\${top}px\`;
    }

    // Mute state
    let isMuted = false;
    const activeSounds = {};

    // Updated playAudio function
    function playAudio(interactionData, waypointIndex) {
      if (isMuted) return;

      const id = interactionData.id;
      const url = interactionData.url;
      const data = interactionData;

      // If sound is already playing, do not play it again
      if (activeSounds[id] && activeSounds[id].isPlaying) {
        return;
      }

      if (activeSounds[id]) {
        // Sound object already exists, play it if not playing
        if (!activeSounds[id].isPlaying) {
          activeSounds[id].play();
        }
      } else {
        // Create new sound
        const sound = new BABYLON.Sound(
          id,
          url,
          scene,
          () => {
            // Play the sound once it's ready
            sound.play();
          },
          {
            loop: data.loop !== undefined ? data.loop : true,
            volume: data.volume !== undefined ? data.volume : 1,
            spatialSound: data.spatialSound !== undefined ? data.spatialSound : false,
            distanceModel: data.distanceModel !== undefined ? data.distanceModel : "exponential",
            maxDistance: data.maxDistance !== undefined ? data.maxDistance : 100,
            refDistance: data.refDistance !== undefined ? data.refDistance : 1,
            rolloffFactor: data.rolloffFactor !== undefined ? data.rolloffFactor : 1,
          }
        );

        activeSounds[id] = sound;

        if (data.spatialSound) {
          let position;
          if (waypointIndex !== undefined && waypoints[waypointIndex]) {
            const waypoint = waypoints[waypointIndex];
            position = new BABYLON.Vector3(waypoint.x, waypoint.y, waypoint.z);
          } else {
            position = new BABYLON.Vector3(0, 0, 0); // Default position if waypoint is undefined
          }

          sound.setPosition(position);
          // No need to attach the sound to the camera
        }
      }
    }

    // Updated stopAudio function
    function stopAudio(interactionData) {
      const id = interactionData.id;
      const sound = activeSounds[id];
      if (sound && sound.isPlaying) {
        sound.stop();
      }
      // Remove the sound from activeSounds to clean up
      delete activeSounds[id];
    }

    // Function to execute interactions
    const executeInteractions = (interactions, waypointIndex) => {
      interactions.forEach((interaction) => {
        switch (interaction.type) {
          case "audio":
            playAudio({ ...interaction.data, id: interaction.id }, waypointIndex);
            break;
          case "info":
            showInfoPopup(interaction.data.text);
            break;
          // Add other interaction types here if needed
        }
      });
    };

    // Function to reverse interactions
    const reverseInteractions = (interactions) => {
      interactions.forEach((interaction) => {
        switch (interaction.type) {
          case "audio":
            const data = interaction.data;
            if (!data.spatialSound && data.stopOnExit) {
              stopAudio({ ...data, id: interaction.id });
            }
            break;
          case "info":
            hideInfoPopup();
            break;
          // Add other interaction types here if needed
        }
      });
    };

    // Function to show info popup
    function showInfoPopup(text) {
      const infoPopup = document.getElementById('infoPopup');
      infoPopup.innerHTML = \`
        <p>\${text}</p>
        <button onclick="hideInfoPopup()" style="width: 100%; padding: 10px; background-color: ${uiColor}; border: none; color: white; cursor: pointer; border-radius: 5px;">Close</button>
      \`;
      infoPopup.style.display = 'block';
    }

    // Function to hide info popup
    function hideInfoPopup() {
      const infoPopup = document.getElementById('infoPopup');
      infoPopup.style.display = 'none';
    }

    // Function to update scroll percentage and progress bar
    function updateScrollUI(percentage) {
      const scrollPercentage = document.getElementById('scrollPercentage');
      const progressBar = document.getElementById('progressBar');
      if (scrollPercentage && progressBar) {
        scrollPercentage.textContent = \`\${Math.round(percentage)}%\`;
        progressBar.style.width = \`\${percentage}%\`;
      }
    }

    // Function to adjust scroll
    function adjustScroll(direction) {
      if (cameraMode === 'explore') {
        return;
      }
      const increment = 10;
      const pathLength = path.length;
      if (pathLength > 1) {
        const scrollIncrement = (pathLength - 1) * (increment / 100) * direction;
        scrollTarget += scrollIncrement;

        if (scrollTarget < 0) scrollTarget = 0;
        if (scrollTarget > path.length - 1) scrollTarget = path.length - 1;

        userControl = false;
      }
    }

    // Handle scroll events
    window.addEventListener('wheel', (event) => {
      if (animatingToPath) return;

      if (
        (cameraMode === 'auto' && userControl) ||
        (cameraMode === 'tour' && userControl)
      ) {
        animatingToPath = true;
        userControl = false;

        if (!camera.rotationQuaternion) {
          camera.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(
            camera.rotation.x,
            camera.rotation.y,
            camera.rotation.z
          ).normalize();
          camera.rotation.set(0, 0, 0);
        }

        // Use current scroll position instead of finding closest point
        const targetT = scrollPosition;
        const pathLength = path.length - 1;

        const floorIndex = Math.floor(targetT);
        const ceilIndex = Math.min(floorIndex + 1, pathLength);
        const lerpFactor = targetT - floorIndex;

        const targetPosition = BABYLON.Vector3.Lerp(
          path[floorIndex],
          path[ceilIndex],
          lerpFactor
        );

        let targetRotation = camera.rotationQuaternion.clone();
        if (rotations.length >= 2 && path.length >= 2) {
          const totalSegments = waypoints.length - 1;
          const segmentT = (targetT / pathLength) * totalSegments;
          const segmentIndex = Math.floor(segmentT);
          const clampedSegmentIndex = Math.min(segmentIndex, totalSegments - 1);
          const lerpFactorRot = segmentT - clampedSegmentIndex;

          const r1 = rotations[clampedSegmentIndex];
          const r2 = rotations[clampedSegmentIndex + 1] || rotations[rotations.length - 1];
          targetRotation = BABYLON.Quaternion.Slerp(r1, r2, lerpFactorRot).normalize();
        } else if (rotations.length === 1) {
          targetRotation = rotations[0];
        }

        const positionAnimation = new BABYLON.Animation(
          'cameraPositionAnimation',
          'position',
          60,
          BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
          BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        const positionKeys = [];
        positionKeys.push({ frame: 0, value: camera.position.clone() });
        positionKeys.push({ frame: ${animationFrames}, value: targetPosition.clone() });

        positionAnimation.setKeys(positionKeys);

        const easingFunction = new BABYLON.CubicEase();
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);
        positionAnimation.setEasingFunction(easingFunction);

        const rotationAnimation = new BABYLON.Animation(
          'cameraRotationAnimation',
          'rotationQuaternion',
          60,
          BABYLON.Animation.ANIMATIONTYPE_QUATERNION,
          BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );

        const currentRotation = camera.rotationQuaternion.clone();
        rotationAnimation.setKeys([
          { frame: 0, value: currentRotation },
          { frame: ${animationFrames}, value: targetRotation },
        ]);

        rotationAnimation.setEasingFunction(easingFunction);

        camera.animations = [];
        camera.animations.push(positionAnimation);
        camera.animations.push(rotationAnimation);

        scene.beginAnimation(camera, 0, ${animationFrames}, false, 1, function () {
          animatingToPath = false;
          scrollPosition = targetT;
          scrollTarget = targetT;
        });
      } else if (cameraMode !== 'explore') {
        scrollTarget += event.deltaY * ${scrollSpeed};

        if (scrollTarget < 0) scrollTarget = 0;
        if (scrollTarget > path.length - 1) scrollTarget = path.length - 1;
      }
    });

    // Initialize target rotation and position
    let targetRotation = camera.rotationQuaternion.clone();
    let targetPosition = camera.position.clone();

    // Active waypoints set
    const activeWaypoints = new Set();

    // Create floor mesh at y = 0 and hide it
    const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 100, height: 100 }, scene);    
    ground.isVisible = false;

    // WebXR setup
    const xr = scene.createDefaultXRExperienceAsync({
      floorMeshes: [ground],
    });

    // Load the model file
    BABYLON.SceneLoader.ImportMeshAsync('', '', '${modelUrl}', scene)
      .then((result) => {
        const loadedMeshes = result.meshes;
        loadedMeshes.forEach((mesh) => {
          if (mesh instanceof BABYLON.Mesh) {
            mesh.position = BABYLON.Vector3.Zero();
          }
        });
        // Hide the preloader after the model is loaded
        preloader.classList.add('hidden');
      })
      .catch((error) => {
        console.error('Error loading model file:', error);
        alert('Error loading model file: ' + error.message);
        preloader.classList.add('hidden');
      });

    // Start the render loop
    engine.runRenderLoop(function () {
      // Smoothly interpolate scrollPosition towards scrollTarget
      const scrollInterpolationSpeed = 0.1;
      scrollPosition += (scrollTarget - scrollPosition) * scrollInterpolationSpeed;

      // Clamp scroll position
      scrollPosition = Math.max(0, Math.min(scrollPosition, path.length - 1));

      // Calculate scroll percentage
      const scrollPercentage = (scrollPosition / (path.length - 1 || 1)) * 100;

      // Update UI only if not in explore mode
      if (cameraMode !== 'explore') {
        ${includeScrollControls ? `updateScrollUI(scrollPercentage);` : ""}
      }

      // Determine if camera should follow the path
      if (
        (
          cameraMode === 'auto' && !userControl
        ) ||
        (
          cameraMode === 'tour' && !userControl
       )) {
        const t = scrollPosition / (path.length - 1 || 1);

        const totalSegments = waypoints.length - 1;
        if (totalSegments >= 1) {
          const segmentT = t * totalSegments;
          const segmentIndex = Math.floor(segmentT);
          const clampedSegmentIndex = Math.min(segmentIndex, totalSegments - 1);
          const lerpFactor = segmentT - clampedSegmentIndex;

          // Calculate target rotation using Slerp
          const r1 = rotations[clampedSegmentIndex];
          const r2 = rotations[clampedSegmentIndex + 1] || rotations[rotations.length - 1];

          targetRotation = BABYLON.Quaternion.Slerp(r1, r2, lerpFactor).normalize();

          // Calculate interpolated position using Lerp
          const floorIndex = Math.floor(scrollPosition);
          const ceilIndex = Math.min(floorIndex + 1, path.length - 1);
          const lerpFactorPos = scrollPosition - floorIndex;

          const interpolatedPosition = BABYLON.Vector3.Lerp(
            path[floorIndex],
            path[ceilIndex],
            lerpFactorPos
          );

          targetPosition = interpolatedPosition;
        } else if (rotations.length === 1) {
          targetRotation = rotations[0].clone();
          targetPosition = path[0].clone();
        }

        // Smoothly interpolate the camera's rotation towards the target rotation
        if (camera.rotationQuaternion) {
          camera.rotationQuaternion = BABYLON.Quaternion.Slerp(
            camera.rotationQuaternion,
            targetRotation,
            ${cameraDampeningRef} // Damping factor for rotation
          ).normalize();
        }

        // Smoothly interpolate the camera's position towards the target position
        const positionDampingFactor = 0.1; // Adjust between 0 (no movement) and 1 (instant movement)
        camera.position = BABYLON.Vector3.Lerp(
          camera.position,
          targetPosition,
          positionDampingFactor
        );

        // Handle interactions based on waypoints
        waypoints.forEach((wp, index) => {
          const distance = BABYLON.Vector3.Distance(
            camera.position,
            new BABYLON.Vector3(wp.x, wp.y, wp.z)
          );
          const triggerDistance = 1.0; // Define a suitable trigger distance

          if (distance <= triggerDistance) {
            if (!activeWaypoints.has(index)) {
              activeWaypoints.add(index);
              executeInteractions(wp.interactions, index);
            }
          } else {
            if (activeWaypoints.has(index)) {
              activeWaypoints.delete(index);
              reverseInteractions(wp.interactions);
            }
          }
        });
      }

      scene.render();
    });

    // User interaction detection
    scene.onPointerObservable.add(function (evt) {
      if (evt.type === BABYLON.PointerEventTypes.POINTERDOWN) {
        if (cameraMode === 'explore' || cameraMode === 'auto') {
          userControl = true;
        } else {
          userControl = false;
        }
      }
    });

    window.addEventListener('keydown', function () {
      if (cameraMode === 'explore' || cameraMode === 'auto') {
        userControl = true;
      } else {
        userControl = false;
      }
    });

    // Mute button functionality
    const muteButton = document.getElementById('muteButton');
    muteButton.textContent = isMuted ? '🔇 Unmute' : '🔊 Mute';
    muteButton.addEventListener('click', function() {
      isMuted = !isMuted;
      muteButton.textContent = isMuted ? '🔇 Unmute' : '🔊 Mute';
      
      if (isMuted) {
        // Stop all active sounds
        Object.values(activeSounds).forEach(sound => {
          if (sound.isPlaying) {
            sound.pause();
          }
        });
      } else {
        // Resume sounds that should be playing
        Object.values(activeSounds).forEach(sound => {
          if (!sound.isPlaying) {
            sound.play();
          }
        });
      }
    });

    // Start button functionality
    document.getElementById('startButton').addEventListener('click', function() {
      // Hide the start button
      document.getElementById('startButtonContainer').style.display = 'none';

      // Resume audio context if suspended
      if (BABYLON.Engine.audioEngine.audioContext.state === 'suspended') {
        BABYLON.Engine.audioEngine.audioContext.resume();
      }

      // Play audio interactions with autoplay set to true
      waypoints.forEach((wp, index) => {
        wp.interactions.forEach((interaction) => {
          if (interaction.type === 'audio') {
            const data = interaction.data;
            if (data.autoplay) {
              playAudio({ ...data, id: interaction.id }, index);
            }
          }
        });
      });
    });

    // Resize
    window.addEventListener('resize', function () {
      engine.resize();
    });
  </script>
</body>
</html>
  `;

  function adjustColorBrightness(color: string, percent: number) {
    const num = parseInt(color.replace("#",""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
  }

};
