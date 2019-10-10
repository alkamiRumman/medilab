import {Controller, Get, Post, Req, Res, Use} from "@tsed/common";
import BaseController from "../Core/BaseController";
import {Mongo} from "../services/Mongo";
import {User} from "../models/User";
import {ifNotDoctor, ifNotLaboratorist, ifNotLoggedIn, ifNotPharmacist, SESSION} from "../middlewares/SessionCheck";

@Controller("/laboratorist")
@Use(SESSION)
@Use(ifNotLoggedIn)
@Use(ifNotLaboratorist)
export class Laboratorist extends BaseController {
    constructor(private mongo: Mongo) {
        super(mongo);
        this.config.view = "laboratorist";
    }

    @Get("/")
    async index(@Res() res: Res, @Req() req: Req) {
        this.config.render = "welcome";
        await this.render(req, res);
    }
}