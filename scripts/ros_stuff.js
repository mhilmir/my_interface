const ros = new ROSLIB.Ros({ url: 'ws://localhost:9090' });

const locationPub = new ROSLIB.Topic({
    ros: ros,
    name: '/location_chosen',
    messageType: 'std_msgs/String'
});

const gotoPub = new ROSLIB.Topic({
    ros: ros,
    name: '/goto_status',
    messageType: 'std_msgs/Bool'
});

const scanPub = new ROSLIB.Topic({
    ros: ros,
    name: '/search_status',
    messageType: 'std_msgs/Bool'
});

const returnPub = new ROSLIB.Topic({
    ros: ros,
    name: '/return_and_place',
    messageType: 'std_msgs/Bool'
});

// console.log("0");

// State variables
let currentLocation = document.getElementById("locationDropdown").value;
let gotoStatus = false;
let scanStatus = false;
let returnStatus = false;

// Intervals
setInterval(() => {
  locationPub.publish(new ROSLIB.Message({ data: currentLocation }));
  gotoPub.publish(new ROSLIB.Message({ data: gotoStatus }));
  scanPub.publish(new ROSLIB.Message({ data: scanStatus }));
  returnPub.publish(new ROSLIB.Message({ data: returnStatus }));
}, 500); // publish every second

// Update currentLocation when dropdown changes
document.getElementById("locationDropdown").addEventListener("change", (e) => {
  currentLocation = e.target.value;
  document.getElementById("currentLocation").innerText = currentLocation;
});

// console.log("1");

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

const currentLocationSpan = document.getElementById('currentLocation');
const locationSub = new ROSLIB.Topic({
    ros: ros,
    name: '/location_chosen',
    messageType: 'std_msgs/String'
});
locationSub.subscribe((msg) => {
    currentLocationSpan.innerText = msg.data;
});

// const stateSub = new ROSLIB.Topic({
//     ros: ros,
//     name: '/robot_state',
//     messageType: 'std_msgs/String'
// });
// stateSub.subscribe(msg => document.getElementById('robotState').innerText = msg.data);

// const batterySub = new ROSLIB.Topic({
//     ros: ros,
//     name: '/robot_battery',
//     messageType: 'std_msgs/String'
// });
// batterySub.subscribe(msg => document.getElementById('robotBattery').innerText = msg.data);

// const graspSub = new ROSLIB.Topic({
//     ros: ros,
//     name: '/grasp_status',
//     messageType: 'std_msgs/Bool'
// });
// graspSub.subscribe(msg => document.getElementById('graspStatus').innerText = msg.data);

// const scanningSub = new ROSLIB.Topic({
//     ros: ros,
//     name: '/scanning_status',
//     messageType: 'std_msgs/Bool'
// });
// scanningSub.subscribe(msg => document.getElementById('scanningStatus').innerText = msg.data);