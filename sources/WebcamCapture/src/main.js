'use strict';

var awsIot = require('aws-iot-device-sdk');

var util = require('util'),
    exec = require('child_process').exec,
    child;

//
// Replace the values of '<YourUniqueClientIdentifier>' and '<YourAWSRegion>'
// with a unique client identifier and the AWS region you created your
// certificate in (e.g. 'us-east-1').  NOTE: client identifiers must be
// unique within your AWS account; if a client attempts to connect with a
// client identifier which is already in use, the existing connection will
// be terminated.
//
var thingShadows = awsIot.thingShadow({
	keyPath: './certs/private.pem.key',
	certPath: './certs/certificate.pem.crt',
	caPath: './certs/root-CA.crt',
	clientId: 'Pi-Camera',
	region: 'ap-southeast-1'
});

//
// Client token value returned from thingShadows.update() operation
//
var clientTokenUpdate;

thingShadows.on('connect', function() {
	
	console.log("Connected.");

    thingShadows.register('Pi-Camera',
		function() {
		   var takePictureState = {"state":{"desired":{"takepic": false}}};

		   clientTokenUpdate = thingShadows.update('Pi-Camera', takePictureState);
		   
		   if (clientTokenUpdate === null)
		   {
			  console.log('update shadow failed, operation still in progress');
		   }else{
			   console.log('shadow updated.');
		   }
		});

	thingShadows.on('status', 
		function(thingName, stat, clientToken, stateObject) {
		   console.log('received '+stat+' on '+thingName+': '+JSON.stringify(stateObject));
		});

	thingShadows.on('delta', 
		function(thingName, stateObject) {
		   console.log('received delta on '+thingName+': '+JSON.stringify(stateObject));
		   
		   if(stateObject.state.takepic == true){
			   console.log("Take picture.");
			   
			   var cfg = stateObject.state.cfg;
			   
			   child = exec('fswebcam -r '+cfg.resolution+' --no-banner /tmp/'+cfg.filename+' && aws s3 cp /tmp/'+cfg.filename+' s3://'+cfg.bucket+' --region=us-east-1', // command line argument directly in string
				  function (error, stdout, stderr) {      // one easy function to capture data/errors
					console.log('stdout: ' + stdout);
					console.log('stderr: ' + stderr);
					if (error !== null) {
					  console.log('exec error: ' + error);
					}
					
					console.log("Picture uploaded.");
					
					console.log("Update shadow.");
					var takePictureState = {"state":{"desired":{"takepic": false}}};

					clientTokenUpdate = thingShadows.update('Pi-Camera', takePictureState);
				});
		   }
		});

	thingShadows.on('timeout',
		function(thingName, clientToken) {
		   console.log('received timeout on '+thingName+' with token: '+ clientToken);
		});
});