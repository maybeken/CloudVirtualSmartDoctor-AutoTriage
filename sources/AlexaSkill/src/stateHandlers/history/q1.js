var Alexa = require('alexa-sdk');
var states = require(__base+'states');

// Configurations
const cfg = require(__base+'config');

var Subtitle = require("ar-subtitle-support");

var Handler = Alexa.CreateStateHandler(states.HISTORY_Q1, {

    'NewSession': function () {
        this.handler.state = '';
        this.emitWithState('NewSession');
    },

    'AMAZON.YesIntent': function () {
        this.attributes["haveHeartIssues"] = true;
        this.handler.state = states.HISTORY_Q2;

        Subtitle(this, "BLOOD_ISSUES_PROMPT", "BLOOD_ISSUES_EXAMPLES", function(_this){
            _this.emit(':ask', _this.t("BLOOD_ISSUES_PROMPT")+_this.t("BLOOD_ISSUES_EXAMPLES"), '');
        });
    },

    'AMAZON.NoIntent': function () {
        this.attributes["haveHeartIssues"] = false;
        this.handler.state = states.HISTORY_Q2;

        Subtitle(this, "BLOOD_ISSUES_PROMPT", "BLOOD_ISSUES_EXAMPLES", function(_this){
            _this.emit(':ask', _this.t("BLOOD_ISSUES_PROMPT")+_this.t("BLOOD_ISSUES_EXAMPLES"), '');
        });
    },

    'AMAZON.CancelIntent': function () {
        this.emit('Goodbye');
    },

    'AMAZON.StopIntent': function () {
        this.emit('Goodbye');
    },

    'AMAZON.HelpIntent': function () {
        Subtitle(this, "MEDICAL_HISTORY_PROMPT", "HEART_ISSUES_PROMPT", "HEART_ISSUES_EXAMPLES", function(_this){
            _this.emit(':ask', _this.t("MEDICAL_HISTORY_PROMPT")+_this.t("HEART_ISSUES_PROMPT")+_this.t("HEART_ISSUES_EXAMPLES"), '');
        });
    },

    'SessionEndedRequest': function () {
        console.log('session ended!');
        this.emit(':saveState', true);
    },

    'Unhandled': function () {
        Subtitle(this, "SORRY_NOT_UNDERSTAND", "MEDICAL_HISTORY_PROMPT", "HEART_ISSUES_PROMPT", "HEART_ISSUES_EXAMPLES", function(_this){
            _this.emit(':ask', _this.t("SORRY_NOT_UNDERSTAND")+_this.t("MEDICAL_HISTORY_PROMPT")+_this.t("HEART_ISSUES_PROMPT")+_this.t("HEART_ISSUES_EXAMPLES"), '');
        });
    }
});

module.exports = Handler;
