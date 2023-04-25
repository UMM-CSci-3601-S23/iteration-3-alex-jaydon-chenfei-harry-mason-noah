import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';
import { Request } from './request';
import { RequestService } from './request.service';

fdescribe('RequestService', () => {
  //small collection of test Requests
  const testRequests: Request[] = [
    {
      _id: '1',
      name: 'sarah',
      dateAdded: '20200222',
      // itemType: 'food',
      description: 'I would like to be able to get some spaghetti noodles',
      // foodType: 'grain'
    },
    {
      _id: '2',
      name: 'hannah',
      dateAdded: '20230516',
      // itemType: 'toiletries',
      description: 'I need some toothpaste',
      // foodType: ''
    },
    {
      _id: '3',
      name: 'kyle',
      dateAdded: '20180719',
      // itemType: 'other',
      description: 'Would it be possible for me to get some Advil?',
      // foodType: ''
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

  describe('The getReadableDSelections Method', () => {
    const testSelections = ['hotSauce', 'tomatoSoup', 'yellowSplitPeas'];
    const testSelectionsBroken = ['hotSauce', 'tomatoSoup', 'yellowSplitPeas', 'le3emeLien'];
    it('should properly format all elements of the list', () => {
      const returnedString = requestService.getReadableSelections(testSelections);
      expect(returnedString.substring(0, 9)).toEqual('Hot sauce');
      expect(returnedString.substring(9, 20)).toEqual('Tomato soup');
      expect(returnedString.substring(20, 37)).toEqual('Yellow split peas');
    });
  });

  describe('When getRequests() is called with no parameters', () => {
    it('calls `api/requests`', () => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testRequests));

      requestService.getClientRequests().subscribe(() => {
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);

        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(requestService.requestClientUrl, { params: new HttpParams() });
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


  describe('When getDonorRequests() is called with a parameter', () => {
    //test food top level category
    it('correctly calls api/requests with itemType \'food\'', () => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testRequests));

      //getting requests with top category food
      /*requestService.getDonorRequests({itemType: 'food'}).subscribe(() => {
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);

        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(requestService.requestDonorUrl, { params: new HttpParams().set('itemType', 'food')});
      });*/
    });
    //test a foodType level category
    /*it('correctly calls api/requests with foodType \'dairy\'', () => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testRequests));

      //get requests with foodType dairy
      requestService.getDonorRequests({foodType: 'dairy'}).subscribe(() => {
        //check if called once
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        //check if it's at the correct endpoint
        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(requestService.requestDonorUrl, { params: new HttpParams().set('foodType', 'dairy')});
      });
    });*/

    it('correctly calls api/requests with description \'Need Milk\'', () => {
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(testRequests));


      requestService.getDonorRequests({description: 'Need Milk'}).subscribe(() => {
        //check if called once
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        //check if it's at the correct endpoint
        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(requestService.requestDonorUrl, { params: new HttpParams().set('description', 'Need Milk')});
      });
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
}));});

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




});



});

