const express = require('express');
const exphbs  = require('express-handlebars');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

app.use(session(
  {
    secret: 'supersecret',
    name: 'oreo',
    proxy: true,
    resave: true,
    saveUninitialized: true
  }
));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use('/media', express.static( path.join( __dirname, 'media') ) )
const dirs = {
  public: path.join(__dirname, '/public'),
  views: path.join(__dirname, '/views')
}

var sess = {};

app.get('/',function(req,res){
  sess = req.session;
  //Session set when user Request our app via URL
    if(sess.username) {

      res.render('dashboard', sess );
    } else if (req.query.login === 'error') {

      res.render( 'login', { error: true } );

    } else {
      res.render( 'login' );
    }
});

app.post('/login',function(req,res){

  sess = req.session;
  if( req.body.username === 'level' && req.body.password === 'Access123'){
    sess.username = req.body.username;
    if( req.body.js ) {      
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ loggedin: true }));
    } else {
      res.redirect('/');
    }
  } else {
    if( req.body.js ){
      res.send(JSON.stringify({ loggedin: false}));
    } else {
      res.redirect('/?login=error');
    }
  }

});

app.get('/logout',function(req,res){
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});


app.listen(3000,function(){
  console.log("App Started on PORT 3000");
});