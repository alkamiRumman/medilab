import {Controller, Get, MergeParams, Post, Req, Res, Use} from "@tsed/common";
import BaseController from "../Core/BaseController";
import {Mongo} from "../services/Mongo";
import {User} from "../models/User";
import {ifNotLoggedIn, ifNotReceptionist, SESSION} from "../middlewares/SessionCheck";

@Controller("/receptionist")
@MergeParams()
@Use(SESSION)
@Use(ifNotLoggedIn)
@Use(ifNotReceptionist)
export class Receptionist extends BaseController {
    constructor(private mongo: Mongo) {
        super(mongo);
        this.config.view = "receptionist";
    }

    @Get("/")
    async index(@Res() res: Res, @Req() req: Req) {
        this.config.render = "welcome";
        await this.render(req, res);
    }
}