import {User} from "../models/User";

export class Data {
	public userID: string;
	public isDesination: string;
	public loginTime: Date;
}

export class $SESSION {
	public user: User;
	public data: Data;
}