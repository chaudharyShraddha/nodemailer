const express = require("express");
const bodyParser = require("body-parser");
const hbs = require("express-handlebars");
const mongoose = require("mongoose");
let studentData = require("./database/schema");
const nodemailer = require("nodemailer");

let app =express();
mongoose.connect("mongodb://localhost:27017/student");

app.engine("hbs",hbs({extname:"hbs",defaultLayout:"index",layoutsDir:__dirname+"/views"}));
app.set("view engine","hbs");
app.use(bodyParser.urlencoded({extended: false}));

app.get("/", (req,res)=>{
    res.render("insert",{title:"Student Registration"});
});
app.post("/insert", (req,res)=>{
    let id = req.body.id;
    if( id =="" ){
        let datas = new studentData({
            name: req.body.name,
            email:req.body.email,
            pass: req.body.password
        });
        datas.save( (err,doc)=>{
            mail(doc);
        });
    }
    else{
        studentData.findById(id, (err,doc)=>{
            doc.name = req.body.name,
            doc.email= req.body.email,
            doc.pass = req.body.password,
            doc.save();
        });
    }
    res.redirect("/showData");
});

app.get("/showData",(req,res)=>{
    studentData.find().then( (doc)=>{
        res.render("showData",{data:doc});
    });
});

app.get("/delete/:id", (req,res)=>{
    let id = req.params.id;
    studentData.findByIdAndRemove(id).exec();
    res.redirect("/showData");
});

app.get("/update/:id", (req,res)=>{
    studentData.findById(req.params.id, (err,doc)=>{
        res.render("insert",{ title:"Update Details", data:doc });
    });
});

app.listen(8888,console.log("server is running"));

function mail(data){
	const details = 
	`<p>You have new Registration Request</p>
	<h3>Student details</h3>
	<ul>
		<li>Student name: ${data.name}</li>
		<li>Email: ${data.email}</li>
		<li>Password: ${data.pass}</li>
	</ul>`
let mailTransport = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user:"shraddha9577@gmail.com",
        pass:"calculas2610"
    }
});

let sendMail = {
    from: "shraddha9577@gmail.com",
    to: `${data.email}`,
    subject: "Registration Confirmation!!",
    text:  "hello",
    html: details
}

mailTransport.sendMail(sendMail, (err,doc)=>{
    if(err) throw err;
    console.log("mail is send");
});

}