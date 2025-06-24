const ros = new ROSLIB.Ros({ url: 'ws://localhost:9090' });

const locationChosenTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/location_chosen',
    messageType: 'std_msgs/String'
});

const gotoStatusTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/goto_status',
    messageType: 'std_msgs/Bool'
});

const searchStatusTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/search_status',
    messageType: 'std_msgs/Bool'
});

const mouseCbTopicQuadruped = new ROSLIB.Topic({
    ros: ros,
    name: "/camera/quadruped/mouse_click",
    messageType: "geometry_msgs/Point"
});

const mouseCbTopicArm = new ROSLIB.Topic({
    ros: ros,
    name: "/camera/arm/mouse_click",
    messageType: "geometry_msgs/Point"
});

const yoloEnabledTopicQuadruped = new ROSLIB.Topic({
  ros: ros,
  name: '/yolo_enabled_quadruped',
  messageType: 'std_msgs/Bool'
});

const yoloEnabledTopicArm = new ROSLIB.Topic({
  ros: ros,
  name: '/yolo_enabled_arm',
  messageType: 'std_msgs/Bool'
});

const cancelTrackingTopic = new ROSLIB.Topic({
  ros: ros,
  name: '/cancel_tracking',
  messageType: 'std_msgs/Empty'
});

const trackedStatusTopic = new ROSLIB.Topic({
  ros: ros,
  name: '/tracked_status',
  messageType: 'std_msgs/Bool'
});

const trackedCenterTopic = new ROSLIB.Topic({
  ros: ros,
  name: '/tracked_center',
  messageType: 'geometry_msgs/Point'
});

const trackedDepthTopic = new ROSLIB.Topic({
  ros: ros,
  name: '/tracked_depth',
  messageType: 'std_msgs/Int32'
});

const dragBboxTopicQuadruped = new ROSLIB.Topic({
  ros: ros,
  name: '/camera/quadruped/drag_bbox',
  messageType: 'geometry_msgs/PolygonStamped'
});

const dragBboxTopicArm = new ROSLIB.Topic({
  ros: ros,
  name: '/camera/arm/drag_bbox',
  messageType: 'geometry_msgs/PolygonStamped'
});

const navStatusTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/nav_status',
    messageType: 'std_msgs/String'
});

const manStatusTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/man_status',
    messageType: 'std_msgs/String'
});

// State variables
let currentLocation = document.getElementById("locationDropdown").value;
let scanStatus = false;
let gotoPublishTrueOnce = false; // Flag to indicate if true should be published

// Button function
function publishGoto() {
  gotoPublishTrueOnce = true; // Set the flag to true when the button is clicked
}

function publishScan(status) {
  scanStatus = status;
}

// Intervals
setInterval(() => {
  locationChosenTopic.publish(new ROSLIB.Message({ data: currentLocation }));
  searchStatusTopic.publish(new ROSLIB.Message({ data: scanStatus }));

  if (gotoPublishTrueOnce) {
    gotoStatusTopic.publish(new ROSLIB.Message({ data: true }));
    gotoPublishTrueOnce = false; // Reset the flag after publishing true once
  } else {
    gotoStatusTopic.publish(new ROSLIB.Message({ data: false }));
  }
}, 500); // publish every second

// Update currentLocation when dropdown changes
document.getElementById("locationDropdown").addEventListener("change", (e) => {
  currentLocation = e.target.value;
  document.getElementById("currentLocation").innerText = currentLocation;
});
// This is redundant indeed, but this useful at the beginning of the program flow
const currentLocationSpan = document.getElementById("currentLocation");
locationChosenTopic.subscribe((msg) => {
    currentLocationSpan.innerText = msg.data;
});

// document.getElementById("frontCamera").addEventListener("click", function(event) {
//     const rect = event.target.getBoundingClientRect();
//     const x = event.clientX - rect.left;
//     const y = event.clientY - rect.top;

//     // Dimensions of the displayed image
//     const displayWidth = rect.width;
//     const displayHeight = rect.height;

//     // Dimensions of the original image from the camera (actual resolution)
//     const naturalWidth = event.target.naturalWidth;
//     const naturalHeight = event.target.naturalHeight;

