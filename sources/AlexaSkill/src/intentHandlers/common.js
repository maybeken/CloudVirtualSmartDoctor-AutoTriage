var AWS = require('aws-sdk');
var iotdata = new AWS.IotData({
    region: 'ap-southeast-1',
    endpoint: 'a9dqi8yrosh5v.iot.ap-southeast-1.amazonaws.com'
});

var states = require(__base+'states');

var Subtitle = require("ar-subtitle-support");

var Handler = {

    'NewSession': function() {
		console.log(this.attributes);
		
		if(this.attributes["seriousness"] != -1){
			// Reset all session attributes
			for (var key in this.attributes) {
				if (this.attributes.hasOwnProperty(key)) {
					this.attributes[key] = undefined;
				}
			}
			
			this.handler.state = states.LOGIN_ID;
			var MESSAGE = this.t("WELCOME_MESSAGE", this.t("APP_NAME"));

			MESSAGE += this.t("ID_PROMPT")+this.t("ID_HELP");

			var _this = this;
			
			var payloadObj={
				"state": {
					"desired": {
						"takepic": true
					}
				}
			};
			
			var params = {
				payload: JSON.stringify(payloadObj), /* required */
				thingName: 'Pi-Camera' /* required */
			};
			iotdata.updateThingShadow(params, function(err, data) {
				if (err) console.log(err, err.stack); // an error occurred
				else     console.log(data);           // successful response
				
				callback();
			});

			var callback = function(){
				Subtitle(_this, "WELCOME_MESSAGE", "ID_PROMPT", "ID_HELP",
				function(_this){
					_this.emit(':ask', MESSAGE, '');
				});
			}
		}else{
			this.handler.state = states.QUESTION_MEASURE;
			this.emit('FinishedIntent');
		}
    },

    'Goodbye': function() {
        this.emit(':saveState', false);
        Subtitle(this, "GOODBYE_MESSAGE", function(_this){
            _this.emit(':tell', _this.t("GOODBYE_MESSAGE"));
        });

    },

    'Error': function() {
        this.emit(':saveState', false);
        Subtitle(this, "INTERNAL_SERVER_ERROR", function(_this){
            _this.emit(':tell', _this.t("INTERNAL_SERVER_ERROR"));
        });
    }
};

module.exports = Handler;
