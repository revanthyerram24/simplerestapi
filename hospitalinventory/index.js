var express=require("express");
var middleware=require("./middleware");
var app=express();
const MongoClient=require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017';
const dbName='hospitalInventory';
let db
app.use(express.urlencoded({
    extended: true
 }))
MongoClient.connect(url,(err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName);  
})
app.get("/hospitaldetails",middleware.checkToken,(req,res)=>{
    db.collection("hospital").find().toArray().then(result=>res.json(result))
})
app.get("/ventilatordetails",middleware.checkToken,(req,res)=>{
    db.collection("ventilator").find().toArray().then(result=>res.json(result))
})
app.get("/ventilatordetails/:hid",middleware.checkToken,(req,res)=>{
    var hid=req.params.hid
    db.collection("ventilator").find({"hid":hid}).toArray().then(result=>res.json(result))
})
app.get("/ventilatordetails/:hid/:status",middleware.checkToken,(req,res)=>{
    var hid=req.params.hid
    var status=req.params.status
    db.collection("ventilator").find({"hid":hid,"status":status}).toArray().then(result=>res.json(result))
})
app.post('/updateventilator',middleware.checkToken,(req,res)=>{
    console.log('visited  /updateventilator');
    var vid=req.body.vid;
    var status=req.body.status;
    db.collection('ventilator').updateOne({'vid':vid},{$set:{'status':status}});
    res.send(`updated status of ${vid} ventilator`);
});
app.put("/insertventilator",middleware.checkToken,(req,res)=>{
    var vid=req.body.vid
    var status=req.body.status
    var hid=req.body.hid
    db.collection("ventilator").insertOne({"vid":vid,"hid":hid,"status":status,})
    res.send("data updates")
})
app.put("/inserthospital",middleware.checkToken,(req,res)=>{
    var hid=req.body.hid
    var hname=req.body.hname
    var contact=req.body.contact
    
    db.collection("hospital").insertOne({"hid":hid,"hname":hname,"contact":contact})
    res.send("data updates")
})
app.delete("/deleteventilator",middleware.checkToken,(req,res)=>{
    
    var vid=req.body.vid
    
    
    db.collection("ventilator").remove({"vid":vid})
    res.send("data updates")
})
app.delete("/deletehospital",middleware.checkToken,(req,res)=>{
    
    var hid=req.body.hid
    
    db.collection("hospital").remove({"hid":hid})
    db.collection("ventilator").remove({"hid":hid})
    res.send("data updates")
})
app.listen(3000)