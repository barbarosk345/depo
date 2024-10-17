import React, { useState } from "react";
import Draggable from "react-draggable";
import styled from "styled-components";
import { FiArrowLeft, FiArrowRight, FiCamera, FiMap } from "react-icons/fi";
interface ScrollControlsProps {
  scrollPercentage: number;
  adjustScroll: (direction: number) => void;
  showScrollControls: boolean;
  setShowScrollControls: React.Dispatch<React.SetStateAction<boolean>>;
  cameraMode: 'tour' | 'explore' | 'auto';
  setCameraMode: React.Dispatch<React.SetStateAction<'tour' | 'explore' | 'auto'>>;
  uiColor: string;
}

// Styled Components
const Handle = styled.div<{ isDraggingDisabled: boolean }>`
  position: absolute;
  bottom: 10px;
  left: calc(50% - 140px);
  transform: translateY(-50%);
  background-color: #1e1e1e;
  padding: 16px;
  border-radius: 8px;
  color: #ffffff;
  z-index: 1000;
  cursor: ${({ isDraggingDisabled }) => (isDraggingDisabled ? "not-allowed" : "move")};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
  width: 280px;
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

const ToggleButton = styled.button<{ uiColor: string }>`
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
      background-color: ${props => props.uiColor};
  }
`;

const ControlsContainer = styled.div``;

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  justify-content: space-between;
  width: 100%;
`;

const ControlRowCenter = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  justify-content: center;
  width: 100%;
`;

const PercentageText = styled.p`
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #dddddd;
  text-align: center;
`;

const Button = styled.button<{ uiColor: string }>`
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
     background-color: ${props => props.uiColor};
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

const ProgressBar = styled.div<{ percentage: number, uiColor: string }>`
  background-color: ${props => props.uiColor};
  height: 100%;
  width: ${({ percentage }) => percentage}%;
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

const ScrollControls: React.FC<ScrollControlsProps> = ({
  scrollPercentage,
  adjustScroll,
  showScrollControls,
  setShowScrollControls,
  cameraMode,
  setCameraMode,
  uiColor
}) => {
  const [isDraggingDisabled, setIsDraggingDisabled] = useState<boolean>(false);
  const handleMouseDown = () => setIsDraggingDisabled(true);
  const handleMouseUp = () => setIsDraggingDisabled(false);
  const handleTouchStart = () => setIsDraggingDisabled(true);
  const handleTouchEnd = () => setIsDraggingDisabled(false);

  const toggleCameraMode = () => {
    setCameraMode((prevMode) => {
      switch (prevMode) {
        case 'tour':
          return 'explore';
        case 'explore':
          return 'auto';
        case 'auto':
          return 'tour';
      }
    });
  };

  return (
    <>
      {showScrollControls && (
        <Draggable handle=".handle" disabled={isDraggingDisabled}>
          <Handle className="handle" isDraggingDisabled={isDraggingDisabled}>
          <ControlRowCenter>
                <ModeButton onClick={toggleCameraMode} uiColor={uiColor}>
                  <IconWrapper>
                    {cameraMode === 'tour' ? <FiCamera /> : <FiMap />}
                  </IconWrapper>
                  <ModeText>
                    Mode: {cameraMode.charAt(0).toUpperCase() + cameraMode.slice(1)}
                  </ModeText>
                </ModeButton>
              </ControlRowCenter>
            { cameraMode === 'auto' || cameraMode === 'tour' ? (
                <ControlsContainer>
                <PercentageText>Scroll Position: {Math.round(scrollPercentage)}%</PercentageText>
                <ProgressBarContainer>
                  <ProgressBar percentage={scrollPercentage} uiColor={uiColor}/>
                </ProgressBarContainer>
  
                <ControlRow>
                  <Button
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onClick={() => adjustScroll(-1)}
                    aria-label="Scroll Backward"
                    uiColor={uiColor}
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
                    uiColor={uiColor}
                  >
                    Forward
                    <FiArrowRight style={{ marginLeft: "4px" }} />
                  </Button>
                </ControlRow>
              </ControlsContainer>
  
            ) : null}
          
          </Handle>
        </Draggable>
      )}
    </>
  );
};

export default ScrollControls;