//     // Scale the click coordinates back to actual pixel positions
//     const scaleX = naturalWidth / displayWidth;
//     const scaleY = naturalHeight / displayHeight;

//     const correctedX = x * scaleX;
//     const correctedY = y * scaleY;

//     console.log("[Quadruped] Corrected click at:", correctedX, correctedY);

//     const point = new ROSLIB.Message({ x: correctedX, y: correctedY, z: 0 });
//     mouseCbTopicQuadruped.publish(point);
// });

// document.getElementById("gripperCamera").addEventListener("click", function(event) {
//     const rect = event.target.getBoundingClientRect();
//     const x = event.clientX - rect.left;
//     const y = event.clientY - rect.top;

//     // Dimensions of the displayed image
//     const displayWidth = rect.width;
//     const displayHeight = rect.height;

//     // Dimensions of the original image from the camera (actual resolution)
//     const naturalWidth = event.target.naturalWidth;
//     const naturalHeight = event.target.naturalHeight;

//     // Scale the click coordinates back to actual pixel positions
//     const scaleX = naturalWidth / displayWidth;
//     const scaleY = naturalHeight / displayHeight;

//     const correctedX = x * scaleX;
//     const correctedY = y * scaleY;

//     console.log("[Arm] Corrected click at:", correctedX, correctedY);

//     const point = new ROSLIB.Message({ x: correctedX, y: correctedY, z: 0 });
//     mouseCbTopicArm.publish(point);
// });

// Publish Bool message when object detection checkbox changes
const objectDetectionToggleQuadruped = document.getElementById('objectDetectionToggleQuadruped');
objectDetectionToggleQuadruped.addEventListener('change', () => {
  const msg = new ROSLIB.Message({
    data: objectDetectionToggleQuadruped.checked
  });
  yoloEnabledTopicQuadruped.publish(msg);
  console.log('Published yolo_enabled_quadruped:', objectDetectionToggleQuadruped.checked);
});

const objectDetectionToggleArm = document.getElementById('objectDetectionToggleArm');
objectDetectionToggleArm.addEventListener('change', () => {
  const msg = new ROSLIB.Message({
    data: objectDetectionToggleArm.checked
  });
  yoloEnabledTopicArm.publish(msg);
  console.log('Published yolo_enabled_arm:', objectDetectionToggleArm.checked);
});

// Publish Empty message when cancel tracking button clicked
const cancelTrackingBtn = document.getElementById('cancelTrackingBtn');
cancelTrackingBtn.addEventListener('click', () => {
  const msg = new ROSLIB.Message({});
  cancelTrackingTopic.publish(msg);
  console.log('Published cancel_tracking');
});

