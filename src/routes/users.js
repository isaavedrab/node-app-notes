const router = require('express').Router();
const User = require('../models/User');
const passport = require('passport');

router.get('/users/signin', (req, res)=>{    
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local',{
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true    
}));

router.get('/users/signup', (req, res)=>{    
    res.render('users/signup');
});

router.post('/users/signup', async (req, res)=>{
    console.log(req.body);

    const {name, email, password, confirm_password} = req.body;
    const errors = [];

    if(password != confirm_password){
        errors.push({text: 'Las contraseñas no coiciden.'});
        console.log('Las contraseñas no coiciden.');
    }
    if(password.length < 4){
        errors.push({text: 'La contraseña debe ser al menos 4 caracteres.'})
        console.log('La contraseña debe ser al menos 4 caracteres.');
    }
    if(errors.length > 0){        
        res.render('users/signup', {errors, name, email, password, confirm_password});        
    }else{    
        const emailUser = await User.findOne({email: email});
        if(emailUser){
            console.log('Ya existe una cuenta con este correo.');
            req.flash('error_msg', 'Ya existe una cuenta con este correo.');
            res.redirect('/users/signup');
        }else{
            const newUser = new User({name, email, password});
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            console.log('Usuario registrado exitosamente.');
            req.flash('success_msg', 'Usuario registrado exitosamente.');
            res.redirect('/users/signin');                                         
        }        
    }    
});

router.get('/users/logout',(req, res)=>{
    req.logOut();
    res.redirect('/');
});

module.exports = router;