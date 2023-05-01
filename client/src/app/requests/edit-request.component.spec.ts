import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditRequestComponent } from './edit-request.component';
import { AbstractControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockRequestService } from 'src/testing/request.service.mock';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NewRequestComponent } from './new-request/new-request.component';
import { RequestService } from './request.service';
import { Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from 'src/testing/activated-route-stub';
import { Request } from './request';

describe('EditRequestComponent', () => {
  let editRequestComponent: EditRequestComponent;
  let editRequestForm: FormGroup;
  let fixture: ComponentFixture<EditRequestComponent>;
  const service: MockRequestService = new MockRequestService();
  let requestService: RequestService;
  let component: EditRequestComponent;
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub({
    id : '1_id'
  });

  beforeEach(waitForAsync(() => {
    TestBed.overrideProvider(RequestService, { useValue: service });
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      declarations: [NewRequestComponent],
      providers: [
        { provide: RequestService, useValue: new MockRequestService() },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    }).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRequestComponent);
    editRequestComponent = fixture.componentInstance;
    fixture.detectChanges();
    editRequestForm = editRequestComponent.editRequestForm;
    expect(editRequestForm).toBeDefined();
    expect(editRequestForm.controls).toBeDefined();
  });

  it('should create the component and form', () => {
    expect(editRequestComponent).toBeTruthy();
    expect(editRequestForm).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(editRequestForm.valid).toBeFalsy();
  });

  describe('The getErrorMessage method', ()=>{
    let clientNameControl: AbstractControl;

    beforeEach(() => {
      clientNameControl = editRequestForm.controls.clientName;
    });

    it('should return "unknown error" when passed an invalid error code', ()=> {
       expect(editRequestComponent.getErrorMessage('foodType') === 'Unknown error');
    });

    it('should return "required" error when clientName is empty', ()=> {
       clientNameControl.setValue('');
       expect(editRequestComponent.getErrorMessage('clientName')).toBeTruthy();
    });

    it('should return "minLength" error when clientName is too short', ()=> {
      clientNameControl.setValue('A');
      expect(editRequestComponent.getErrorMessage('clientName')).toBeTruthy();
   });

   it('should return "maxLength" error when clientName is too long', ()=> {
    clientNameControl.setValue('A182222222222222222222222222222222222222f18f128fj128f1j28f1j28f1j8fj128f1j2f8');
    expect(editRequestComponent.getErrorMessage('clientName')).toBeTruthy();
 });
  });

  describe('Can we submit stuff to the donor database?', ()=>{
    // let itemTypeControl: AbstractControl;
    // let foodTypeControl: AbstractControl;
    let descControl: AbstractControl;

    beforeEach(() => {
    //   itemTypeControl = editRequestForm.controls.itemType;
    //   foodTypeControl = editRequestForm.controls.foodType;
      descControl = editRequestComponent.editRequestForm.controls.description;
    });

    it('should not get angy', ()=> {

    //   foodTypeControl.setValue('dairy');
    //   itemTypeControl.setValue('food');
      descControl.setValue('this is a description I guess');

      editRequestComponent.submitForm();

    //   expect(service.addedDonorRequests[0].itemType).toEqual('food');
    //   expect(service.addedDonorRequests[0].foodType).toEqual('dairy');
      expect(service.addedDonorRequests[0].description).toEqual('this is a description I guess');
    });

    it('should fill in values properly', ()=> {
      editRequestComponent.setRequestValues({
        _id: '588935f57546a2daea44de7c',
        name: 'joe',
        dateAdded: '13980507',
        description: 'This is a test edit',
      });

      // expect(itemTypeControl.value === 'food').toBeTrue();
      // expect(foodTypeControl.value === 'fruit').toBeTrue();
      expect(descControl.value === 'This is a test edit').toBeTrue();
    });
  });
/*
  describe('It should navigate to the correct Auto filled form', ()=> {
    //requestService = TestBed.inject(RequestService)
    let expectedRequest: Request;


    it('should create the component', () => {
      expect(editRequestComponent).toBeTruthy();
    });

    it('should show the correct request', ()=> {


      activatedRoute.setParamMap({id: expectedRequest._id});
      fixture.detectChanges();
      expect(editRequestComponent.request._id).toEqual(expectedRequest._id);
    });
  }); */
});

