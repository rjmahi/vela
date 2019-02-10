import {Injectable} from'@angular/core';
import {Http, Headers, URLSearchParams,RequestOptions} from '@angular/http';
import {Contact} from '../models/contact';
import * as constants from '../config/constants';
import {BaseHttpService} from './base-http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Observable} from 'rxjs/Observable';
import { LoginCmp } from '../pages/login/login';
import { NavController } from 'ionic-angular';

class ServerObj {
	constructor (public resource: any) {
	}
};

@Injectable()
export class ContactService {
	baseResourceUrl: string = constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/db/_table/contact';
	constructor(private httpService: BaseHttpService,private nav: NavController) {

	};


	query (params?:URLSearchParams): Observable<Contact[]> {
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
    	queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);    	
		return this.httpService.http
			.get(this.baseResourceUrl, { search: params, headers: queryHeaders})
			.map((response) => {
				var result: any = response.json();
				let contacts: Array<Contact> = [];
				result.resource.forEach((contact) => {
					contacts.push(Contact.fromJson(contact));
				});
				return contacts;
			}).catch(this.handleError);
	};
	private handleError (error: any) {
	   let errMsg = (error.message) ? error.message :
	   error.status ? `${error.status} - ${error.statusText}` : 'Server error';
	   console.log(errMsg); // log to console instead
	   localStorage.setItem('session_token', '');       
	  return Observable.throw(errMsg);
	}
	
	get (id: string, params?: URLSearchParams): Observable<Contact> {
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
    	queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		return this.httpService.http
			.get(this.baseResourceUrl + '/' + id, { search: params ,headers: queryHeaders})
			.map((response) => {
				var result: any = response.json();
				let contact: Contact = Contact.fromJson(result);
				return contact;
			}).catch(this.handleError);
	};

	remove (id: string) {
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
    	queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
		return this.httpService.http
			.delete(this.baseResourceUrl + '/' + id,{ headers: queryHeaders})
			.map((response) => {
				var result: any = response.json();
				return result.id;
			});
	}

	save (contact: Contact) {
		var queryHeaders = new Headers();
    	queryHeaders.append('Content-Type', 'application/json');
    	queryHeaders.append('X-Dreamfactory-Session-Token', localStorage.getItem('session_token'));
    	queryHeaders.append('X-Dreamfactory-API-Key', constants.DREAMFACTORY_API_KEY);
    	
    	let options = new RequestOptions({ headers: queryHeaders });

		if (contact.id) {
			return this.httpService.http.patch(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/db/_table/contact', contact.toJson(true),options)
			.map((data) => {
				return data;
			});
		} else {
			delete contact.id;
			return this.httpService.http.post(constants.DREAMFACTORY_INSTANCE_URL + '/api/v2/db/_table/contact', contact.toJson(true),options)
			.map((data) => {
				return data;
			});
		}
	}
}
