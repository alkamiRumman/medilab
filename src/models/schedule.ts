import {Default, Property, PropertyType} from "@tsed/common";
import {Indexed, Model, ObjectID, Ref} from "@tsed/mongoose";
import {Types} from "mongoose";

@Model({
    collection: 'schedule',
    schemaOptions: {
        timestamps: {
            updatedAt: true,
            createdAt: false
        }
    }
})
export class Schedule {
    @ObjectID("id")
    _id: Types.ObjectId;


}