import {Controller, Get, Post, Req, Res, Use} from "@tsed/common";
import BaseController from "../Core/BaseController";
import {Mongo} from "../services/Mongo";
import {User} from "../models/User";
import {ifNotDoctor, ifNotLoggedIn, ifNotPharmacist, SESSION} from "../middlewares/SessionCheck";

@Controller("/pharmacist")
@Use(SESSION)
@Use(ifNotLoggedIn)
@Use(ifNotPharmacist)
export class Pharmacist extends BaseController {
    constructor(private mongo: Mongo) {
        super(mongo);
        this.config.view = "pharmacist";
    }

    @Get("/")
    async index(@Res() res: Res, @Req() req: Req) {
        this.config.render = "welcome";
        await this.render(req, res);
    }
}