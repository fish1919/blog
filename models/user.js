var mongodb = require('./db');

function User(user){
  this.name = user.name;
  this.password = user.password;
  this.email = user.email;
};

module.exports = User;

User.prototype.save = function(callback){
  //要存入数据库的用户信息
  var user = {
      name: this.name,
      password: this.password,
      email: this.email
  };

  //打开数据库
  mongodb.open(function(err, db){
    if(err){
      return callback(err);
    }

    //读取users集合
    db.collection('users', function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      //讲用户数据插入users集合
      collection.insert(user,{safe:true},function(err,user){
        mongodb.close();
        callback(err, user); //成功！ 返回插入的用户信息
      });
    });
  });
};

User.get = function(name, callback){ //读取用户信息
  //打开数据库
  mongodb.open(function(err, db){
    if(err){
      return callback(err);
    }
    //读取users集合
    db.collection('user', function(err, collection){
      if(err){
        mongodb.close();
        return callback(err);
      }
      //查找用户名name的信息
      collection.findOne({
        name:name
      },function(err, doc){
          mongodb.close();
          if(doc){
            var user = new User(doc);
            callback(err, user); //成功，返回查询的用户信息
          } else{
            callback(err,null); //失败，返回null
          }
      });
    });
  });
};
