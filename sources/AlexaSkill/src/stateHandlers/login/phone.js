var Alexa = require('alexa-sdk');
var states = require(__base+'states');

var get = require('simple-get');

// Configurations
const cfg = require(__base+'config');

var Subtitle = require("ar-subtitle-support");

var Handler = Alexa.CreateStateHandler(states.LOGIN_PHONE, {

    'NewSession': function () {
        this.handler.state = '';
        this.emitWithState('NewSession');
    },

    'PhoneIntent': function() {
        var phone = this.event.request.intent.slots.phone.value;

        if(phone == this.attributes["Phone"]){
            this.handler.state = states.QUESTION_ACTION;

            var _this = this;

            var opts = {
              method: 'GET',
              url: 'http://healthimagecloudlabhk.s3-website-us-east-1.amazonaws.com/face.json',
              json: true
            }

            get.concat(opts, function (err, res, data) {
                if (err) throw err
                console.log("HTTP Request Result: "+res.statusCode) // 200

                _this.attributes["gender"] = data.faceDetails[0].gender.value ? data.faceDetails[0].gender.value : null;
                _this.attributes["emotions"] = data.faceDetails[0].emotions ? data.faceDetails[0].emotions : [];

                var emotions = "";

                if(_this.attributes["emotions"].length && _this.attributes["emotions"].length > 0){
                    emotions += "You look ";

                    for(var i=0; i<_this.attributes["emotions"].length; i++){
                        emotions += _this.attributes["emotions"][i].type;

                        if(_this.attributes["emotions"].length > 2 && i < _this.attributes["emotions"].length-2){
                            emotions += ", ";
                        }

                        if(_this.attributes["emotions"].length != 1 && i == _this.attributes["emotions"].length-2){
                            emotions += " and ";
                        }
                    }

                    emotions += " today. ";
                }

                Subtitle(_this, _this.attributes["Name"]+" ", "WELCOME_BACK", "WHAT_CAN_I_HELP", function(_this){
                    _this.emit(':ask', _this.t("WELCOME_BACK", _this.attributes["Name"])+emotions+_this.t("WHAT_CAN_I_HELP"), '');
                });
            });
        }else{
            Subtitle(this, "PHONE_WRONG", "PHONE_PROMPT", function(_this){
                _this.emit(':ask', _this.t("PHONE_WRONG")+_this.t("PHONE_PROMPT"), '');
            });
        }
    },

    // Very wieldly, Alexa will pick the wrong intent even the format is technically not correct
    'HKIdIntent': function() {
        var hkid = {};
        hkid.prefix = this.event.request.intent.slots.hkid_prefix.value;
        hkid.number = this.event.request.intent.slots.hkid_number.value;
        hkid.checkSum = this.event.request.intent.slots.hkid_checkSum.value;

        var phone = hkid.prefix+hkid.number+hkid.checkSum

        if(phone == this.attributes["Phone"]){
            this.handler.state = states.QUESTION_ACTION;

            var _this = this;

            var opts = {
              method: 'GET',
              url: 'http://healthimagecloudlabhk.s3-website-us-east-1.amazonaws.com/face.json',
              json: true
            }

            get.concat(opts, function (err, res, data) {
                if (err) throw err
                console.log("HTTP Request Result: "+res.statusCode) // 200

                _this.attributes["gender"] = data.faceDetails[0].gender.value ? data.faceDetails[0].gender.value : null;
                _this.attributes["emotions"] = data.faceDetails[0].emotions ? data.faceDetails[0].emotions : [];

                var emotions = "";

                if(_this.attributes["emotions"].length && _this.attributes["emotions"].length > 0){
                    emotions += "You look ";

                    for(var i=0; i<_this.attributes["emotions"].length; i++){
                        emotions += _this.attributes["emotions"][i].type;

                        if(_this.attributes["emotions"].length > 2 && i < _this.attributes["emotions"].length-2){
                            emotions += ", ";
                        }

                        if(_this.attributes["emotions"].length != 1 && i == _this.attributes["emotions"].length-2){
                            emotions += " and ";
                        }
                    }

                    emotions += " today. ";
                }

                Subtitle(_this, _this.attributes["Name"]+" ", "WELCOME_BACK", "WHAT_CAN_I_HELP", function(_this){
                    _this.emit(':ask', _this.t("WELCOME_BACK", _this.attributes["Name"])+emotions+_this.t("WHAT_CAN_I_HELP"), '');
                });
            });
        }else{
            Subtitle(this, "PHONE_WRONG", "PHONE_PROMPT", function(_this){
                _this.emit(':ask', _this.t("PHONE_WRONG")+_this.t("PHONE_PROMPT"), '');
            });
        }
    },

    'AMAZON.CancelIntent': function() {
        this.emit('Goodbye');
    },

    'AMAZON.StopIntent': function() {
        this.emit('Goodbye');
    },

    'AMAZON.HelpIntent': function() {
        Subtitle(this, "PHONE_PROMPT", function(_this){
            _this.emit(':ask', _this.t("PHONE_PROMPT"), '');
        });

    },

    'SessionEndedRequest': function () {
        console.log('session ended!');
        this.emit(':saveState', true);
    },

    'Unhandled': function() {
        Subtitle(this, "SORRY_NOT_UNDERSTAND", "PHONE_PROMPT", function(_this){
            _this.emit(':ask', _this.t("SORRY_NOT_UNDERSTAND")+_this.t("PHONE_PROMPT"), '');
        });
    }
});

module.exports = Handler;
