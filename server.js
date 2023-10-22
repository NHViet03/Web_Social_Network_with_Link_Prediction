require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const cookieParser=require('cookie-parser');

const app=express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());


//Routes


//Connect MongoDB

app.get('/',(req,res)=>{
    res.json({msg:"Welcome to my website"})
})

const port=process.env.PORT||5000;

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);   
})