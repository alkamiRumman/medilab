import {Controller, Get, Post, Req, Res, Use, UseBefore} from "@tsed/common";
import BaseController from "../Core/BaseController";
import {Mongo} from "../services/Mongo";
import {User} from "../models/User";
import {Notification, NotificationType} from "../config/Notification";
import {Data} from "../config/SessionData";
import {ifLoggedIn, ifNotLoggedIn} from "../middlewares/SessionCheck";
import {DoctorModel} from "../models/DoctorModel";

const bcrypt = require("bcrypt");
const Cryptr = require('crypto');

@Controller("/")
export class Home extends BaseController {
    constructor(private mongo: Mongo) {
        super(mongo);
        this.config.view = "home";
    }

    @Get("/")
    @Use(ifLoggedIn)
    async index(@Res() res: Res, @Req() req: Req) {
        this.config.render = "index";
        await this.render(req, res);
    }

    @Get("/login")
    @Post("/login")
    @Use(ifLoggedIn)
    async login(@Res() res: Res, @Req() req: Req) {
        if (req.method == 'POST') {
            let {email, password} = req.body;
            let User: User = await this.mongo.UserService.findOne({
                email: email
            });
            if (User) {
                if (User.status === true) {
                    if (bcrypt.compareSync(password, User.password)) {
                        let data = new Data();
                        data.userID = User._id.toHexString();
                        data.isDesination = User.designation;
                        data.loginTime = new Date();
                        req.session.user = data;
                        let user = await this.mongo.UserService.findById(User._id);
                        await user.save();
                        let notification: Notification = {
                            message: "Login as " + User.name + " @" + Date(),
                            type: NotificationType.SUCCESS,
                            title: "Login Success!"
                        };
                        this.config.notification.push(notification);
                        if (req.session.oldRequest) {
                            let url = req.session.oldRequest;
                            delete req.session.oldRequest;
                            return res.redirect(url);
                        }
                        return res.redirect("/login");
                    } else {
                        let notification: Notification = {
                            message: "Username and password does not match!",
                            type: NotificationType.WARNING,
                            title: "Login Failed!"
                        };
                        this.config.notification.push(notification);
                        return res.redirect("/login");
                    }
                } else {
                    let notification: Notification = {
                        message: "User is not registered by Admin!",
                        type: NotificationType.WARNING,
                        title: "Not registered yet!"
                    };
                    this.config.notification.push(notification);
                    return res.redirect("/login");
                }
            } else {
                let notification: Notification = {
                    message: "Username and password does not match!",
                    type: NotificationType.WARNING,
                    title: "Login Failed!"
                };
                this.config.notification.push(notification);
                return res.redirect("/login");
            }
        } else {
            this.config.render = "login";
            return this.render(req, res);
        }
    }

    @Get("/apply")
    @Post("/apply")
    @UseBefore(ifLoggedIn)
    async apply(@Res() res: Res, @Req() req: Req) {
        if (req.method == 'POST') {
            let {name, email, password, designation} = req.body;
            let user = new this.mongo.UserService();
            let doctor = new this.mongo.DoctorModelService();
            doctor.userID = user._id;
            await doctor.save();
            user.name = name;
            user.email = email;
            user.password = bcrypt.hashSync(password, 12);
            user.designation = designation;
            user.status = false;
            let data = new this.mongo.UserService(user);
            await data.save();
            let notification: Notification = {
                message: "You have successfully registered",
                type: NotificationType.SUCCESS,
                title: "Sign-up Success"
            };
            this.config.notification.push(notification);
            return res.redirect("/login");
        } else {
            this.config.render = "apply";
            await this.render(req, res);
        }
    }

    @Get("/logout")
    @UseBefore(ifNotLoggedIn)
    logout(@Req() req: Req, @Res() res: Res) {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            }
        });
        let notification: Notification = {
            message: "You have successfully sign out",
            type: NotificationType.INFO,
            title: "Logout Success!"
        };
        this.config.notification = new Array<Notification>();
        this.config.notification.push(notification);
        return res.redirect('/login');
    }


}