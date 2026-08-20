import expres from "express";
import jwt from 'jsonwebtoken'



const Logout = expres.Router();

Logout.delete('/LOGOUT' , async (req , res)=> {
    
    try {
      const Token = req.cookies.accses_token;

      if(!Token) {
        res.status(404).json({
        message:'Not found Credential',
        status:404,
        navigasi:'/halamanLogin'
        });
        console.log('Token gaada')
        return
      }

      const decode = jwt.verify(Token,'isi_rahasia_kamu',);
      res.clearCookie('accses_token')
      res.status(200).json({
        message:'Berhasil Logout',
        status:200,
        navigasi:'/halamanLogin'
      })
      
    } catch (err) {
       res.status(500).json({message:err || 'Ada kesalah Internal Server!'})
    }
})


export default Logout;