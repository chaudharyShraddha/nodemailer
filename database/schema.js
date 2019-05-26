const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let studentSchema = new Schema({
    name: { type:String, required:true },
    email: { type:String, required:true },
    pass: { type:String, required:true },
});

module.exports = mongoose.model("studentData",studentSchema);