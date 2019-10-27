import {Email, Property, PropertyType} from "@tsed/common";
import {Indexed, Model, ObjectID} from "@tsed/mongoose";
import {Types} from "mongoose";


@Model({
	collection: "user",
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

	@Property()
	designation: string;

	@Property()
	password: string;

	@Indexed(true)
	@Email()
	email: string;

	@PropertyType(Boolean)
	status: boolean;

	@Property()
	isDesignation: string;


}