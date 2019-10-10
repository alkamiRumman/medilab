import {Controller, Get, Post, Req, Res, Use} from "@tsed/common";
import BaseController from "../Core/BaseController";
import {Mongo} from "../services/Mongo";
import {User} from "../models/User";
import {ifNotDoctor, ifNotLoggedIn, SESSION} from "../middlewares/SessionCheck";

@Controller("/doctor")
@Use(SESSION)
@Use(ifNotLoggedIn)
@Use(ifNotDoctor)
export class Doctor extends BaseController {
    constructor(private mongo: Mongo) {
        super(mongo);
        this.config.view = "doctor";
    }

    @Get("/")
    async index(@Res() res: Res, @Req() req: Req) {
        this.config.render = "welcome";
        await this.render(req, res);
    }
}