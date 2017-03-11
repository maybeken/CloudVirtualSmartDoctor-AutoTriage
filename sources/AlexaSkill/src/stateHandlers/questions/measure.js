var Alexa = require('alexa-sdk');
var states = require(__base+'states');

var get = require('simple-get');

// Configurations
const cfg = require(__base+'config');

var Subtitle = require("ar-subtitle-support");

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

var Handler = Alexa.CreateStateHandler(states.QUESTION_MEASURE, {

    'NewSession': function () {
        this.handler.state = '';
        this.emitWithState('NewSession');
    },

    'FinishedIntent': function () {
		this.emit('FinishedIntent');
    },

    'AMAZON.CancelIntent': function () {
        this.emit('Goodbye');
    },

    'AMAZON.StopIntent': function () {
        this.emit('Goodbye');
    },

    'AMAZON.HelpIntent': function () {
        if(this.attributes["useThermometer"]){
            Subtitle(this, "USE_THERMOMETER", "TELL_ME_WHEN_FINISHED", function(_this){
                _this.emit(':tell', _this.t("USE_THERMOMETER")+_this.t("TELL_ME_WHEN_FINISHED"));
            });
        }else if(this.attributes["useOximeter"]){
            Subtitle(this, "USE_OXIMETER", "TELL_ME_WHEN_FINISHED", function(_this){
                _this.emit(':tell', _this.t("USE_OXIMETER")+_this.t("TELL_ME_WHEN_FINISHED"));
            });
        }else if(this.attributes["useBloodPressureMeter"]){
            Subtitle(this, "USE_BLOOD_PRESSURE_METER", "TELL_ME_WHEN_FINISHED", function(_this){
                _this.emit(':tell', _this.t("USE_BLOOD_PRESSURE_METER")+_this.t("TELL_ME_WHEN_FINISHED"));
            });
        }else{
            this.emit('DiagnoseIntent');
        }
    },

    'SessionEndedRequest': function () {
        console.log('session ended!');
        this.emit('FinishedIntent');
    },

    'Unhandled': function () {
        if(this.attributes["useThermometer"]){
            Subtitle(this, "USE_THERMOMETER", "TELL_ME_WHEN_FINISHED", function(_this){
                _this.emit(':tell', _this.t("USE_THERMOMETER")+_this.t("TELL_ME_WHEN_FINISHED"));
            });
        }else if(this.attributes["useOximeter"]){
            Subtitle(this, "USE_OXIMETER", "TELL_ME_WHEN_FINISHED", function(_this){
                _this.emit(':tell', _this.t("USE_OXIMETER")+_this.t("TELL_ME_WHEN_FINISHED"));
            });
        }else if(this.attributes["useBloodPressureMeter"]){
            Subtitle(this, "USE_BLOOD_PRESSURE_METER", "TELL_ME_WHEN_FINISHED", function(_this){
                _this.emit(':tell', _this.t("USE_BLOOD_PRESSURE_METER")+_this.t("TELL_ME_WHEN_FINISHED"));
            });
        }else{
            this.emit('DiagnoseIntent');
        }
    }
});

module.exports = Handler;
