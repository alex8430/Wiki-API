const bodyParser = require("body-parser");
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{ useNewUrlParser: true , useUnifiedTopology: true });

const  articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article",articleSchema);
// ----------------------------------------Request for all Article----------------------------------------------
app.route("/articles")

// GET REQUEST
.get(function(req,res){
  Article.find({},function(err,foundArticles){
    if(err){
      res.send(err);
    }else{
      res.send(foundArticles);
    }
  });
})

 // POST REQUEST
.post(function(req,res){
  const newArticle = new Article({
    title:req.body.title,
    content:req.body.content
  });
  newArticle.save(function(err){
    if(err){
      res.send(err);
    }else{
      res.send("Succesfully added new article: "+req.body.title);
    }
  });
})

//DELETE REQUEST
.delete(function(req,res){
  Article.deleteMany({}, function(err){
    if(err){
      res.send(err)
    }else{
      res.send("Succesfully delete all the Articles");
    }
  });
});

// ---------------------------------------------Request for Specific Article---------------------------------
app.route("/articles/:title")
.get(function(req,res){
  Article.findOne({title: req.params.title},function(err,foundArticle){
    if(err){
      res.send(err);
    }else{
      if(foundArticle){
        res.send(foundArticle);
      }else{
        res.send("Nothing Found!");
      }

    }
  });
})
.put(function(req,res){
  Article.update(
    {title:req.params.title},
    {title:req.body.title,
    content: req.body.content},
    {overwrite:true},
    function(err){
      if(err){
         res.send(err)
      }else{
         res.send("Succesfully updated");
      }
  })
})
.patch(function(req,res){
  Article.update(
    {title:req.params.title},
    {$set:req.body},
  function(err){
    if(err){
      res.send(err)
    }else{
      res.send("Succesfully update throught patch request");
    }
  })
})
.delete(function(req,res){
  Article.deleteOne({title:req.params.title},function(err){
    if(err){
      res.send(err)
    }else{
      res.send("Succesfully delete article: "+req.params.title);
    }
  });
});


app.listen(3000, function(){
  console.log("server is start on port 3000");
});
