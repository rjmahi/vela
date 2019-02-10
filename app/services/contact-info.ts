import {Injectable} from'@angular/core';
import {Http, Headers, URLSearchParams} from '@angular/http';
import {ContactInfo} from '../models/contact-info';
import * as constants from '../config/constants';
import {BaseHttpService} from './base-http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

class ServerResponse {
	constructor (public resource: any) {
	}
};

@Injectable()
export class ContactInfoService {
	baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/db/_table/contact_info';
	constructor(private httpService: BaseHttpService) {

	};


	query(params: URLSearchParams): Observable<ContactInfo[]> {
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
    	queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);

		return this.httpService.http
			.get(this.baseResourceUrl, { search: params , headers: queryHeaders})
			.map((response) => {
				var result: ServerResponse = response.json();
				let contacts: Array<ContactInfo> = [];
				result.resource.forEach((contact) => {
					contacts.push(ContactInfo.fromJson(contact));
				});
				return contacts;
			});
	};

	get (id: string): Observable<ContactInfo> {
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
    	queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		return this.httpService.http
			.get(this.baseResourceUrl + '/' + id,{ headers: queryHeaders})
			.map((response) => {
				var result: ServerResponse = response.json();
				let contactInfo: ContactInfo = ContactInfo.fromJson(result);
				return contactInfo;
			});
	};

	remove (id: number): Observable<any> {
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
    	queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		return this.httpService.http
			.delete(this.baseResourceUrl + '/' + id,{ headers: queryHeaders})
			.map((response) => {
				var result: any = response.json();
				return parseInt(result.id);
			});
	};
}
