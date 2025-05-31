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

const returnNPlaceTopic = new ROSLIB.Topic({
    ros: ros,
    name: '/return_and_place',
    messageType: 'std_msgs/Bool'
});

const mouseCbTopic = new ROSLIB.Topic({
    ros: ros,
    name: "/camera/quadruped/mouse_click",
    messageType: "geometry_msgs/Point"
});

const yoloEnabledTopic = new ROSLIB.Topic({
  ros: ros,
  name: '/yolo_enabled',
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

// State variables
let currentLocation = document.getElementById("locationDropdown").value;
let gotoStatus = false;
let scanStatus = false;
let returnStatus = false;

// Button functions
function publishGoto(status) {
  gotoStatus = status;
}

function publishScan(status) {
  scanStatus = status;
}

function publishReturn(status) {
  returnStatus = status;
}

// Intervals
setInterval(() => {
  locationChosenTopic.publish(new ROSLIB.Message({ data: currentLocation }));
  gotoStatusTopic.publish(new ROSLIB.Message({ data: gotoStatus }));
  searchStatusTopic.publish(new ROSLIB.Message({ data: scanStatus }));
  returnNPlaceTopic.publish(new ROSLIB.Message({ data: returnStatus }));
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

document.getElementById("frontCamera").addEventListener("click", function(event) {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Dimensions of the displayed image
    const displayWidth = rect.width;
    const displayHeight = rect.height;

    // Dimensions of the original image from the camera (actual resolution)
    const naturalWidth = event.target.naturalWidth;
    const naturalHeight = event.target.naturalHeight;

    // Scale the click coordinates back to actual pixel positions
    const scaleX = naturalWidth / displayWidth;
    const scaleY = naturalHeight / displayHeight;

    const correctedX = x * scaleX;
    const correctedY = y * scaleY;

    console.log("Corrected click at:", correctedX, correctedY);

    const point = new ROSLIB.Message({ x: correctedX, y: correctedY, z: 0 });
    mouseCbTopic.publish(point);
});

// Publish Bool message when object detection checkbox changes
const objectDetectionToggle = document.getElementById('objectDetectionToggle');
objectDetectionToggle.addEventListener('change', () => {
  const msg = new ROSLIB.Message({
    data: objectDetectionToggle.checked
  });
  yoloEnabledTopic.publish(msg);
  console.log('Published yolo_enabled:', objectDetectionToggle.checked);
});

// Publish Empty message when cancel tracking button clicked
const cancelTrackingBtn = document.getElementById('cancelTrackingBtn');
cancelTrackingBtn.addEventListener('click', () => {
  const msg = new ROSLIB.Message({});
  cancelTrackingTopic.publish(msg);
  console.log('Published cancel_tracking');
});

// Robot State Information Block
gotoStatusTopic.subscribe(msg => document.getElementById('info_goto_status').innerText = msg.data);
locationChosenTopic.subscribe(msg => document.getElementById('info_location_chosen').innerText = msg.data);
searchStatusTopic.subscribe(msg => document.getElementById('info_search_status').innerText = msg.data);
returnNPlaceTopic.subscribe(msg => document.getElementById('info_return_and_place').innerText = msg.data);
yoloEnabledTopic.subscribe(msg => document.getElementById('info_yolo_enabled').innerText = msg.data);
trackedStatusTopic.subscribe(msg => document.getElementById('info_tracked_status').innerText = msg.data);
trackedCenterTopic.subscribe(msg => document.getElementById('info_tracked_center').innerText = msg.data);
trackedDepthTopic.subscribe(msg => document.getElementById('info_tracked_depth').innerText = msg.data);
cancelTrackingTopic.subscribe(msg => document.getElementById('info_cancel_tracking').innerText = msg.data);