const express = require("express")
const { Pool } = require('pg');
const bodyParser = require('body-parser')

const app = express();
const PORT = 5000;

const pool = new Pool({
    // user: 'POST_APP_owner',
    // password: 'Luluribas@080301',
    // host: 'postgresql://POST_APP_owner:jU1oSeM5ukXh@ep-white-bird-a5earvlr.us-east-2.aws.neon.tech/POST_APP?sslmode=require',
    // port: 5432,
    // database: 'POST_APP',
    connectionString:"postgresql://POST_APP_owner:jU1oSeM5ukXh@ep-white-bird-a5earvlr-pooler.us-east-2.aws.neon.tech/POST_APP?sslmode=require"
  });
  
  module.exports = {
    query: (text, params) => pool.query(text, params)
  };


  app.use(bodyParser.json());

  // Rota para signup
  app.post("/signup", async (req, res) => {
    const {username, email, password} = req.body;
    const query = "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING";

    try{
        const result = await pool.query(query, [username, email, password]);
        res.status(200).json(result.rows[0]);
    } catch (error){
        res.status(500).json({error: 'Erro ao cadastrar usuario'});
    }
});

app.post('/login', async (req, res) =>{
    const {email, password} = req.body;
    const query = 'SELECT * FROM users WHERE email = $1 AND password = $2';

    try{
        const result = await pool.query(query, [email, password]);
            if (result.rows.length === 1){
                res.status(200).json({
                    message: "Login bem-vindo"
                });

            }  else{
                res.status(401).json({ error: 'Credenciais Invalidas'});
            }
        } catch (error) {
            res.status(500).json({error: 'Erro ao fazer login'});
        }
    });

    // Rota para cadastros de categorias

    app.post('/categories', async (req, res) =>{
        const {name} = req.body;
        const query = 'INSERT INTO categories (name) VALUES ($1) RETURNING *';

        try{
            const result = await pool.query(query, [name]);
            
            res.status(201).json(result.rows[0]);
            } catch (error) {
                res.status(500).json({error: 'Erro ao cadastrar categoria'})
        }
    });


// Rota para criar post

app.post('/posts', async (req, res)=>{
    const {title, content, category_id} = req.body

    const query = 'INSERT INTO posts (title, content, category_id) VALUES ($1, $2, $3) RETURNING *';

    try {
        const result = await pool.query(query, [title, content, category_id]);
        res.status(200).json(result.rows[0]);
        }catch(error){
            res.status(500).json({error:"Erro ao postar conteudo"})

    }
});

// Obter todas postagens

app.get('/posts', async (req, res)=>{
    try{
        const result = await pool.query('SELECT * FROM posts');
        res.status(200).json(result.rows);
    } catch (error){
        res.status(500).json({error:'Erro ao obter posts'})
    }
});

// Buscar posts por id
app.get('/posts/:id', async (req, res) =>{

    const postId = req.params.id;

    try{
        const result = await pool.query('SELECT * FROM posts WHERE post_id = $1', [postId]);

        if(result.rows.length === 1){
            res.status(200).json(results.rows[0]);
        }else{
            res.status(404).json({ error: 'Nao encontrado'});
        }

    } catch{
        res.status(500).json({error: 'Erro ao obter post'})
    }
})

// Atualizar Post

app.put('/posts/:id', async(req, res)=>{
    const postId = req.params.id;
    const {title, content, category_id} = req.body;
    const query = 'UPDATE posts SET title= $1, content = $2, category_id= $3 WHERE post_id = $4 RETURNING';

    try{
        const result = await pool.query(query, [title, content, category_id, postId]);
        if (result.rows.length === 1){
            res.status(200).json(result.rows[0]);
        } else{
            res.status(404).json({error: "Postagem nao encontrada"});
        }

    }catch (error) {
        res.status(500).json({error:'Erro ao atualizar postagem'})
    }
})

// Apagar post
app.delete('/post/:id', async (req, res)=>{
    const postId = req.params.id;
    const query = 'DELETE FROM posts WHERE post_id = $1 RETURNING';

    try {
        const result = await pool.query(query, [postId]);
        if(result.rows.length === 1){
            res.status(200).json({message: 'Apagou com sucesso'})
        } else{
            res.status(404).json({error:'Post nao encontrado'})
        } 

    }catch (error){
        res.status(500).json({error:"Erro ao apagar post"})

    }
});

app.listen(PORT, () => {console.log(`Servidor esta a correr na ${PORT}`)})
  