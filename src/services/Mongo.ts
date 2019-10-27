import {Inject, Service} from "@tsed/common";
import {MongooseModel, MongooseService} from "@tsed/mongoose";
import {User} from "../models/User";
import {DoctorModel} from "../models/DoctorModel";

@Service()
export class Mongo {
	@Inject(User)
	public UserService: MongooseModel<User>;
	@Inject(DoctorModel)
	public DoctorModelService: MongooseModel<DoctorModel>;
	constructor(mongooseService: MongooseService) {
		mongooseService.get();
	}
}