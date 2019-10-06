import {Controller, Get, Post, Req, Res} from "@tsed/common";
import BaseController from "../Core/BaseController";
import {Mongo} from "../services/Mongo";
import {User} from "../models/User";

@Controller("/")
export class Home extends BaseController {
	constructor(private mongo: Mongo) {
		super(mongo);
		this.config.view = "home";
	}

	@Get("/")
	async index(@Res() res: Res, @Req() req: Req){
		this.config.render = "index";
		await this.render(req, res);
	}

	@Get("/login")
	async login(@Res() res: Res, @Req() req: Req){
		this.config.render = "login";
		await this.render(req, res);
	}

	@Get("/apply")
	@Post("/apply")
	async apply(@Res() res: Res, @Req() req: Req){
		if (req.method == 'POST') {
			let {name, email, password, designation} = req.body;
			let user = new User();
			user.name = name;
			user.email = email;
			user.password = password;
			user.designation = designation;
			return res.redirect("/")
		} else {
			this.config.render = "apply";
			await this.render(req, res);
		}
	}
}