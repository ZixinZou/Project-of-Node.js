let express = require('express');
let router = express.Router();
let async = require('async');

let list_m = require('../node_modules/list');


// http://127.0.0.1:3030/list/1.html
router.get('/:titleid.html', function(req, res) {
	// var titleid = req.query.titleid || 1;
	// console.log(req.query);
	// console.log(req.params);
	let titleid = req.params.titleid || 1;

	async.parallel([
		function (async) {
			list_m.getListById(titleid, function(result) {
				async(null, result[0]);
			})
		},
		/*function(callback){
			list_m.getReplyById(titleid, function(result){
				callback(null, result);
			})
		},*/
	], function (err, results) {
		// console.log( results );
		// res.json(results);
		res.render('list', { data:results });
	})
	
});

/*router.get('/addreply', function(req, res){
	if(req.session.user){
		var titleid = parseInt(req.query.titleid),
			content = req.query.content,
			userid = req.session.user.userid,
			createtime = Date.now();

		var params = {titleid:titleid, userid:userid, content:content, createtime:createtime};
		console.log(params);
		list_m.addReply(params, function(result){
			// console.log(result);
			if(result.affectedRows){
				res.json({code:0, msg:'Répondre avec succès', data:{rid:result.insertId ,createtime:createtime}});

			}else{
				res.json({code:2, msg:'La réponse a échoué, veuillez réessayer'})
			}
		});
		
	}else{
		res.json({code:1, msg:'Vous n\'êtes pas connecté'})
	}
});*/

router.get('/addtopic', function(req, res) {
	if (req.session.user) {
		let title = req.query.title,
			content = req.query.content,
            userid = req.session.user.userid,
			createtime = new Date();

		let params = {userid:userid, title:title, content:content, createtime:createtime};

		list_m.addTopic(params, function(result) {
			// console.log(result);
			if (result.affectedRows) {
				res.json({code:0, msg:'Ajouté avec succès', data:{url:'/list/'+result.insertId+'.html', title:title, author:req.session.user.username, createtime:createtime}});
			} else {
				res.json({code:2, msg:'Ajouter échoué, veuillez réessayer'})
			}
		});
		
	} else {
		res.json({code:1, msg:'Vous n\'êtes pas connecté'})
	}
})

module.exports = router;
