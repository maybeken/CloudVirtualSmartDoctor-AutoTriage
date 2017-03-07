var states = require(__base+'states');

// Configurations
const cfg = require(__base+'config');

// DB Conenction
var AWS = require('aws-sdk');
var $db = new AWS.DynamoDB();
var DynamoDB = require('aws-dynamodb')($db);

var Subtitle = require("ar-subtitle-support");

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

            Subtitle(_this, "DATA_SAVED", action, "FOLLOW_UP", "THANKS_FOR_USE", function(_this){
                if(return_results){
                    _this.emit(':tell', _this.t("DATA_SAVED")+return_results+_this.t(action)+_this.t("FOLLOW_UP")+_this.t("THANKS_FOR_USE"));
                }else{
                    _this.emit(':tell', _this.t("DATA_SAVED")+_this.t(action)+_this.t("FOLLOW_UP")+_this.t("THANKS_FOR_USE"));
                }
            });
        }
    }
};

module.exports = Handler;
