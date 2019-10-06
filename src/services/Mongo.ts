import {Inject, Service} from "@tsed/common";
import {MongooseModel, MongooseService} from "@tsed/mongoose";
import {User} from "../models/User";

@Service()
export class Mongo {
	@Inject(User)
	public UserService: MongooseModel<User>;
	constructor(mongooseService: MongooseService) {
		mongooseService.get();
	}
}