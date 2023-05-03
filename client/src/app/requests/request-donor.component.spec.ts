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
import { Observable } from 'rxjs';
import { MockRequestService } from 'src/testing/request.service.mock';
import { Request } from './request';
import { RequestDonorComponent } from './request-donor.component';
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

describe('Donor Request View', () => {
  let donorList: RequestDonorComponent;
  let fixture: ComponentFixture<RequestDonorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [RequestDonorComponent],
      providers: [{ provide: RequestService, useValue: new MockRequestService() }]
    });
  });

  beforeEach(waitForAsync (() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(RequestDonorComponent);
      donorList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('contains all requests', () => {
    donorList.updateFilter();
    expect(donorList.serverFilteredItems.length).toBe(4);
  });


  it('contains a request for food', () => {
  //   expect(donorList.serverFilteredItems.some((request: Request) => request.itemType === 'food')).toBe(true);
  });

  it('contains a request for toiletries', () => {
  //   expect(donorList.serverFilteredItems.some((request: Request) => request.itemType === 'toiletries')).toBe(true);
  });

  it('contains a request for other', () => {
  //   expect(donorList.serverFilteredItems.some((request: Request) => request.itemType === 'other')).toBe(true);
  });

  /*it('contains a request for itemType food and foodType meat', () => {
    expect(donorList.serverFilteredItems.some((request: Request) => request.itemType === 'food'
     && request.foodType === 'meat')).toBe(true);
  });*/
});

describe('Misbehaving Donor view', () => {
  let donorList: RequestDonorComponent;
  let fixture: ComponentFixture<RequestDonorComponent>;

  let requestServiceStub: {
    deleteDonorRequest: () => Observable<object>;
    getClientRequests: () => Observable<Request[]>;
    getDonorRequests: () => Observable<Request[]>;
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

      deleteDonorRequest: () => new Observable(observer => {
        observer.error('deleteDonorRequest() Observer generates an error');
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
      declarations: [RequestDonorComponent],
      providers: [{provide: RequestService, useValue: requestServiceStub}, {provide: MatSnackBar, useValue: snackbarModuleStub}]
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(RequestDonorComponent);
      donorList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  // it('generates an error if we don\'t set up a RequestDonorService, but delete', () => {
  //   donorList.deleteRequest(null);
  // });

  it('opens snackbar on failures', () => {
    snackbarModuleStub.called = false;
    donorList.deleteRequest(null);
    expect(snackbarModuleStub.called).toBeTrue();
  });

  it('generates an error if we don\'t set up a RequestDonorService', () => {
    expect(donorList.serverFilteredItems).toBeUndefined();
  });

  it('updateFilter properly reassigns our request list', ()=>{
    donorList.updateFilter();
    expect(donorList.filteredRequests === donorList.serverFilteredItems).toBeTruthy();
  });
});

