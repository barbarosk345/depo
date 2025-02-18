import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import * as BABYLON from "@babylonjs/core";
import { Waypoint, Interaction } from "../App";
import InteractionEditor from "./InteractionEditor";
import { FiCamera } from "react-icons/fi";

type WaypointControlsProps = {
  waypoints: Waypoint[];
  setWaypoints: React.Dispatch<React.SetStateAction<Waypoint[]>>;
  isEditMode: boolean;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  scene?: BABYLON.Scene;
  cameraMode: 'tour' | 'explore' | 'auto';
  setCameraMode: React.Dispatch<React.SetStateAction<'tour' | 'explore' | 'auto'>>;
};

const WaypointControls: React.FC<WaypointControlsProps> = ({ 
  waypoints, 
  setWaypoints, 
  isEditMode, 
  setIsEditMode, 
  scene,
  cameraMode,
  setCameraMode,
}) => {
  const [editingWaypointIndex, setEditingWaypointIndex] = useState<number | null>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [collapsedWaypoints, setCollapsedWaypoints] = useState<Set<number>>(new Set());


  useEffect(() => {
    setCollapsedWaypoints(new Set(waypoints.map((_, index) => index)));
  }, [waypoints.length]);

  const getQuaternionFromRotation = (rotation: any): BABYLON.Quaternion => {
    if (rotation instanceof BABYLON.Quaternion) {
      return rotation.clone();
    } else if (rotation && typeof rotation === 'object' && 'x' in rotation && 'y' in rotation && 'z' in rotation && 'w' in rotation) {
      return new BABYLON.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w);
    } else {
      console.warn('Invalid rotation format, using default Quaternion');
      return BABYLON.Quaternion.Identity();
    }
  };

  const handleWaypointChange = (
    index: number,
    axis: "x" | "y" | "z" | "rotationX" | "rotationY" | "rotationZ",
    value: string
  ) => {
    const newWaypoints = [...waypoints];
    if (axis === "x" || axis === "y" || axis === "z") {
      newWaypoints[index] = { ...newWaypoints[index], [axis]: parseFloat(value) };
    } else {
      const quaternion = getQuaternionFromRotation(newWaypoints[index].rotation);
      const euler = quaternion.toEulerAngles();
      euler[axis.charAt(8).toLowerCase() as 'x' | 'y' | 'z'] = parseFloat(value);
      newWaypoints[index] = {
        ...newWaypoints[index],
        rotation: BABYLON.Quaternion.FromEulerAngles(euler.x, euler.y, euler.z),
      };
    }
    setWaypoints(newWaypoints);
  };

  const addWaypoint = () => {
    const camera = scene?.activeCamera;
    const cameraRotation = camera?.absoluteRotation;
    const cameraPosition = camera?.position;

    const newWaypoint: Waypoint = {
      x: cameraPosition ? cameraPosition.x : 0,
      y: cameraPosition ? cameraPosition.y : 0,
      z: cameraPosition ? cameraPosition.z : 0,
      rotation: cameraRotation ? cameraRotation.clone() : BABYLON.Quaternion.Identity(),
      interactions: [],
    };
    setWaypoints([...waypoints, newWaypoint]);
    setCollapsedWaypoints(prev => new Set(prev).add(waypoints.length));
  };

  const removeWaypoint = (index: number) => {
    const newWaypoints = waypoints.filter((_, i) => i !== index);
    setWaypoints(newWaypoints);
    setCollapsedWaypoints(prev => {
      const newSet = new Set<number>();
      newWaypoints.forEach((_, i) => {
        if (prev.has(i < index ? i : i + 1)) {
          newSet.add(i);
        }
      });
      return newSet;
    });
  };

  const updateWaypointInteractions = (interactions: Interaction[]) => {
    if (editingWaypointIndex !== null) {
      const newWaypoints = [...waypoints];
      newWaypoints[editingWaypointIndex] = { 
        ...newWaypoints[editingWaypointIndex], 
        interactions: interactions 
      };
      setWaypoints(newWaypoints);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if(!isEditMode){
       setCameraMode('explore');
    }
  };

  const toggleWaypointCollapse = (index: number) => {
    setCollapsedWaypoints(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const updateWaypointToCurrentCamera = (index: number) => {
    const camera = scene?.activeCamera;
    if (camera) {
      const newWaypoints = [...waypoints];
      newWaypoints[index] = {
        ...newWaypoints[index],
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
        rotation: camera.absoluteRotation.clone(),
      };
      setWaypoints(newWaypoints);
    }
  };

  return (
    <>
      <Draggable handle=".handle">
        <div
          className="handle"
          style={{
            position: "absolute",
            top: "10px",
            right: "300px",
            backgroundColor: "rgba(0,0,0,0.7)",
            borderRadius: "5px",
            color: "white",
            zIndex: 10,
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            cursor: "move",
            overflow: "hidden",
            transition: "height 0.3s ease",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <div
            className="header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 10px",
              backgroundColor: "rgba(0,0,0,0.8)",
              cursor: "move",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "normal" }}>Waypoints</h3>
            <div style={{ display: "flex", alignItems: "center" }}>
              <button
                onClick={toggleEditMode}
                style={{
                  marginRight: "10px",
                  padding: "4px 8px",
                  backgroundColor: isEditMode ? "#dc3545" : "#28a745",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                  borderRadius: "3px",
                  fontSize: "12px",
                }}
              >
                {isEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}
              </button>
              <button
                onClick={toggleCollapse}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "16px",
                  lineHeight: "1",
                }}
                aria-label={isCollapsed ? "Expand Waypoints" : "Collapse Waypoints"}
              >
                {isCollapsed ? "▲" : "▼"}
              </button>
            </div>
          </div>

          <div
            className="content"
            style={{
              maxHeight: isCollapsed ? "0px" : "400px",
              opacity: isCollapsed ? 0 : 1,
              padding: isCollapsed ? "0 10px" : "10px",
              transition: "max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease",
              overflowY: "auto",
              backgroundColor: "rgba(0,0,0,0.6)",
            }}
          >
            {waypoints.map((wp, index) => (
              <div
                key={index}
                style={{
                  marginTop: "8px",
                  paddingBottom: "8px",
                  borderBottom: "1px solid #444",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ 
                    fontSize: "14px", 
                    color: "#ddd",
                    marginRight: "10px"
                  }}>
                    Waypoint {index + 1}
                  </span>
                  <div>
                    <button
                      onClick={() => updateWaypointToCurrentCamera(index)}
                      style={{
                        marginRight: "5px",
                        padding: "3px 6px",
                        backgroundColor: "#007BFF",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "3px",
                        fontSize: "11px",
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                      title="Update to current camera position and rotation"
                    >
                      <FiCamera style={{ marginRight: "2px" }} />
                    </button>
                    <button
                      onClick={() => setEditingWaypointIndex(index)}
                      style={{
                        marginRight: "5px",
                        padding: "3px 6px",
                        backgroundColor: "#007BFF",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "3px",
                        fontSize: "11px",
                      }}
                    >
                      Edit Interactions
                    </button>
                    <button
                      onClick={() => removeWaypoint(index)}
                      style={{
                        padding: "3px 6px",
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "3px",
                        fontSize: "11px",
                      }}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => toggleWaypointCollapse(index)}
                      style={{
                        marginLeft: "5px",
                        padding: "3px 6px",
                        backgroundColor: "transparent",
                        color: "#ccc",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "12px",
                      }}
                      aria-label={collapsedWaypoints.has(index) ? "Expand Coordinates" : "Collapse Coordinates"}
                    >
                      {collapsedWaypoints.has(index) ? "Show" : "Hide"} Coordinates
                    </button>
                  </div>
                </div>
                {!collapsedWaypoints.has(index) && (
                  <div style={{ marginTop: "6px" }}>
                    {/* Position Coordinates */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "4px" }}>
                      {["x", "y", "z"].map((axis) => (
                        <label key={axis} style={{ display: "flex", alignItems: "center", fontSize: "12px", color: "#ccc" }}>
                          <span style={{ marginRight: "4px", width: "30px" }}>
                            {axis.toUpperCase()}
                          </span>
                          <input
                            type="number"
                            step="0.1"
                            value={wp[axis as "x" | "y" | "z"]}
                            onChange={(e) => handleWaypointChange(index, axis as "x" | "y" | "z", e.target.value)}
                            style={{
                              width: "60px",
                              padding: "2px 4px",
                              borderRadius: "3px",
                              border: "1px solid #555",
                              backgroundColor: "#333",
                              color: "#fff",
                              fontSize: "12px",
                            }}
                          />
                        </label>
                      ))}
                    </div>
                    {/* Rotation Coordinates */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {["rotationX", "rotationY", "rotationZ"].map((axis) => (
                        <label key={axis} style={{ display: "flex", alignItems: "center", fontSize: "12px", color: "#ccc" }}>
                          <span style={{ marginRight: "4px", width: "30px" }}>
                            {axis.replace("rotation", "R")}
                          </span>
                          <input
                            type="number"
                            step="0.1"
                            value={BABYLON.Angle.FromRadians(getQuaternionFromRotation(wp.rotation).toEulerAngles()[axis.charAt(8).toLowerCase() as 'x' | 'y' | 'z']).degrees()}
                            onChange={(e) => handleWaypointChange(index, axis as "rotationX" | "rotationY" | "rotationZ", e.target.value)}
                            style={{
                              width: "60px",
                              padding: "2px 4px",
                              borderRadius: "3px",
                              border: "1px solid #555",
                              backgroundColor: "#333",
                              color: "#fff",
                              fontSize: "12px",
                            }}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={addWaypoint}
              style={{
                marginTop: "10px",
                padding: "6px 12px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                cursor: "pointer",
                borderRadius: "3px",
                fontSize: "14px",
                width: "100%",
              }}
            >
              Add Waypoint at Camera Position
            </button>
          </div>
        </div>
      </Draggable>
      
      {editingWaypointIndex !== null && (
        <InteractionEditor
          waypointIndex={editingWaypointIndex}
          interactions={waypoints[editingWaypointIndex].interactions}
          setInteractions={updateWaypointInteractions}
          onClose={() => setEditingWaypointIndex(null)}
        />
      )}
    </>
  );
};

export default WaypointControls;