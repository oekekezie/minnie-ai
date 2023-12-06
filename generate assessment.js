/*
* Project Name: Minnie AI
* By: Obi Ekekezie
* Date Created: 2/3/2019
*/

const fetch = require('node-fetch');

// FIXME: Needs "context" parameter not "callback"
let generateAssessmentHandler = (event, context, callback) => {
    console.log(`Debug: event = ${JSON.stringify(event, null, 2)}`);
    // FIXME: Security
    const message = event;
    const attributes = message.attributes;
    const data = message.data;
    const { url, folderID, templateID } = attributes;
    // Get history
    const history = JSON.parse(Buffer.from(data, 'base64').toString());
    // Execute Apps Script
    fetch(
        url, 
        { method: 'POST', body: JSON.stringify({ history, folderID, templateID }) 
    })
    .then((response) => {            
        return response.json();
    })
    .then((result) => {
        // console.log(`Debug: Result of Apps Script = ${JSON.stringify(result)}`);
        if (result && result.success) {
            // Success
            callback();
        } else {
            // Respond with failed to document message
            throw new Error('Apps Script failed');
        }
    })
    .catch((error) => {
        // Failed to document
        console.log(`Error: Failed to document: ${error}`);
        // Respond with failed to document message
        // TODO: Is it a mistake to call the callback if there's an error? I think so...
        callback(new Error(`Error: Failed to document: ${error}`));
    });
};

module.exports = {
    generateAssessmentHandler
};
