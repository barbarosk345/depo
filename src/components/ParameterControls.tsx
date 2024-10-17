// ParameterControls.tsx
import React, { useState } from "react";
import Draggable from "react-draggable";
import styled from "styled-components";
import { FiSettings, FiInfo } from "react-icons/fi";
import BackgroundColorSelector from "./BackgroundColorSelector"; // Adjust the import path as needed
import UIColorSelector from "./UIColorSelector";

// Extend the interface to include backgroundColor props and camera swing
interface ParameterControlsProps {
  scrollSpeed: number;
  setScrollSpeed: React.Dispatch<React.SetStateAction<number>>;
  animationFrames: number;
  setAnimationFrames: React.Dispatch<React.SetStateAction<number>>;
  cameraMovementSpeed: number;
  setCameraMovementSpeed: React.Dispatch<React.SetStateAction<number>>;
  cameraRotationSensitivity: number;
  setCameraRotationSensitivity: React.Dispatch<React.SetStateAction<number>>;
  cameraSwing: number;
  setCameraSwing: React.Dispatch<React.SetStateAction<number>>;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  uiColor: string;
  setUiColor: (color: string) => void;
}

const Container = styled.div`
  position: absolute;
  top: 10px;
  left: 300px;
  background-color: #1e1e1e;
  border-radius: 8px;
  color: #ffffff;
  z-index: 1000;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  width: 280px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  @media (max-width: 480px) {
    width: 90%;
    left: 5%;
  }
`;


const Handle = styled.div`
  padding: 16px;
  cursor: move;
  background-color: #2c2c2c;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  user-select: none;
`;

const ControlsContainer = styled.div`
  padding: 16px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  display: flex;
  align-items: center;
  color: #ffffff;
`;

const ToggleButton = styled.button`
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  outline: none;
  transition: color 0.3s ease;

  &:hover {
    color: #1e90ff;
  }
`;



const ControlRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #dddddd;
`;

const Value = styled.span`
  font-size: 14px;
  color: #1e90ff;
`;

const Slider = styled.input`
  width: 100%;
  -webkit-appearance: none;
  height: 5px;
  border-radius: 5px;
  background: #555555;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #1e90ff;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #1e90ff;
    cursor: pointer;
  }
`;

const Tooltip = styled.div`
  position: relative;
  display: inline-block;
  margin-left: 5px;

  &:hover span {
    visibility: visible;
    opacity: 1;
  }
`;

const TooltipText = styled.span`
  visibility: hidden;
  width: 200px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -100px;
  opacity: 0;
  transition: opacity 0.3s;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #555 transparent transparent transparent;
  }
`;

const ParameterControls: React.FC<ParameterControlsProps> = ({
  scrollSpeed,
  setScrollSpeed,
  animationFrames,
  setAnimationFrames,
  cameraMovementSpeed,
  setCameraMovementSpeed,
  cameraRotationSensitivity,
  setCameraRotationSensitivity,
  cameraSwing,
  setCameraSwing,
  backgroundColor,
  setBackgroundColor,
  uiColor,
  setUiColor,
}) => {
  const [showControls, setShowControls] = useState<boolean>(true);

  return (
    <Draggable handle=".handle">
      <Container>
        <Handle className="handle">
          <Header>
            <Title>
              <FiSettings style={{ marginRight: "8px" }} />
              Settings
            </Title>
            <ToggleButton
              onClick={() => setShowControls(!showControls)}
              aria-label="Toggle Controls Visibility"
              aria-expanded={showControls}
            >
              {showControls ? "▲" : "▼"}
            </ToggleButton>
          </Header>
        </Handle>
        {showControls && (
          <ControlsContainer>
            {/* Scroll Speed */}
            <ControlRow>
              <LabelRow>
                <Label htmlFor="scrollSpeed">
                  Scroll Speed
                  <Tooltip>
                    <FiInfo />
                    <TooltipText>Adjusts how fast you move through the scene when scrolling</TooltipText>
                  </Tooltip>
                </Label>
                <Value>{scrollSpeed.toFixed(2)}</Value>
              </LabelRow>
              <Slider
                id="scrollSpeed"
                type="range"
                min="0.01"
                max="0.5"
                step="0.01"
                value={scrollSpeed}
                onChange={(e) => setScrollSpeed(parseFloat(e.target.value))}
              />
            </ControlRow>

            {/* Animation Frames */}
            <ControlRow>
              <LabelRow>
                <Label htmlFor="animationFrames">
                  Return To Path Delay
                  <Tooltip>
                    <FiInfo />
                    <TooltipText>Controls the speed of animation back to path</TooltipText>
                  </Tooltip>
                </Label>
                <Value>{animationFrames}</Value>
              </LabelRow>
              <Slider
                id="animationFrames"
                type="range"
                min="30"
                max="240"
                step="1"
                value={animationFrames}
                onChange={(e) => setAnimationFrames(parseInt(e.target.value, 10))}
              />
            </ControlRow>

            {/* Camera Fly Speed */}
            <ControlRow>
              <LabelRow>
                <Label htmlFor="cameraMovementSpeed">
                  Camera Free Fly Speed
                  <Tooltip>
                    <FiInfo />
                    <TooltipText>Adjusts how fast the camera moves in free-fly mode</TooltipText>
                  </Tooltip>
                </Label>
                <Value>{cameraMovementSpeed.toFixed(2)}</Value>
              </LabelRow>
              <Slider
                id="cameraMovementSpeed"
                type="range"
                min="0.01"
                max="1"
                step="0.01"
                value={cameraMovementSpeed}
                onChange={(e) => setCameraMovementSpeed(parseFloat(e.target.value))}
              />
            </ControlRow>

            {/* Camera Rotation Sensitivity */}
            <ControlRow>
              <LabelRow>
                <Label htmlFor="cameraRotationSensitivity">
                  Camera Rotation Friction
                  <Tooltip>
                    <FiInfo />
                    <TooltipText>Adjusts how sensitive the camera is to mouse movements </TooltipText>
                  </Tooltip>
                </Label>
                <Value>{cameraRotationSensitivity}</Value>
              </LabelRow>
              <Slider
                id="cameraRotationSensitivity"
                type="range"
                min="1000"
                max="100000"
                step="100"
                value={cameraRotationSensitivity}
                onChange={(e) => setCameraRotationSensitivity(parseFloat(e.target.value))}
              />
            </ControlRow>

            {/* Camera Swing */}
            <ControlRow>
              <LabelRow>
                <Label htmlFor="cameraSwing">
                  Camera Swing Dampening
                  <Tooltip>
                    <FiInfo />
                    <TooltipText>Controls how much the camera swings off path when interpolating rotation</TooltipText>
                  </Tooltip>
                </Label>
                <Value>{cameraSwing.toFixed(2)}</Value>
              </LabelRow>
              <Slider
                id="cameraSwing"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={cameraSwing}
                onChange={(e) => setCameraSwing(parseFloat(e.target.value))}
              />
            </ControlRow>

            {/* Background Color Selector */}
            <BackgroundColorSelector
              backgroundColor={backgroundColor}
              setBackgroundColor={setBackgroundColor}
            />
            <UIColorSelector
              uiColor={uiColor}
              setUiColor={setUiColor}
            />
          </ControlsContainer>
        )}
      </Container>
    </Draggable>
  );
};

export default ParameterControls;