var Alexa = require('alexa-sdk');
var states = require(__base+'states');

// Configurations
const cfg = require(__base+'config');

var Subtitle = require("ar-subtitle-support");

var Handler = Alexa.CreateStateHandler(states.REGISTRATION_NAME, {

    'NewSession': function () {
        this.handler.state = '';
        this.emitWithState('NewSession');
    },

    'NameIntent': function() {
        var name = this.event.request.intent.slots.name.value;
        this.attributes["Name"] = name;

        Subtitle(this, name+" ", "NAME_CONFIRM", function(_this){
            _this.emit(':ask', _this.t("NAME_CONFIRM", _this.attributes["Name"]), '');
        });
    },

    'AMAZON.YesIntent': function() {
        if(this.attributes["Name"]){
            this.handler.state = states.REGISTRATION_ID;
            Subtitle(this, "DATA_SAVED", "ID_CONFIRM", function(_this){
                _this.emit(':ask', _this.t("DATA_SAVED")+_this.t("ID_CONFIRM", _this.attributes["ID"].substring(0, 4)), '');
            });
        }else{
            Subtitle(this, "NAME_PROMPT", "NAME_HELP", function(_this){
                _this.emit(':ask', _this.t("NAME_PROMPT")+_this.t("NAME_HELP"), '');
            });
        }
    },

    'AMAZON.NoIntent': function() {
        Subtitle(this, "NAME_PROMPT", "NAME_HELP", function(_this){
            _this.emit(':ask', _this.t("NAME_PROMPT")+_this.t("NAME_HELP"), '');
        });
    },

    'AMAZON.CancelIntent': function() {
        this.emit('Goodbye');
    },

    'AMAZON.StopIntent': function() {
        this.emit('Goodbye');
    },

    'AMAZON.HelpIntent': function() {
        Subtitle(this, "NAME_PROMPT", "NAME_HELP", function(_this){
            _this.emit(':ask', _this.t("NAME_PROMPT")+_this.t("NAME_HELP"), '');
        });
    },

    'SessionEndedRequest': function () {
        console.log('session ended!');
        this.emit(':saveState', true);
    },

    'Unhandled': function() {
        Subtitle(this, "SORRY_NOT_UNDERSTAND", "NAME_PROMPT", "NAME_HELP", function(_this){
            _this.emit(':ask', _this.t("SORRY_NOT_UNDERSTAND")+_this.t("NAME_PROMPT")+_this.t("NAME_HELP"), '');
        });
    }
});

module.exports = Handler;
