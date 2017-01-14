var pause = "<break time=\"0.1s\" />";

var Scripts = {
    "SCRIPTS_EN_GB": {
        // Welcoming Section
        "WELCOME_MESSAGE": "Welcome! You are now using %s . ",
        "WELCOME_BACK": "Welcome back %s! ",
        "WHAT_CAN_I_HELP": "What can I help you? ",
        // Login Section
        "ID_PROMPT": "Please tell me your identity card number including the number inside the bracket. ",
        "ID_INVAILD": "Your identity card number seems to be wrong, please try again. ",
        "PHONE_PROMPT": "Please tell me your 8 digit phone number. ",
        "PHONE_WRONG": "Sorry, your phone number doesn't match our record, please try again. ",
        // Registration
        "REGISTRATION_PROMPT": "It appears that we don't have your record, would you like to make a registration now? ",
        "REGISTRATION_FINISH": "Registration finished! ",
        // Registration Question
        "NAME_PROMPT": "Please tell me your english nick name. ",
        "NAME_CONFIRM": "Is your name: %s ? ",
        "ID_CONFIRM": "Is %s your first four HKID number? ",
        "PHONE_EXPLAIN": "This will be used as your login password. ",
        "PHONE_CONFIRM": "Is %s your last four phone number? ",
        "PHONE_INVAILD": "You phone number seems to be wrong, please try again. ",
        // Helper Section
        "REGISTRATION_HELP": "We need to collect your personal information to fully understand your health status, would you like to continue? ",
        "YES_OR_NO": "Please just simply say Yes or No. ",
        "NAME_HELP": "You could simply use a name such as John or Mary. ",
        "ID_HELP": "For example: A"+pause+"1"+pause+"2"+pause+"3"+pause+"4"+pause+"5"+pause+"6"+pause+"7. ",
        // Condition History Section
        "MEDICAL_HISTORY_PROMPT": "I will now ask you about your medical history, this will help me to pioritise when you are sick. ",
        "HEART_ISSUES_PROMPT": "Do you have any kind of heart disease? ",
        "HEART_ISSUES_EXAMPLES": "For examples: Irrgular heart rate, history of heart attacks ",
        "BLOOD_ISSUES_PROMPT": "Do you have any kind of blood issues? ",
        "BLOOD_ISSUES_EXAMPLES": "For examples: High blood pressure, high blood sugar, anemia ",
        "LONG_TERM_DISEASE_PROMPT": "Do you have any kind of long term disease? ",
        "LONG_TERM_DISEASE_EXAMPLES": "For examples: Diabetes, asthma ",
        "ALLERGY_PROMPT": "Do you have any kind of allergies? ",
        "ALLERGY_EXAMPLES": "For examples: Medicin allergies or food allergies ",
        // Symptoms Section
        "HOW_YOU_FEEL": "You can just tell me how you feel. ",
        "SYMPTOM_CONFIRM": "You are feeling or having %s. ",
        "SYMPTOM_PROMPT": "Do you feel any other illness? ",
        // Measure Section
        "USE_OXIMETER": "Please use the Oximeter on the table to measure your pulse and oxygen level. ",
        "USE_THERMOMETER": "Please use the Thermometer on the table to measure your body temperature. ",
        "USE_BLOOD_PRESSURE_METER": "Please use the Blood pressure meter to measure your blood pressure. ",
        "TELL_ME_WHEN_FINISHED": "Tell me when you are done. ",
        "NO_DATA_RECEIVED": "No related data was received, please follow the instruction on screen to make the measure again. ",
        "PLEASE_WAIT_FOR_DATA": "Data are being measured, please wait for a moment until the measure is ready. ",
        "BODYTEMPERATURE_RESULT": "Your body temperature is %i degree celsius, ",
        "SPO2_RESULT": "Your blood oxigen level is %i percent, ",
        "HEARTRATE_RESULT": "Your heartreate is %i per minute, ",
        "BLOODPRESSURE_RESULT": "Your blood pressure is %i over %i, ",
        // Result Section
        "TAKE_REST": "Please take some rest. ",
        "PAIN_KILLER": "Please take some pain killer from our nurse to reduce the pain. ",
        "ICE_PATCH": "Please take a ice patch from our nurse to low your body temperature. ",
        "HEAT_PACK": "Please take a heat pack from our nurse to keep your body warm. ",
        "FOLLOW_UP": "Our nurse will call your name and soon our doctor will make further diagnose. "
    },
	"SCRIPTS_ZH_HK": {
        // Welcoming Section
        "WELCOME_MESSAGE": "歡迎使用醫院自動分流系統 ",
        "WELCOME_BACK": "歡迎你的回來, ",
        "WHAT_CAN_I_HELP": "請問有什麼可以幫到你? ",
        // Login Section
        "ID_PROMPT": "請說出你的香港身份證號碼連同括號內的號碼 ",
        "ID_INVAILD": "你的香港身份證號碼有誤, 請重新再試 ",
        "PHONE_PROMPT": "請說出你的 8 位數字電話號碼 ",
        "PHONE_WRONG": "對不起, 你的電話號碼和我們的記錄有所出入, 請重新再試 ",
        "PHONE_INVAILD": "你的電話號碼有誤, 請重新再試 ",
        // Registration
        "REGISTRATION_PROMPT": "我們好像未有你的記錄, 你是否希望現在註冊? ",
        "REGISTRATION_FINISH": "註冊完成! ",
        // Registration Question
        "NAME_PROMPT": "請說出你的英文稱呼 ",
        "NAME_CONFIRM": "你的稱呼正確嗎? ",
        "ID_CONFIRM": "你的香港身份證號碼首 4 個號碼正確嗎? ",
        "PHONE_EXPLAIN": "你的電話號碼會用作登入之用 ",
        "PHONE_CONFIRM": "你的電話話號碼尾 4 個數字正確嗎? ",
        // Helper Section
        "REGISTRATION_HELP": "我們需要收集你的個人資料以便全面的了解你的建康狀況, 你想繼續嗎? ",
        "YES_OR_NO": "請說出 Yes 或 No ",
        "NAME_HELP": "你可以選擇一個簡單的名字例如: John 或 Mary ",
        "ID_HELP": "舉例: A"+pause+"1"+pause+"2"+pause+"3"+pause+"4"+pause+"5"+pause+"6"+pause+"7. ",
        // Condition History Section
        "MEDICAL_HISTORY_PROMPT": "現在我會問有關患病的記錄, 這方面的資料可以讓我們更合適地處理你的輪候次序 ",
        "HEART_ISSUES_PROMPT": "你有否曾患上任何心臟相關疾病? ",
        "HEART_ISSUES_EXAMPLES": "例如: 心律不正, 心臟病 ",
        "BLOOD_ISSUES_PROMPT": "你有否曾患上任何血液相關疾病? ",
        "BLOOD_ISSUES_EXAMPLES": "例如: 高血壓, 高血糖, 貧血 ",
        "LONG_TERM_DISEASE_PROMPT": "你有否曾患上任何長期病患? ",
        "LONG_TERM_DISEASE_EXAMPLES": "例如: 糖尿病, 哮喘 ",
        "ALLERGY_PROMPT": "你有沒有對任何物品有過敏反應? ",
        "ALLERGY_EXAMPLES": "例如: 藥物過敏, 食物過敏 ",
        // Symptoms Section
        "HOW_YOU_FEEL": "你可以直接告訴我你的症狀 ",
        "SYMPTOM_CONFIRM": "你正在出現 ",
        "SYMPTOM_PROMPT": "你有沒有其他症狀? ",
        // Measure Section
        "USE_OXIMETER": "請使用桌上的血氧計來測量你的脈搏和血氧水平 ",
        "USE_THERMOMETER": "請使用桌上的溫度計來測量你的體溫 ",
        "USE_BLOOD_PRESSURE_METER": "請使用桌上的血壓計來測量你的血壓水平 ",
        "TELL_ME_WHEN_FINISHED": "完成後請知悉我 ",
        "NO_DATA_RECEIVED": "未能收到相關數據, 請依照顯示屏上的方法重新測量 ",
        "PLEASE_WAIT_FOR_DATA": "測量進行中, 請等候測量完成 ",
        // Result Section
        "TAKE_REST": "請先稍作休息 ",
        "PAIN_KILLER": "請向我們的護士領取少量止痛藥以舒緩你的痛症 ",
        "ICE_PATCH": "請向我們的護士領取冰袋以降低你的體溫 ",
        "HEAT_PACK": "請向我們的護士領取暖包以提升你的體溫 ",
        "FOLLOW_UP": "我們的護士會在短時間內安排醫生為你進行更深入的檢驗 "
    }
};

module.exports = Scripts;
