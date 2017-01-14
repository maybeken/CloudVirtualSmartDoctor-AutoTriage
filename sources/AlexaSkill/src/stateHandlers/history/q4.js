var Alexa = require('alexa-sdk');
var states = require(__base+'states');

var get = require('simple-get');

// Configurations
const cfg = require(__base+'config');

// DB Conenction
var AWS = require('aws-sdk');
var $db = new AWS.DynamoDB();
var DynamoDB = require('aws-dynamodb')($db);

var Subtitle = require("ar-subtitle-support");

var Handler = Alexa.CreateStateHandler(states.HISTORY_Q4, {

    'NewSession': function () {
        this.handler.state = '';
        this.emitWithState('NewSession');
    },

    'AMAZON.YesIntent': function () {
        this.attributes["haveAllergy"] = true;
        this.handler.state = states.QUESTION_ACTION;

        DynamoDB.table(cfg.AWS.TABLE_PREFIX+'User')
        .where('id_number').eq(this.attributes["ID"])
        .where('phone').eq(this.attributes["Phone"])
        .update({
            medicalHistory: {
                haveHeartIssues: this.attributes["haveHeartIssues"],
                haveBloodIssues: this.attributes["haveBloodIssues"],
                haveLongTermDisease: this.attributes["haveLongTermDisease"],
                haveAllergy: this.attributes["haveAllergy"]
            }
        }, function(err, data){
            callback(err, data);
        });

        var _this = this;
        var callback = function(){
            _this.attributes["medicalHistory"] = {
                haveHeartIssues: _this.attributes["haveHeartIssues"],
                haveBloodIssues: _this.attributes["haveBloodIssues"],
                haveLongTermDisease: _this.attributes["haveLongTermDisease"],
                haveAllergy: _this.attributes["haveAllergy"]
            }

            _this.attributes["haveHeartIssues"] = undefined;
            _this.attributes["haveBloodIssues"] = undefined;
            _this.attributes["haveLongTermDisease"] = undefined;
            _this.attributes["haveAllergy"] = undefined;

            var opts = {
              method: 'GET',
              url: 'http://healthimage.cloudlabhk.com.s3-website-us-east-1.amazonaws.com/face.json',
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

                Subtitle(_this, "GREAT", "REGISTRATION_FINISH", "WHAT_CAN_I_HELP", "HOW_YOU_FEEL", function(_this){
                    _this.emit(':ask', _this.t("GREAT")+_this.t("REGISTRATION_FINISH")+emotions+_this.t("WHAT_CAN_I_HELP")+_this.t("HOW_YOU_FEEL"), '');
                });
            });
        }
    },

    'AMAZON.NoIntent': function () {
        this.attributes["haveAllergy"] = false;
        this.handler.state = states.QUESTION_ACTION;

        DynamoDB.table(cfg.AWS.TABLE_PREFIX+'User')
        .where('id_number').eq(this.attributes["ID"])
        .where('phone').eq(this.attributes["Phone"])
        .return(DynamoDB.ALL_OLD)
        .update({
            medicalHistory: {
                haveHeartIssues: this.attributes["haveHeartIssues"],
                haveBloodIssues: this.attributes["haveBloodIssues"],
                haveLongTermDisease: this.attributes["haveLongTermDisease"],
                haveAllergy: this.attributes["haveAllergy"]
            }
        }, function(err, data){
            callback(err, data);
        })

        var _this = this;
        var callback = function(){
            _this.attributes["medicalHistory"] = {
                haveHeartIssues: _this.attributes["haveHeartIssues"],
                haveBloodIssues: _this.attributes["haveBloodIssues"],
                haveLongTermDisease: _this.attributes["haveLongTermDisease"],
                haveAllergy: _this.attributes["haveAllergy"]
            }

            _this.attributes["haveHeartIssues"] = undefined;
            _this.attributes["haveBloodIssues"] = undefined;
            _this.attributes["haveLongTermDisease"] = undefined;
            _this.attributes["haveAllergy"] = undefined;

            var opts = {
              method: 'GET',
              url: 'http://healthimage.cloudlabhk.com.s3-website-us-east-1.amazonaws.com/face.json',
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

                Subtitle(_this, "GREAT", "REGISTRATION_FINISH", "WHAT_CAN_I_HELP", function(_this){
                    _this.emit(':ask', _this.t("GREAT")+_this.t("REGISTRATION_FINISH")+emotions+_this.t("WHAT_CAN_I_HELP")+_this.t("HOW_YOU_FEEL"), '');
                });
            });
        }
    },

    'AMAZON.CancelIntent': function () {
        this.emit('Goodbye');
    },

    'AMAZON.StopIntent': function () {
        this.emit('Goodbye');
    },

    'AMAZON.HelpIntent': function () {
        Subtitle(this, "ALLERGY_PROMPT", "ALLERGY_EXAMPLES", function(_this){
            _this.emit(':ask', _this.t("ALLERGY_PROMPT")+_this.t("ALLERGY_EXAMPLES"), '');
        });
    },

    'SessionEndedRequest': function () {
        console.log('session ended!');
        this.emit(':saveState', true);
    },

    'Unhandled': function() {
        Subtitle(this, "SORRY_NOT_UNDERSTAND", "ALLERGY_PROMPT", "ALLERGY_EXAMPLES", function(_this){
            _this.emit(':ask', _this.t("SORRY_NOT_UNDERSTAND")+_this.t("ALLERGY_PROMPT")+_this.t("ALLERGY_EXAMPLES"), '');
        });
    }
});

module.exports = Handler;
