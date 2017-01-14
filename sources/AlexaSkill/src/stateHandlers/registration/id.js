var Alexa = require('alexa-sdk');
var states = require(__base+'states');

// Configurations
const cfg = require(__base+'config');

var hkidCheck = require('hkid-check');
var Subtitle = require("ar-subtitle-support");

var Handler = Alexa.CreateStateHandler(states.REGISTRATION_ID, {

    'NewSession': function () {
        this.handler.state = '';
        this.emitWithState('NewSession');
    },

    'AMAZON.YesIntent': function() {
        if(this.attributes["ID"]){
            this.handler.state = states.REGISTRATION_PHONE;

            Subtitle(this, "DATA_SAVED", "PHONE_PROMPT", "PHONE_EXPLAIN", function(_this){
                _this.emit(':ask', _this.t("DATA_SAVED")+_this.t("PHONE_PROMPT")+_this.t("PHONE_EXPLAIN"), '');
            });

        }else{
            this.handler.state = states.LOGIN_ID;
            Subtitle(this, "ID_PROMPT", "ID_HELP", function(_this){
                _this.emit(':ask', _this.t("ID_PROMPT")+_this.t("ID_HELP"), '');
            });
        }
    },

    'AMAZON.NoIntent': function() {
        this.handler.state = states.LOGIN_ID;
        Subtitle(this, "ID_PROMPT", "ID_HELP", function(_this){
            _this.emit(':ask', _this.t("ID_PROMPT")+_this.t("ID_HELP"), '');
        });
    },

    'AMAZON.CancelIntent': function() {
        this.emit('Goodbye');
    },

    'AMAZON.StopIntent': function() {
        this.emit('Goodbye');
    },

    'AMAZON.HelpIntent': function() {
        Subtitle(this, this.attributes["ID"].substring(0, 4)+" ", "ID_CONFIRM", "YES_OR_NO", function(_this){
            _this.emit(':ask', _this.t("ID_CONFIRM", _this.attributes["ID"].substring(0, 4))+_this.t("YES_OR_NO"), '');
        });
    },

    'SessionEndedRequest': function () {
        console.log('session ended!');
        this.emit(':saveState', true);
    },

    'Unhandled': function() {
        Subtitle(this, "SORRY_NOT_UNDERSTAND", this.attributes["ID"].substring(0, 4)+" ", "ID_CONFIRM", "YES_OR_NO", function(_this){
            _this.emit(':ask', _this.t("SORRY_NOT_UNDERSTAND")+_this.t("ID_CONFIRM", _this.attributes["ID"].substring(0, 4))+_this.t("YES_OR_NO"), '');
        });
    }
});

module.exports = Handler;
