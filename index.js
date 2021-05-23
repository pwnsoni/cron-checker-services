const express = require('express');
const bodyParser = require('body-parser')
require('dotenv').config();
const {invokeTest, invoke} = require('./util.js')
const createRule = require('./lambdaHandler/createRule').handler;
const putTarget = require('./lambdaHandler/putTarget');
const removeRule = require('./lambdaHandler/removeRule').handler;
const verifyTheCron = require('./lambdaHandler/verifyTheCron').handler;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/api/register', async (req, res) => {
    let {email} = req.body;
    console.log('/api/register')
    res.send(`sending ${email}`)
})

app.post('/api/createRule', async (req, res) => {
    console.log('creatingthe rule');
    const {ruleName, ruleExpression, input, targetId} = req.body;
    console.log(`ruleName : ${ruleName}, ruleExpression : ${ruleExpression}, input : ${input}`);
    const event = {ruleExpression, ruleName, input, targetId};
    await createRule(event);
    res.send('succesfull');
})

app.get('/api/testAPI', (req, res) => {
    res.send(`tested successfully`)
})

app.get('/testAPI', (req, res) => {
    res.send(`tested successfully`)
})


app.get('/back/testAPI', (req, res) => {
    res.send(`tested successfully`)
})

app.get('/api/invoke/test', async (req, res) =>{
    console.log('invoking');
    const r = await invokeTest('cron-checker-services-dev-test', {"test": "testing successfull"});
    res.send(`returned from the Test Lambda ${JSON.stringify(r)}`)
})

app.post('/api/invoke', async (req, res) => {
    const {lambda, event} = req.body;
    console.log('invoking from post');
    const result =  await invoke(lambda, event);
    res.send(`returned from lambda function invoke ${result}`);
})

app.post('/api/removeRule', async (req, res) => {
    const {ruleName, targetId} = req.body;``
    console.log('removing from post' + ruleName);
    const result = await removeRule({ruleName, targetId});
    res.send(`returned from lambda function invoke ${result}`);
})

app.post('/api/verify', async (req, res) => {
    const {cron, sns, lastHit} = req.body;``
    console.log('removing from post' + lastHit);
    const result = await verifyTheCron({cron, sns, lastHit});
    res.send(`returned from lambda function invoke ${result}`);
})

app.listen(process.env.PORT, (err) => {
    if (!err) console.log(`listening on ${process.env.PORT}`)
})

module.exports = {app};






