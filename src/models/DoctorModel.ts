import {Property, PropertyType} from "@tsed/common";
import {Advice} from "../schema/Advice";
import {Indexed, Model, ObjectID, Ref} from "@tsed/mongoose";
import {Types} from "mongoose";
import {User} from "./User";


@Model({
	collection: "doctor",
	schemaOptions: {
		timestamps: {
			createdAt: false,
			updatedAt: true
		}
	}
})
export class DoctorModel {
	@ObjectID("id")
	_id: Types.ObjectId;

	@Indexed(true)
	@Ref(User)
	@Property()
	userID: Ref<User>;

	@PropertyType(String)
	days: Array<string>;

	@PropertyType(String)
	times: Array<string>;

	@PropertyType(Advice)
	advice: Array<Advice>;

}