// Drag Select and mouse click Logic for quadruped
// HTML Elements
const frontCamera = document.getElementById('frontCamera');
const frontCamCanvas = document.getElementById('frontCamCanvas');
// const objectDetectionToggleQuadruped = document.getElementById('objectDetectionToggleQuadruped');
const frontCamCtx = frontCamCanvas.getContext('2d');
// State variables
let q_isDrawing = false; // A simple flag to know if the mouse button is down
let q_startX, q_startY; // Stores SCALED coordinates
let q_startEventX, q_startEventY; // Stores raw event coordinates for drawing
let q_startTime;
let frontCamCanvasInitialized = false;
// Helper function for coordinate scaling (Unchanged)
function q_getScaledCoordinates(e) {
  const rect = frontCamera.getBoundingClientRect();
  const naturalWidth = frontCamera.naturalWidth;
  const naturalHeight = frontCamera.naturalHeight;
  if (rect.width === 0 || rect.height === 0 || naturalWidth === 0 || naturalHeight === 0) {
    return { x: 0, y: 0 };
  }
  const scaleX = naturalWidth / rect.width;
  const scaleY = naturalHeight / rect.height;
  const scaledX = e.offsetX * scaleX;
  const scaledY = e.offsetY * scaleY;
  return { x: scaledX, y: scaledY };
}
// --- Canvas Setup (Unchanged) ---
const resizeFrontCamCanvas = () => {
  frontCamCanvas.width = frontCamera.clientWidth;
  frontCamCanvas.height = frontCamera.clientHeight;
};
frontCamera.onload = () => {
  if (!frontCamCanvasInitialized) {
    resizeFrontCamCanvas();
    frontCamCanvasInitialized = true;
  }
};
window.onresize = resizeFrontCamCanvas;
const clearFrontCamCanvas = () => frontCamCtx.clearRect(0, 0, frontCamCanvas.width, frontCamCanvas.height);
// --- Event Handlers with New Mode-Switching Logic ---
// Clear frontCamCanvas if the mode is switched, to avoid confusion.
objectDetectionToggleQuadruped.addEventListener('change', clearFrontCamCanvas);
// Mousedown is simple: it just records the starting point.
frontCamCanvas.addEventListener('mousedown', (e) => {
  q_isDrawing = true;
  q_startTime = Date.now();
  q_startEventX = e.offsetX;
  q_startEventY = e.offsetY;
  const scaledCoords = q_getScaledCoordinates(e);
  q_startX = scaledCoords.x;
  q_startY = scaledCoords.y;
});
// Mousemove will ONLY draw the rectangle if we are in "Drag Mode" (checkbox unchecked).
frontCamCanvas.addEventListener('mousemove', (e) => {
  // <-- NEW LOGIC HERE
  const isCheckboxChecked = objectDetectionToggleQuadruped.checked;
  // Do not draw the rubber-band rectangle if the checkbox is checked (i.e., we are in "Click Mode").
  if (!q_isDrawing || isCheckboxChecked) {
    return;
  }
  clearFrontCamCanvas();
  frontCamCtx.strokeStyle = 'red';
  frontCamCtx.lineWidth = 2;
  frontCamCtx.strokeRect(q_startEventX, q_startEventY, e.offsetX - q_startEventX, e.offsetY - q_startEventY);
});
// Mouseup is the main controller. It checks the checkbox state to decide what to do.
frontCamCanvas.addEventListener('mouseup', (e) => {
  if (!q_isDrawing) return;
  q_isDrawing = false;
  const isCheckboxChecked = objectDetectionToggleQuadruped.checked; // <-- CHECK THE MODE
  const timeElapsed = Date.now() - q_startTime;
  const endScaledCoords = q_getScaledCoordinates(e);
  const dist = Math.sqrt(Math.pow(endScaledCoords.x - q_startX, 2) + Math.pow(endScaledCoords.y - q_startY, 2));
  // ==========================================================
  //  A. IF CHECKBOX IS CHECKED (CLICK MODE)
  // ==========================================================
  if (isCheckboxChecked) {
    // Check if it was a genuine click (short time, short distance)
    if (timeElapsed < 250 && dist < 10) {
      console.log("Click Mode: Corrected click at", q_startX, q_startY);
      const pointMsg = new ROSLIB.Message({ x: q_startX, y: q_startY, z: 0 });
      mouseCbTopicQuadruped.publish(pointMsg);
    } else {
      // It was a drag attempt while in click mode, so we ignore it.
      console.log("Click Mode: Drag ignored.");
    }
  // ==========================================================
  //  B. IF CHECKBOX IS UNCHECKED (DRAG MODE)
  // ==========================================================
  } else {
    // Check if it was a genuine drag (not just an accidental click)
    if (dist > 10) {
      const userConfirmed = confirm("Send this bounding box to the topic?");
      if (userConfirmed) {
        q_publishBoundingBox(q_startX, q_startY, endScaledCoords.x, endScaledCoords.y);
      } else {
        console.log("Drag Mode: User canceled.");
      }
    } else {
        // It was a click while in drag mode, so we ignore it.
        console.log("Drag Mode: Click ignored.")
    }
  }
  // Finally, always clear the frontCamCanvas for the next action.
  clearFrontCamCanvas();
});
// Publishing function for bounding box (Unchanged)
function q_publishBoundingBox(scaledX1, scaledY1, scaledX2, scaledY2) {
  const finalX1 = Math.min(scaledX1, scaledX2);
  const finalY1 = Math.min(scaledY1, scaledY2);
  const finalX2 = Math.max(scaledX1, scaledX2);
  const finalY2 = Math.max(scaledY1, scaledY2);
  const points = [
    { x: finalX1, y: finalY1, z: 0 },
    { x: finalX2, y: finalY1, z: 0 },
    { x: finalX2, y: finalY2, z: 0 },
    { x: finalX1, y: finalY2, z: 0 }
  ];
  const polygonStampedMsg = new ROSLIB.Message({
    header: {
      stamp: { secs: Math.floor(Date.now() / 1000), nsecs: (Date.now() % 1000) * 1000000 },
      frame_id: 'front_camera_link'
    },
    polygon: { points: points.map(p => new ROSLIB.Message({ x: p.x, y: p.y, z: p.z })) }
  });
  dragBboxTopicQuadruped.publish(polygonStampedMsg);
  console.log('Drag Mode: User confirmed. Publishing SCALED bounding box.');
}

