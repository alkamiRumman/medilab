import {Default, Property, PropertyType} from "@tsed/common";
import {Indexed, Model, ObjectID} from "@tsed/mongoose";
import {Types} from "mongoose";


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

	@PropertyType(String)
	days: Array<string>;

	@PropertyType(String)
	times: Array<string>;

}