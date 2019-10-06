import {Indexed, Model, ObjectID} from "@tsed/mongoose";
import {Types} from "mongoose";
import {Email, Property, PropertyType} from "@tsed/common";

@Model({
	schemaOptions: {
		timestamps: {
			createdAt: false,
			updatedAt: true
		}
	}
})
export class User {
	@ObjectID("id")
	_id: Types.ObjectId;

	@Property()
	name: string;

	@Indexed(true)
	@Email()
	email: string;

	@Property()
	password: string;

	@Property()
	designation: string;
}