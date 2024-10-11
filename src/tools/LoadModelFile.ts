import * as BABYLON from "@babylonjs/core";
import addTooltipToMesh from "./AddToolTipToMesh";

/**
 * Asynchronously loads a model file into the BabylonJS scene.
 *
 * @param fileOrUrl - The file or URL of the model to load.
 * @param scene - The BabylonJS scene where the model will be loaded.
 * @param isComponentMounted - Flag to check if the component is still mounted.
 * @param setIsModelLocal - State setter to indicate if the model is loaded locally.
 * @param infoTextRef - Ref to display informational text or errors.
 * @returns A promise that resolves to an array of loaded meshes or undefined if failed.
 */
const loadModelFile = async (
  fileOrUrl: File | string,
  scene: BABYLON.Scene,
  isComponentMounted: boolean,
  setIsModelLocal: React.Dispatch<React.SetStateAction<boolean>>,
  infoTextRef: React.RefObject<HTMLDivElement>
): Promise<BABYLON.AbstractMesh[] | undefined> => {
  // Define supported file extensions
  const loadExtensions = [".splat", ".ply", ".gltf", ".glb"];

  // Determine file extension
  let fileExtension = "";
  if (typeof fileOrUrl === "string") {
    const parts = fileOrUrl.split(".");
    fileExtension = "." + (parts.pop()?.toLowerCase() || "");
  } else {
    const parts = fileOrUrl.name.split(".");
    fileExtension = "." + (parts.pop()?.toLowerCase() || "");
  }

  // Check for supported file formats
  if (!loadExtensions.includes(fileExtension)) {
    alert(
      "Unsupported file format. Please load a .splat, .ply, .gltf, or .glb file."
    );
    return;
  }

  try {
    let result: BABYLON.ISceneLoaderAsyncResult;
    let isLocal = false;

    if (typeof fileOrUrl === "string") {
      console.log("Loading model from URL:", fileOrUrl);
      // Load from URL
      result = await BABYLON.SceneLoader.ImportMeshAsync("", fileOrUrl, "", scene);
      isLocal = false;
    } else {
      console.log("Loading model from file:", fileOrUrl.name);
      result = await BABYLON.SceneLoader.ImportMeshAsync("", "", fileOrUrl, scene);
      isLocal = true;
    }

    if (!isComponentMounted) return;

    const newMeshes = result.meshes;
    newMeshes.forEach((mesh) => {
      if (mesh instanceof BABYLON.Mesh) {
        mesh.position = BABYLON.Vector3.Zero();
       // addTooltipToMesh(mesh, 'tooltip', scene);
      }
    });

    // Frame new mesh in camera
    const camera = scene.activeCamera as BABYLON.FreeCamera;
    let target = newMeshes[0];
    let scaleFactor = .5;

    //Helper function to calculate the distance needed to frame the target
    const frameTarget = (target: BABYLON.AbstractMesh, camera: BABYLON.FreeCamera, scaleFactor: number) =>{
        let bbInfo = target.getBoundingInfo();
        let box = bbInfo.boundingBox;
        let minX = Number.POSITIVE_INFINITY;
        let maxX = Number.NEGATIVE_INFINITY;
        let minY = Number.POSITIVE_INFINITY;
        let maxY = Number.NEGATIVE_INFINITY;
        let minZ = Number.POSITIVE_INFINITY;
        let maxZ = Number.NEGATIVE_INFINITY;
        let maxDistance = Number.NEGATIVE_INFINITY;
        let targetPosition = target.position.clone();
        let vectors = box.vectorsWorld;
        vectors.forEach((v) => {
          minX = Math.min(minX, v.x - targetPosition.x);
          maxX = Math.max(maxX, v.x - targetPosition.x);
          minY = Math.min(minY, v.y - targetPosition.y);
          maxY = Math.max(maxY, v.y - targetPosition.y);
          minZ = Math.min(minZ, v.z - targetPosition.z);
          maxZ = Math.max(maxZ, v.z - targetPosition.z);
          let md0 = Math.pow(Math.pow(maxX - minX, 2) + Math.pow(maxY - minY, 2), 0.5);
          let md1 = Math.pow(Math.pow(maxX - minX, 2) + Math.pow(maxZ - minZ, 2), 0.5);
          let md2 = Math.pow(Math.pow(maxY - minY, 2) + Math.pow(maxZ - minZ, 2), 0.5);
          maxDistance = Math.max(maxDistance, Math.max(md0, Math.max(md1, md2)));
        });

        let fov = camera.fov;
        let scale = Math.min(Math.max(((maxDistance / Math.tan(fov * 0.5)) * scaleFactor), camera.minZ * 2), camera.maxZ * 0.8);
        let normal = camera.getForwardRay(1).direction;
        camera.position = normal.scale(-scale).add(targetPosition);
    }

    if (camera) {
        frameTarget(target, camera, scaleFactor)
    }


    // Hide the info text
    if (infoTextRef.current) infoTextRef.current.style.display = "none";

    setIsModelLocal(isLocal); // Update state based on loading source

    return newMeshes;
  } catch (error) {
    console.error("Error loading model file:", error);
    alert("Error loading model file: " + (error as Error).message);
    return;
  }
};

export default loadModelFile;
