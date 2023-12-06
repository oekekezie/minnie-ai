/*
* Project Name: Minnie AI
* By: Obi Ekekezie
* Date Created: 11/8/2018
*/

let _ssmlRegistrationItems = () => {
    return `<break strength="strong" /> <emphasis>(FIRST NAME) (LAST NAME),</emphasis> <break strength="strong" /> <emphasis>(STREET NUMBER) (STREET NAME) Street,</emphasis> <break strength="strong" /> <emphasis>(CITY).</emphasis>`;
};

module.exports = {
    _FOR_UNIT_TESTING_: [
        `FOR UNIT TESTING`,
    ],
    // No matching intent
    ERROR_NO_MATCHING_INTENT_HANDLER: [
        `<emphasis level="moderate">Oops!</emphasis> <break strength="weak" /> It looks like something went wrong. <break strength="weak" /> Please hang up and call back again later. <emphasis>Goodbye.</emphasis>`        
    ],
    // Default fallback
    FIRST_FALLBACK: [
        `I’m sorry but I didn’t understand what you just said. <break strength="weak" /> Can you please say that again?`
    ],
    SECOND_FALLBACK: [
        `I'm sorry. <break strength="medium" /> But I still don’t understand what you're saying. <break strength="weak" /> Can you please say it again one last time?`
    ],
    NO_FALLBACKS_REMAINING: [
        `I’m sorry that I’m having such a hard time understanding what you’re saying. <break strength="weak" />  Please try calling me back later to see if that helps.  <emphasis>Goodbye.</emphasis>`
    ],
    // Repetitions
    FIRST_REPETITION: [
        `No worries. <break strength="weak" /> I’ll say it again <break strength="medium" /> `
    ],
    SECOND_REPETITION: [
        `I can say it again one more time. <break strength="medium" /> Please listen carefully <break strength="strong" /> `
    ],
    NO_REPETITIONS_REMAINING: [
        `It seems as though you might be having a hard time <break strength="x-weak" /> understanding what <break strength="x-weak" /> I'm saying. Please try calling me back later to see if that helps. <emphasis>Goodbye.</emphasis>`
    ],
    // Goodbye
    GOODBYE: [
        `You haven't answered all the questions! <emphasis>Please call me again later so we can complete the screening test.</emphasis> Goodbye!`
    ],
    // Welcome Consent
    GREETING_AND_CONSENT: [
        `Hi, this is Minnie speaking. <break strength="weak" /> Just so you know, you’re speaking with a computer. <break strength="medium" /> I'd like to ask you some questions <break strength="x-weak" /> to check your memory and concentration. <break strength="x-weak" /> Does that sound ok?`,
    ],
    SEGUE_CONSENT_GIVEN: [
        `Great! <emphasis level="weak">My first question</emphasis> <break strength="x-weak" /> is, `
    ],
    CONSENT_DECLINED: [
        `I didn’t hear a “yes,” so I’ll hold my questions for now. Feel free to give me a call again when you’re ready. It’s a good idea to answer my questions before your visit so that you can make the most of your time with your healthcare provider. Goodbye.`
    ],
    // Orientation Year
    PROMPT_ORIENTATION_YEAR: [
        `What year is it?`
    ],
    SEGUE_ORIENTATION_YEAR: [
        `And, `
    ],
    // Orientation Month
    PROMPT_ORIENTATION_MONTH: [
        `What month is it now?`
    ],
    SEGUE_ORIENTATION_MONTH: [
        `Now, please listen carefully, <break strength="medium" />`
    ],
    // Memory Registration
    PROMPT_MEMORY_REGISTRATION: [
        `I'm going to give you a name and address to remember for a few minutes. Repeat this name and address after me: ${_ssmlRegistrationItems()}`
    ],
    REPROMPT_MEMORY_REGISTRATION: [
        `Please repeat this name and address after me: ${_ssmlRegistrationItems()}`
    ],
    SEGUE_MEMORY_REGISTRATION: [
        `Good job. <break strength="medium" /> Remember that name, street address, and city for a few minutes because I’ll ask you about them again in a bit. <break strength="medium" />`
    ],
    RETRY_MEMORY_REGISTRATION: [
        `That’s not quite right. <break strength="medium" /> Let’s try again. <break strength="medium" />`
    ],
    // Orientation Time
    PROMPT_ORIENTATION_TIME: [
        `<emphasis level="strong">Without looking at a watch or a clock,</emphasis> <break strength="weak" /> about what time do you think it is?`
    ],
    SEGUE_ORIENTATION_TIME: [
        `Ok. Next,  <break strength="medium" />`
    ],
    // Attention Count
    PROMPT_ATTENTION_COUNT: [
        `<emphasis level="strong">When I say, “Go,”</emphasis> I’d like you to count backwards from (START AT) to 1. <break strength="weak"/> I may interrupt you to keep you on track. <break strength="medium" /> <emphasis level="strong">Go.</emphasis>`
    ],
    SEGUE_ATTENTION_COUNT: [
        `Good effort! Let’s go on to the next task, <break strength="medium" /> `
    ],
    INTERRUPT_ATTENTION_COUNT: [
        `Sorry to interrupt. <break strength="medium" /> I only heard part of your answer. Let's continue from the last number that I heard you say correctly.  <break strength="medium" />`
    ],
    MISINTERPRETED_ATTENTION_COUNT: [
        `I'm sorry. <break strength="medium" /> I'm having trouble interpreting what you said. <break strength="medium" />`
    ],
    // Attention Months
    PROMPT_ATTENTION_MONTHS: [
        `<emphasis level="strong">When I say, “Go,”</emphasis> I’d like you to say the months of the year <emphasis>backwards</emphasis> starting with (START AT). <break strength="weak" /> I may interrupt you to keep you on track. <break strength="medium" /> <emphasis level="strong">Go.</emphasis>`
    ],
    SEGUE_ATTENTION_MONTHS: [
        `Nice effort! My last question <break strength="x-weak" /> is, `
    ],
    INTERRUPT_ATTENTION_MONTHS: [
        `Sorry to interrupt. <break strength="medium" /> I only heard part of your answer. Let's continue from the last month that I heard you say correctly.`
    ],
    MISINTERPRETED_ATTENTION_MONTHS: [
        `I'm sorry. <break strength="medium" /> I'm having trouble interpreting what you said. <break strength="medium" />`
    ],
    // Memory Recall
    PROMPT_MEMORY_RECALL: [
        `<emphasis>What were the name and address</emphasis> I asked you to remember?`
    ],
    SEGUE_MEMORY_RECALL: [
        `Nice work, <break strength="medium" /> `
    ],
    RETRY_MEMORY_RECALL: [
        `That’s not quite right. <break strength="medium" /> Let’s try again.  <break strength="medium" />`
    ],
    // Conclusion
    CONCLUSION: [
        `Good job! Thank you so much for your patience and effort. Your healthcare provider will let you know the results during your upcoming office visit. Goodbye.`
    ],
    // Failed to document
    FAILED_TO_DOCUMENT: [
        `Good job! Thank you so much for your patience and effort. Unfortunately, something went wrong while I was recording your results. Please call me back later so we can repeat the testing. Goodbye.`
    ]
};