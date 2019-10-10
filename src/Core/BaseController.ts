import {Constant, Req, Res} from "@tsed/common";
import {Mongo} from "../services/Mongo";
import {Config} from "../config/Config";
import {Notification} from "../config/Notification";

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
		return res.render(this.config.view + "/" + 'popup/' + page, this.config.data);
	}

	public async render(req: Req, res: Res) {
		this.config.data["baseUrl"] = process.env.baseUrl;
		this.config.data['notifications'] = this.config.notification;
		this.config.notification = new Array<Notification>();
		this.config.data["__breadCrumb"] = undefined;
		if (this.config.breadCrumb) {
			this.config.data["__breadCrumb"] = this.config.breadCrumb;
			this.config.breadCrumb = undefined;
		}
		this.config.data['__pageScript'] = this.config.pageScript;
		this.config.pageScript = new Array<{ js: string[], css: string[] }>();
		if (this.config.render) {
			return res.render(this.getView(), this.config.data, (err, html) => {
				if (err) {
					res.render('error', {error: err});
				}
				return res.send(html);
			});
		} else {
			return res.send(this.config.data);
		}
	}

}



