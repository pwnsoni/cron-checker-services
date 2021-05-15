//create the cloudwatch event rule, so that 
// we can track if the cron hit at the right time or nor, (Its connected with hitTheCron)

//Working perfectly fine ----


let AWS = require(`aws-sdk`);
const lambda = new AWS.Lambda({ region: `us-east-1`});
const cloudwatchevents = new AWS.CloudWatchEvents({ region: `us-east-1`});

const createRule = async (event) => {
    console.log(`creating the rule in cron-checker-services, ${JSON.stringify(event)}`);
    const {ruleName, ruleExpression, input, targetId} = event;
    let params = {
        Name: ruleName, /* required */
        Description: 'Just testing man',
        ScheduleExpression: ruleExpression,
        State: 'ENABLED',
    };

    try{
        let rule = await cloudwatchevents.putRule(params).promise();

        while (true){
            if (rule.RuleArn){
                break;
            }
        }

        console.log(`Response from create rule: ${rule}`)

        console.log(`Putting the target in the lambda`);

        params = {
            Rule: ruleName,
            Targets: [
            {
                Id: targetId,
                // below is working perfectly fine    
                // Id: 'default',
                Arn: 'arn:aws:lambda:us-east-1:873301023246:function:cron-checker-services-dev-verifythecron',
                Input: JSON.stringify(input)
            }
            ]
        };
        let resTarget = await cloudwatchevents.putTargets(params).promise();

        console.log(`response from putTarget, ${JSON.stringify(resTarget)}`);

        console.log(`Adding the permission in lambda to invoke by this event`);

        let lambdaPermRes = await lambda
        .addPermission({
            Action: "lambda:invokeFunction",
            FunctionName: "arn:aws:lambda:us-east-1:873301023246:function:cron-checker-services-dev-verifythecron",
            StatementId: "allow-rule-invoke-" + ruleName,
            Principal: "events.amazonaws.com",
            SourceArn: rule.RuleArn
        })
        .promise();

        console.log(JSON.stringify(lambdaPermRes))

        return {'statusCode': 200, 'message': 'successfully created'};


    } catch(e) {
        console.log(`ERROR ${JSON.stringify(e)}`);
        return {'statusCode': 500, 'payload': 'ok Buddy Error ' + JSON.stringify(e), 'Payload': 'hope this works success' + JSON.stringify(e) };
    }

}

module.exports.handler = createRule;
    