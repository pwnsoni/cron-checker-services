// This lambda function is for hooking up the cloudwatch cron with verifyTheCron lambda function.
//Will verify it it needs to be done here or in the createRule itself.

let AWS = require(`aws-sdk`);
const lambda = new AWS.Lambda({ region: `us-east-1`});
const cloudwatchevents = new AWS.CloudWatchEvents({ region: `us-east-1`});

const putTarget = async (event) => {

    console.log(`event in putTarget : ${event}`)
    let params = {
        Rule: 'testing-rule-1',
        Targets: [
          {
            Id: 'default',
            Arn: 'arn:aws:lambda:us-east-1:873301023246:function:cron-checker-services-dev-testinvoke',
            Input: JSON.stringify({"input": "input from cron"})
          }
        ]
    };
    let res = await cloudwatchevents.putTargets(params).promise();

    await lambda
    .addPermission({
        Action: "lambda:invokeFunction",
        FunctionName: "arn:aws:lambda:us-east-1:873301023246:function:cron-checker-services-dev-testinvoke",
        StatementId: "allow-rule-invoke-" + "testing-rule-1",
        Principal: "events.amazonaws.com",
        SourceArn: "arn:aws:events:us-east-1:873301023246:rule/testing-rule-1",
    })
    .promise();

    console.log(`response from putTarget, ${JSON.stringify(res)}`);
    return res;
}

module.exports = putTarget;

