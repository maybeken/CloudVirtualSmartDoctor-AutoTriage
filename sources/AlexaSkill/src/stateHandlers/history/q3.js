var Alexa = require('alexa-sdk');
var states = require(__base+'states');

// Configurations
const cfg = require(__base+'config');

var Subtitle = require("ar-subtitle-support");

var Handler = Alexa.CreateStateHandler(states.HISTORY_Q3, {

    'NewSession': function () {
        this.handler.state = '';
        this.emitWithState('NewSession');
    },

    'AMAZON.YesIntent': function () {
        this.attributes["haveLongTermDisease"] = true;
        this.handler.state = states.HISTORY_Q4;

        Subtitle(this, "ALLERGY_PROMPT", "ALLERGY_EXAMPLES", function(_this){
            _this.emit(':ask', _this.t("ALLERGY_PROMPT")+_this.t("ALLERGY_EXAMPLES"), '');
        });
    },

    'AMAZON.NoIntent': function () {
        this.attributes["haveLongTermDisease"] = false;
        this.handler.state = states.HISTORY_Q4;

        Subtitle(this, "ALLERGY_PROMPT", "ALLERGY_EXAMPLES", function(_this){
            _this.emit(':ask', _this.t("ALLERGY_PROMPT")+_this.t("ALLERGY_EXAMPLES"), '');
        });
    },

    'AMAZON.CancelIntent': function () {
        this.emit('Goodbye');
    },

    'AMAZON.StopIntent': function () {
        this.emit('Goodbye');
    },

    'AMAZON.HelpIntent': function () {
        Subtitle(this, "LONG_TERM_DISEASE_PROMPT", "LONG_TERM_DISEASE_EXAMPLES", function(_this){
            _this.emit(':ask', _this.t("LONG_TERM_DISEASE_PROMPT")+_this.t("LONG_TERM_DISEASE_EXAMPLES"), '');
        });
    },

    'SessionEndedRequest': function () {
        console.log('session ended!');
        this.emit(':saveState', true);
    },

    'Unhandled': function () {
        Subtitle(this, "SORRY_NOT_UNDERSTAND", "LONG_TERM_DISEASE_PROMPT", "LONG_TERM_DISEASE_EXAMPLES", function(_this){
            _this.emit(':ask', _this.t("SORRY_NOT_UNDERSTAND")+_this.t("LONG_TERM_DISEASE_PROMPT")+_this.t("LONG_TERM_DISEASE_EXAMPLES"), '');
        });
    }
});

module.exports = Handler;
