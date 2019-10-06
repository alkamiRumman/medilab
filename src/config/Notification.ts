export class Notification {
	public type: NotificationType = null;
	public message: Array<any> | string = null;
	public title: string = null;
}
export enum NotificationType {
	SUCCESS = "success",
	ERROR = 'error',
	INFO = "info",
	WARNING = "warning"
}