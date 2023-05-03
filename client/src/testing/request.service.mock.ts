import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { Request } from 'src/app/requests/request';
import { RequestService } from 'src/app/requests/request.service';
import { RequestedItem } from 'src/app/requests/requestedItem';


@Injectable({
  providedIn: AppComponent
})
export class MockRequestService extends RequestService {
  public static testRequests: Request[] = [
    {
      _id: '1_id',
      name: 'noah',
      dateAdded: '20210213',
      fulfilled: [],
      incomeValid: 'true',
      selections: ['hotSauce', 'tomatoSoup', 'vegOil'],
      // itemType: 'food',
      description: 'I would like some ground beef'
      // foodType: 'meat'
      priority: 3
    },
    {
      _id: '2_id',
      name: 'mason',
      dateAdded: '20220618',
      fulfilled: [],
      incomeValid: 'true',
      selections: ['hotSauce', 'tomatoSoup', 'vegOil'],
      // itemType: 'toiletries',
      description: 'I need more toothpaste'
      // foodType: ''
      priority: 4
    },
    {
      _id: '3_id',
      name: 'harry',
      dateAdded: '20180401',
      fulfilled: [],
      incomeValid: 'true',
      selections: ['hotSauce', 'tomatoSoup', 'vegOil'],
      // itemType: 'other',
      description: 'I need more paper plates'
      // foodType: ''
      priority: 1
    },
    {
      _id: '4_id',
      name: 'jaydon',
      dateAdded: '20140817',
      fulfilled: [],
      incomeValid: 'true',
      selections: ['hotSauce', 'tomatoSoup', 'vegOil', 'diapers'],
      diaperSize: 'newborn',
      // itemType: 'food',
      description: 'I would like some milk'
      // foodType: 'dairy'
      priority: 2
    }
  ];

  public static testItems: RequestedItem[] = [
    {
      _id: 'item_1',
      name: 'hotSauce',
      amount: 3
    }
  ];

  public addedClientRequests: Partial<Request>[] = [];
  public addedDonorRequests: Partial<Request>[] = [];

  public deletedClientRequests: Partial<Request>[] = [];
  public deletedDonorRequests: Partial<Request>[] = [];

  constructor() {
    super(null);
  }

  getClientRequests(): Observable<Request[]> {
      return of(MockRequestService.testRequests);
  }

  getDonorRequests(): Observable<RequestedItem[]> {
    return of(MockRequestService.testItems);
  }
  deleteClientRequest(request: Partial<Request>): Observable<object> {
    this.deletedClientRequests.push(request);
    // Send delete request to delete a request
    return of (Object);
  }

  // deleteRequest(request: Partial<Request>): Observable<object> {
  //   // Send delete request to delete a request
  //   return of (Object);
  // }

  deleteDonorRequest(request: Partial<Request>): Observable<object> {
    this.deletedDonorRequests.push(request);
    // Send delete request to delete a request
    return of (Object);
  }


  addClientRequest(newRequest: Partial<Request>): Observable<string> {
    this.addedClientRequests.push(newRequest);
    return of('added! :)');
  }

  addDonorRequest(newRequest: Partial<Request>): Observable<string> {
    this.addedDonorRequests.push(newRequest);
    return of('added! <3');
  }

}
