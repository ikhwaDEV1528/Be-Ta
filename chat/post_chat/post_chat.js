import express from "express";
import db from "../../db.js";
import { io } from "../../server.js";

const chatRouter = express.Router();





chatRouter.post('/dataTeman',async (req,res)=> {
    const {teman,username,profile_user,profile_temen} = req.body;
    const temenId = 1
    const id =1
    
    console.log(profile_user)
    
    io.emit('profile_temen' , profile_user)


    
    //  const [getrRows] = await db.query('SELECT nama_teman,username FROM daftar_teman_chat');
    //  const [postRows] = await db.query('INSERT INTO daftar_teman_chat (user_id,teman_id,nama_teman,username) VALUES(?,?,?,?), VALUES(?,?,?,?)',[id,temenId,teman,username])
    try{
        const [getrRows] = await db.query('SELECT nama_teman,username,gambar FROM daftar_teman_chat');
        if(getrRows.length == 0){
            if(teman == username){
                const [rowsUsername] = await db.query('INSERT INTO daftar_teman_chat (user_id,teman_id,nama_teman,username) VALUES(?,?,?,?)',[id,temenId,username,username]) 
                return  res.status(200).json('ok') 
            }
            const [rowsUsername] = await db.query('INSERT INTO daftar_teman_chat (user_id,teman_id,nama_teman,username,gambar) VALUES(?,?,?,?,?)',[id,temenId,teman,username,profile_temen[0]])
            const [rowsTeman] = await db.query('INSERT INTO daftar_teman_chat (user_id,teman_id,nama_teman,username,gambar) VALUES(?,?,?,?,?)',[id,temenId,username,teman,profile_user[0]])
            const [rows] = await db.query('SELECT nama_teman,username,gambar FROM daftar_teman_chat');
            res.status(200).json({chat:rows});
        }
        else{
            if(getrRows.some(item => item.username == username && item.nama_teman == teman)){
                console.log('sudah ada temen ini dalam daftar chat anda')
            }
            else{
                if(teman == username){
                    const [rowsUsername] = await db.query('INSERT INTO daftar_teman_chat (user_id,teman_id,nama_teman,username,gambar) VALUES(?,?,?,?,?)',[id,temenId,username,username,profile_user[1]]) 
                    return;
                }
                const [rowsUsername] = await db.query('INSERT INTO daftar_teman_chat (user_id,teman_id,nama_teman,username,gambar) VALUES(?,?,?,?,?)',[id,temenId,teman,username,profile_temen[0]]) 
                const [rowsTeman] = await db.query('INSERT INTO daftar_teman_chat (user_id,teman_id,nama_teman,username,gambar) VALUES(?,?,?,?,?)',[id,temenId,username,teman,profile_user[0]])
                const [rows] = await db.query('SELECT nama_teman,username,gambar FROM daftar_teman_chat');
                res.status(200).json({chat:rows});
            }
        }
    }
        
    catch(err){
      res.status(500).json({error:err})
    }

});

export default chatRouter;