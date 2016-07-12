/**
 * Created by iyobo on 2016-07-11.
 */
module.exports=function*(server){

	let admin = yield server.app.db.user.findOne({username:'admin'})
	if(!admin){
		yield new server.app.db.user({
			username: 'admin',
		}).save()
		server.log('info','Created user with username admin')
	}

}