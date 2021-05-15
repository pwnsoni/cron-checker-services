let AWS = require(`aws-sdk`);
const lambda = new AWS.Lambda({ region: `us-east-1`});

const invokeTest = async (lambdaName, event) => {
    let params = {
        FunctionName: lambdaName, 
        InvocationType: "Event", 
        Payload: JSON.stringify(event), 
        // Qualifier: "1"
       };
    let res = await lambda.invoke(params).promise();
    console.log(res);
    console.log(`payload ${res.Payload}`);
    return res;
}


const invoke = async (lambdaName, event) => {
    console.log(`lambdaName : ${lambdaName}, event : ${JSON.stringify(event)}`)
    let params = {
        FunctionName: lambdaName, 
        InvocationType: "Event", 
        Payload: JSON.stringify(event), 
        // Qualifier: "1"
       };
    let res = await lambda.invoke(params).promise();
    console.log(res);
    console.log(`payload ${res.Payload}`);
    return res;
}


module.exports = {invokeTest, invoke};