import dotenv from "dotenv"
import express from "express"
import bodyParser  from "body-parser"
import ejs from "ejs"
import mongoose from "mongoose"
import encrypt from "mongoose-encryption"
dotenv.config();




// App session
const app = express(); 
// PORT SESSION
const port  = process.env.PORT || 3000;
// APP USING 
app.use(bodyParser.urlencoded({extended : true}))
app.use(express.static("public"))
// SET VIEW ENGINE
app.set("view engine", "ejs")
// Connect to mongo DB
mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true});

// Create the schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
}); 

userSchema.plugin(encrypt, { secret: process.env.SECRET ,  encryptedFields: ['password']})

const User = mongoose.model("User", userSchema)

// Getting the index of the web for log
app.get("/", (req,res)=>{
    res.render("index")
})


// Getting the register page by click
app.get("/register", (req,res)=>{
    res.render("register")
})

// Getting the login page by click
app.get("/login", (req,res)=>{
    res.render("login")
})
// Posting a new User
app.post("/register", (req,res)=>{
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    try{
        user.save();
        console.log("Saved succesfully to database", user)
        res.render("secrets")
    }catch(err){
        console.error(err);
    }

})
// Login on the secret pages
app.post("/login",  async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    // Trying to access the secret page while the user is auth and the password
    try{
        const findUser = await User.findOne({email: username});

        if(findUser && findUser.password === password){
            console.log("Okay Perfect")
            res.render("secrets")
        }
    }catch(err){
        console.error(err)
    }
  
})
app.listen(port, ()=>{
    console.log("Port is working on " + port)
})