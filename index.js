/*
* Project Name: Minnie AI
* By: Obi Ekekezie
* Date Created: 7/22/2018
*/

const { dialogflowRequestHandler } = require('./dialogflow.js');
const { generateAssessmentHandler } = require('./generate assessment.js');

module.exports = {
    dialogflowRequestHandler,
    generateAssessmentHandler
};
