// let collection=require('../config/collections')
// const MongoClient=require('mongodb').MongoClient
//  const state ={
//      db:null
//  }

//  module.exports.connect=function(done){
//     console.log('ajmal')
//      const url ='mongodb://0.0.0.0:27017'
     
//      MongoClient.connect(url,(err,data)=>{
//          if(err) return done(err)
//          state.db=data.db(collection.db_name)
//          done()
//      }) 
//  }

//  module.exports.get=function(){
//      return state.db 
//  }
// mongodb-conneting code
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://0.0.0.0:27017';
const dbName = 'myDatabase';

module.exports.connect = async function() {
    console.log('hai')
  const client = await MongoClient.connect(url, { useUnifiedTopology: true });
  const db = client.db(dbName);
  return db;
}

module.exports.get = function() {
  throw new Error('You must call connect() first');
}
