
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.orderlist = function(db){
	return function(req, res){
		// var list = [
		// 	{'username1': 'aa', 'username2': 'bb', 'exeTime': 100},
		// 	{'username1': 'aa', 'username2': 'bb', 'exeTime': 101},
		// 	{'username1': 'aa', 'username2': 'bb', 'exeTime': 102},
		// 	{'username1': 'aa', 'username2': 'bb', 'exeTime': 103},
		// 	{'username1': 'aa', 'username2': 'bb', 'exeTime': 104},
		// 	{'username1': 'aa', 'username2': 'bb', 'exeTime': 105},
		// 	{'username1': 'aa', 'username2': 'bb', 'exeTime': 106},
		// 	{'username1': 'aa', 'username2': 'bb', 'exeTime': 107},
		// 	{'username1': 'aa', 'username2': 'bb', 'exeTime': 108},
		// 	{'username1': 'aa', 'username2': 'bb', 'exeTime': 109}
		// ];
		// res.json(list);
		db.collection('orderlist').find().sort({exeTime: 1}).toArray(function(err, items){
			
			res.json(items);
		})
	}
};

exports.addrecord = function(db){
	return function(req, res){
		//console.log(req.body);
		if(req.body.exeTime === '-1'){
			//add username
			console.log('add username');
			/*db.collection('orderlist').update({username1: 'you', username2: 'teammate'}, {$set:{username1: req.body.username1, username2: req.body.username2, done: req.body.done}}, function(err, result){
				res.send(
					(err === null) ? {msg: ''} : {msg: err}
				);
			})*/
			var data = {
				'username1': req.body.username1,
				'username2': req.body.username2,
				'exeTime': -1,
				'done1': false,
				'done2': false
			};
			db.collection('orderlist').insert(data, function(err, result){
				res.send(
	        		(err === null) ? { msg: '' } : { msg: err }
      			);
			})

		}else{
			//new a json object, only time value is correct
			var data = {
				'username1': '',
				'username2': '',
				'exeTime': '',
				'done1': false,
				'done2': false
			};
			if(req.body.username1 != null && req.body.username2 != null && req.body.exeTime != null){
				data['username1'] = req.body.username1;
				data['username2'] = req.body.username2;
				data['exeTime'] = parseInt(req.body.exeTime, 10);
			}
			db.collection('orderlist').insert(data, function(err, result){
				res.send(
	        		(err === null) ? { msg: '' } : { msg: err }
      			);
			})
		}
	}
};

exports.clean = function(db){
	return function(req, res){
		db.collection('orderlist', function(err, collection){
			collection.remove({}, function(err, removed){

			});
		});
	}
}

exports.deleterecord = function(db){
	return function(req, res){
		var recordToDelete = req.params.id;
		db.collection('orderlist').removeById(recordToDelete, function(err, result){
			res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
		});
	}
};

exports.revisedata = function(db){
	return function(req, res){
		var dataToRevise = req.body.id;
		console.log(dataToRevise);
		var mongodb = require('mongodb');
		var ObjectId = mongodb.ObjectID;
		db.collection('orderlist').update({ _id: ObjectId(dataToRevise)}, 
			{$set: {
				username1: req.body.username1, 
				username2: req.body.username2, 
				done1: req.body.done1, 
				done2: req.body.done2
				}
			}, 
			function(err, result){
				console.log(result);
				res.send(
					(err === null) ? {msg: ''} : {msg: err}
				);
		});
		console.log('1:'+req.body.done1+' ,2: '+ req.body.done2);
	}
}