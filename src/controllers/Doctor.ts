import {Controller, Get, Post, Req, Res, Session, Use, UseAfter, UseBefore} from "@tsed/common";
import BaseController from "../Core/BaseController";
import {Mongo} from "../services/Mongo";
import {DoctorModel} from "../models/DoctorModel";
import {ifLoggedIn, ifNotDoctor, ifNotLoggedIn, SESSION} from "../middlewares/SessionCheck";
import {Data} from "../config/SessionData";
import {Notification, NotificationType} from "../config/Notification";


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
    async index(@Res() res: Res, @Req() req: Req, @Session("user") session:Data ) {
        if (req.method == 'POST') {
            let {days, times} = req.body;
            let doc = new DoctorModel();
            doc.days = days;
            doc.times =  times;
            let doctor = new this.mongo.DoctorModelService(doc);
            await doctor.save();
            console.log(req.body);
            return res.redirect("/doctor");
        } else {
            this.config.render = "welcome";
            await this.render(req, res);
        }
    }

    @Get("/schedule")
    @Post("/schedule")
    async schedule(@Res() res: Res, @Req() req: Req) {
        if (req.method == 'POST') {
            let {days, times} = req.body;
            let doc = new DoctorModel();
            doc.days = days;
            doc.times =  times;
            let doctor = new this.mongo.DoctorModelService(doc);
            await doctor.save();
	        let notification: Notification = {
		        message: "Schedule added successfully",
		        type: NotificationType.SUCCESS,
		        title: "Add Success!"
	        };
	        this.config.notification.push(notification);
	        return res.redirect("/doctor");
        } else {
            this.config.render = "schedule";
            await this.render(req, res);
        }
    }

    @Get("/prescription")
    @Post("/prescription")
    async prescription(@Res() res:Res, @Req() req:Req, @Session("user") user:Data){
        if (req.method == "POST"){

        }else {
            this.config.render = "prescription";
            await this.render(req, res);
        }
    }

    @Get("/advice")
    @Post("/advice")
    async advice(@Res() res:Res, @Req() req:Req, @Session("user") user:Data){
        if (req.method == "POST"){

        }else {
            this.config.render = "advice";
            await this.render(req, res);
        }
    }

    @Get("/treatment")
    @Post("/treatment")
    async treatment(@Res() res:Res, @Req() req:Req, @Session("user") user:Data){
        if (req.method == "POST"){

        }else {
            this.config.render = "treatment";
            await this.render(req, res);
        }
    }

    @Get("/medicine")
    @Post("/medicine")
    async medicine(@Res() res:Res, @Req() req:Req, @Session("user") user:Data){
        if (req.method == "POST"){

        }else {
            this.config.render = "medicine";
            await this.render(req, res);
        }
    }

    @Get("/medicineNote")
    @Post("/medicineNote")
    async medicineNote(@Res() res:Res, @Req() req:Req, @Session("user") user:Data){
        if (req.method == "POST"){

        }else {
            this.config.render = "medicineNote";
            await this.render(req, res);
        }
    }
}