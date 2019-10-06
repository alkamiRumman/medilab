import {Property, PropertyType} from "@tsed/common";
import {Schema} from "@tsed/mongoose";

@Schema({
	schemaOptions: {
		timestamps: {
			createdAt: true,
			updatedAt: true
		}
	}
})
export class FileProperty {
	@Property()
	name: string;
	@Property()
	originalName: string;
	@PropertyType(Number)
	size: number;
	@Property()
	mimeType: string;
	@PropertyType(Date)
	updatedAt?: Date;
	@PropertyType(Date)
	createdAt?: Date;
	@Property()
	path: string;
}