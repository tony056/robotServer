
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.orderlist = function(db){
	return function(req, res){
		var list = [
			{'username1': 'aa', 'username2': 'bb', 'exeTime': 100},
			{'username1': 'aa', 'username2': 'bb', 'exeTime': 101},
			{'username1': 'aa', 'username2': 'bb', 'exeTime': 102},
			{'username1': 'aa', 'username2': 'bb', 'exeTime': 103},
			{'username1': 'aa', 'username2': 'bb', 'exeTime': 104},
			{'username1': 'aa', 'username2': 'bb', 'exeTime': 105},
			{'username1': 'aa', 'username2': 'bb', 'exeTime': 106},
			{'username1': 'aa', 'username2': 'bb', 'exeTime': 107},
			{'username1': 'aa', 'username2': 'bb', 'exeTime': 108},
			{'username1': 'aa', 'username2': 'bb', 'exeTime': 109}
		];
		res.json(list);

		// db.collection('orderlist').find().toArray(function(err, x){
		// 	x.exeTime = parseInt(x.exeTime);
		// 	db.collection('orderlist').save(x);
		// });
		// db.collection('orderlist').find().toArray(function(err, items){
		// 	res.json(items);
		// })
		// db.collection('orderlist').find({exeTime: 1}).limit(10).toArray(function(err, items){
		// 	res.json(items);
		// })
	}
};

exports.addrecord = function(db){
	return function(req, res){
		if(req.body.exeTime === '-1'){
			//add username
			console.log('add username');
			db.collection('orderlist').update({username1: 'you', username2: 'you'}, {$set:{username1: req.body.username1, username2: req.body.username2}}, function(err, result){
				res.send(
					(err === null) ? {msg: ''} : {msg: err}
				);
			})

		}else{
			db.collection('orderlist').insert(req.body, function(err, result){
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