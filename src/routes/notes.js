const router = require('express').Router();
const Note = require('../models/Note');
const { isAuthenticated } = require('../helpers/auth');

//New 
router.get('/notes/add', isAuthenticated, (req, res)=>{
    console.log('Nueva Nota.');     
    res.render('notes/new-note');
});

//Create
router.post('/notes/new-note', isAuthenticated, async (req, res)=>{    
    const { tittle, description } = req.body;
    console.log('Guardando Nota... '+ { tittle, description });     
    const errors = [];
    if(!tittle){
        errors.push({text: "Ingrese Título"});        
    }
    if(!description)
        errors.push({text: "Ingrese Descripción"});        

    if(errors.length > 0){
        console.log('Existen errores en el formulario. '+ errors.toString());
        res.render('notes/new-note', {
            errors, 
            tittle,
            description
        });
    }        
    else{
        const newNote = new Note({tittle, description});
        newNote.user = req.user.id;
        await newNote.save();
        console.log('Nota agregada exitosamente.'); 
        req.flash('success_msg', 'Nota agregada exitosamente.');
        res.redirect('/notes');
    }
});

//Read
router.get('/notes/edit/:id', isAuthenticated, async (req, res)=>{
    const note = await Note.findById(req.params.id).lean();
    console.log('Modificando Nota Id: '+ req.params.id.toString());
    res.render('notes/edit-note', {note});
})

//Update
router.put('/notes/edit-note/:id', isAuthenticated, async (req, res)=>{
    const {tittle, description} = req.body;
    console.log('Guardando Nota... '+ { tittle, description });    
    await Note.findByIdAndUpdate(req.params.id, {tittle, description});
    console.log('Nota modificada exitosamente.');
    req.flash('success_msg', 'Nota modificada exitosamente.');
    res.redirect('/notes');
});

//Delete
router.delete('/notes/delete/:id', isAuthenticated, async (req, res)=>{
    console.log('Eliminando Nota Id: '+ req.params.id.toString());
    await Note.findByIdAndDelete(req.params.id);   
    console.log('Nota eliminada exitosamente.');
    req.flash('success_msg', 'Nota eliminada exitosamente.');
    res.redirect('/notes');
});

//Search
router.get('/notes', isAuthenticated, async (req, res)=>{        
        
    const notes = await Note.find({user:req.user.id}).lean().sort({date:'desc'});    
    console.log('Buscando Notas...');
    res.render('notes/all-notes', { notes });    
    
    /*
    console.log('Buscando Notas...');
    const notes = await Note.find({}).sort({date:'desc'}).then(documentos =>{
        const contexto = {notes: documentos.map(documento =>{
            return{
                tittle: documento.tittle,
                description: documento.description
            }                
        })}        
        res.render('notes/all-notes', { notes:contexto.notes })    
    })
    */        
});

module.exports = router;