const bcrypt = require('bcrypt');
const cors = require('cors');
const express = require('express');
const pool = require('pg'); //database connection

const pool = new Pool({
    user : 'Postgres',
    host : 'localhost',
    database : 'MyDatabase',
    password : 'Gates03#',
    port : 5432
});
pool.connect();
 const app = express();
 app.use(cors()); 
 app.use(express.json());

 //get exhibitions
 app.get('/PepsArts/Exhibitions', async (req,res) =>{

    try{
        const result = await pool.query('Select * From Exhibition Returning *');
        res.status(201).send(result.rows); // sending all the rows from table

    }catch(error)
    {
        res.status(500).send("error getting Exhibitions"); // sending all the rows from table
        console.error("error with server!");
    }
 });

 //edit exhibition
 app.put('/PepsArts/Exhibition/:id', async (req,res)=>{
    const Id = req.params.Id;
    const {Name,Status,StartDate,EndDate,Description,User_Id}= req.body;
try{
    const result = await pool.query('UPDATE Exhibition SET Name=$1, Status=$2, Description=$3, StartDate=$4, EndDate=$5, User_Id =$5 where Id=$6',[Name,Status,StartDate,EndDate,Description,User_Id,Id]);

}catch(Error)
{
    res.status(500).send("error adding Exhibition"); // sending all the rows from table
    console.error("error with server!");
}

 });
 //delete a Artist
 app.delete('/PepsArts/Artist/:id', async (req, res) => {
    const resourceId = req.params.id;
  
    try {
      const result = await pool.query('DELETE FROM Artist WHERE id = $1', [resourceId]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Artist not found' });
      }
  
      res.status(200).json({ message: 'Artist deleted successfully' });
    } catch (err) {
      console.error('Error deleting resource:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });


//Delete and Art Piece
  app.delete('/PepsArts/ArtPiece/:id', async (req, res) => {
    const resourceId = req.params.id;
  
    try {
      const result = await pool.query('DELETE FROM ArtPiece WHERE id = $1', [resourceId]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Artist Piece not found' });
      }
  
      res.status(200).json({ message: 'Art Piece deleted successfully' });
    } catch (err) {
      console.error('Error deleting resource:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

 //get art pieces
 app.get('/PepsArts/ArtPieces', async (req,res) =>{

    try{
        const result = await pool.query('Select * From ArtPiece Returning *');
        res.status(201).send(result.rows); // sending all the rows from table

    }catch(error)
    {
        res.status(500).send("error getting ArtPieces"); // sending all the rows from table
        console.error("error with server!");
    }
 });

 app.get('PepsArts/Artists', async (req,res) =>{

    try{
        const result = await pool.query('Select * From Artist Returning *');
        res.status(201).send(result.rows); // sending all the rows from table

    }catch(error)
    {
        res.status(500).send("error getting Artists"); // sending all the rows from table
        console.error("error with server!");
    }
 });


 app.get('/Users', async (req,res) =>{

    try{
        const result = await pool.query('Select * From Users Returning *');
        res.status(201).send(result.rows); // sending all the rows from table

    }catch(error)
    {
        res.status(500).send("error getting Users"); // sending all the rows from table
        console.error("error with server!");
    }
 });

 // handles user login
 app.post('PepsArts/Login', async (req,res)=>{
const {Email,Password}= req.body;
try{
    const result = await pool.query('Select * from Users where Email =$1 Returning *',[Email]);
    const User = result.rows[0];
    if(User && bcrypt.Compare(User.Password,Password))
    {
        res.status(200).send({ message : "Successfully Logged in",
    Role : User.Role,
Name : User.Name});
    }
    else{
        res.status(400).send("Login not Successfully, wrong Password or Email")
    }

}catch(error)
{
    res.status(500).json("Server error Please try again..");
    console.error("Server error Please try again..");
}
});
// adding







//Updating



//Deleting




//Merging
//assigning artworks to exhibition
app.post('/PepsArts/Exhibitions/Add',async (req,res)=>{
const exhibition_id= parseInt(req.params.exhibition_id,10)
const {artworkIds }= req.body;
if(!Array.isArray(artworkIds) || artworkIds.length===0)
return res.status(400).json({
 success : false,
    message : 'ids must be a none-empty array'
})
try{
    await  pool.query('Insert INTO exhibitions_artworks (exhibition_id,artwork_id) Select $1, x FROM UNNEST($2::int[]) AS x ON CONFLICT DO NOTHING', [exhibition_id, artworkIds]
    
    );
    res.status(201).json( {success: true});


}catch(Error)
{
    res.status(501).json( {success: false});
    console.error ="database / server error";
}

}


);


 // listening for requests
 const port = 2025;
 app.listen(port,()=>{
console.log("Pep's Arts Listening to port ${Port}");

 });