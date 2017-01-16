'use strict';

// Set up Global Root DIR
global.__base = __dirname + '/';

// Amazon SDKs
var Alexa = require('alexa-sdk');

// Configurations
const cfg = require(__base+'config');

// Language Modules
var common = require(__base+'lang/common');
var scripts = require(__base+'lang/scripts');

// Lanuages Support
var extend = require('util')._extend;

var languageStrings = {
    "en-GB": {
        "translation": extend(common.COMMON_EN_GB, scripts.SCRIPTS_EN_GB)
    },
    "en-US": {
        "translation": extend(common.COMMON_EN_GB, scripts.SCRIPTS_EN_GB)
    }
};

// Intent Handlers Modules
var commonIntent = require(__base+'intentHandlers/common');
var diagnoseIntent = require(__base+'intentHandlers/diagnose');

// State Handlers Modules

var loginIDState = require(__base+'stateHandlers/login/id');
var loginPhoneState = require(__base+'stateHandlers/login/phone');

var registrationPromptState = require(__base+'stateHandlers/registration/prompt');
var registrationNameState = require(__base+'stateHandlers/registration/name');
var registrationIDState = require(__base+'stateHandlers/registration/id');
var registrationPhoneState = require(__base+'stateHandlers/registration/phone');

var historyQ1State = require(__base+'stateHandlers/history/q1');
var historyQ2State = require(__base+'stateHandlers/history/q2');
var historyQ3State = require(__base+'stateHandlers/history/q3');
var historyQ4State = require(__base+'stateHandlers/history/q4');

var questionActionState = require(__base+'stateHandlers/questions/action');
var questionMeasureState = require(__base+'stateHandlers/questions/measure');

// Alexa Handlers
exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = cfg.ALEXA.APP_ID;

    // Make use of DynamoDB (Easy Implementation)
    alexa.dynamoDBTableName = cfg.ALEXA.DB_NAME;

    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;

    alexa.registerHandlers(
        commonIntent, diagnoseIntent, loginIDState, loginPhoneState,
        registrationPromptState, registrationNameState, registrationIDState, registrationPhoneState,
        historyQ1State, historyQ2State, historyQ3State, historyQ4State,
        questionActionState, questionMeasureState
    );
    alexa.execute();
};
