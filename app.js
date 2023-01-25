const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { urlencoded } = require("body-parser");
const app = express();
app.use(express.static("newsletterpublic"));
app.use(bodyParser.urlencoded({extended: true}));
app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html");
});
app.post("/", function(req,res){
    const f = req.body.fname;
    const l = req.body.lname;
    const e = req.body.email;
    const data = {
        members: [
            {
                email_address: e,
                status: "subscribed",
                merge_fields: {
                    FNAME: f,
                    LNAME: l
                }
            }
        ]
    }
    const jsonData= JSON.stringify(data);
    const url = "https://us8.api.mailchimp.com/3.0/lists/5ffd9a1582";
    const options = {
        method : "POST",
        auth : "aakash:0aa13d47d17f0174f53d5f76d93a6841-us8"
    }
    const request = https.request(url, options, function(response){
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else{
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
});
app.post("/failure", function(req,res){
    res.redirect("/");
})
app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000");
});

//api key :    0aa13d47d17f0174f53d5f76d93a6841-us8
//list id :    5ffd9a1582