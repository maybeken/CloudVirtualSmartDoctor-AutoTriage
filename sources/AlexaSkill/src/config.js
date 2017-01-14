var Config = {
    // Alexa skill configurations
    "ALEXA": {
        "APP_ID": "amzn1.ask.skill.2ab56e15-b9bf-4232-ae08-ab692a31c9a7", // TODO replace with your app ID (OPTIONAL).
        "DB_NAME": "autoTriageSystem-Sessions" // TODO replace with DynamoDB Table Name (OPTIONAL).
    },
    // AWS Connection configurations
    "AWS": {
        "TABLE_PREFIX": "autoTriageSystem-",
        "SUBTITLE_S3_BUCKET": "iot-project-subtitle"
    }
};

module.exports = Config;
