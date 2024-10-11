import React, { useState } from "react";
import Draggable from "react-draggable";
import styled from "styled-components";
import { FiFolder, FiSave, FiUpload, FiDownload, FiTrash2, FiChevronDown, FiChevronUp, FiMenu } from "react-icons/fi";
import plyToSplat from "../tools/plyToSplat";

// Define the interface for custom props
interface LoadSaveExportMenuProps {
  setLoadedModelUrl: React.Dispatch<React.SetStateAction<string | null>>;
  setIsModelLocal: React.Dispatch<React.SetStateAction<boolean>>;
  customModelUrl: string;
  setCustomModelUrl: React.Dispatch<React.SetStateAction<string>>;
  handleExport: () => void;
  resetSettings: () => void;
  saveToJson: () => void;
  loadFromJson: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// Styled Components
const MenuContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
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

// Create a new DraggableHeader component
const DraggableHeader = styled.div<{ isOpen: boolean }>`
  padding: 16px;
  background-color: #2c2c2c;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: ${({ isOpen }) => (isOpen ? "0" : "8px")};
  border-bottom-left-radius: ${({ isOpen }) => (isOpen ? "0" : "8px")};
  transition: border-radius 0.3s ease;
  cursor: move;
`;


const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px; /* Adjusted for consistency */
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
    color: #1e90ff; /* DodgerBlue on hover */
  }
`;

const Section = styled.div`
  margin-top: 12px;
`;

const SectionTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 16px; /* Consistent with Load/Save title */
  color: #ffffff;
  display: flex;
  align-items: center;
`;

