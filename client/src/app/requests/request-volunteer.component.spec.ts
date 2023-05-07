import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { MockRequestService } from 'src/testing/request.service.mock';
import { Request } from './request';
import { RequestVolunteerComponent } from './request-volunteer.component';
import { RequestService } from './request.service';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

const COMMON_IMPORTS: unknown[] = [
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatButtonModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatListModule,
  MatDividerModule,
  MatRadioModule,
  MatIconModule,
  MatSnackBarModule,
  BrowserAnimationsModule,
  RouterTestingModule,
];

describe('Volunteer Request View', () => {
  let volunteerList: RequestVolunteerComponent;
  let fixture: ComponentFixture<RequestVolunteerComponent>;
  const service = new MockRequestService();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [RequestVolunteerComponent],
      providers: [{ provide: RequestService, useValue: service }]
    });
  });

  beforeEach(waitForAsync (() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(RequestVolunteerComponent);
      volunteerList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('contains all requests', () => {
    volunteerList.updateFilter();
    expect(volunteerList.serverFilteredRequests.length).toBe(4);
  });

  it('contains a request for noah', () => {
    expect(volunteerList.serverFilteredRequests.some((request: Request) => request.name === 'noah')).toBe(true);
  });

  it('contains a request added on 04-01-2018', () => {
     expect(volunteerList.serverFilteredRequests.some((request: Request) => request.dateAdded === '20180401')).toBe(true);
  });

  it('contains a request that includes hotSauce', () => {
     expect(volunteerList.serverFilteredRequests.some((request: Request) => request.selections[0] === 'hotSauce')).toBe(true);
  });

  it('contains a request that asks for paper plates', () => {
    expect(volunteerList.serverFilteredRequests.some((request: Request) => request.description === 'I need more paper plates')).toBe(true);
 });

  describe('Can we delete requests', ()=>{
    it('should not get angy', ()=> {
      volunteerList.deleteRequest(MockRequestService.testRequests[0]);

      expect(service.deletedClientRequests[0]).toEqual(MockRequestService.testRequests[0]);
    });
  });

  describe('Can we post requests', ()=>{
    it('should not get angy', ()=> {
      //volunteerList.postRequest(MockRequestService.testRequests[0]);

      expect(service.deletedClientRequests[0]).toEqual(MockRequestService.testRequests[0]);
      //expect(service.addedDonorRequests[0].description).toEqual(MockRequestService.testRequests[0].description);
      // expect(service.addedDonorRequests[0].foodType).toEqual(MockRequestService.testRequests[0].foodType);
      // expect(service.addedDonorRequests[0].itemType).toEqual(MockRequestService.testRequests[0].itemType);
    });
  });
});

