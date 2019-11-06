import {Controller, Get, Post, Req, Res, Session, Use, UseBefore} from "@tsed/common";
import BaseController from "../Core/BaseController";
import {Mongo} from "../services/Mongo";
import {User} from "../models/User";
import {Notification, NotificationType} from "../config/Notification";
import {Data} from "../config/SessionData";
import {ifLoggedIn, ifNotAdmin, ifNotLoggedIn, SESSION} from "../middlewares/SessionCheck";


@Controller("/admin")
@Use(SESSION)
@Use(ifNotAdmin)
@Use(ifNotLoggedIn)
export class Doctor extends BaseController {
	constructor(private mongo: Mongo) {
		super(mongo);
		this.config.view = "admin";
	}

	@Get("/")
	async index(@Res() res: Res, @Req() req: Req, @Session("user") session: Data) {
		if (req.method == 'POST') {

		} else {
			this.config.render = "welcome";
			await this.render(req, res);
		}
	}

	@Get("/list")
	@Get("/list")
	async list(@Res() res: Res, @Req() req: Req, @Session("user") session: Data) {
		let user = await this.mongo.UserService.find({
			status: false
		});
		this.config.render = "list";
		this.config.data['usrs'] = user;
		console.log(req.body);
		await this.render(req, res);
	}
}