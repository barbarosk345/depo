// ScrollControls.tsx
import React, { useState } from "react";
import Draggable from "react-draggable";
import styled from "styled-components";
import { FiArrowLeft, FiArrowRight , FiCamera, FiCameraOff, FiMap} from "react-icons/fi";


interface ScrollControlsProps {
  scrollPercentage: number;
  adjustScroll: (direction: number) => void;
  showScrollControls: boolean;
  setShowScrollControls: React.Dispatch<React.SetStateAction<boolean>>;
  cameraConstraintMode: 'auto' | 'path' ;
  setCameraConstraintMode: React.Dispatch<React.SetStateAction<'auto' | 'path' >>;
  freeFlyEnabled: boolean;
  setFreeFlyEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

// Styled Components
const Handle = styled.div<{ isDraggingDisabled: boolean }>`
  position: absolute;
  bottom: 10px;
  left: calc(50% - 140px);
  transform: translateY(-50%);
  background-color: #1e1e1e; /* Dark background */
  padding: 16px; /* Reduced padding for tighter layout */
  border-radius: 8px;
  color: #ffffff; /* Light text */
  z-index: 1000;
  cursor: ${({ isDraggingDisabled }) => (isDraggingDisabled ? "not-allowed" : "move")};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  width: 280px; /* Adjusted width */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  transition: background-color 0.3s ease, cursor 0.3s ease;

  @media (max-width: 480px) {
    width: 90%;
    left: 5%;
    padding: 12px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  color: #ffffff;
`;

const ToggleButton = styled.button`
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  outline: none;
  transition: color 0.3s ease;
    width: 100%;
    justify-content: center;
  &:hover {
    color: #ffa500; /* Orange on hover */
  }
`;

const ControlsContainer = styled.div`

`;

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px; /* Reduced margin */
  justify-content: space-between;
  width: 100%;
`;

const PercentageText = styled.p`
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #dddddd;
  text-align: center;
`;

const Button = styled.button`
  padding: 6px 12px;
  margin: 0 5px;
  background-color: #555555;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ffa500; /* Orange on hover */
  }
`;

const ProgressBarContainer = styled.div`
  background-color: #333333;
  border-radius: 8px;
  overflow: hidden;
  height: 20px;
  width: 100%;
  margin-bottom: 10px;
`;

const ProgressBar = styled.div<{ percentage: number }>`
  background-color: #ffa500; /* Orange */
  height: 100%;
  width: ${({ percentage }) => percentage}%;
  /* Removed transition for immediate update */
`;


const ModeButton = styled(ToggleButton)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 5px 10px;
  border-radius: 20px;
  background-color: #333;
  margin-right: 10px;
  width: auto;

  &:hover {
    background-color: #444;
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  font-size: 20px;
`;

const ModeText = styled.span`
  font-size: 14px;
`;

// Main Component

const ScrollControls: React.FC<ScrollControlsProps> = ({
  scrollPercentage,
  adjustScroll,
  showScrollControls,
  setShowScrollControls,
  cameraConstraintMode,
  setCameraConstraintMode,
  freeFlyEnabled,
  setFreeFlyEnabled,
}) => {

  const [isDraggingDisabled, setIsDraggingDisabled] = useState<boolean>(false);
  const handleMouseDown = () => setIsDraggingDisabled(true);
  const handleMouseUp = () => setIsDraggingDisabled(false);
  const handleTouchStart = () => setIsDraggingDisabled(true);
  const handleTouchEnd = () => setIsDraggingDisabled(false);

  const toggleCameraConstraint = () => {
    setCameraConstraintMode(cameraConstraintMode === 'path' ? 'auto' : 'path');
    setFreeFlyEnabled(false);
  };

  const toggleFreeFly = () => {
    setFreeFlyEnabled(!freeFlyEnabled);
  };

  return (
    <>
      {showScrollControls && (
        <Draggable handle=".handle" disabled={isDraggingDisabled}>
          <Handle className="handle" isDraggingDisabled={isDraggingDisabled}>
            <ControlsContainer>
              <PercentageText>Scroll Position: {Math.round(scrollPercentage)}%</PercentageText>
              <ProgressBarContainer>
                <ProgressBar percentage={scrollPercentage} />
              </ProgressBarContainer>

              <ControlRow>
                <Button
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onClick={() => adjustScroll(-1)}
                  aria-label="Scroll Backward"
                >
                  <FiArrowLeft style={{ marginRight: "4px" }} />
                  Backward
                </Button>
                <Button
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onClick={() => adjustScroll(1)}
                  aria-label="Scroll Forward"
                >
                  Forward
                  <FiArrowRight style={{ marginLeft: "4px" }} />
                </Button>
              </ControlRow>
              <ControlRow>
                <ModeButton onClick={toggleCameraConstraint}>
                  <IconWrapper>
                    {<FiCamera />}
                  </IconWrapper>
                  <ModeText>
                    {cameraConstraintMode === 'path' ? 'Follow Path' : 'Auto'}
                  </ModeText>
                </ModeButton>
                {cameraConstraintMode === 'path' && (
                  <ModeButton onClick={toggleFreeFly}>
                    <ModeText>
                      {freeFlyEnabled ? 'Free Fly: On' : 'Free Fly: Off'}
                    </ModeText>
                  </ModeButton>
                )}
              </ControlRow>
            </ControlsContainer>
          </Handle>
        </Draggable>
      )}
    </>
  );
};

export default ScrollControls;