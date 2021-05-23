// To check if a cron ran at a particular time
// Connect with DB and check if it did hit at the right time or not
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_CONNECTION_URI;
const dbName = process.env.DBNAME;
const ObjectID = require('mongodb').ObjectID;
const sendMail = require('./sendAlert').render;

const verifyTheCron = async (event) => {
    console.log(`Event in verifythecron ${JSON.stringify(event)}`);
    const {sns, cron, lastHit} = event;

    const client = await MongoClient.connect(uri, {useUnifiedTopology: true});
    const db = await client.db(dbName)

    let res = await db.collection("lasthits").find({_id: new ObjectID(lastHit)}).toArray();
    console.log(res[0]);

    console.log(res[0].lastHits[res[0].lastHits.length - 1]) 


    console.log(check(res[0].lastHits[res[0].lastHits.length - 1]))

    try{

        if(check(res[0].lastHits[res[0].lastHits.length - 1])){
            console.log(`All good, cron was hit today`);
        } else{
            console.log(`cron was not hit today`);
            console.log('updating lastHits');
            let updatedAt = new Date();
            let update = await db.collection('lasthits').updateOne({_id: new ObjectID(lastHit)}, 
                    {$set: {updatedAt: updatedAt}, $push: {failedHits: updatedAt}}, {upsert: true})
            console.log(`fetching the sns recipients`);
            let recipients = await db.collection("snsgroups").find({_id: new ObjectID(sns)}).toArray();
            await sendMail(res[0] ,updatedAt, recipients[0].recipients);
        }
    
        return {'statusCode': 200, 'message': 'verfied this cron for DATE => ' + new Date()};

    }catch(e){
        console.log(JSON.stringify(e));
        return {'statusCode': 500, 'message': 'Error in verfied this cron for DATE => ' + new Date(), "error": JSON.stringify(e)};
    }


}

const check = (d) => {
    let curr = new Date();
    curr.setTime(curr.getTime() - (3 * 60* 1000));
    if (d > curr){
        return true;
    }
    return false;
}

module.exports.handler = verifyTheCron;