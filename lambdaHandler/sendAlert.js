const nodemailer = require('nodemailer');
  
  
let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD
    }
});

const sendMail = async (lastHit, time, recipients) => {

    console.log(`sending mail to ${recipients}`);

    let body = `<p> Hi, <br/> Greetings from Cron-Checker. <br/> <br/> Buddy your cron job failed for this particular hit, we thought you might wanna know.<br/> </p>`

    let cron = `<p> <strong> Cron name: ${lastHit.cronName} <br/> Cron ID: ${lastHit.cron_id} </strong> <p/>` 

    let sign = `<p> <br/> Best, <br/> Cron Checker Team </p>`

    let mailDetails = {
        from: process.env.SENDER_EMAIL,
        to: recipients,
        subject: `Cron Skipped Alert [${lastHit.cron_id}]`,
        html: body + cron + sign
    };

    try{
        const res = await mailTransporter.sendMail(mailDetails);
        console.log(res.messageId);
        return JSON.stringify(res.messageId)
    }catch(e){
        console.log(JSON.stringify(e));
        return JSON.stringify(e);
    }
      
}

module.exports.render = sendMail; 
  
