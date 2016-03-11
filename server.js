var express = require('express'),
    logger  = require('morgan')('dev'),
    path    = require('path'),
    mongoose = require('mongoose'),

    Schema = mongoose.Schema,
    bodyParser = require('body-parser'),
    server  = express();
//Todo Model
var todoSchema = new Schema({
  desc: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    required: true
  }
});

var Todo = mongoose.model('Todo', todoSchema);


//create a connection to our db
mongoose.connect('mongodb://localhost/todoApp');
var port = process.env.PORT || 9000;


server.use(express.static(path.join(__dirname,'public')));
server.use(logger);
server.use(bodyParser.json());

server.use(bodyParser.urlencoded({extended:true}));

server.get('/', function(req, res){
  res.send('this is a starter application, welcome!');
});//get has to be front of post

server.get('/api/todos', function(req, res){

  Todo.find(function(err,todos){
    if(err)throw err;
    res.json(todos);//if don't have, will hang til timeout
  });//url means where to find not just web
  //res.send('I got some todos!');
});
//url means where to find not just web
  //res.send('I got some todos!');


server.post('/api/todos', function(req, res){
  var desc = req.body.desc;
  var completed = false//req.body.completed;// 3 now no addtional properties could be add accidentally,
  var todoObj = {
    desc:desc,
    completed:completed
  };
  Todo.create(todoObj,function(err,todo){
    if(err)throw err;
//todoObj is doc name
    res.json(todo);
  }); //non numbers and not empty strings are true;
//  res.json(req.body);b2
//  res.send('I saved a todo!'); 1
});
server.put('/api/todos/:id', function(req,res){
  var id=req.params.id;
  var desc=req.body.desc;
  var completed=req.body.completed;
  var update = {
    desc:desc,
    completed:completed,
  };
  Todo.findOneAndUpdate({_id: id}, update , {new:true} ,function(err, todo){
    if(err)throw err;
    res.json(todo);
  });//3 copy from post man the first id put id after /
  //3, put them into obj update because we need to send all info, update method in mongoose api
  //res.send(req.params.id)//2 now go to post man and after / type everything then show everything after /
  //res.send('I updated a todo!');1
});//:id is a var as aforeign key to locate _id
server.delete('/api/todos/:id',function(req,res){
  Todo.findOneAndRemove({_id: req.params.id},function(err,todo){
    if(err)throw err;
    res.json(todo);
});
//  res.send('Oh no! I deleted a todo!');
});//you can check errors on nodemon
  // var someJson = [
  //   {
  //     desc: 'learn how to build a web based api',
  //     completed: false
  //   },
  //   {
  //     desc: 'build an Angular frontend that consumes the api',
  //     completed: false
  //   }
  // ];

 //   res.json(someJson);
 // });

server.listen(port, function(){
  console.log('Now listening on port ' + port);
});
