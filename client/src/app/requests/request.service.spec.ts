import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { Request } from './request';
import { RequestService } from './request.service';
import { RequestedItem } from './requestedItem';
import { Pledge } from '../donor-pledge/pledge';

describe('RequestService', () => {
  //small collection of test Requests
  const testRequests: Request[] = [
    {
      _id: '1',
      name: 'sarah',
      dateAdded: '20200222',
      selections: ['hotSauce', 'tomatoSoup', 'yellowSplitPeas'],
      fulfilled: [],
      incomeValid: 'true',
      // itemType: 'food',
      description: 'I would like to be able to get some spaghetti noodles',
      archived: 'false',
      priority: 4
    },
    {
      _id: '2',
      name: 'hannah',
      dateAdded: '20230516',
      fulfilled: [],
      incomeValid: 'true',
      // itemType: 'toiletries',
      description: 'I need some toothpaste',
      archived: 'false',
      priority: 3
    },
    {
      _id: '3',
      name: 'kyle',
      dateAdded: '20180719',
      fulfilled: [],
      incomeValid: 'true',
      // itemType: 'other',
      description: 'Would it be possible for me to get some Advil?',
      archived: 'false',
      priority: 1
    }
  ];

  const testItems: RequestedItem[] = [
    {
      _id: '1',
      name: 'tomatoSoup',
      amount: 3
    },
    {
      _id: '2',
      name: 'bread',
      amount: 1
    },
    {
      _id: '3',
      name: 'hotSauce',
      amount: 8
    }
  ];

  let requestService: RequestService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    requestService = TestBed.inject(RequestService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('The getReadableDate Method', () => {
    it('should properly format a date in the form year/month/day`', () => {
      expect(requestService.getReadableDate('20231012') === 'submitted a form on: 10-12-2023').toBeTruthy();
    });
  });


  describe('The getReadableItemMethod', () => {
    const diaper = 'diapers';
    const ds = '5';
    const notPresent = 'orangeChickenSlices';
    const normalValue = 'hotSauce';
    it('should properly format diaper w/ diapersize', () => {
      expect(requestService.getReadableItem(diaper, ds) === 'Diapers (size: 5)').toBeTruthy();
    });
    it('should properly respond when the item isnt present in the itemMap', () => {
      expect(requestService.getReadableItem(notPresent) === notPresent).toBeTruthy();
    });
    it('should properly return a normal value in the itemMap', () => {
      expect(requestService.getReadableItem(normalValue) === 'Hot sauce').toBeTruthy();
    });
  });

  describe('The getReadableSelections Method', () => {
    const testSelections = ['hotSauce', 'tomatoSoup', 'yellowSplitPeas'];
    const testSelectionsBroken = ['hotSauce', 'tomatoSoup', 'yellowSplitPeas', 'le3emeLien'];
    it('should properly format all elements of the list', () => {
      const returnedString = requestService.getReadableSelections(testSelections);
      expect(returnedString.substring(0, 9)).toEqual('Hot sauce');
      expect(returnedString.substring(11, 22)).toEqual('Tomato soup');
      expect(returnedString.substring(24, 41)).toEqual('Yellow split peas');
    });
    it('should properly handle items not in the item map', () => {
      const returnedString = requestService.getReadableSelections(testSelectionsBroken);
      expect(returnedString.substring(43, 53)).toEqual('le3emeLien');
    });
  });

  describe('The getReadableUnfulfilled Method', () => {
    const testSelections = testRequests[0].selections;
    const testFulfilled = testRequests[0].fulfilled;
    const testSelectionsBroken = ['hotSauce', 'tomatoSoup', 'yellowSplitPeas', 'le3emeLien'];
    it('should properly format all elements of the list when there\'s nothing in fulfilled', () => {
      const returnedString = requestService.getReadableUnfulfilled(testFulfilled, testSelections);
      expect(returnedString.substring(0, 9)).toEqual('Hot sauce');
      expect(returnedString.substring(11, 22)).toEqual('Tomato soup');
      expect(returnedString.substring(24, 41)).toEqual('Yellow split peas');
    });

    it('should properly format all elements of the list when there\'s something in fulfilled', () => {
      testFulfilled.push('hotSauce');
      const returnedString = requestService.getReadableUnfulfilled(testFulfilled, testSelections);
      expect(returnedString.substring(0, 11)).toEqual('Tomato soup');
      expect(returnedString.substring(13, 30)).toEqual('Yellow split peas');
    });

    it('should properly handle items not in the item map', () => {
      const returnedString = requestService.getReadableUnfulfilled([], testSelectionsBroken);
      expect(returnedString.substring(43, 53)).toEqual('le3emeLien');
    });
  });

  describe('When getRequests() is called with no parameters', () => {
    it('calls `api/requests`', () => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testRequests));

      requestService.getClientRequests({}).subscribe(() => {
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);

        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(requestService.requestClientUrl, { params: new HttpParams() });
      });
    });
  });


  describe('When getRequests() is called with the filters=archived parameter', () => {
    it('calls `api/requests`', () => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testRequests));

      requestService.getClientRequests({archived: 'true'}).subscribe(() => {
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);

        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(requestService.requestClientUrl, { params: new HttpParams().set('archived', 'true')});
      });
    });
  });

  describe('When getRequestById() is called', () => {
    it('calls `api/requests`', () => {
      const targetRequest: Request = testRequests[1];
      const targetId: string = targetRequest._id;
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(targetRequest));

      requestService.getRequestById(targetId).subscribe((request: Request) => {
        expect(request)
          .withContext('expected request')
          .toBe(targetRequest);
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(requestService.requestClientUrl + '/' + targetId);
      });
    });
  });

  describe('When getRequestedItemById() is called', () => {
    it('calls `api/requests`', () => {
      const targetItem: RequestedItem = testItems[1];
      const targetId: string = targetItem._id;
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(targetItem));

      requestService.getRequestedItemById(targetId).subscribe((request: RequestedItem) => {
        expect(request)
          .withContext('expected item')
          .toBe(targetItem);
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(requestService.itemDonorUrl + '/' + targetId);
      });
    });
  });

  describe('When getClientRequests() is called with a parameter', () => {

      it('correctly calls api/requests with description \'Need Milk\'', () => {
        const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testRequests));
        //get requests with foodType dairy
        requestService.getClientRequests({description: 'Need Milk'}).subscribe(() => {
          //check if called once
          expect(mockedMethod)
            .withContext('one call')
            .toHaveBeenCalledTimes(1);
          //check if it's at the correct endpoint
          expect(mockedMethod)
            .withContext('talks to the correct endpoint')
            .toHaveBeenCalledWith(requestService.requestClientUrl, { params: new HttpParams().set('description', 'Need Milk')});
        });
      });
    });


    it('correctly calls api/requests with name \'Need Milk\'', () => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testRequests));

      // get requests with description 'Need Milk'
      requestService.getDonorRequests({ name: 'Need Milk' }).subscribe(() => {
        // check if called once
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        // check if it's at the correct endpoint
        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(requestService.requestedItem, {
            params: new HttpParams().set('name', 'Need Milk'),
          });
      });
    });

  describe('When getDonorRequests() is called with a parameter', () => {
    //test food top level category

    it('correctly calls api/requests with description \'Need Milk\'', () => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testRequests));

      //get requests with foodType dairy
      requestService.getDonorRequests({name: 'Need Milk'}).subscribe(() => {
        //check if called once
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        //check if it's at the correct endpoint
        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(requestService.requestedItem, { params: new HttpParams().set('name', 'Need Milk')});
      });
    });
  });

  describe('When getRequests() is called with multiple parameters', () => {
    //test a itemType 'food' with a foodType 'meat'
    it('correctly calls api/requests with itemType \'food\' and foodType \'meat\'', () => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testRequests));
    });
  });

  describe('filterRequests', ()=> {
    it('returns the correct array of requests', ()=>{
      expect(requestService.filterRequests(testRequests) === testRequests).toBeTrue();
    });
  });

  describe('addClientRequest', ()=> {
    it('talks to the right endpoint and is called once', waitForAsync(() => {
      // Mock the `httpClient.addUser()` method, so that instead of making an HTTP request,
      // it just returns our test data.
      const REQUEST_ID = '2';
      const mockedMethod = spyOn(httpClient, 'post').and.returnValue(of(REQUEST_ID));

      // paying attention to what is returned (undefined) didn't work well here,
      // but I'm putting something in here to remind us to look into that
      requestService.addClientRequest(testRequests[1]).subscribe((returnedString) => {
        console.log('The thing returned was:' + returnedString);
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(requestService.newRequestClientUrl, testRequests[1]);
      });
    }));
  });

  describe('addDonorRequest', ()=> {
    it('talks to the right endpoint and is called once', waitForAsync(() => {
      // Mock the `httpClient.addUser()` method, so that instead of making an HTTP request,
      // it just returns our test data.
      const REQUEST_ID = '2';
      const mockedMethod = spyOn(httpClient, 'post').and.returnValue(of(REQUEST_ID));

      // paying attention to what is returned (undefined) didn't work well here,
      // but I'm putting something in here to remind us to look into that
      requestService.addDonorRequest(testRequests[1]).subscribe((returnedString) => {
        console.log('The thing returned was:' + returnedString);
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(requestService.newRequestDonorUrl, testRequests[1]);
        });
    }));
  });

  describe('deleteClientRequest', ()=> {
    it('talks to the right endpoint and is called once', waitForAsync(() => {
      // Mock the `httpClient.addUser()` method, so that instead of making an HTTP request,
      // it just returns our test data.
      const REQUEST_ID = '2';
      const mockedMethod = spyOn(httpClient, 'delete').and.returnValue(of(REQUEST_ID));

      // paying attention to what is returned (undefined) didn't work well here,
      // but I'm putting something in here to remind us to look into that
      requestService.deleteClientRequest(testRequests[1]).subscribe((returnedString) => {
        console.log('The thing returned was:' + returnedString);
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(mockedMethod)
          .withContext('talks to the correct endpoint');
      });
    }));
  });

  describe('deleteDonorRequest', ()=> {
    it('talks to the right endpoint and is called once', waitForAsync(() => {
      // Mock the `httpClient.addUser()` method, so that instead of making an HTTP request,
      // it just returns our test data.
      const REQUEST_ID = '2';
      const mockedMethod = spyOn(httpClient, 'delete').and.returnValue(of(REQUEST_ID));

      // paying attention to what is returned (undefined) didn't work well here,
      // but I'm putting something in here to remind us to look into that
      requestService.deleteDonorRequest(testRequests[1]).subscribe((returnedString) => {
        console.log('The thing returned was:' + returnedString);
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(mockedMethod)
          .withContext('talks to the correct endpoint');
      });
    }));
  });

  describe('deleteDonorItem', ()=> {
    it('talks to the right endpoint and is called once', waitForAsync(() => {
      // Mock the `httpClient.addUser()` method, so that instead of making an HTTP request,
      // it just returns our test data.
      const ITEM_ID = '2';
      const mockedMethod = spyOn(httpClient, 'delete').and.returnValue(of(ITEM_ID));

      // paying attention to what is returned (undefined) didn't work well here,
      // but I'm putting something in here to remind us to look into that
      requestService.deleteDonorItem(testItems[1]).subscribe((returnedString) => {
        console.log('The thing returned was:' + returnedString);
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(mockedMethod)
          .withContext('talks to the correct endpoint');
      });
    }));
  });

  describe('When getPledges() is called with no parameters', () => {
    it('calls `api/getPledges`', () => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testRequests));

      requestService.getPledges().subscribe(() => {
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);

        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(requestService.getPledgesUrl, { params: new HttpParams() });
      });
    });
  });

  describe('addDonorItem', ()=> {
    it('talks to the right endpoint and is called once', waitForAsync(() => {
      // Mock the `httpClient.addUser()` method, so that instead of making an HTTP request,
      // it just returns our test data.
      const ITEM_ID= '2';
      const mockedMethod = spyOn(httpClient, 'post').and.returnValue(of(ITEM_ID));

      // paying attention to what is returned (undefined) didn't work well here,
      // but I'm putting something in here to remind us to look into that
      requestService.addDonorItem(testItems[1]).subscribe((returnedString) => {
        console.log('The thing returned was:' + returnedString);
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(requestService.addNewRequestedItem, testItems[1]);
        });
    }));
  });

  describe('addDonorItem', ()=> {
    it('talks to the right endpoint and is called once', waitForAsync(() => {
      // Mock the `httpClient.addUser()` method, so that instead of making an HTTP request,
      // it just returns our test data.

      const testPledge: Pledge = {
        _id: '2',
        comment: 'hahah',
        timeSlot: 'Monday',
        name: 'Mason',
        amount: 4,
        itemName: 'hotSauce'
      };
      const PLEDGE_ID= '2';
      const mockedMethod = spyOn(httpClient, 'post').and.returnValue(of(PLEDGE_ID));

      // paying attention to what is returned (undefined) didn't work well here,
      // but I'm putting something in here to remind us to look into that
      requestService.addDonorPledge(testPledge).subscribe((returnedString) => {
        console.log('The thing returned was:' + returnedString);
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(requestService.newPledgeDonorUrl, testPledge);
        });
    }));
  });
  describe('updateRequest', ()=> {
    it('talks to the right endpoint and is called once', waitForAsync(() => {
      // Mock the `httpClient.addUser()` method, so that instead of making an HTTP request,
      // it just returns our test data.
      const REQUEST_ID= '2';
      const mockedMethod = spyOn(httpClient, 'post').and.returnValue(of(REQUEST_ID));

      // paying attention to what is returned (undefined) didn't work well here,
      // but I'm putting something in here to remind us to look into that
      requestService.updateRequest(testRequests[1]).subscribe((returnedString) => {
        console.log('The thing returned was:' + returnedString);
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(requestService.updateRequestUrl, testRequests[1]);
      });
    }));

    describe('updateClientRequest', ()=> {
      it('talks to the right endpoint and is called once', waitForAsync(() => {
        // Mock the `httpClient.addUser()` method, so that instead of making an HTTP request,
        // it just returns our test data.
        const REQUEST_ID= '2';
        const mockedMethod = spyOn(httpClient, 'post').and.returnValue(of(REQUEST_ID));

        // paying attention to what is returned (undefined) didn't work well here,
        // but I'm putting something in here to remind us to look into that
        requestService.updateClientPledge(testRequests[1]).subscribe((returnedString) => {
          console.log('The thing returned was:' + returnedString);
          expect(mockedMethod)
            .withContext('one call')
            .toHaveBeenCalledTimes(1);
          expect(mockedMethod)
            .withContext('talks to the correct endpoint')
            .toHaveBeenCalledWith(requestService.updateRequestUrl, testRequests[1]);
        });
      }));
  });

  describe('markRequestAsComplete', ()=> {
    it('talks to the right endpoint and is called once', waitForAsync(() => {
      // Mock the `httpClient.addUser()` method, so that instead of making an HTTP request,
      // it just returns our test data.
      const REQUEST_ID= '2';
      const mockedMethod = spyOn(httpClient, 'post').and.returnValue(of(REQUEST_ID));

      // paying attention to what is returned (undefined) didn't work well here,
      // but I'm putting something in here to remind us to look into that
      requestService.markRequestAsComplete(testRequests[1]).subscribe((returnedString) => {
        console.log('The thing returned was:' + returnedString);
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith('/api/archive', testRequests[1]);
      });
    }));
  });

  describe('deletePledge', ()=> {
    it('talks to the right endpoint and is called once', waitForAsync(() => {
      // Mock the `httpClient.addUser()` method, so that instead of making an HTTP request,
      // it just returns our test data.
      const testPledge: Pledge = {
        _id: '2',
        comment: 'hahah',
        timeSlot: 'Monday',
        name: 'Mason',
        amount: 4,
        itemName: 'hotSauce'
      };
      const PLEDGE_ID= '2';
      const mockedMethod = spyOn(httpClient, 'delete').and.returnValue(of(PLEDGE_ID));

      // paying attention to what is returned (undefined) didn't work well here,
      // but I'm putting something in here to remind us to look into that
      requestService.deletePledge(testRequests[1]).subscribe((returnedString) => {
        console.log('The thing returned was:' + returnedString);
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(mockedMethod)
          .withContext('talks to the correct endpoint');
      });
    }));
  });
  describe('addRequestPriority', () => {
    let httpClientSpy: { put: jasmine.Spy };
    let service: RequestService;

    beforeEach(() => {
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['put']);
      service = new RequestService(httpClientSpy as any);
    });

    it('should update request priority', () => {
      const priorityGiven = 2;
      const expectedPriority = 2;

      httpClientSpy.put.and.returnValue(of({ priority: expectedPriority }));

      service.addRequestPriority(testRequests[1], priorityGiven).subscribe(priority => {
        expect(priority).toEqual(expectedPriority);
      });

      expect(httpClientSpy.put.calls.count()).toBe(1, 'one call');
      expect(httpClientSpy.put.calls.mostRecent().args[0]).toEqual(`${service.priorityUrl}/${testRequests[1]._id}`, 'URL');
      expect(httpClientSpy.put.calls.mostRecent().args[1].toString()).toEqual('2', 'priorityGiven as param');
    });

    it('should return the correct priority when updating the request priority', () => {
      const priorityGiven = 1;
      const expectedPriority = 1;

      httpClientSpy.put.and.returnValue(of({ priority: expectedPriority }));

      service.addRequestPriority(testRequests[2], priorityGiven).subscribe(priority => {
        expect(priority).toEqual(expectedPriority);
      });

      expect(httpClientSpy.put.calls.count()).toBe(1, 'one call');
      expect(httpClientSpy.put.calls.mostRecent().args[0]).toEqual(`${service.priorityUrl}/${testRequests[2]._id}`, 'URL');
      expect(httpClientSpy.put.calls.mostRecent().args[1].toString()).toEqual('1', 'priorityGiven as param');
    });

    it('should send the correct data to the server when updating the request priority', () => {
      const priorityGiven = 3;
      const expectedPriority = 3;

      httpClientSpy.put.and.returnValue(of({ priority: expectedPriority }));

      service.addRequestPriority(testRequests[0], priorityGiven).subscribe();

      expect(httpClientSpy.put.calls.count()).toBe(1, 'one call');
      expect(httpClientSpy.put.calls.mostRecent().args[0]).toEqual(`${service.priorityUrl}/${testRequests[0]._id}`, 'URL');
      expect(httpClientSpy.put.calls.mostRecent().args[1].toString()).toEqual('3', 'priorityGiven as param');
    });
  });
});
});
