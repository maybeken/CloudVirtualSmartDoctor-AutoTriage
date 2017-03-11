var Alexa = require('alexa-sdk');
var states = require(__base+'states');

var get = require('simple-get');

// Configurations
const cfg = require(__base+'config');

var Subtitle = require("ar-subtitle-support");

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

var Handler = Alexa.CreateStateHandler(states.QUESTION_ACTION, {

    'NewSession': function () {
        this.handler.state = '';
        this.emitWithState('NewSession');
    },

    'ActionIntent': function () {
        this.handler.state = states.HISTORY_Q1;
        Subtitle(this, "MEDICAL_HISTORY_PROMPT", "HEART_ISSUES_PROMPT", function(_this){
            _this.emit(':ask', _this.t("MEDICAL_HISTORY_PROMPT")+_this.t("HEART_ISSUES_PROMPT"), '');
        });
    },

    'SymptomsIntent': function () {

        if(this.attributes["Symptoms"] === undefined){
            this.attributes["Symptoms"] = [];
        }

        var symptom = this.event.request.intent.slots.symptom.value;
        var symptoms = [];
        var repeat = false;

        if(symptom.search("and")){
            symptoms = symptom.split(" and ");
        }else{
            symptoms.push(this.event.request.intent.slots.symptom.value);
        }

        for(var j=0; j<symptoms.length; j++){
            if(typeof this.attributes["Symptoms"] !== "undefined"){
                for(var i=0; i<this.attributes["Symptoms"].length; i++){
                    if(this.attributes["Symptoms"][i] == symptoms[j]){
                        repeat = true;
                        break;
                    }
                }
            }

            if(!repeat){
                this.attributes["Symptoms"].push(symptoms[j]);
            }
        }

        Subtitle(this, "OKAY", "SYMPTOM_CONFIRM", symptom, "SYMPTOM_PROMPT", function(_this){
            _this.emit(':ask', _this.t("OKAY")+_this.t("SYMPTOM_CONFIRM", symptom)+_this.t("SYMPTOM_PROMPT"), '');
        });
    },

    'AMAZON.NoIntent': function () {
        var symptoms = "";

        for(var i=0; i<this.attributes["Symptoms"].length; i++){

            var symptom = this.attributes["Symptoms"][i];

            if(symptom == "cold" || symptom == "hot" || symptom == "fever"){
                this.attributes["useThermometer"] = true;
                this.attributes["seriousness"] += 2;
            }else if(symptom == "feel tired"){
                this.attributes["useOximeter"] = true;
                this.attributes["seriousness"] += 1;
            }else if(symptom == "dizzy"){
                this.attributes["useOximeter"] = true;
                this.attributes["useBloodPressureMeter"] = true;
                this.attributes["seriousness"] += 5;
            }

            if(i != this.attributes["Symptoms"].length-1){
                symptoms += symptom+", ";
            }else if(i == this.attributes["Symptoms"].length-2){
                symptoms += "and ";
            }else{
                symptoms += symptom+" ";
            }
        }
		
		this.attributes["seriousness"] = -1;

        if(this.attributes["useThermometer"]){
            Subtitle(this, "DATA_SAVED", "SYMPTOM_CONFIRM", symptoms, "USE_THERMOMETER", "TELL_ME_WHEN_FINISHED", function(_this){
                _this.emit(':tell', _this.t("DATA_SAVED")+_this.t("SYMPTOM_CONFIRM", symptoms)+_this.t("USE_THERMOMETER")+_this.t("TELL_ME_WHEN_FINISHED"));
            });
        }else if(this.attributes["useOximeter"]){
            Subtitle(this, "DATA_SAVED", "SYMPTOM_CONFIRM", symptoms, "USE_OXIMETER", "TELL_ME_WHEN_FINISHED", function(_this){
                _this.emit(':tell', _this.t("DATA_SAVED")+_this.t("SYMPTOM_CONFIRM", symptoms)+_this.t("USE_OXIMETER")+_this.t("TELL_ME_WHEN_FINISHED"));
            });
        }else if(this.attributes["useBloodPressureMeter"]){
            Subtitle(this, "DATA_SAVED", "SYMPTOM_CONFIRM", symptoms, "USE_BLOOD_PRESSURE_METER", "TELL_ME_WHEN_FINISHED", function(_this){
                _this.emit(':tell', _this.t("DATA_SAVED")+_this.t("SYMPTOM_CONFIRM", symptoms)+_this.t("USE_BLOOD_PRESSURE_METER")+_this.t("TELL_ME_WHEN_FINISHED"));
            });
        }else{
            this.emit('DiagnoseIntent');
        }
    },

    'AMAZON.CancelIntent': function () {
        this.emit('Goodbye');
    },

    'AMAZON.StopIntent': function () {
        this.emit('Goodbye');
    },

    'AMAZON.HelpIntent': function () {
        Subtitle(this, "WHAT_CAN_I_HELP", function(_this){
            _this.emit(':ask', _this.t("WHAT_CAN_I_HELP"), '');
        });
    },

    'SessionEndedRequest': function () {
        console.log('session ended!');
        this.emit('FinishedIntent');
    },

    'Unhandled': function () {
        Subtitle(this, "SORRY_NOT_UNDERSTAND", "WHAT_CAN_I_HELP", function(_this){
            _this.emit(':ask', _this.t("SORRY_NOT_UNDERSTAND")+_this.t("WHAT_CAN_I_HELP"), '');
        });
    }
});

module.exports = Handler;
