import {Constant, Req, Res} from "@tsed/common";
import {Mongo} from "../services/Mongo";
import {Config} from "../config/Config";
import {Notification, NotificationType} from "../config/Notification";
import {SESSION} from "../middlewares/SessionCheck";
import {$SESSION, Data} from "../config/SessionData";

//"success" || "info" || "warning" || "danger",

export default class BaseController {

	@Constant('httpPort')
	httpPort: String;
	public config: Config = new Config();


	constructor(private mongoose: Mongo) {
	}

	private getView(): string {
		return this.config.view + "/" + this.config.render;
	}

	public async popUp(page: string, req: Req, res: Res) {
		let $SESSION: $SESSION = await SESSION.get();
		if ($SESSION) {
			this.config.data["$SESSION"] = $SESSION;
		}
		return res.render(this.config.view + "/" + 'popup/' + page, this.config.data);
	}

	public async render(req: Req, res: Res) {
		this.config.data["baseUrl"] = process.env.baseUrl;
		if (req.session.notLoggedIn) {
			let notification: Notification = {
				title: "Access Denied!",
				type: NotificationType.ERROR,
				message: "You can't access there without login!"
			};
			this.config.notification.push(notification);
			delete req.session.notLoggedIn;
		}
		this.config.data['notifications'] = this.config.notification;
		this.config.notification = new Array<Notification>();
		let $SESSION: $SESSION = await SESSION.get();
		this.config.data["__SESSION"] = undefined;
		if ($SESSION) {
			this.config.data["__SESSION"] = $SESSION;
		}
		this.config.data['__pageScript'] = this.config.pageScript;
		this.config.pageScript = new Array<{ js: string[], css: string[] }>();
		if (this.config.render) {
			return res.render(this.getView(), this.config.data, (err, html) => {
				if (err) {
					console.log(err)
				}
				return res.send(html);
			});
		} else {
			return res.send(this.config.data);
		}
	}

}



