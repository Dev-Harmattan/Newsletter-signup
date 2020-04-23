const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/sign", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {

        members: [{
            email_address : email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us4.api.mailchimp.com/3.0/lists/32d21da82a";
    const options = {
        method: "POST",
        auth: "sodiq1:2e64d818fb590ee26b43b6097b232bbc-us4"
    };

    const request = https.request(url, options, function(responds){

        const status = responds.statusCode;
        if(status === 200){
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
        }

        responds.on("data", function(data){
            console.log(JSON.parse(data));
        });

    });

    request.write(jsonData);
    request.end();
    
});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen( process.env.PORT || 3000, function(){
    console.log("Server is running on port: 3000");
});


// key id
// 2e64d818fb590ee26b43b6097b232bbc-us4

//list id
// 32d21da82a