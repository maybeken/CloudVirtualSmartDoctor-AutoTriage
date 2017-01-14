var Alexa = require('alexa-sdk');
var states = require(__base+'states');

// Configurations
const cfg = require(__base+'config');

// DB Conenction
var AWS = require('aws-sdk');
var $db = new AWS.DynamoDB();
var DynamoDB = require('aws-dynamodb')($db);

var hkidCheck = require('hkid-check');
var Subtitle = require("ar-subtitle-support");

var Handler = Alexa.CreateStateHandler(states.LOGIN_ID, {

    'NewSession': function () {
        this.handler.state = '';
        this.emitWithState('NewSession');
    },

    'HKIdIntent': function() {
        var hkid = {};
        hkid.prefix = this.event.request.intent.slots.hkid_prefix.value;
        hkid.number = this.event.request.intent.slots.hkid_number.value;
        hkid.checkSum = this.event.request.intent.slots.hkid_checkSum.value;
        hkid.combined = hkid.prefix+hkid.number+hkid.checkSum;

        if(hkidCheck(hkid.combined)){

            this.attributes["ID"] = hkid.prefix+hkid.number;
            this.attributes["ID"] = this.attributes["ID"].toLowerCase();

            DynamoDB.table(cfg.AWS.TABLE_PREFIX+'User')
            .having('id_number').eq(this.attributes["ID"])
            .scan(function(err, data){
                callback(data, err);
            });

            var _this = this;
            var callback = function(data, err) {
                if(err){
                    _this.emit('Error');
                }else{
                    if(typeof data !== "undefined" && data.length >= 1){
                        _this.attributes["ID"] = data[0].id_number;
                        _this.attributes["Phone"] = data[0].phone;
                        _this.attributes["Name"] = data[0].name;
                        _this.attributes["medicalHistory"] = data[0].medicalHistory;

                        _this.handler.state = states.LOGIN_PHONE;

                        Subtitle(_this, "DATA_SAVED", "PHONE_PROMPT", function(_this){
                            _this.emit(':ask', _this.t("DATA_SAVED")+_this.t("PHONE_PROMPT"), '');
                        });
                    }else{
                        _this.handler.state = states.REGISTRATION_PROMPT;
                        Subtitle(_this, "REGISTRATION_PROMPT", function(_this){
                            _this.emit(':ask', _this.t("REGISTRATION_PROMPT"), '');
                        });
                    }
                }
            };

        }else{
            Subtitle(this, "ID_INVAILD", function(_this){
                _this.emit(':ask', _this.t("ID_INVAILD"), '');
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
        Subtitle(this, "ID_PROMPT", "ID_HELP", function(_this){
            _this.emit(':ask', _this.t("ID_PROMPT")+_this.t("ID_HELP"), '');
        });
    },

    'SessionEndedRequest': function () {
        console.log('session ended!');
        this.emit(':saveState', true);
    },

    'Unhandled': function() {
        Subtitle(this, "SORRY_NOT_UNDERSTAND", "ID_PROMPT", "ID_HELP", function(_this){
            _this.emit(':ask', _this.t("SORRY_NOT_UNDERSTAND")+_this.t("ID_PROMPT")+_this.t("ID_HELP"), '');
        });
    }
});

module.exports = Handler;
