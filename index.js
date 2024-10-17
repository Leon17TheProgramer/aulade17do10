const express = require('express');
const exphbs = require('express-handlebars');
//const nodemon = require('nodemon');
const mysql = require('mysql2');

const app = express();

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.use(express.static('public'));
app.use(express.urlencoded({
    extended:true
}))
app.use(express.json())

const conn = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password: '',
    database : 'amigos'
})

app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/amigos',(req,res)=>{
    const sql = 'SELECT * FROM pessoas'
    conn.query(sql,(err,data)=>{
        if(err){
            console.log(err)
            return
        }
        const pessoas = data
        //console.log(pessoas)
        res.render('amigos',{pessoas})

    })

})

app.get('/amigo/:id', (req,res)=>{
    const id = req.params.id
    const sql = `SELECT * FROM pessoas WHERE id = ${id}`
    conn.query(sql,id,(err,data)=>{
        if(err){
            console.log(err)
            return
        }
        const amigo = data[0] 
        res.render('amigo',{amigo})
    })
})

app.post('/apagar/:id', (req,res)=>{
    const id = req.params.id
    const sql = `DELETE FROM pessoas WHERE id = ${id}`
    conn.query(sql,(err)=>{
        if(err){
            console.log(err)
            return
        }
         
        res.redirect('/amigos')
    })
})

app.post('/adicionar',(req,res)=>{
    const nome = req.body.nome
    const idade = req.body.idade
          
    const sql = `INSERT INTO pessoas (nome,idade) VALUES ('${nome}', ${idade})`

    conn.query(sql,(err)=>{
        console.log(err)
        return
    })

    res.redirect('/')
    
    //res.render('adicionar',{nome,idade})
})

app.get('/editar/:id',(req,res)=>{
    const id = req.params.id 
    const sql = `SELECT * FROM pessoas WHERE id = ${id}`
    conn.query(sql,id,(err, data) =>{
        if(err){
            console.log(err)
            return
        }
        const amigo = data[0]
        res.render('editar',{amigo})
    })
})

app.post('/formEditar',(req,res)=>{
    const id = req.body.id
    const nome = req.body.nome
    const idade = req.body.idade

    const sql = `UPDATE pessoas SET nome='${nome}', idade=' ${idade}' WHERE id = ${id}`
    conn.query(sql,(err,data)=>{
        if(err){
            console.log(err)
            return
        }
        res.redirect('/')
    })
})



conn.connect((err)=>{
    if(err){
        console.log(err)
    }else{
        console.log('Conectou')
        app.listen(3000,() => console.log(`servidor funcionando em http://localhost:3000`))
    }
})
