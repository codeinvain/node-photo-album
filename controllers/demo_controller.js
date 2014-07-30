function index(req,res){
  //throw new Error("not configured")
  console.dir('index')
  res.render('demo/index')
}

module.exports.wire= function(app){
  app.get('/',index);
}
