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
        var _this = this;

        var opts = {
          method: 'GET',
          url: 'https://s3-ap-southeast-1.amazonaws.com/iveawsiot/newdata.json',
          json: true
        }

        get.concat(opts, function (err, res, data) {
            if (err) throw err
            console.log("HTTP Request Result: "+res.statusCode) // 200

            if(_this.attributes["useThermometer"]){

                if(data["dataType"] == "thermometer_data"){

                    _this.attributes["useThermometer"] = false;

                    _this.attributes["bodyTemperature"] = data["temperature"];

                    if(_this.attributes["useOximeter"]){
                        Subtitle(_this, "DATA_SAVED", "USE_OXIMETER", function(_this){
                            _this.emit(':ask', _this.t("DATA_SAVED")+_this.t("USE_OXIMETER"), '');
                        });
                    }else if(_this.attributes["useBloodPressureMeter"]){
                        Subtitle(_this, "DATA_SAVED", "USE_BLOOD_PRESSURE_METER", function(_this){
                            _this.emit(':ask', _this.t("DATA_SAVED")+_this.t("USE_BLOOD_PRESSURE_METER"), '');
                        });
                    }else{
                        _this.emit('DiagnoseIntent');
                    }

                }else{
                    Subtitle(_this, "NO_DATA_RECEIVED", "USE_THERMOMETER", "TELL_ME_WHEN_FINISHED", function(_this){
                        _this.emit(':ask', _this.t("NO_DATA_RECEIVED")+_this.t("USE_THERMOMETER")+_this.t("TELL_ME_WHEN_FINISHED"), '');
                    });
                }

            }else if(_this.attributes["useOximeter"]){

                if(data["dataType"] == "oximeter_data" && data["heartrate"] != 255 && data["spO2"] != 127){

                    _this.attributes["useOximeter"] = false;

                    _this.attributes["heartrate"] = data["heartrate"];
                    _this.attributes["spO2"] = data["spO2"];

                    if(_this.attributes["useBloodPressureMeter"]){
                        Subtitle(_this, "DATA_SAVED", "USE_BLOOD_PRESSURE_METER", function(_this){
                            _this.emit(':ask', _this.t("DATA_SAVED")+_this.t("USE_BLOOD_PRESSURE_METER"), '');
                        });
                    }else{
                        _this.emit('DiagnoseIntent');
                    }

                }else if(data["dataType"] == "oximeter_data"){
                    Subtitle(_this, "PLEASE_WAIT_FOR_DATA", "USE_OXIMETER", "TELL_ME_WHEN_FINISHED", function(_this){
                        _this.emit(':ask', _this.t("PLEASE_WAIT_FOR_DATA")+_this.t("USE_OXIMETER")+_this.t("TELL_ME_WHEN_FINISHED"), '');
                    });
                }else{
                    Subtitle(_this, "NO_DATA_RECEIVED", "USE_OXIMETER", "TELL_ME_WHEN_FINISHED", function(_this){
                        _this.emit(':ask', _this.t("NO_DATA_RECEIVED")+_this.t("USE_OXIMETER")+_this.t("TELL_ME_WHEN_FINISHED"), '');
                    });
                }

            }else if(_this.attributes["useBloodPressureMeter"]){

                if(data["dataType"] == "bpmeter_data" && !isNumeric(data["bp_processing"])){
                    _this.attributes["useBloodPressureMeter"] = false;

                    _this.attributes["bpUp"] = data["bp_up"];
                    _this.attributes["bpDown"] = data["bp_down"];
                    _this.attributes["heartrate"] = data["heartrate"];

                    _this.emit('DiagnoseIntent');
                }else if(data["dataType"] == "bpmeter_data"){
                    Subtitle(_this, "PLEASE_WAIT_FOR_DATA", "USE_BLOOD_PRESSURE_METER", "TELL_ME_WHEN_FINISHED", function(_this){
                        _this.emit(':ask', _this.t("PLEASE_WAIT_FOR_DATA")+_this.t("USE_BLOOD_PRESSURE_METER")+_this.t("TELL_ME_WHEN_FINISHED"), '');
                    });
                }else{
                    Subtitle(_this, "NO_DATA_RECEIVED", "USE_BLOOD_PRESSURE_METER", "TELL_ME_WHEN_FINISHED", function(_this){
                        _this.emit(':ask', _this.t("NO_DATA_RECEIVED")+_this.t("USE_BLOOD_PRESSURE_METER")+_this.t("TELL_ME_WHEN_FINISHED"), '');
                    });
                }

            }else{
                _this.emit('DiagnoseIntent');
            }
        });
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
                _this.emit(':ask', _this.t("USE_THERMOMETER")+_this.t("TELL_ME_WHEN_FINISHED"), '');
            });
        }else if(this.attributes["useOximeter"]){
            Subtitle(this, "USE_OXIMETER", "TELL_ME_WHEN_FINISHED", function(_this){
                _this.emit(':ask', _this.t("USE_OXIMETER")+_this.t("TELL_ME_WHEN_FINISHED"), '');
            });
        }else if(this.attributes["useBloodPressureMeter"]){
            Subtitle(this, "USE_BLOOD_PRESSURE_METER", "TELL_ME_WHEN_FINISHED", function(_this){
                _this.emit(':ask', _this.t("USE_BLOOD_PRESSURE_METER")+_this.t("TELL_ME_WHEN_FINISHED"), '');
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
                _this.emit(':ask', _this.t("USE_THERMOMETER")+_this.t("TELL_ME_WHEN_FINISHED"), '');
            });
        }else if(this.attributes["useOximeter"]){
            Subtitle(this, "USE_OXIMETER", "TELL_ME_WHEN_FINISHED", function(_this){
                _this.emit(':ask', _this.t("USE_OXIMETER")+_this.t("TELL_ME_WHEN_FINISHED"), '');
            });
        }else if(this.attributes["useBloodPressureMeter"]){
            Subtitle(this, "USE_BLOOD_PRESSURE_METER", "TELL_ME_WHEN_FINISHED", function(_this){
                _this.emit(':ask', _this.t("USE_BLOOD_PRESSURE_METER")+_this.t("TELL_ME_WHEN_FINISHED"), '');
            });
        }else{
            this.emit('DiagnoseIntent');
        }
    }
});

module.exports = Handler;
