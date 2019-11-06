import {IMiddleware, Middleware, Req, Res, Session} from "@tsed/common";
import {$SESSION, Data} from "../config/SessionData";
import {Mongo} from "../services/Mongo";
import {User} from "../models/User";

var session: Data = null;

@Middleware()
export class SESSION implements IMiddleware {
	private static mongoose: Mongo;

	constructor(private mongo: Mongo) {
		SESSION.mongoose = mongo;
	}

	use(@Req() req: Req) {
		if (req.session.user) {
			session = req.session.user;
		}
		return session;
	}


	public static async get(): Promise<$SESSION> {
		if (session) {
			let user: User = await this.mongoose.UserService.findById(session.userID).exec();
			return {
				data: session,
				user: user
			};
		}
		return new $SESSION();
	}
}


@Middleware()
export class ifLoggedIn implements IMiddleware {
	public async use(@Req() req: Req, @Res() res: Res, @Session("user") user: Data) {
		if (user) {
			if (user.isDesination === "admin") {
				return res.redirect("/admin");
			}
			if (user.isDesination === "doctor") {
				return res.redirect("/doctor");
			}
			if (user.isDesination === "receptionist"){
				return res.redirect("/receptionist");
			}
			if (user.isDesination === "laboratorist") {
				return res.redirect("/laboratorist");
			}
			if (user.isDesination === "pharmacist"){
				return res.redirect("/pharmacist");
			}
		}
	}
}

@Middleware()
export class ifNotLoggedIn implements IMiddleware {
	public async use(@Req() req: Req, @Res() res: Res, @Session("user") user: Data) {
		if (!user) {
			return res.redirect("/login");
		}
	}
}

@Middleware()
export class ifNotAdmin implements IMiddleware {
	public async use(@Req() req: Req, @Res() res: Res, @Session("user") user: Data) {
		if (user) {
			if (user.isDesination != "admin") {
				req.session.noSystemAccess = true;
				return res.redirect("/admin");
			}
		}
	}
}

@Middleware()
export class ifNotDoctor implements IMiddleware {
	public async use(@Req() req: Req, @Res() res: Res, @Session("user") user: Data) {
		if (user) {
			if (user.isDesination != "doctor") {
				req.session.noSystemAccess = true;
				return res.redirect("/login");
			}
		}
	}
}


@Middleware()
export class ifNotReceptionist implements IMiddleware {
	public async use(@Req() req: Req, @Res() res: Res, @Session("user") user: Data) {
		if (user) {
			if (user.isDesination != "receptionist") {
				req.session.noSystemAccess = true;
				return res.redirect("/login");
			}
		}
	}
}

@Middleware()
export class ifNotLaboratorist implements IMiddleware {
	public async use(@Req() req: Req, @Res() res: Res, @Session("user") user: Data) {
		if (user) {
			if (user.isDesination != "laboratorist") {
				req.session.noSystemAccess = true;
				return res.redirect("/login");
			}
		}
	}
}

@Middleware()
export class ifNotPharmacist implements IMiddleware {
	public async use(@Req() req: Req, @Res() res: Res, @Session("user") user: Data) {
		if (user) {
			if (user.isDesination != "pharmacist") {
				req.session.noSystemAccess = true;
				return res.redirect("/login");
			}
		}
	}
}
