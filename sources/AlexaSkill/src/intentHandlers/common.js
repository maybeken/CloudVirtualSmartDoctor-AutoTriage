var AWS = require('aws-sdk');

if(typeof process.env.accessKeyId !== "undefined" && typeof process.env.secretAccessKey !== "undefined"){
	var s3 = new AWS.S3({accessKeyId: process.env.accessKeyId, secretAccessKey: process.env.secretAccessKey});
}else{
	var s3 = new AWS.S3();
}

var states = require(__base+'states');

var Subtitle = require("ar-subtitle-support");

var Handler = {

    'NewSession': function() {
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

        var params = {Bucket: 'healthimagecloudlabhk', Key: 'takepic.txt', Body: 'TRUE', ACL: 'public-read', ContentType: 'text/plain'};

        s3.upload(params, function(err, data) {
            if(err) console.log("Error: S3 Upload Failure: "+err);

            callback(_this);
        });

        var callback = function(){
            Subtitle(_this, "WELCOME_MESSAGE", "ID_PROMPT", "ID_HELP",
            function(_this){
                _this.emit(':ask', MESSAGE, '');
            });
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
