// To check if a cron ran at a particular time
// Connect with DB and check if it did hit at the right time or not

const verifyTheCron = (event) => {
    console.log(`Event in verifythecron ${JSON.stringify(event)}`);
    console.log(`what I need to do is conect to DB and check if the lastHits or updatedAt is within 10 minutes`);
    console.log(`And return if everything is good, or send alerts to those recipients found in snsGroup collection`);
    return {'statusCode': 200, 'message': 'verfied this cron for DATE => ' + new Date()};
}

module.exports.handler = verifyTheCron;