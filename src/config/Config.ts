import {FileProperty} from "../schema/FileProperty";
import {Notification} from "./Notification";

export enum METHOD {
	POST = 'POST',
	GET = 'GET'
}

export class Config {
	public pageScript?: { js: string[], css: string[] }[] = new Array<{ js: string[], css: string[] }>();
	public render?: string;
	public title?: string;
	public view?: string;
	public data?: object = {};
	public breadCrumb?: BreadCrumb.Menu;
	public notification?: Array<Notification> = new Array<Notification>();
}

export function MakeFileProperty(file: Express.Multer.File, dir: string): FileProperty {
	if (file) {
		let fileProperty = new FileProperty();
		fileProperty.mimeType = file.mimetype;
		fileProperty.name = file.filename;
		fileProperty.originalName = file.originalname;
		fileProperty.size = file.size;
		fileProperty.path = "/uploads/" + dir + "/" + file.filename;
		return fileProperty;
	} else {
		return undefined;
	}
}

/**
 *
 * @param files
 * @param dir Company ID
 * @constructor
 */
export function MakeFilesProperties(files: Express.Multer.File[], dir: string): FileProperty[] {
	if (files) {
		let fileProperties = new Array<FileProperty>();
		files.forEach(file => {
			fileProperties.push(MakeFileProperty(file, dir));
		});
		return fileProperties;
	} else {
		return undefined;
	}
}

export class CustomField {
	label: string;
	type: string;
	isRequired: boolean;
	placeholder: string;
	size: string;
	showInTable: boolean;
	searchable: boolean;
	alias: boolean;
}

export namespace BreadCrumb {

	export class Menu {
		title: string;
		items: Item[];
	}

	export class Item {
		text: string;
		link: string | false;
	}
}