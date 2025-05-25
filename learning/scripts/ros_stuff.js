// Connect to rosbridge websocket
var ros = new ROSLIB.Ros({
url: 'ws://localhost:9090'
});

ros.on('connection', function() {
console.log('Connected to websocket server.');
});

ros.on('error', function(error) {
console.log('Error connecting to websocket server: ', error);
});

ros.on('close', function() {
console.log('Connection to websocket server closed.');
});

// Subscriber
var listener = new ROSLIB.Topic({
  ros: ros,
  name: '/turtle1/pose', // change this to your topic
  messageType: 'turtlesim/Pose'
});
listener.subscribe(function (message) {
  const poseText = `x: ${message.x.toFixed(2)}, y: ${message.y.toFixed(2)}, theta: ${message.theta.toFixed(2)}, ` +
                    `v_lin: ${message.linear_velocity.toFixed(2)}, v_ang: ${message.angular_velocity.toFixed(2)}`;
  console.log(poseText);
  document.getElementById('pose').innerText = poseText;
});

// Setup publisher on /cmd_vel
var cmdVel = new ROSLIB.Topic({
  ros: ros,
  name: '/turtle1/cmd_vel',
  messageType: 'geometry_msgs/Twist'
});

function turtleMove() {
  var twist = new ROSLIB.Message({
    linear: {
      x: 0.5,
      y: 0.0,
      z: 0.0
    },
    angular: {
      x: 0.0,
      y: 0.0,
      z: 0.0
    }
  });
  cmdVel.publish(twist);
  console.log("move forward referenced");
}