describe('Misbehaving request service', () => {
  // let itemTypeControl: AbstractControl;
  // let foodTypeControl: AbstractControl;
  let descControl: AbstractControl;
  let editRequestComponent: EditRequestComponent;
  let editRequestForm: FormGroup;
  let fixture: ComponentFixture<EditRequestComponent>;

  let requestServiceStub: {
    deleteRequest: () => Observable<object>;
    addDonorRequest: () => Observable<string>;
    addClientRequest: () => Observable<string>;
    getClientRequests: () => Observable<Request[]>;
    getDonorRequests: () => Observable<Request[]>;
  };

  beforeEach(() => {
    requestServiceStub = {
      getClientRequests: () => new Observable(observer => {
        observer.error('getClientRequests() Observer generates an error');
      }),
      getDonorRequests: () => new Observable(observer => {
        observer.error('getDonorRequests() Observer generates an error');
      }),
      addDonorRequest: () => new Observable(observer => {
        observer.error('addDonorRequest() Observer generates an error');
      }),
      addClientRequest: () => new Observable(observer => {
        observer.error('addClientRequest() Observer generates an error');
      }),

      deleteRequest: () => new Observable(observer => {
        observer.error('deleteRequest() Observer generates an error');
      })
    };
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule,
      ],
      providers: [{provide: RequestService, useValue: requestServiceStub}],
      declarations: [EditRequestComponent]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(EditRequestComponent);
      editRequestComponent = fixture.componentInstance;
      fixture.detectChanges();
      editRequestForm = editRequestComponent.editRequestForm;
      expect(editRequestForm).toBeDefined();
      expect(editRequestForm.controls).toBeDefined();
      descControl = editRequestComponent.editRequestForm.controls.description;
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRequestComponent);
    editRequestComponent = fixture.componentInstance;
    fixture.detectChanges();
    editRequestForm = editRequestComponent.editRequestForm;
    expect(editRequestForm).toBeDefined();
    expect(editRequestForm.controls).toBeDefined();
  });

  it('should get angy when talking with the donor database', ()=> {
    // foodTypeControl.setValue('dairy');
    // itemTypeControl.setValue('food');
    descControl.setValue('this is a description I guess');

    editRequestComponent.submitForm();
  });

});





describe('Partially Misbehaving request service', () => {
  // let itemTypeControl: AbstractControl;
  // let foodTypeControl: AbstractControl;
  let descControl: AbstractControl;
  let editRequestComponent: EditRequestComponent;
  let editRequestForm: FormGroup;
  let fixture: ComponentFixture<EditRequestComponent>;

  let requestServiceStub: {
    deleteRequest: () => Observable<object>;
    addDonorRequest: () => Observable<string>;
    addClientRequest: () => Observable<string>;
    getClientRequests: () => Observable<Request[]>;
    getDonorRequests: () => Observable<Request[]>;
    getRequestById: () => Observable<Request>;
  };

  beforeEach(() => {
    requestServiceStub = {
      getClientRequests: () => new Observable(observer => {
        observer.error('getClientRequests() Observer generates an error');
      }),
      getDonorRequests: () => new Observable(observer => {
        observer.error('getDonorRequests() Observer generates an error');
      }),
      addDonorRequest: () => new Observable(observer => {
        observer.error('addDonorRequest() Observer generates an error');
      }),
      addClientRequest: () => new Observable(observer => {
        observer.error('addClientRequest() Observer generates an error');
      }),
      getRequestById: () => of(MockRequestService.testRequests[0]),

      deleteRequest: () => new Observable(observer => {
        observer.error('deleteRequest() Observer generates an error');
      })
    };
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule,
      ],
      providers: [{provide: RequestService, useValue: requestServiceStub}],
      declarations: [EditRequestComponent]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(EditRequestComponent);
      editRequestComponent = fixture.componentInstance;
      fixture.detectChanges();
      editRequestForm = editRequestComponent.editRequestForm;
      expect(editRequestForm).toBeDefined();
      expect(editRequestForm.controls).toBeDefined();

      // itemTypeControl = editRequestForm.controls.itemType;
      // foodTypeControl = editRequestForm.controls.foodType;
      descControl = editRequestComponent.editRequestForm.controls.description;
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRequestComponent);
    editRequestComponent = fixture.componentInstance;
    fixture.detectChanges();
    editRequestForm = editRequestComponent.editRequestForm;
    expect(editRequestForm).toBeDefined();
    expect(editRequestForm.controls).toBeDefined();
  });

  it('should fill in values properly', ()=> {
    editRequestComponent.setRequestValues({
      _id: '588935f57546a2daea44de7c',
      name: 'joe',
      dateAdded: '20230423',
    //   itemType: 'food',
    //   foodType: 'meat',
      description: 'This is a test edit'
    });



    expect(editRequestForm.value.description === 'Description').toBeTrue();
    // expect(editRequestForm.value.foodType === 'fruit').toBeTrue();
    // expect(editRequestForm.value.itemType === 'food').toBeTrue();
  });

});




