//This projects us the MailChimp APIBuilding to add contacts to a predefined "audience"
const express = require("express");
const app = express();
const https = require("https"); //included with Node
const mailchimp = require("@mailchimp/mailchimp_marketing");
const listId = "bdcf87f887";//MailChimp List, currently using my Main Audience

//app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json()); //express now includes JSON parser
app.use(express.urlencoded({extended: true}));
app.use(express.static("public")); //use static "local" relative files

//Our Root (Home) Route Server Get
app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html" );
});

mailchimp.setConfig({
  apiKey: "a8ac082a0b5a2f3c1159497a98f8f0b1a-us1",
  server: "us1",
});

app.post("/", function(req, res) { //"callback function"
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  console.log(firstName, lastName, email);

  //create array of objects in Mail Chimp API format
  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email
  }


  //Now sending data to external resource
  //Had to use Try+Catch for the error redirection
  async function run() {
    try {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
      }
    });

      res.sendFile(__dirname + "/success.html");
    } catch (err) {
      console.log(err.status);
      res.sendFile(__dirname + "/failure.html");
    }
  }

  run();

}); //end of POST to Home Route

//POST action for Try Again button
app.post("/failure", function(req, res) {
  res.redirect("/");
});

//Using dynamic PORT for Heroku OR Locally
app.listen(process.env.PORT || 3000, function() {
  //console.log("Server running on Port 3000");
});
