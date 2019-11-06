import {ObjectID} from "@tsed/mongoose";
import {Types} from "mongoose";
import {Property, PropertyType, Schema} from "@tsed/common";

@Schema({
	schemaOptions: {
		timestamps: {
			createdAt: false,
			updatedAt: true
		}
	}
})
export class Advice {
	@ObjectID("id")
	_id: Types.ObjectId;

	@Property()
	name: string;

	@Property()
	note: string;
	
}