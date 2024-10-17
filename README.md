# Gaussian Splatting Viewer with HTML Export

## Overview

The Gaussian Splatting Viewer is an advanced, interactive 3D visualization tool built with React and Babylon.js. It offers users the ability to load, manipulate, and explore 3D models, particularly those in the Gaussian Splatting format (.splat), as well as other common 3D formats like .ply, .gltf, and .glb. This application stands out with its intuitive user interface, a comprehensive waypoint system for camera path creation, and robust HTML export functionality, allowing users to generate standalone, shareable versions of their customized 3D scenes.

## Key Features and Usage Guide

### 1. Versatile 3D Model Loading
- **Drag-and-Drop Support**: Easily load .splat, .ply, .gltf, or .glb files by dragging them directly onto the viewer.
- **URL-based Loading**: Load models from predefined URLs or custom URLs for dynamic model integration.
  - Use the "Load Custom Splat" option in the Load/Save menu to load models via URL.
- **PLY to Splat Conversion**: Built-in functionality to convert .ply files to the .splat format using the built-in converter.

### 2. Advanced Waypoint System
- **Dynamic Waypoint Management**: Access the Waypoint Controls panel to add, remove, or edit waypoints, creating custom camera paths.
- **Precise Coordinate Control**: Fine-tune X, Y, Z coordinates and rotation for each waypoint using numerical inputs.
- **Interactive Editing**: Use position gizmos for visual, drag-and-drop editing of waypoint locations and rotations.

### 3. Sophisticated Camera Controls
- **Multiple Camera Modes**: 
  - 'Tour' mode for guided experiences
  - 'Explore' mode for free navigation
  - 'Auto' mode for dynamic switching between guided and free exploration
- **Keyboard and Mouse Navigation**: 
  - Use W/A/S/D keys for movement, Q/E for up/down, and mouse for looking around in 'Explore' mode.
  - Scroll or use forward/backward buttons to move along the path in 'Tour' mode.
- **Gamepad Support**: Enhanced control options with gamepad compatibility.

### 4. Rich Interaction System
- **Audio Interactions**: Attach spatial or non-spatial audio to waypoints.
- **Info Pop-ups**: Display informative text at specific waypoints.
- **Customizable Hotspots**: Create interactive points of interest within the 3D scene.
  - Use the Hotspot Manager to create and edit interactive points in the scene.
- **Adding Interactions**: Click "Edit Interactions" on a waypoint to add audio or info pop-up interactions.

### 5. Flexible User Interface
- **Draggable UI Components**: All control panels can be repositioned for a customized layout.
- **Real-time Parameter Adjustments**: Modify scroll speed, animation frames, camera behavior, and more on-the-fly using the Parameter Controls.
- **Visual Customization**: Adjust background color and UI color to suit preferences or branding needs.

### 6. Comprehensive Export Functionality
- **Standalone HTML Export**: Generate a self-contained HTML file of the entire scene, including models, camera paths, and interactions.
  - Click "Export Scene" in the Load/Save menu.
  - Configure export options like including scroll controls or setting the default camera mode.
  - Download the generated HTML file for easy sharing and deployment.
- **Customizable Export Options**: Choose to include or exclude UI elements, set default camera modes, and more.

### 7. Performance and Compatibility
- **Optimized Rendering**: Utilizes Babylon.js for efficient 3D rendering.
- **WebXR Support**: Enables immersive VR experiences when supported by the browser and hardware.

## Installation and Setup

1. **Clone the Repository**:
   ```
   git clone https://github.com/YourUsername/gaussian-splatting-viewer.git
   cd gaussian-splatting-viewer
   ```

2. **Install Dependencies**:
   ```
   npm install
   ```

3. **Run the Application**:
   ```
   npm start
   ```

4. **Access the Application**:
   Open your web browser and navigate to `http://localhost:3000`.

## Project Structure

- `src/components/`: React components for UI elements and controls.
- `src/tools/`: Utility functions for file handling, export generation, etc.
- `src/App.tsx`: Main application component orchestrating the viewer's functionality.

## Contributing

Contributions to the Gaussian Splatting Viewer are welcome! Please refer to the project's GitHub repository for contribution guidelines, issue reporting, and pull request processes.


## Acknowledgements

- Babylon.js for 3D rendering capabilities.
- React and TypeScript are used to provide a robust development framework.
- Contributors and maintainers of various open-source libraries used in this project.