// Drag Select and mouse click Logic for arm
// HTML Elements
const gripperCamera = document.getElementById('gripperCamera');
const gripperCamCanvas = document.getElementById('gripperCamCanvas');
// const objectDetectionToggleArm = document.getElementById('objectDetectionToggleArm');
const gripperCamCtx = gripperCamCanvas.getContext('2d');
// State variables
let a_isDrawing = false; // A simple flag to know if the mouse button is down
let a_startX, a_startY; // Stores SCALED coordinates
let a_startEventX, a_startEventY; // Stores raw event coordinates for drawing
let a_startTime;
let gripperCamCanvasInitialized = false;
// Helper function for coordinate scaling (Unchanged)
function a_getScaledCoordinates(e) {
  const rect = gripperCamera.getBoundingClientRect();
  const naturalWidth = gripperCamera.naturalWidth;
  const naturalHeight = gripperCamera.naturalHeight;
  if (rect.width === 0 || rect.height === 0 || naturalWidth === 0 || naturalHeight === 0) {
    return { x: 0, y: 0 };
  }
  const scaleX = naturalWidth / rect.width;
  const scaleY = naturalHeight / rect.height;
  const scaledX = e.offsetX * scaleX;
  const scaledY = e.offsetY * scaleY;
  return { x: scaledX, y: scaledY };
}
// --- Canvas Setup (Unchanged) ---
const resizeGripperCamCanvas = () => {
  gripperCamCanvas.width = gripperCamera.clientWidth;
  gripperCamCanvas.height = gripperCamera.clientHeight;
};
gripperCamera.onload = () => {
  if (!gripperCamCanvasInitialized) {
    resizeGripperCamCanvas();
    gripperCamCanvasInitialized = true;
  }
};
window.onresize = resizeGripperCamCanvas;
const clearGripperCamCanvas = () => gripperCamCtx.clearRect(0, 0, gripperCamCanvas.width, gripperCamCanvas.height);
// --- Event Handlers with New Mode-Switching Logic ---
// Clear gripperCamCanvas if the mode is switched, to avoid confusion.
objectDetectionToggleArm.addEventListener('change', clearGripperCamCanvas);
// Mousedown is simple: it just records the starting point.
gripperCamCanvas.addEventListener('mousedown', (e) => {
  a_isDrawing = true;
  a_startTime = Date.now();
  a_startEventX = e.offsetX;
  a_startEventY = e.offsetY;
  const scaledCoords = a_getScaledCoordinates(e);
  a_startX = scaledCoords.x;
  a_startY = scaledCoords.y;
});
// Mousemove will ONLY draw the rectangle if we are in "Drag Mode" (checkbox unchecked).
gripperCamCanvas.addEventListener('mousemove', (e) => {
  // <-- NEW LOGIC HERE
  const isCheckboxChecked = objectDetectionToggleArm.checked;
  // Do not draw the rubber-band rectangle if the checkbox is checked (i.e., we are in "Click Mode").
  if (!a_isDrawing || isCheckboxChecked) {
    return;
  }
  clearGripperCamCanvas();
  gripperCamCtx.strokeStyle = 'red';
  gripperCamCtx.lineWidth = 2;
  gripperCamCtx.strokeRect(a_startEventX, a_startEventY, e.offsetX - a_startEventX, e.offsetY - a_startEventY);
});
// Mouseup is the main controller. It checks the checkbox state to decide what to do.
gripperCamCanvas.addEventListener('mouseup', (e) => {
  if (!a_isDrawing) return;
  a_isDrawing = false;
  const isCheckboxChecked = objectDetectionToggleArm.checked; // <-- CHECK THE MODE
  const timeElapsed = Date.now() - a_startTime;
  const endScaledCoords = a_getScaledCoordinates(e);
  const dist = Math.sqrt(Math.pow(endScaledCoords.x - a_startX, 2) + Math.pow(endScaledCoords.y - a_startY, 2));
  // ==========================================================
  //  A. IF CHECKBOX IS CHECKED (CLICK MODE)
  // ==========================================================
  if (isCheckboxChecked) {
    // Check if it was a genuine click (short time, short distance)
    if (timeElapsed < 250 && dist < 10) {
      console.log("Click Mode: Corrected click at", a_startX, a_startY);
      const pointMsg = new ROSLIB.Message({ x: a_startX, y: a_startY, z: 0 });
      mouseCbTopicArm.publish(pointMsg);
    } else {
      // It was a drag attempt while in click mode, so we ignore it.
      console.log("Click Mode: Drag ignored.");
    }
  // ==========================================================
  //  B. IF CHECKBOX IS UNCHECKED (DRAG MODE)
  // ==========================================================
  } else {
    // Check if it was a genuine drag (not just an accidental click)
    if (dist > 10) {
      const userConfirmed = confirm("Send this bounding box to the topic?");
      if (userConfirmed) {
        a_publishBoundingBox(a_startX, a_startY, endScaledCoords.x, endScaledCoords.y);
      } else {
        console.log("Drag Mode: User canceled.");
      }
    } else {
        // It was a click while in drag mode, so we ignore it.
        console.log("Drag Mode: Click ignored.")
    }
  }
  // Finally, always clear the gripperCamCanvas for the next action.
  clearGripperCamCanvas();
});
// Publishing function for bounding box (Unchanged)
function a_publishBoundingBox(scaledX1, scaledY1, scaledX2, scaledY2) {
  const finalX1 = Math.min(scaledX1, scaledX2);
  const finalY1 = Math.min(scaledY1, scaledY2);
  const finalX2 = Math.max(scaledX1, scaledX2);
  const finalY2 = Math.max(scaledY1, scaledY2);
  const points = [
    { x: finalX1, y: finalY1, z: 0 },
    { x: finalX2, y: finalY1, z: 0 },
    { x: finalX2, y: finalY2, z: 0 },
    { x: finalX1, y: finalY2, z: 0 }
  ];
  const polygonStampedMsg = new ROSLIB.Message({
    header: {
      stamp: { secs: Math.floor(Date.now() / 1000), nsecs: (Date.now() % 1000) * 1000000 },
      frame_id: 'gripper_camera_link'
    },
    polygon: { points: points.map(p => new ROSLIB.Message({ x: p.x, y: p.y, z: p.z })) }
  });
  dragBboxTopicArm.publish(polygonStampedMsg);
  console.log('Drag Mode: User confirmed. Publishing SCALED bounding box.');
}

