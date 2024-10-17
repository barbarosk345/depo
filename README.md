# Gaussian Splatting Viewer with HTML Export

## Overview

The Gaussian Splatting Viewer is an advanced, interactive 3D visualization tool built with React and Babylon.js. It offers users the ability to load, manipulate, and explore 3D models, particularly those in the Gaussian Splatting format (.splat), as well as other common 3D formats like .ply, .gltf, and .glb. This application stands out with its intuitive user interface, comprehensive waypoint system for camera path creation, and robust HTML export functionality, allowing users to generate standalone, shareable versions of their customized 3D scenes.

## Key Features

### 1. Versatile 3D Model Loading
- **Drag-and-Drop Support**: Easily load .splat, .ply, .gltf, or .glb files by dragging them into the application.
- **URL-based Loading**: Load models from predefined URLs or custom URLs for dynamic model integration.
- **PLY to Splat Conversion**: Built-in functionality to convert .ply files to the .splat format.

### 2. Advanced Waypoint System
- **Dynamic Waypoint Management**: Add, edit, or remove waypoints to create custom camera paths.
- **Precise Coordinate Control**: Fine-tune X, Y, Z coordinates and rotation for each waypoint.
- **Interactive Editing**: Use gizmos for visual, drag-and-drop editing of waypoint positions and rotations.

### 3. Sophisticated Camera Controls
- **Multiple Camera Modes**: 
  - 'Tour' mode for guided experiences
  - 'Explore' mode for free navigation
  - 'Auto' mode for dynamic switching between guided and free exploration
- **Keyboard and Mouse Navigation**: Use W/A/S/D keys for movement, mouse for looking around, and scroll wheel for path traversal.
- **Gamepad Support**: Enhanced control options with gamepad compatibility.

### 4. Rich Interaction System
- **Audio Interactions**: Attach spatial or non-spatial audio to waypoints.
- **Info Pop-ups**: Display informative text at specific waypoints.
- **Customizable Hotspots**: Create interactive points of interest within the 3D scene.

### 5. Flexible User Interface
- **Draggable UI Components**: All control panels can be repositioned for a customized layout.
- **Real-time Parameter Adjustments**: Modify scroll speed, animation frames, camera behavior, and more on-the-fly.
- **Visual Customization**: Adjust background color and UI color to suit preferences or branding needs.

### 6. Comprehensive Export Functionality
- **Standalone HTML Export**: Generate a self-contained HTML file of the entire scene, including models, camera paths, and interactions.
- **Customizable Export Options**: Choose to include or exclude UI elements, set default camera modes, and more.

### 7. Performance and Compatibility
- **Optimized Rendering**: Utilizes Babylon.js for efficient 3D rendering.
- **WebXR Support**: Enables immersive VR experiences when supported by the browser and hardware.

### 8. Developer-Friendly Architecture
- **React-based Structure**: Modular component design for easy maintenance and extensibility.
- **TypeScript Integration**: Strong typing for improved code quality and developer experience.
- **State Management**: Efficient state handling using React hooks and context.

## Installation and Setup

1. **Clone the Repository**:
    git clone https://github.com/YourUsername/gaussian-splatting-viewer.git
    cd gaussian-splatting-viewer
Copy
    2. **Install Dependencies**:
    npm install
Copy
    3. **Run the Application**:
    npm start
Copy
    4. **Access the Application**:
    Open your web browser and navigate to `http://localhost:3000`.

## Usage Guide

### Loading Models
- Drag and drop supported file formats directly onto the viewer.
- Use the "Load Custom Splat" option in the Load/Save menu to load models via URL.
- Convert .ply files to .splat format using the built-in converter.

### Creating and Editing Waypoints
- Access the Waypoint Controls panel to add, remove, or edit waypoints.
- Use the position gizmos to visually adjust waypoint locations.
- Fine-tune waypoint positions and rotations using the numerical inputs.

### Customizing Interactions
- Click "Edit Interactions" on a waypoint to add audio or info pop-up interactions.
- Use the Hotspot Manager to create and edit interactive points in the scene.

### Navigating the Scene
- Toggle between 'Tour', 'Explore', and 'Auto' camera modes.
- Use WASD keys for movement and mouse for looking around in 'Explore' mode.
- Scroll or use the forward/backward buttons to move along the path in 'Tour' mode.

### Adjusting Visual Settings
- Use the Parameter Controls to modify camera behavior, animation settings, and more.
- Change the background color and UI color to customize the viewer's appearance.

### Exporting Your Scene
- Click "Export Scene" in the Load/Save menu.
- Configure export options like including scroll controls or setting the default camera mode.
- Download the generated HTML file for easy sharing and deployment.

## Project Structure

- `src/components/`: React components for UI elements and controls.
- `src/tools/`: Utility functions for file handling, export generation, etc.
- `src/App.tsx`: Main application component orchestrating the viewer's functionality.

## Contributing

Contributions to the Gaussian Splatting Viewer are welcome! Please refer to the project's GitHub repository for contribution guidelines, issue reporting, and pull request processes.

## License

MIT License

## Acknowledgements

- Babylon.js for 3D rendering capabilities.
- React and TypeScript are used to provide a robust development framework.
- Contributors and maintainers of various open-source libraries used in this project.
