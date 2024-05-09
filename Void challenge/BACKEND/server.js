const express = require("express")
const cors = require("cors")
const { Pool } = require('pg');
const bodyParser = require('body-parser')
const multer = require('multer');
const upload = multer({ dest: "uploads/" });
const app = express();
const PORT = 5000;

app.use(cors({
    origin: "http://localhost:3000" // Allow requests from this origin
  }));

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


    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
  
        
        try {
            await pool.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3)", [username, email, password]);
            res.status(200).json({ message: "User created successfully" });
        } catch (error) {
            console.error("Error executing query:", error);
            res.status(500).json({ message: "Error creating user" });
        } finally {
            connection.release(); // Release the connection back to the pool
        }
    } catch (error) {
        console.error("Error establishing database connection:", error);
        res.status(500).json({ message: error.message });
    }
});



// Rota para login
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

    app.post('/categoria', async (req, res) => {
    const { name } = req.body;
    const query = 'INSERT INTO categories (name) VALUES ($1) RETURNING *';

    try {
        const result = await pool.query(query, [name]);
        // Check if any rows were inserted
        if (result.rows.length > 0) {
            res.status(201).json(result.rows[0]); // Return the newly created category
        } else {
            // Return an error response if no rows were inserted
            res.status(500).json({ error: 'Erro ao cadastrar categoria' });
        }
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error inserting category:', error);
        // Return an error response with a meaningful message
        res.status(500).json({ error: 'Erro ao cadastrar categoria: ' + error.message });
    }
});



// Rota para criar post
app.post('/posts', upload.single('image'), async (req, res) => {
    const { title, content, user_id ,category_id} = req.body;
    const imageUrl = req.file ? req.file.path : null; // Retrieve the path of the uploaded image

    const query = 'INSERT INTO posts (title, content, category_id, image_url, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *';

    try {
        const result = await pool.query(query, [title, content,category_id??4,  imageUrl, user_id]);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Erro ao postar conteudo " + error.message });
    }
});
// Obter todas postagens

app.get('/posts', async (req, res)=>{
    try{
        const result = await pool.query('SELECT users.picture as avatar, posts.created_at , posts.title, posts.content, users.username, posts.post_id, categories.name as category FROM posts, categories,users WHERE users.user_id = posts.user_id AND posts.category_id=categories.category_id ');
        res.status(200).json(result.rows);
    } catch (error){
        res.status(500).json({error:'Erro ao obter posts ' + error.message})
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

app.put('/posts/:id', async (req, res) => {
    const postId = req.params.id;
    const { title, content,  image_url } = req.body;

    const query = 'UPDATE posts SET title = $1, content = $2, image_url = $3 WHERE post_id = $4 RETURNING *';

    try {
        const result = await pool.query(query, [title, content, image_url, postId]);

        if (result.rows.length === 1) {
            res.status(200).json(result.rows[0]); // Return the updated post
        } else {
            res.status(404).json({ error: 'Post not found '+ error.message  }); // Return 404 if post not found
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating post ' + error.message }); // Return 500 if there's an error
    }
});

// Apagar post
app.delete('/posts/:id', async (req, res)=>{
    const postId = req.params.id;
    const query = 'DELETE FROM posts WHERE post_id = $1 RETURNING *';

    try {
        const result = await pool.query(query, [postId]);
            res.status(200).json({message: 'Apagou com sucesso'})
    }catch (error){
        res.status(500).json({error:"Erro ao apagar post "+ error.message})

    }
});

app.listen(PORT, () => {console.log(`Servidor esta a correr na ${PORT}`)})
  