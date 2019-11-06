import {Controller, Get, PathParams, Post, Req, Res, Session, Use, UseAfter, UseBefore} from "@tsed/common";
import BaseController from "../Core/BaseController";
import {Mongo} from "../services/Mongo";
import {ifNotDoctor, ifNotLoggedIn, SESSION} from "../middlewares/SessionCheck";
import {Data} from "../config/SessionData";
import {Notification, NotificationType} from "../config/Notification";
import {Advice} from "../schema/Advice";
import {DoctorModel} from "../models/DoctorModel";


@Controller("/doctor")
@Use(SESSION)
@Use(ifNotDoctor)
@Use(ifNotLoggedIn)
export class Doctor extends BaseController {
	constructor(private mongo: Mongo) {
		super(mongo);
		this.config.view = "doctor";
	}

	@Get("/")
	async index(@Res() res: Res, @Req() req: Req, @Session("user") session: Data) {
		if (req.method == 'POST') {

		} else {
			this.config.render = "welcome";
			await this.render(req, res);
		}
	}

	@Get("/schedule")
	@Post("/schedule")
	async schedule(@Res() res: Res, @Req() req: Req, @Session("user") session: Data) {
		if (req.method == 'POST') {
			let {days, times} = req.body;
			let doctor = await this.mongo.DoctorModelService.findOne({
				userID: session.userID
			});
			doctor.days = days;
			doctor.times = times;
			let doc = new this.mongo.DoctorModelService(doctor);
			await doc.save();
			let notification: Notification = {
				message: "Schedule added successfully",
				type: NotificationType.SUCCESS,
				title: "Add Success!"
			};
			this.config.notification.push(notification);
			console.log(req.body);
			return res.redirect("/doctor");
		} else {
			let schedules = await this.mongo.DoctorModelService.find({
				userID: session.userID
			});
			this.config.render = "schedule";
			this.config.data['schedule'] = schedules;
			console.log(req.body);
			await this.render(req, res);
		}
	}

	@Get("/prescription")
	@Post("/prescription")
	async prescription(@Res() res: Res, @Req() req: Req, @Session("user") user: Data) {
		if (req.method == "POST") {

		} else {
			this.config.render = "prescription";
			await this.render(req, res);
		}
	}

	@Get("/advice")
	@Post("/advice")
	async advice(@Res() res: Res, @Req() req: Req, @Session("user") user: Data) {
		if (req.method == "POST") {
			let {name, note} = req.body;
			let doctor = await this.mongo.DoctorModelService.findOne({
				userID: user.userID
			});
            let ad = new Advice();
			ad.name = name;
			ad.note = note;
            doctor.advice.push(ad);
			await doctor.save();
			let notification: Notification = {
				message: "Advice added successfully",
				type: NotificationType.SUCCESS,
				title: "Add Success!"
			};
			this.config.notification.push(notification);
			return res.redirect("/doctor");
		} else {
			this.config.data['advices'] = await this.mongo.DoctorModelService.findOne({
				userID: user.userID
			});
			this.config.render = "advice";
			await this.render(req, res);
		}
	}

	@Get("/adviceEdit/:id")
	@Post("/adviceEdit/:id")
		async adviceEdit(@Req() req:Req, @Res() res: Res, @Session("user") session: Data,
	                     @PathParams('id') id: string){


	}


	@Get("/treatment")
	@Post("/treatment")
	async treatment(@Res() res: Res, @Req() req: Req, @Session("user") user: Data) {
		if (req.method == "POST") {

		} else {
			this.config.render = "treatment";
			await this.render(req, res);
		}
	}

	@Get("/medicine")
	@Post("/medicine")
	async medicine(@Res() res: Res, @Req() req: Req, @Session("user") user: Data) {
		if (req.method == "POST") {

		} else {
			this.config.render = "medicine";
			await this.render(req, res);
		}
	}

	@Get("/medicineNote")
	@Post("/medicineNote")
	async medicineNote(@Res() res: Res, @Req() req: Req, @Session("user") user: Data) {
		if (req.method == "POST") {

		} else {
			this.config.render = "medicineNote";
			await this.render(req, res);
		}
	}
}