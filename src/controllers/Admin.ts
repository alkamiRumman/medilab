import {Controller, Get, Post, Req, Res, Use, UseBefore} from "@tsed/common";
import BaseController from "../Core/BaseController";
import {Mongo} from "../services/Mongo";
import {User} from "../models/User";
import {Notification, NotificationType} from "../config/Notification";
import {Data} from "../config/SessionData";
import {ifLoggedIn, ifNotLoggedIn} from "../middlewares/SessionCheck";
import session from "express-session";

const bcrypt = require("bcrypt");
const Cryptr = require('crypto');

@Controller("/")
export class Home extends BaseController {
	constructor(private mongo: Mongo) {
		super(mongo);
		this.config.view = "home";
	}
}