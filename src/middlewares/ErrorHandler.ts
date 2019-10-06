import {Err, GlobalErrorHandlerMiddleware, Middleware, OverrideProvider, Req, Res} from "@tsed/common";

@Middleware()
@OverrideProvider(GlobalErrorHandlerMiddleware)
export class ErrorHandler extends GlobalErrorHandlerMiddleware {


	use(@Err() err: any, @Req() req: Req, @Res() res: Res): any {
		const toHTML = (message = "") => message.replace(/\n/gi, "<br />");
		if (typeof err === "string") {
			res.status(404).send(toHTML(err));
			return;
		}

		res.locals.message = err.message;
		if (req.app.get('env') === 'development') {
			res.locals.error = err;
			res.locals.status = err.status || 500;
		} else {
			res.locals.error = {};
		}
		res.status(err.status || 500);
		res.render('error');

		return super.use(err, req, res);
	}
}