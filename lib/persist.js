/*
* Project Name: Minnie AI
* By: Obi Ekekezie
* Date Created: 2/1/2019
*/

const { PubSub } = require('@google-cloud/pubsub');

const __TOPIC_COMPLETED_ASSESSMENTS__ = process.env.__TOPIC_COMPLETED_ASSESSMENTS__ ||
    `projects/com-ekekezie-minnie-dev/topics/completed-assessments`;
const __APPS_SCRIPT_URL__ = process.env.__APPS_SCRIPT_URL__
    || `https://script.google.com/macros/s/AKfycbzDcoE8Q8FNw2d_z4MJQXTtEPzo8x1j6lVufkhe/exec`;
    const __SCORE_REPORTS_FOLDER_ID__ = process.env.__SCORE_REPORTS_FOLDER_ID__
    || `1eXgApRTlbTPwcf0kmYG8h62aSSXl8jrG`;
const __SCORE_REPORTS_TEMPLATE_ID__ = process.env.__SCORE_REPORTS_TEMPLATE_ID__
    || `1zV8NUdzCsn_vxhRY4s1LqQidAm2yuZdrCMMfXyp-tQA`;

let persistAssessment = (history) => {
    const attributes = {
        url: __APPS_SCRIPT_URL__,
        folderID: __SCORE_REPORTS_FOLDER_ID__,
        templateID: __SCORE_REPORTS_TEMPLATE_ID__
    };
    const data = _jsonToBuffer(history);
    return Promise.resolve(_sendPubSubMessage(__TOPIC_COMPLETED_ASSESSMENTS__, attributes, data));
};

let _sendPubSubMessage = (topic, attr, data) => {    
    return new Promise((resolve, reject) => {
        const pubsub = process.env.NODE_ENV === 'production' ? new PubSub() : new PubSub({
            projectID: 'com-ekekezie-minnie-dev',
            keyFilename: './com-ekekezie-minnie-dev.json'
        });
        pubsub.topic(topic).publish(data, attr)
        .then((messageID) => {
            console.log(`Debug: Message ${messageID} published.`);
            resolve(messageID);
        })
        .catch((error) => {
            console.log(`Error: Failed to send pub/sub message`);
            reject(error);
        });
    });
};

let _jsonToBuffer = (obj) => {
    try {
        const json = JSON.stringify(obj);
        return Buffer.from(json);
    } catch (error) {
        console.log(`Error: Failed to convert JSON to base 64`);
        throw error;
    }
};

module.exports = {
    persistAssessment
};