// Robot State Information Block
gotoStatusTopic.subscribe(msg => document.getElementById('info_goto_status').innerText = msg.data);
locationChosenTopic.subscribe(msg => document.getElementById('info_location_chosen').innerText = msg.data);
searchStatusTopic.subscribe(msg => document.getElementById('info_search_status').innerText = msg.data);
yoloEnabledTopicQuadruped.subscribe(msg => document.getElementById('info_yolo_enabled_quadruped').innerText = msg.data);
yoloEnabledTopicArm.subscribe(msg => document.getElementById('info_yolo_enabled_arm').innerText = msg.data);
trackedStatusTopic.subscribe(msg => document.getElementById('info_tracked_status').innerText = msg.data);
trackedCenterTopic.subscribe(msg => document.getElementById('info_tracked_center_x').innerText = msg.x);
trackedCenterTopic.subscribe(msg => document.getElementById('info_tracked_center_y').innerText = msg.y);
trackedDepthTopic.subscribe(msg => document.getElementById('info_tracked_depth').innerText = msg.data);
// cancelTrackingTopic.subscribe(msg => document.getElementById('info_cancel_tracking').innerText = msg.data);

// Navigation & Manipulation Status
navStatusTopic.subscribe(msg => document.getElementById('info_nav_status').innerText = msg.data);
manStatusTopic.subscribe(msg => document.getElementById('info_man_status').innerText = msg.data);