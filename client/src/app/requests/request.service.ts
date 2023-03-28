import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Request, ItemType, FoodType } from './request';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  // The URL for the requests part of the server API
  readonly requestClientUrl: string = `${environment.apiUrl}clientRequests`;
  readonly newRequestClientUrl: string = `${environment.apiUrl}clientRequests`;
  readonly requestDonorUrl: string = `${environment.apiUrl}donorRequests`;
  readonly newRequestDonorUrl: string = `${environment.apiUrl}donorRequests`;

  private readonly itemTypeKey = 'itemType';
  private readonly foodTypeKey = 'foodType';

  constructor(private httpClient: HttpClient) {
  }

  getClientRequests(filters?: {itemType?: ItemType; foodType?: FoodType}): Observable<Request[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.itemType) {
        httpParams = httpParams.set(this.itemTypeKey, filters.itemType);
      }
      if (filters.foodType) {
        httpParams = httpParams.set(this.foodTypeKey, filters.foodType);
      }
    }
// We'll need to add a conditional in here that handles a donor get request as well
    return this.httpClient.get<Request[]>(this.requestClientUrl, {
      params: httpParams,
    });

  }

  getDonorRequests(filters?: {itemType?: ItemType; foodType?: FoodType}): Observable<Request[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.itemType) {
        httpParams = httpParams.set(this.itemTypeKey, filters.itemType);
      }
      if (filters.foodType) {
        httpParams = httpParams.set(this.foodTypeKey, filters.foodType);
      }
    }
// We'll need to add a conditional in here that handles a donor get request as well
    return this.httpClient.get<Request[]>(this.requestDonorUrl, {
      params: httpParams,
    });

  }

  filterRequests(requests: Request[]): Request[] {
    const filteredRequests = requests;

    return filteredRequests;
  }
// This is the method that submit form calls on the new request component.
// My idea is to add another function that handles newRequestDonor stuff
  addClientRequest(newRequest: Partial<Request>): Observable<string> {
    // Send post request to add a new Request with the Request data as the body.
    return this.httpClient.post<{id: string}>(this.newRequestClientUrl, newRequest).pipe(map(res => res.id));
  }

  addDonorRequest(newRequest: Partial<Request>): Observable<string> {
    // Send post request to add a new Request with the Request data as the body.
    return this.httpClient.post<{id: string}>(this.newRequestDonorUrl, newRequest).pipe(map(res => res.id));
  }

}