const Button = styled.button<{ variant?: string; }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding:  6px 10px; /* Adjust padding based on requirement */
  margin-bottom: 8px;
  background-color: ${({ variant }) => {
    switch (variant) {
      case "primary":
        return "#007bff";
      case "success":
        return "#28a745";
      case "info":
        return "#17a2b8";
      case "danger":
        return "#dc3545";
      case "secondary":
        return "#555555";
      default:
        return "#555555";
    }
  }};
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  text-align: left;
  height: 40px; /* Fixed height for Save/Load buttons */

  &:hover {
    opacity: 0.9;
  }

  svg {
    margin-right: 8px;
    flex-shrink: 0;
    /* Consistent icon size */
    width: 18px;
    height: 18px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 10px;
  margin-bottom: 8px;
  box-sizing: border-box;
  border: 1px solid #555555;
  border-radius: 4px;
  background-color: #2c2c2c;
  color: #ffffff;
  font-size: 14px;

  &:focus {
    border-color: #1e90ff;
    outline: none;
    box-shadow: 0 0 5px rgba(30, 144, 255, 0.5);
  }
`;

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 91%;
  padding: 8px 12px;
  background-color: #17a2b8;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  text-align: center;
  height: 24px; /* Fixed height for consistency */

  &:hover {
    opacity: 0.9;
  }

  svg {
    margin-right: 8px;
    flex-shrink: 0;
    width: 18px;
    height: 18px;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const HorizontalLine = styled.hr`
  border: 1px solid #555555;
  margin: 16px 0;
`;

const CollapsibleSection = styled.div`
  margin-top: 8px;
`;

const CollapsibleHeader = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 0;
  color: #ffffff;
`;

const CollapsibleContent = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const SmallButton = styled(Button)`
  padding: 4px 8px;
  font-size: 12px;
  height: auto;
  margin-bottom: 4px;
`;

const CollapsibleMenuContainer = styled.div<{ isOpen: boolean }>`
  max-height: ${({ isOpen }) => (isOpen ? "1000px" : "0px")};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
`;

const MainHeader = styled.div<{ isOpen: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: ${({ isOpen }) => (isOpen ? "0" : "0")};
`;
const MainTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  color: #ffffff;
  display: flex;
  align-items: center;
`;

// Main Component

const LoadSaveExportMenu: React.FC<LoadSaveExportMenuProps> = ({
  setLoadedModelUrl,
  setIsModelLocal,
  customModelUrl,
  setCustomModelUrl,
  handleExport,
  resetSettings,
  saveToJson,
  loadFromJson,
}) => {
  const baseURL = "https://assets.babylonjs.com/splats/";
  const models = [
    "gs_Sqwakers_trimed.splat",
    "gs_Skull.splat",
    "gs_Plants.splat",
    "gs_Fire_Pit.splat",
  ];
  const modelNames = [
    "Sqwakers",
    "Skull",
    "Plants",
    "Fire Pit",
  ];

  const loadModel = (url: string) => {
    setLoadedModelUrl(url);
    setIsModelLocal(false);
  };

  const handleClear = () => {
    const confirmClear = window.confirm("Are you sure you want to clear all settings?");
    if (!confirmClear) return;
    resetSettings();
  };

  const [isDraggingDisabled, setIsDraggingDisabled] = React.useState<boolean>(false);
  const [isDefaultSplatsOpen, setIsDefaultSplatsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const handleFocus = () => setIsDraggingDisabled(true);
  const handleBlur = () => setIsDraggingDisabled(false);

  const handlePlyFileConvert = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.files){
      plyToSplat([event.target.files[0]]);
    }
  };

  return (
    <Draggable handle=".handle">
      <MenuContainer>
        <DraggableHeader isOpen={isMenuOpen} className="handle">
          <MainHeader isOpen={isMenuOpen}>
            <MainTitle>
              <FiMenu size={18} style={{ marginRight: "8px" }} />
              Load / Save Menu
            </MainTitle>
            <ToggleButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <FiChevronUp /> : <FiChevronDown />}
            </ToggleButton>
          </MainHeader>
        </DraggableHeader>
        <CollapsibleMenuContainer isOpen={isMenuOpen}>
          <div style={{ padding: "16px" }}>
            <SectionTitle>
              <FiFolder size={18} style={{ marginRight: "8px" }} /> Load Splats
            </SectionTitle>

            <Input
              type="text"
              placeholder="Enter custom splat URL"
              value={customModelUrl}
              onChange={(e) => setCustomModelUrl(e.target.value)}
            />
            <Button
              variant="success"
              onClick={() => {
                if (customModelUrl) {
                  loadModel(customModelUrl);
                } else {
                  alert("Please enter a valid URL.");
                }
              }}
            >
              <FiUpload size={18} /> Load Custom Splat
            </Button>
            <FileInputLabel htmlFor="ply-to-splat-input">
              Convert PLY to Splat
            </FileInputLabel>
            <HiddenFileInput
              id="ply-to-splat-input"
              type="file"
              accept=".ply"
              onChange={handlePlyFileConvert}
            />

            <CollapsibleSection>
              <CollapsibleHeader onClick={() => setIsDefaultSplatsOpen(!isDefaultSplatsOpen)}>
                {isDefaultSplatsOpen ? <FiChevronUp /> : <FiChevronDown />} Example Splats
              </CollapsibleHeader>
              <CollapsibleContent isOpen={isDefaultSplatsOpen}>
                {models.map((splat, index) => (
                  <SmallButton
                    key={index}
                    variant="secondary"
                    onClick={() => loadModel(baseURL + splat)}
                  >
                    {modelNames[index]}
                  </SmallButton>
                ))}
              </CollapsibleContent>
            </CollapsibleSection>
            <HorizontalLine />

            <Header>
              <Title>
                <FiFolder size={20} style={{ marginRight: "8px" }} /> Load/Save
              </Title>
            </Header>

            <Section>
              <Button variant="primary" onClick={handleExport}>
                <FiDownload size={18} /> Export Scene
              </Button>

              <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                <Button
                  variant="success"
                  style={{ flex: 1 }}
                  onClick={saveToJson}
                >
                  <FiSave size={18} /> Save Project
                </Button>
                <FileInputLabel htmlFor="load-json">
                  <FiUpload size={18} /> Load Project
                </FileInputLabel>
                <HiddenFileInput
                  id="load-json"
                  type="file"
                  accept=".json"
                  onChange={loadFromJson}
                />
              </div>
            </Section>

            <Button variant="danger" onClick={handleClear}>
              <FiTrash2 size={18} /> Reset All
            </Button>
          </div>
        </CollapsibleMenuContainer>
      </MenuContainer>
    </Draggable>
  );
};

export default LoadSaveExportMenu;