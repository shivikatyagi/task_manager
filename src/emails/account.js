const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email,name)=>{
sgMail.send({
    to: email,
    from: 'iamshivikatyagi@gmail.com',
    subject: 'Thanks for joining in!!',
    text: `Hey ${name}. Welcome to Task Manager app!!`

})
}


const sendCancellationEmail= (email,name)=>{
sgMail.send({
        to:email,
        from:'iamshivikatyagi@gmail.com',
        subject:'Account successfully deleted',
        text:`Goodbye ${name}. We hope to see you soon.`
    })
}


module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}


// 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