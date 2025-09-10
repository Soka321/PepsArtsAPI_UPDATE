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


 /* ---------------------------Exhibition data ----------------------------------------*/

 //Merging
 //Add Exhibition
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
        await  pool.query('Insert INTO exhibitions_artworks (exhibition_id,artwork_id) Select $1, x FROM UNREST($2::int[]) AS x ON CONFLICT DO NOTHING', [exhibition_id, artworkIds]
        
        );
        res.status(201).json( {success: true});
    
    
    }catch(Error)
    {
        res.status(501).json( {success: false});
        console.error ="database / server error";
    }
    
    });
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

 //get 1 Exhibition
 app.get('/PepsArts/Exhibitions/:id', async (req,res) =>{
  const Id = req.params.Id;
    try{
        const result = await pool.query('Select * From Exhibition where Id=$1 Returning *',[Id]);
        res.status(201).send(result.rows[0]); // sending all the rows from table

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

 //delete a Exhibition
 app.delete('/PepsArts/Exhibition/:id', async (req, res) => {
    const resourceId = req.params.id;
  
    try {
      const result = await pool.query('DELETE * FROM Exhibition WHERE id = $1', [resourceId]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Exhibition not found' });
      }
  
      res.status(200).json({ message: 'Exhibition deleted successfully' });
    } catch (err) {
      console.error('Error deleting resource:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });


  //Add Registration for Exhibition

app.post('/PepsArts/Exhibition/Register/:id', async (req,res)=>{
    const Ex_Id = req.params.Id;
 const {User_Id,RegistrationDate,NumberOfAttendees}= req.body;

 try{
    var result = await pool.query('Select * From Exhibition_Register where User_Id =$1 And Exhibition_Id = $2 Returning *',[Ex_Id,User_Id]);
     if(result.rows.rowCount > 0)
     {
res.send("User Already registered!");
     }
var reg = await pool.query('Insert INTO Exhibition_Register(Exhibition_Id,User_Id,RegistrationDate,NumberOfAttendees) values ($1,$2,$3,$4)',[Ex_Id,User_Id,RegistrationDate,NumberOfAttendees]);
      res.status(201).send({ message : "User Successfully Registered" , user : reg.rows[0]});
 } catch(error)
 {
    res.status(500).json("Server error Please try again..");
    console.error("Server error Please try again..");

 }





});

//Getting all Visitor registrations(View all registrations)
app.get('/PepsArts/Exhibition/Visitor/Registrations', async (req,res) =>{

    try{
        const result = await pool.query('Select * From Exhibition_Registration Returning *');
        res.status(201).send(result.rows); // sending all the rows from table

    }catch(error)
    {
        res.status(500).send("error getting Users"); // sending all the rows from table
        console.error("error with server!");
    }
 });

 /* ---------------------------Artist data ----------------------------------------*/
 
 // Add Artist

 //Get all Artists

 app.get('/PepsArts/Artists', async (req,res) =>{

    try{
        const result = await pool.query('Select * From Artist Returning *');
        res.status(201).send(result.rows); // sending all the rows from table
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Artists not found' });
          }
    }catch(error)
    {
        res.status(500).send("error getting Artists"); // sending all the rows from table
        console.error("error with server!");
    }
 });
 

 //Update Artist
 
 app.put('/PepsArts/Artists/:id', async (req,res)=>{
    const Id = req.params.Id;
    const {Name,Surname,Biography,Email,PhoneNumber,Country,City,DateCreated}= req.body;
try{
    const result = await pool.query('UPDATE Artist SET Name=$1, Surname=$2, Biography=$3, Email=$4, PhoneNumber=$5, Country =$5,  City=$6, DateCreated =$7 where Id=$8',[Name,Surname,Biography,Email,PhoneNumber,Country,City,DateCreated,Id]);
     res.status(201).send(req.rows[0]);

     if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Artist not found' });
      }

}catch(Error)
{
    res.status(500).send("error adding Exhibition"); // sending all the rows from table
    console.error("error with server!");
}

 }); 


 //get single Artist
 app.get('/PepsArts/Artists/:id', async (req,res) =>{
    const Id = req.params.Id;
      try{
          const result = await pool.query('Select * From Artist where Id=$1 Returning *',[Id]);
          res.status(201).send(result.rows[0]); // sending all the rows from table

          if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Artist not found' });
          }
  
      }catch(error)
      {
          res.status(500).send("error getting Artist"); // sending all the rows from table
          console.error("error with server!");
      }
   });
 
 //delete a Artist
 app.delete('/PepsArts/Artist/:id', async (req, res) => {
    const resourceId = req.params.id;
  
    try {
      const result = await pool.query('DELETE * FROM Artist WHERE id = $1', [resourceId]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Artist not found' });
      }
  
      res.status(200).json({ message: 'Artist deleted successfully' });
    } catch (err) {
      console.error('Error deleting resource:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

/* ---------------------------Art Piece data ----------------------------------------*/

// Add Art Piece

app.post('/PepsArts/ArtPieces', async (req,res)=>{
    const {Title,Description,EstimatedValue,Status,ImgPath,DateCreated,Artist_Id}= req.body;
    try{
        const result = await pool.query('Insert Into ArtPiece (Title,Description,EstimatedValue,Status,ImgPath,DateCreated,Artist_Id) values ($1,$2,$3,$4,$5,$6,$7)',[Title,Description,EstimatedValue,Status,ImgPath,DateCreated,Artist_Id,Id]);
         res.status(201).send(req.rows[0]);
    
         if (result.rowCount === 0) {
            return res.status(404).json({ message: 'ArtPiece not found' });
          }
    
    }catch(Error)
    {
        res.status(500).send("error adding ArtPiece"); // sending all the rows from table
        console.error("error with server!");
    }
    

});

//Update Art Piece

 
app.put('/PepsArts/ArtPieces/:id', async (req,res)=>{
    const Id = req.params.Id;
    const {Title,Description,EstimatedValue,Status,ImgPath,DateCreated,Artist_Id}= req.body;
try{
    const result = await pool.query('UPDATE ArtPiece SET Title=$1, Description=$2, EstimatedValue=$3, Status=$4, ImgPath=$5, DateCreated =$6 , Artist_Id=$7 where Id=$8',[Title,Description,EstimatedValue,Status,ImgPath,DateCreated,Artist_Id,Id]);
     res.status(201).send(req.rows[0]);

     if (result.rowCount === 0) {
        return res.status(404).json({ message: 'ArtPiece not found' });
      }

}catch(Error)
{
    res.status(500).send("error adding ArtPiece"); // sending all the rows from table
    console.error("error with server!");
}

 }); 


 //get single Art Piece
 app.get('/PepsArts/ArtPieces/:id', async (req,res) =>{
    const Id = req.params.Id;
      try{
          const result = await pool.query('Select * From ArtPiece where Id=$1 Returning *',[Id]);
          res.status(201).send(result.rows[0]); // sending all the rows from table

          if (result.rowCount === 0) {
            return res.status(404).json({ message: 'ArtPiece not found' });
          }
  
      }catch(error)
      {
          res.status(500).send("error getting ArtPiece"); // sending all the rows from table
          console.error("error with server!");
      }
   });




//Delete and Art Piece
  app.delete('/PepsArts/ArtPiece/:id', async (req, res) => {
    const resourceId = req.params.id;
  
    try {
      const result = await pool.query('DELETE * FROM ArtPiece WHERE id = $1', [resourceId]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'ArtPiece not found' });
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
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Art pieces not found' });
          }
    }catch(error)
    {
        res.status(500).send("error getting ArtPieces"); // sending all the rows from table
        console.error("error with server!");
    }
 });

 

 /* ---------------------------User data ----------------------------------------*/

 app.get('/PepsArts/Users', async (req,res) =>{

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
 app.post('/PepsArts/Login', async (req,res)=>{
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




//Normal User registration
app.post('/PepsArts/Register', async (req,res)=>{
    const {FirstName,LastName,Gender,Age,Email,Password,PhoneNumber,Role,DateCreated}= req.body;
   
    try{
       var result = await pool.query('Select * From User where Email = $1 Returning *',[Email]);
        if(result.rows.rowCount > 0)
        {
   res.send("User Already registered!");
        }

        //hashing the password for security
        var hashPassword = bcrypt.hash(Password,10);
   var reg = await pool.query('Insert INTO Register(FirstName,LastName,Gender,Age,Email,Password,PhoneNumber,Role,DateCreated) values ($1,$2,$3,$4,$5,$6,$7,$8,$9) Returning *',[FirstName,LastName,Gender,Age,Email,hashPassword,PhoneNumber,Role,DateCreated]);
         res.status(201).send({ message : "User Successfully Registered" , user : reg.rows[0]});
    } catch(error)
    {
       res.status(500).json("Server error Please try again..");
       console.error("Server error Please try again..");
   
    }
   
   
   
   
   
   });


/* ---------------------------Status for Exhibition and Art Piece data ----------------------------------------*/



//Updating Status for Exhibition
app.put('/PepsArts/Exhibition/Status/:id', async (req,res)=>{
    const Id = req.params.Id;
    const {Status}= req.body;
try{
    const result = await pool.query('UPDATE ArtPiece SET Status=$1 where Id=$2',[Status,Id]);
    if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Exhibition not found and failed to update status' });
      }
}catch(Error)
{
    res.status(500).send("error updating Exhibition"); // sending all the rows from table
    console.error("error with server!");
}

 }); 

//Updating Status for ArtPiece
app.put('/PepsArts/ArtPiece/Status/:id', async (req,res)=>{
    const Id = req.params.Id;
    const {Status}= req.body;
try{
    const result = await pool.query('UPDATE ArtPiece SET Status=$1 where Id=$2',[Status,Id]);
    if (result.rowCount === 0) {
        return res.status(404).json({ message: 'ArtPiece not found and failed to update status' });
      }
}catch(Error)
{
    res.status(500).send("error adding ArtPiece"); // sending all the rows from table
    console.error("error with server!");
}

 }); 


//Deleting







 // listening for requests
 const port = 2025;
 app.listen(port,()=>{
console.log("Pep's Arts  Server Listening to port ${{Port}}");

 });