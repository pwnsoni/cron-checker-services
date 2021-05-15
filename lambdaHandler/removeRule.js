//It is for removing the event rule to stop watching the cron.
//Working perfectly fine ----


let AWS = require(`aws-sdk`);
const lambda = new AWS.Lambda({ region: `us-east-1`});
const cloudwatchevents = new AWS.CloudWatchEvents({ region: `us-east-1`});

const removeRule = async (event) => {
    console.log(`creating the rule in cron-checker-services, ${JSON.stringify(event)}`);
    const {ruleName, targetId} = event;
    
    console.log('removing targets');

    let params = {
        Ids: [ /* required */
            targetId,
          /* more items */
        ],
        Rule: ruleName, /* required */
      };

    try{

        let remTargetRes = await cloudwatchevents.removeTargets(params).promise();
        console.log(`Remove Target Response ${remTargetRes}`);

        params = {
            Name: ruleName, /* required */
          };
        let rule = await cloudwatchevents.deleteRule(params).promise();


        console.log(`Response from create rule: ${JSON.stringify(rule)}`)

        console.log(`Removing the permission in lambda to invoke by this event`);

        let lambdaPermRes = await lambda
        .removePermission({
            FunctionName: "arn:aws:lambda:us-east-1:873301023246:function:cron-checker-services-dev-verifythecron",
            StatementId: "allow-rule-invoke-" + ruleName,
            })
        .promise();

        console.log(JSON.stringify(lambdaPermRes))

        return {'statusCode': 200, 'message': 'successfully removed'};


    } catch(e) {
        console.log(`ERROR ${JSON.stringify(e)}`);
        return {'statusCode': 500, 'payload': 'ok Buddy Error ' + JSON.stringify(e), 'Payload': 'hope this works success' + JSON.stringify(e) };
    }

}

module.exports.handler = removeRule;
    