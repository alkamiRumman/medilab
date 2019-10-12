import {Controller, Get, Post, Req, Res, Use, UseBefore} from "@tsed/common";
import BaseController from "../Core/BaseController";
import {Mongo} from "../services/Mongo";
import {User} from "../models/User";
import {Notification, NotificationType} from "../config/Notification";
import {Data} from "../config/SessionData";
import {ifLoggedIn, ifNotLoggedIn} from "../middlewares/SessionCheck";
import session from "express-session";

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
    @UseBefore(ifLoggedIn)
    async login(@Res() res: Res, @Req() req: Req) {
        if (req.method == 'POST') {
            let {email, password} = req.body;
            let User: User = await this.mongo.UserService.findOne({
                email: email,
                password: password
            });
            if (User) {
                if (User.flag === true) {
                    let data = new Data();
                    data.userID = User._id.toHexString();;
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
                    return res.redirect("/receptionist");
                } else {
                    let notification: Notification = {
                        message: "Username does not registered!",
                        type: NotificationType.WARNING,
                        title: "Login Failed!"
                    };
                    this.config.notification.push(notification);
                    return res.redirect("/login");
                }
            } else {
                let notification: Notification = {
                    message: "Email or Password doesn't matched!",
                    type: NotificationType.ERROR,
                    title: "Login Failed!"
                };
                this.config.notification.push(notification);
                return res.redirect("/login");
            }

        } else {
            this.config.render = "login";
            await this.render(req, res);
        }
    }

    @Get("/apply")
    @Post("/apply")
    @UseBefore(ifLoggedIn)
    async apply(@Res() res: Res, @Req() req: Req) {
        if (req.method == 'POST') {
            let {name, email, password, designation} = req.body;
            let user = new User();
            user.name = name;
            user.email = email;
            user.password = password;
            user.designation = designation;
            user.flag = false;
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