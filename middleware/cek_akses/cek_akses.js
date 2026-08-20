import express from "express";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'



const hak_akses = express.Router();

dotenv.config();

const rahasia = process.env.JWT_SECRET

hak_akses.post('/hak_akses' , (req, res) => {

    console.log('Masuk ke hak akses');
    const {pathname}= req.body;

  try{
    console.log('Mencoba mendapatkan Token Accses...')
    const accses_token = req.cookies?.accses_token;
    
    if(!accses_token) {
        console.log('Token Accses tidak ada!')
        return res.status(401).json({
            status:401,
            message:'Sepertinya ada masalah , Silahkan login kembali!',
            navigasi:'/halamanLogin'
        })
    }

    console.log('Decode Token Accses...')
    const decode = jwt.verify(accses_token , rahasia , {ignoreExpiration:true});

    if(!decode) {
        console.log('Token Accses Rusak')
        return res.status(401).json({
            status:401,
            message:'Token is Broken',
            navigasi:'/halamanLogin'
        })
    }
    
    console.log('Token Accses Tidak Palsu!');

    if(decode.exp < Date.now() / 1000) {
        console.log('Token Accses EXP')
        return res.status(401).json({
            status:401,
            message:'Token is Broken',
            navigasi:'/halamanLogin'
        })
    }

    console.log('token ga exp')
    console.log(pathname.split("/")[1] + " " + decode.role)

    if(pathname.split("/")[1] == 'Admin' && decode.role == 'admin'){
         console.log('Token Accses valid! dan role admin')
         return res.status(200).json({
          statu:200,
          message:'ok',
          username:decode.username
        })
    }

    if(decode.role == 'user' && pathname.split("/")[1] == 'User'){
        console.log('Token Accses valid! dan anda user')
        return res.status(200).json({
        statu:200,
        message:'OK',
        username:decode.username
    })
    }

    if(decode.role == 'driver' && pathname.split("/")[1] == 'Driver'){
        console.log('Token Accses valid! dan anda user')
        return res.status(200).json({
        statu:200,
        message:'OK',
        username:decode.username
    })
    }

  
    return res.status(403).json({
        statu:200,
        message:'Sepertinya ada kesalahan, Silahkan login kembali!',
        navigasi:'/halamanLogin'
    })

  } catch (err) {
     return res.status(500).json({
        status:500,
        message:'Internal server',
        navigasi:'halamanLogin'
     })
  }
} );


export default hak_akses