describe('Misbehaving Volunteer view', () => {
  let volunteerList: RequestVolunteerComponent;
  let fixture: ComponentFixture<RequestVolunteerComponent>;
  let hasCalledDelete = false;
  let hasCalledAddDonor = false;

  let requestServiceStub: {
    getClientRequests: () => Observable<Request[]>;
    getDonorRequests: () => Observable<Request[]>;
    deleteClientRequest: () => Observable<object>;
    addDonorRequest: () => Observable<string>;
  };

  let snackbarModuleStub: {
    open: (msg, buttons, settings) => void;
    called: boolean;
  };

  beforeEach(() => {
    requestServiceStub = {
      getClientRequests: () => new Observable(observer => {
        observer.error('getClientRequests() Observer generates an error');
      }),
      getDonorRequests: () => new Observable(observer => {
        observer.error('getDonorRequests() Observer generates an error');
      }),
      deleteClientRequest: () => new Observable(observer => {
        hasCalledDelete = true;
        observer.error('getDonorRequest() Observer generates an error');
      }),
      addDonorRequest: () => new Observable(observer => {
        hasCalledAddDonor = true;
        observer.error('addDonorRequest() Observer generates an error');
      })
    };

    snackbarModuleStub = {
      open: (msg, buttons, settings) => {
        snackbarModuleStub.called = true;
      },
      called: false
    };

    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [RequestVolunteerComponent],
      providers: [{provide: RequestService, useValue: requestServiceStub}, {provide: MatSnackBar, useValue: snackbarModuleStub}]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(RequestVolunteerComponent);
      volunteerList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('opens snackbar on failures', () => {
    snackbarModuleStub.called = false;
    volunteerList.deleteRequest(null);
    expect(snackbarModuleStub.called).toBeTrue();
  });

  it('generates an error if we don\'t set up a RequestVolunteerService', () => {
    expect(volunteerList.serverFilteredRequests).toEqual([]);
  });

  it('does not call delete if the post failed when calling `postRequest`', () => {
    hasCalledDelete = false;
    hasCalledAddDonor = false;
    //volunteerList.postRequest(null);
    expect(hasCalledDelete).toBeFalse();
    expect(hasCalledAddDonor).toBeFalse();
  });

  it('updateFilter properly reassigns our request list', ()=>{
    volunteerList.updateFilter();
    expect(volunteerList.filteredRequests === volunteerList.serverFilteredRequests).toBeTruthy();
  });

});

describe('Partially misbehaving Volunteer view', () => {
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
  let volunteerList: RequestVolunteerComponent;
  let fixture: ComponentFixture<RequestVolunteerComponent>;
  let hasCalledDelete = false;
  let hasCalledAddDonor = false;

  let requestServiceStub: {
    getClientRequests: () => Observable<Request[]>;
    getDonorRequests: () => Observable<Request[]>;
    deleteClientRequest: () => Observable<object>;
    addDonorRequest: () => Observable<string>;
  };

  beforeEach(() => {
    requestServiceStub = {
      getClientRequests: () => new Observable(observer => {
        observer.error('getClientRequests() Observer generates an error');
      }),
      getDonorRequests: () => new Observable(observer => {
        observer.error('getDonorRequests() Observer generates an error');
      }),
      deleteClientRequest: () => new Observable(observer => {
        hasCalledDelete = true;
        observer.error('getDonorRequest() Observer generates an error');
      }),
      addDonorRequest: () => {
        hasCalledAddDonor = true;
        return of('<3');
      },
    };

    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [RequestVolunteerComponent],
      providers: [{provide: RequestService, useValue: requestServiceStub}]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(RequestVolunteerComponent);
      volunteerList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('does call delete if the post succeeded when calling `postRequest`, even if the delete call fails too', () => {
    hasCalledDelete = false;
    hasCalledAddDonor = false;
    //volunteerList.postRequest(null);
    expect(hasCalledDelete).toBeFalse();
    expect(hasCalledAddDonor).toBeFalse();
  });

  it('should update request priority and call updateFilter', () => {
    const request: Request = {
      _id: '1',
      name: 'Test Request',
      dateAdded: '',
      archived: '',
      incomeValid: '',
      fulfilled: [],
      description: '',
      priority: 0
    };
    const priority = 5;
    const requestServiceStub2 = {
      getRequests: () => new Observable(observer => {
        observer.error('getRequests() Observer generates an error');
      }),
      addRequestPriority: () => of(null)
    };
    const requestService = requestServiceStub2;

    // Spy on addRequestPriority method and return an observable
    spyOn(requestService, 'addRequestPriority').and.returnValue(of(null));

    // Spy on updateFilter method
    spyOn(volunteerList, 'updateFilter');

    volunteerList.updateRequestPriority(request, priority);

    expect(requestService.addRequestPriority).toHaveBeenCalledWith();
    expect(volunteerList.updateFilter).toHaveBeenCalled();
  });
  describe('MockRequestService', () => {
    let mockRequestService: MockRequestService;

    beforeEach(() => {
      mockRequestService = new MockRequestService();
    });

    it('should call addRequestPriority with correct arguments', () => {
      const request: Request = {
        _id: '1',
        name: 'Test Request',
        dateAdded: '',
        archived: '',
        incomeValid: '',
        fulfilled: [],
        description: '',
        priority: 0
      };
      const priority = 5;

      spyOn(mockRequestService, 'addRequestPriority').and.callThrough();

      mockRequestService.addRequestPriority(request, priority);

      expect(mockRequestService.addRequestPriority).toHaveBeenCalledWith(request, priority);
    });
  });


});
