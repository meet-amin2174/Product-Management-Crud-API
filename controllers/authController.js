const database = require('../services/database');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken')

exports.regUser = async (req,res) => {
    try{
            const userExists = await database.pool.query({
                text : 'SELECT * FROM users WHERE email = $1',
                values : [req.body.email]
            })
            if(userExists.rows.length > 0){
                return res.status(409).json({error: `email ${req.body.email} already exists!!`})
            }
            const hashedPassword = await bcrypt.hash(req.body.password,10)
            const newUser = await database.pool.query(
                {
                    text : `INSERT INTO users (name,email,password,role) VALUES ($1,$2,$3,$4) returning *`,
                    values : [req.body.name,req.body.email,hashedPassword,req.body.role]    
                }
            )
           return res.status(201).json({message : `user ${req.body.name} with email ${req.body.email} registered successfully !!!!`})
    }catch(error){
        return res.status(500).json({error : error.message})
    }   
 }
 
 exports.loginUser = async (req, res) => {
     try {
         const user = await database.pool.query({
             text: 'SELECT * FROM users WHERE email = $1',
             values: [req.body.email]
         });
 
         if (user.rows.length === 0) {
             return res.status(404).json({ error: 'User not found' });
         }
 
         const validPassword = await bcrypt.compare(req.body.password, user.rows[0].password);
 
         if (!validPassword) {
             return res.status(401).json({ error: 'Invalid credentials' });
         }
 
         const token = jwt.sign(
             { id: user.rows[0].id, email: user.rows[0].email },
             process.env.JWT_SECRET,
             { expiresIn: '4h' } 
         );
         console.log('Token:', token);
         return res.status(200).json({
             message: `Welcome back, ${user.rows[0].name}!`,
             token: token
         });
     } catch (error) {
         return res.status(500).json({ error: error.message });
     }
 };


 