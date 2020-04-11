const router = require('express').Router();

router.get('/', (req, res)=>{
    //res.send('Página Principal');
    res.render('index');
});

router.get('/about', (req, res)=>{
    //res.send('Acerca de...');
    res.render('about');
});

module.exports = router;



