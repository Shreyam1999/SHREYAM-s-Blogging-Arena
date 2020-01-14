var bodyParser=require("body-parser"),
methodOverride=require("method-override"),
expressSanitizer=require("express-sanitizer"),
mongoose      =require("mongoose"),
express       =require("express"),
app           =express();
 
//APP CONFIG
mongoose.connect("mongodb://localhost/blog_app",{ useNewUrlParser: true });
app.set("view engine","ejs");         //to use ejs file without extension (npm install ejs)
app.use(express.static("public"));   //to serve our custom styled sheets
app.use(bodyParser.urlencoded({extended:true})); //to get data from form (npm install body-parser)
app.use(expressSanitizer());//so that user cannot misuse the text area 
app.use(methodOverride("_method"));
mongoose.set("useFindAndModify", false);//To remove Depriciated Warning


//MONGOOSE/MODEL CONFIG
var blogSchema=new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{ type:Date,default:Date.now}
});

//Compile up into a model
var Blog=mongoose.model("Blog",blogSchema);


   
//RESTFUL ROUTES
app.get("/",function(req,res){
	res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log("ERROR!");
		}else{
			res.render("index",{blogs:blogs});
		}
	});
});

//NEW ROUTE
app.get("/blogs/new",function(req,res){
	res.render("new");
});

//CREATE ROUTE
app.post("/blogs",function(req,res){
	//create blog
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog,function(err,newBlog){
		if(err){
			res.render("new");
		}else{
			res.redirect("/blogs");
		}
	});
});

//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
    	if(err){
    		res.redirect("/blogs");
    	}else{
    		res.render("show",{blog:foundBlog})
    	}
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}else{
            res.render("edit",{blog:foundBlog});
		}
	});
});

//UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
	req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
    	if(err){
    		res.redirect("/blogs");
    	}else{
    		res.redirect("/blogs/"+req.params.id);
    	}
    });
});

//Destroy Route
app.delete("/blogs/:id",function(req,res){
    //destroy blog
    Blog.findByIdAndRemove(req.params.id,function(err){
    	if(err){
    		res.redirect("/blogs");
    	}else{
    		res.redirect("/blogs");
    	}
    });
});


//LISTENER
app.listen(1600,function(){
	console.log("Blog App SERVER has STARTED !!!!!"  );
});