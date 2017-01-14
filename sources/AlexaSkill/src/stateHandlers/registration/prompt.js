var Alexa = require('alexa-sdk');
var states = require(__base+'states');

// Configurations
const cfg = require(__base+'config');

var Subtitle = require("ar-subtitle-support");

var Handler = Alexa.CreateStateHandler(states.REGISTRATION_PROMPT, {

    'NewSession': function () {
        this.handler.state = '';
        this.emitWithState('NewSession');
    },

    'AMAZON.YesIntent': function() {
        this.handler.state = states.REGISTRATION_NAME;

        Subtitle(this, "GREAT", "NAME_PROMPT", "NAME_HELP", function(_this){
            _this.emit(':ask', _this.t("GREAT")+_this.t("NAME_PROMPT")+_this.t("NAME_HELP"), '');
        });
    },

    'AMAZON.NoIntent': function() {
        this.emit('Goodbye');
    },

    'AMAZON.CancelIntent': function() {
        this.emit('Goodbye');
    },

    'AMAZON.StopIntent': function() {
        this.emit('Goodbye');
    },

    'AMAZON.HelpIntent': function() {
        Subtitle(this, "REGISTRATION_HELP", function(_this){
            _this.emit(':ask', _this.t("REGISTRATION_HELP"), '');
        });
    },

    'SessionEndedRequest': function () {
        console.log('session ended!');
        this.emit(':saveState', true);
    },

    'Unhandled': function() {
        Subtitle(this, "SORRY_NOT_UNDERSTAND", "REGISTRATION_HELP", function(_this){
            _this.emit(':ask', _this.t("SORRY_NOT_UNDERSTAND")+_this.t("REGISTRATION_HELP"), '');
        });
    }
});

module.exports = Handler;
