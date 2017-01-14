var Alexa = require('alexa-sdk');
var states = require(__base+'states');

// Configurations
const cfg = require(__base+'config');

// DB Conenction
var AWS = require('aws-sdk');
var $db = new AWS.DynamoDB();
var DynamoDB = require('aws-dynamodb')($db);

var Subtitle = require("ar-subtitle-support");

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function numberWithSpaces(x) {
    return x.toString().replace(/(.{1})/g,"$1 ");
}

var Handler = Alexa.CreateStateHandler(states.REGISTRATION_PHONE, {

    'NewSession': function () {
        this.handler.state = '';
        this.emitWithState('NewSession');
    },

    'PhoneIntent': function() {
        var phone = this.event.request.intent.slots.phone.value;
        var phone1 = phone.substring(0, 1);
        this.attributes["Phone"] = phone;

        if(phone.length == 8){
            Subtitle(this, phone.substring(4, 8)+" ", "PHONE_CONFIRM", function(_this){
                _this.emit(':ask', _this.t("PHONE_CONFIRM", numberWithSpaces(_this.attributes["Phone"].substring(4, 8))), '');
            });
        }else{
            Subtitle(this, "PHONE_CONFIRM", function(_this){
                _this.emit(':ask', _this.t("PHONE_INVAILD"), '');
            });
        }
    },

    // Very wieldly, Alexa will pick the wrong intent even the format is technically not correct
    'HKIdIntent': function() {
        var hkid = {};
        hkid.prefix = this.event.request.intent.slots.hkid_prefix.value;
        hkid.number = this.event.request.intent.slots.hkid_number.value;
        hkid.checkSum = this.event.request.intent.slots.hkid_checkSum.value;

        var phone = hkid.prefix+hkid.number+hkid.checkSum;
        this.attributes["Phone"] = phone;

        if(isNumeric(phone) && phone.length == 8){
            Subtitle(this, phone.substring(4, 8)+" ", "PHONE_CONFIRM", function(_this){
                _this.emit(':ask', _this.t("PHONE_CONFIRM", numberWithSpaces(_this.attributes["Phone"].substring(4, 8))), '');
            });
        }else{
            Subtitle(this, "PHONE_CONFIRM", function(_this){
                _this.emit(':ask', _this.t("PHONE_INVAILD"), '');
            });
        }
    },

    'AMAZON.YesIntent': function() {
        if(this.attributes["Phone"]){
            this.handler.state = states.HISTORY_Q1;

            DynamoDB.table(cfg.AWS.TABLE_PREFIX+'User')
            .insert({
                id_number: this.attributes["ID"],
                phone: this.attributes["Phone"],
                name: this.attributes["Name"],
                createDT: Date.now()
            }, function(err, data){
                callback(err, data);
            })

            var _this = this;
            var callback = function(err, data){
                Subtitle(_this, "DATA_SAVED", "MEDICAL_HISTORY_PROMPT", "HEART_ISSUES_PROMPT", function(_this){
                    _this.emit(':ask', _this.t("DATA_SAVED")+_this.t("MEDICAL_HISTORY_PROMPT")+_this.t("HEART_ISSUES_PROMPT"), '');
                });
            }
        }else{
            Subtitle(this, "PHONE_PROMPT", "PHONE_EXPLAIN", function(_this){
                _this.emit(':ask', _this.t("PHONE_PROMPT")+_this.t("PHONE_EXPLAIN"), '');
            });
        }
    },

    'AMAZON.NoIntent': function() {
        Subtitle(this, "PHONE_PROMPT", function(_this){
            _this.emit(':ask', _this.t("PHONE_PROMPT"), '');
        });
    },

    'AMAZON.CancelIntent': function() {
        this.emit('Goodbye');
    },

    'AMAZON.StopIntent': function() {
        this.emit('Goodbye');
    },

    'AMAZON.HelpIntent': function() {
        Subtitle(this, "PHONE_PROMPT", "PHONE_EXPLAIN", function(_this){
            _this.emit(':ask', _this.t("PHONE_PROMPT")+_this.t("PHONE_EXPLAIN"), '');
        });
    },

    'SessionEndedRequest': function () {
        console.log('session ended!');
        this.emit(':saveState', true);
    },

    'Unhandled': function() {
        Subtitle(this, "SORRY_NOT_UNDERSTAND", "PHONE_PROMPT", "PHONE_EXPLAIN", function(_this){
            _this.emit(':ask', _this.t("SORRY_NOT_UNDERSTAND")+_this.t("PHONE_PROMPT")+_this.t("PHONE_EXPLAIN"), '');
        });
    }
});

module.exports = Handler;
