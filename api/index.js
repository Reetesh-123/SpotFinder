const express=require('express');
const cors=require('cors');
const { default: mongoose } = require('mongoose');
const UserModel = require('./models/User');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser');
const download=require('image-downloader');
const multer=require('multer');
const fs=require('fs');
const placeModel = require('./models/Place');
const bookingModel = require('./models/Bookings');

require('dotenv').config();
const app=express();

const bcryptSalt=bcrypt.genSaltSync(10);
const jwtSecret='fafdklfdshaj';


app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(__dirname+'/uploads'));

app.use(cors({
    credentials:true,
    origin:'http://localhost:5173'
}));

mongoose.connect(process.env.MONGO_URL);

function getUserFromToken(req)
{
    return new Promise((resolve,reject)=>{
        jwt.verify(req.cookies.token,jwtSecret,{},async (err,userData)=>{
            if(err)
            throw err;
            resolve(userData);
        });
    });
}

app.get('/test',(req,res)=>{
    res.json('test ok');
})

app.post('/login', async (req,res)=>{
    const {email,password}=req.body;
    
    const userDoc= await UserModel.findOne({email});
    if(userDoc){
        const passOk= bcrypt.compareSync(password,userDoc.password);
        if(passOk)
        {
            jwt.sign({email:userDoc.email, id:userDoc._id},jwtSecret,{},(err,token)=>{
                if(err)
                throw err;
                res.cookie('token',token).json(userDoc);
            })
        }
        else
        {
            res.status(422).json('pass not ok');
        }
    }
    else
    {
        res.json('not found')
    }
})

app.post('/register',async (req,res)=>{
    const {name,email,password}=req.body;
    try{

        const userDoc = await UserModel.create({
            name,
            email,
            password : bcrypt.hashSync(password,bcryptSalt)
        })
        res.json(userDoc);
    }
    catch(err)
    {
        res.status(422).json(err);
    }
})

app.get('/profile',async (req,res)=>{
    
    
    const {token}=req.cookies;
    if(token)
    {
        jwt.verify(token,jwtSecret,{},async (err,userData)=>{
            if(err)
            throw err;
            
            const {name,email,_id}=await UserModel.findById(userData.id);
            res.json({name,email,_id});
        })
    }
    else
    {
        res.json(null);
    }
})

app.post('/logout',async (req,res)=>{
    res.cookie('token','').json(true);
})

app.post('/upload-by-link',async (req,res)=>{
    const {link}=req.body;
    const newName= 'photo' + Date.now() +'.jpg';
    await download.image({
        url: link,
        dest:  __dirname + '/uploads/'+newName,
    });
    res.json(newName);
})


app.post('/upload',(req,res)=>{
    const uploadedFiles=[];
    
    for(let i=0 ; i<req.files.length ; i++)
    {
        const {path,originalname}=req.files[i];
        const parts=originalname.split('.');
        const ext=parts[parts.length-1];
        const newPath=path+'.'+ext;
        fs.renameSync(path,newPath);
        uploadedFiles.push(newPath.replace('uploads\\',''));
    }
    res.json(uploadedFiles);

    res.json(req.files);
})

app.post('/places',async(req,res)=>{
    const {title,address,addedPhoto,description,perks,extraInfo,checkIn,checkOut,maxGuests,price}=req.body;
    const {token}=req.cookies;
    jwt.verify(token,jwtSecret,{},async (err,userData)=>{
        if(err)
        throw err;
        
        const placeDoc= await placeModel.create({
            owner:userData.id,
            title,address,
            photos:addedPhoto, 
            description,perks,extraInfo,checkIn,checkOut,maxGuests,price
        });
        res.json(placeDoc);
    })
})

app.get('/user-places',(req,res)=>{
    const {token}=req.cookies;
    jwt.verify(token,jwtSecret,{},async (err,userData)=>{
        if(err)
        throw err;

        res.json(await placeModel.find({owner:userData.id}));
    })
})
app.get('/places/:id',async(req,res)=>{
    const {id}=req.params;
    res.json(await placeModel.findById(id));
})

app.put('/places',async (req,res)=>{
    const {id,title,address,addedPhoto,description,perks,extraInfo,checkIn,checkOut,maxGuests,price}=req.body;
    const {token}=req.cookies;

    jwt.verify(token,jwtSecret,{},async (err,userData)=>{
        if(err)
        throw err;
    const placeDoc=await placeModel.findById(id);
        if(userData.id === placeDoc.owner.toString())
        {
            await placeDoc.set({title,address,
                photos:addedPhoto,
                description,perks,extraInfo,checkIn,checkOut,maxGuests,price});
        } 
        await placeDoc.save();
        res.json('ok');
    })
})

app.get('/places',async (req,res)=>{
    res.json( await placeModel.find());
})

app.post('/bookings',async (req,res)=>{
    const {place,checkIn,checkOut,phone,numberOfGuests,name,price}=req.body;
    const userData=await getUserFromToken(req);
    bookingModel.create({
        place,checkIn,checkOut,phone,numberOfGuests,name,price,
        user:userData.id
    }).then(doc=>{
        res.json(doc);
    })
    .catch(err=>{
        res.json(err);
    })
})

app.get('/bookings',async (req,res)=>{
    const userData=await getUserFromToken(req);
    res.json(await bookingModel.find({user:userData.id}).populate('place'));
})

app.listen(4000);