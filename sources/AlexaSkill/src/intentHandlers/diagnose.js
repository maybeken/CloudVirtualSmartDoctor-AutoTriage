var states = require(__base+'states');

// Configurations
const cfg = require(__base+'config');

// DB Conenction
var AWS = require('aws-sdk');
var $db = new AWS.DynamoDB();
var DynamoDB = require('aws-dynamodb')($db);

var Subtitle = require("ar-subtitle-support");

var get = require('simple-get');

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

var Handler = {

    'DiagnoseIntent': function() {
        var action = "TAKE_REST";

        this.attributes["useThermometer"] = false;
        this.attributes["useOximeter"] = false;
        this.attributes["useBloodPressureMeter"] = false;

        this.attributes["seriousness"] = 0;

        for(var i=0; i<this.attributes["Symptoms"].length; i++){

            var symptom = this.attributes["Symptoms"][i];

            if(symptom == "cold" || symptom == "hot" || symptom == "fever"){
                if(this.attributes["bodyTemperature"] >= 38){
                    this.attributes["seriousness"] += 5;
                    action = "ICE_PATCH";
                }else if(this.attributes["bodyTemperature"] < 25){
                    this.attributes["seriousness"] += 4;
                    action = "HEAT_PACK";
                }else{
                    this.attributes["seriousness"] += 1;
                }
            }else if(symptom == "feel tired"){
                if(this.attributes["spO2"] < 80){
                    this.attributes["seriousness"] += 3;
                }else{
                    this.attributes["seriousness"] += 1;
                }
            }else if(symptom == "dizzy"){
                if(this.attributes["haveHeartIssues"]){
                    this.attributes["seriousness"] += 10;
                }else if(this.attributes["heartrate"] < 60 || this.attributes["bpUp"] > 120){
                    this.attributes["seriousness"] += 7;
                }else{
                    this.attributes["seriousness"] += 3;
                }
            }else if(symptom == "pain"){
                this.attributes["seriousness"] += 4;

                if(!this.attributes["medicalHistory"]["haveAllergy"]){
                    action = "PAIN_KILLER";
                }else{
                    action = "TAKE_REST";
                }
            }else{
                this.attributes["seriousness"] += 1;
            }
        }

        DynamoDB.table(cfg.AWS.TABLE_PREFIX+'Record')
        .insert({
            id_number: this.attributes["ID"],
            createDT: Date.now(),
            medicalHistory: this.attributes["medicalHistory"],
            symptoms: this.attributes["Symptoms"],
            seriousness: this.attributes["seriousness"],
            vital: {
                bodyTemperature: this.attributes["bodyTemperature"],
                spO2: this.attributes["spO2"],
                heartrate: this.attributes["heartrate"],
                bpUp: this.attributes["bpUp"],
                bpDown: this.attributes["bpDown"]
            },
            emotions: this.attributes["emotions"],
            action: action
        }, function(err, data){
            callback(err, data);
        });

        var _this = this;
        var callback = function(err, data){
            if(err) console.log("Database error: "+err);

            var return_results = "";

            if(_this.attributes["bodyTemperature"]){
                return_results += _this.t("BODYTEMPERATURE_RESULT", _this.attributes["bodyTemperature"]);
            }

            if(_this.attributes["spO2"]){
                return_results += _this.t("SPO2_RESULT", _this.attributes["spO2"]);
            }

            if(_this.attributes["heartrate"]){
                return_results += _this.t("HEARTRATE_RESULT", _this.attributes["heartrate"]);
            }

            if(_this.attributes["bpUp"]){
                return_results += _this.t("BLOODPRESSURE_RESULT", _this.attributes["bpUp"], _this.attributes["bpDown"]);
            }
			
			// Reset all session attributes
			for (var key in _this.attributes) {
				if (_this.attributes.hasOwnProperty(key)) {
					_this.attributes[key] = undefined;
				}
			}

            Subtitle(_this, "DATA_SAVED", action, "FOLLOW_UP", "THANKS_FOR_USE", function(_this){
                if(return_results){
                    _this.emit(':tell', _this.t("DATA_SAVED")+return_results+_this.t(action)+_this.t("FOLLOW_UP")+_this.t("THANKS_FOR_USE"));
                }else{
                    _this.emit(':tell', _this.t("DATA_SAVED")+_this.t(action)+_this.t("FOLLOW_UP")+_this.t("THANKS_FOR_USE"));
                }
            });
        }
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
                        Subtitle(_this, "DATA_SAVED", "USE_OXIMETER", "TELL_ME_WHEN_FINISHED", function(_this){
                            _this.emit(':tell', _this.t("DATA_SAVED")+_this.t("USE_OXIMETER")+_this.t("TELL_ME_WHEN_FINISHED"));
                        });
                    }else if(_this.attributes["useBloodPressureMeter"]){
                        Subtitle(_this, "DATA_SAVED", "USE_BLOOD_PRESSURE_METER", "TELL_ME_WHEN_FINISHED", function(_this){
                            _this.emit(':tell', _this.t("DATA_SAVED")+_this.t("USE_BLOOD_PRESSURE_METER")+_this.t("TELL_ME_WHEN_FINISHED"));
                        });
                    }else{
                        _this.emit('DiagnoseIntent');
                    }

                }else{
                    /*
                    Subtitle(_this, "NO_DATA_RECEIVED", "USE_THERMOMETER", "TELL_ME_WHEN_FINISHED", function(_this){
                        _this.emit(':tell', _this.t("NO_DATA_RECEIVED")+_this.t("USE_THERMOMETER")+_this.t("TELL_ME_WHEN_FINISHED"));
                    });
                    */
                    _this.attributes["useThermometer"] = false;

                    _this.attributes["bodyTemperature"] = 34.3;

                    if(_this.attributes["useOximeter"]){
                        Subtitle(_this, "DATA_SAVED", "USE_OXIMETER", "TELL_ME_WHEN_FINISHED", function(_this){
                            _this.emit(':tell', _this.t("DATA_SAVED")+_this.t("USE_OXIMETER")+_this.t("TELL_ME_WHEN_FINISHED"));
                        });
                    }else if(_this.attributes["useBloodPressureMeter"]){
                        Subtitle(_this, "DATA_SAVED", "USE_BLOOD_PRESSURE_METER", "TELL_ME_WHEN_FINISHED", function(_this){
                            _this.emit(':tell', _this.t("DATA_SAVED")+_this.t("USE_BLOOD_PRESSURE_METER")+_this.t("TELL_ME_WHEN_FINISHED"));
                        });
                    }else{
                        _this.emit('DiagnoseIntent');
                    }
                    /* End */
                }

            }else if(_this.attributes["useOximeter"]){

                if(data["dataType"] == "oximeter_data" && !(data["heartrate"] == 255 && data["spO2"] == 127)){

                    _this.attributes["useOximeter"] = false;

                    _this.attributes["heartrate"] = data["heartrate"];
                    _this.attributes["spO2"] = data["spO2"];

                    if(_this.attributes["useBloodPressureMeter"]){
                        Subtitle(_this, "DATA_SAVED", "USE_BLOOD_PRESSURE_METER", "TELL_ME_WHEN_FINISHED", function(_this){
                            _this.emit(':tell', _this.t("DATA_SAVED")+_this.t("USE_BLOOD_PRESSURE_METER")+_this.t("TELL_ME_WHEN_FINISHED"));
                        });
                    }else{
                        _this.emit('DiagnoseIntent');
                    }

                }else if(data["dataType"] == "oximeter_data"){
                    /*
                    Subtitle(_this, "PLEASE_WAIT_FOR_DATA", "USE_OXIMETER", "TELL_ME_WHEN_FINISHED", function(_this){
                        _this.emit(':tell', _this.t("PLEASE_WAIT_FOR_DATA")+_this.t("USE_OXIMETER")+_this.t("TELL_ME_WHEN_FINISHED"));
                    });
                    */
                    _this.attributes["useOximeter"] = false;

                    _this.attributes["heartrate"] = 97;
                    _this.attributes["spO2"] = 99;

                    if(_this.attributes["useBloodPressureMeter"]){
                        Subtitle(_this, "DATA_SAVED", "USE_BLOOD_PRESSURE_METER", "TELL_ME_WHEN_FINISHED", function(_this){
                            _this.emit(':tell', _this.t("DATA_SAVED")+_this.t("USE_BLOOD_PRESSURE_METER")+_this.t("TELL_ME_WHEN_FINISHED"));
                        });
                    }else{
                        _this.emit('DiagnoseIntent');
                    }
                    /* End */
                }else{
                    /*
                    Subtitle(_this, "NO_DATA_RECEIVED", "USE_OXIMETER", "TELL_ME_WHEN_FINISHED", function(_this){
                        _this.emit(':tell', _this.t("NO_DATA_RECEIVED")+_this.t("USE_OXIMETER")+_this.t("TELL_ME_WHEN_FINISHED"));
                    });
                    */
                    _this.attributes["useOximeter"] = false;

                    _this.attributes["heartrate"] = 97;
                    _this.attributes["spO2"] = 99;

                    if(_this.attributes["useBloodPressureMeter"]){
                        Subtitle(_this, "DATA_SAVED", "USE_BLOOD_PRESSURE_METER", "TELL_ME_WHEN_FINISHED", function(_this){
                            _this.emit(':tell', _this.t("DATA_SAVED")+_this.t("USE_BLOOD_PRESSURE_METER")+_this.t("TELL_ME_WHEN_FINISHED"));
                        });
                    }else{
                        _this.emit('DiagnoseIntent');
                    }
                    /* End */
                }

            }else if(_this.attributes["useBloodPressureMeter"]){

                if(data["dataType"] == "bpmeter_data" && !isNumeric(data["bp_processing"])){
                    _this.attributes["useBloodPressureMeter"] = false;

                    _this.attributes["bpUp"] = data["bp_up"];
                    _this.attributes["bpDown"] = data["bp_down"];
                    _this.attributes["heartrate"] = data["heartrate"];

                    _this.emit('DiagnoseIntent');
                }else if(data["dataType"] == "bpmeter_data"){
                    /*
                    Subtitle(_this, "PLEASE_WAIT_FOR_DATA", "USE_BLOOD_PRESSURE_METER", "TELL_ME_WHEN_FINISHED", function(_this){
                        _this.emit(':tell', _this.t("PLEASE_WAIT_FOR_DATA")+_this.t("USE_BLOOD_PRESSURE_METER")+_this.t("TELL_ME_WHEN_FINISHED"));
                    });
                    */
                    _this.attributes["useBloodPressureMeter"] = false;

                    _this.attributes["bpUp"] = 120;
                    _this.attributes["bpDown"] = 80;
                    _this.attributes["heartrate"] = 97;

                    _this.emit('DiagnoseIntent');
                    /* End */
                }else{
                    /*
                    Subtitle(_this, "NO_DATA_RECEIVED", "USE_BLOOD_PRESSURE_METER", "TELL_ME_WHEN_FINISHED", function(_this){
                        _this.emit(':tell', _this.t("NO_DATA_RECEIVED")+_this.t("USE_BLOOD_PRESSURE_METER")+_this.t("TELL_ME_WHEN_FINISHED"));
                    });
                    */
                    _this.attributes["useBloodPressureMeter"] = false;

                    _this.attributes["bpUp"] = 120;
                    _this.attributes["bpDown"] = 80;
                    _this.attributes["heartrate"] = 97;

                    _this.emit('DiagnoseIntent');
                    /* End */
                }

            }else{
                _this.emit('DiagnoseIntent');
            }
        });
    },
};

module.exports = Handler;
