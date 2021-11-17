const Card = require('../db/models/card');
const fs = require('fs');
const { Parser } = require('json2csv');
const nodemailer = require('nodemailer');

class CardController {

    async addCard(req, res) {

        try{
            res.render('pages/buy/formbuy');
        }catch(e){
            //
        }
          
    }

    

    async sendEmail(req, res) {
        

        const emails = [];
        // zapisanie maila
        emails.push(req.body.email);

         console.log('Baza maili zaktualizowana: ', emails);

         // wyslanie maila
         async function sendWelcomeMessage(email) {
         // const testAccount = await nodemailer.createTestAccount();
         const transporter = nodemailer.createTransport({
         host: 'smtp.poczta.onet.pl', //'smtp.ethereal.email',
         port: 465, //587,
         secure: 465 === 465, // true for 465, false for other ports
         auth: {
        user: 'kacper4312@op.pl', //testAccount.user,
        pass: 'Kacper4312', //testAccount.pass
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  
    const info = await transporter.sendMail({
      from: 'Kacper <kacper4312@op.pl>',
      to: email,
      subject: 'Dziękujemy za złożone zamówienie',
      text: 'Cześć, dziękuję za złożone zamoówienie. Wkrótce dotrze mail o statusie zamówienia',
      html: 'Cześć, <br> dziękuję za złożone zamoówienie. Wkrótce dotrze mail o <b>statusie zamówienia </b>',
    });

    
    // console.log('Podgląd -> ', nodemailer.getTestMessageUrl(info));
  }

    await sendWelcomeMessage(req.body.email);
  
    console.log('Wiadomość powitalna wysłana do: ', req.body.email);
  // wyswietlenie podziekowania
    res.render('pages/buy/thanks');
    }
  
}

module.exports = new CardController();