import {Default, Email, Enum, Format, IgnoreProperty, Property, PropertyType} from "@tsed/common";
import {Indexed, Model, ObjectID, Ref, Schema} from "@tsed/mongoose";
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
	flag: boolean;

	@Property()
	isDesignation: string;


}