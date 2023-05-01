import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { MockRequestService } from 'src/testing/request.service.mock';;
import { RequestService } from '../request.service';
import { NewRequestComponent } from './new-request.component';
import { environment } from 'src/environments/environment';

describe('NewRequestComponent', () => {
  let newRequestComponent: NewRequestComponent;
  let newRequestForm: FormGroup;
  let fixture: ComponentFixture<NewRequestComponent>;
  const service: MockRequestService = new MockRequestService();

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
    }).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRequestComponent);
    newRequestComponent = fixture.componentInstance;
    fixture.detectChanges();
    newRequestForm = newRequestComponent.newRequestForm;
    expect(newRequestForm).toBeDefined();
    expect(newRequestForm.controls).toBeDefined();
  });

  // Not terribly important; if the component doesn't create
  // successfully that will probably blow up a lot of things.
  // Including it, though, does give us confidence that our
  // our component definitions don't have errors that would
  // prevent them from being successfully constructed.
  it('should create the component and form', () => {
    expect(newRequestComponent).toBeTruthy();
    expect(newRequestForm).toBeTruthy();
  });

  // Confirms that an initial, empty form is *not* valid, so
  // people can't submit an empty form.
  it('form should be invalid when empty', () => {
    expect(newRequestForm.valid).toBeFalsy();
  });

  describe('The calculateHouseholdIncome method', ()=>{
    let houseSize: AbstractControl;
    beforeEach(() => {
      houseSize = newRequestForm.get('clientHouseholdSize');
    });

    it('should work with a household size of 1', ()=> {
      houseSize.setValue(1);
      expect(newRequestComponent.calculateHouseholdIncome()).toEqual('$40770');
    });

    it('should work with a household size of 2', ()=> {
      houseSize.setValue(2);
      expect(newRequestComponent.calculateHouseholdIncome()).toEqual('$54930');
    });

    it('should work with a household size of 3', ()=> {
      houseSize.setValue(3);
      expect(newRequestComponent.calculateHouseholdIncome()).toEqual('$69090');
    });

    it('should work with a household size of 4', ()=> {
      houseSize.setValue(4);
      expect(newRequestComponent.calculateHouseholdIncome()).toEqual('$83250');
    });

    it('should work with a household size of 5', ()=> {
      houseSize.setValue(5);
      expect(newRequestComponent.calculateHouseholdIncome()).toEqual('$97410');
    });

    it('should work with a household size of 6', ()=> {
      houseSize.setValue(6);
      expect(newRequestComponent.calculateHouseholdIncome()).toEqual('$111570');
    });

    it('should work with a household size of 7', ()=> {
      houseSize.setValue(7);
      expect(newRequestComponent.calculateHouseholdIncome()).toEqual('$125730');
    });

    it('should work with a household size of 8', ()=> {
      houseSize.setValue(8);
      expect(newRequestComponent.calculateHouseholdIncome()).toEqual('$139890');
    });

    it('should work with a household size of >8', ()=> {
      houseSize.setValue(10);
      expect(newRequestComponent.calculateHouseholdIncome()).toEqual('$149330');
    });

  });

  describe('The updateDiapers method', ()=>{
    it('should switch diapers from false to true', ()=> {
      newRequestComponent.diapers = false;
      newRequestComponent.updateDiapers();
      expect(newRequestComponent.diapers).toBeTrue();
    });

    it('should switch diapers from true to false', ()=> {
      newRequestComponent.diapers = true;
      newRequestComponent.updateDiapers();
      expect(newRequestComponent.diapers).toBeFalse();
    });
  });

  describe('The updateList method', ()=>{
    let testSelections = [];
    beforeEach(() => {
      testSelections = ['hotSauce', 'pintoBeans', 'tomatoSoup'];
      newRequestComponent.selections = testSelections;
    });
    it('should remove items already present in the list', ()=> {
      newRequestComponent.updateList('hotSauce');
      expect(newRequestComponent.selections.includes('hotSauce')).toBeFalse();
    });

    it('should add items not already in the list', ()=> {
      newRequestComponent.updateList('chicken');
      expect(newRequestComponent.selections.includes('chicken')).toBeTrue();
    });

    it('should behave properly when passed \'diapers\'', ()=> {
      newRequestComponent.updateList('diapers');
      expect(newRequestComponent.selections.includes('diapers')).toBeTrue();
      expect(newRequestComponent.diapers).toBeTrue();
    });
  });


  describe('The description field', () => {
    let descControl: AbstractControl;

    beforeEach(() => {
      descControl = newRequestComponent.newRequestForm.controls.misc;
    });

    it('should allow empty descriptions', () => {
      descControl.setValue('');
      expect(descControl.valid).toBeTruthy();
    });

    it('should allow descriptions with less than 5 chars', () => {
      descControl.setValue('tysm');
      expect(descControl.valid).toBeTruthy();
    });

    it('should allow digits in the description', () => {
      descControl.setValue('Bad2Th3B0ne');
      expect(descControl.valid).toBeTruthy();
    });
  });

  describe('The name field', () =>{
    let nameControl: AbstractControl;

    beforeEach(() => {
      nameControl = newRequestComponent.newRequestForm.controls.clientName;
    });

    it ('should not allow blank names', () =>{
      nameControl.setValue('');
      expect(nameControl.valid).toBeFalsy();
    });

    it ('should not allow really short names', () =>{
      nameControl.setValue('M');
      expect(nameControl.valid).toBeFalsy();
    });

    it ('should allow names between 2 and 50 characters', () =>{
      nameControl.setValue('Mason Eischens');
      expect(nameControl.valid).toBeTruthy();
    });

    it ('should not allow really long names', () =>{
      nameControl.setValue('MASON EISCHENS TO THE MOON, I LOVE DOGECOIN AND ELON MUSK WOOOOOOOO TAKE MY MONEY TESLA');
      expect(nameControl.valid).toBeFalsy();
    });
  });
  describe('The getErrorMessage method', ()=>{
    let nameControl: AbstractControl;

    beforeEach(() => {
      nameControl = newRequestComponent.newRequestForm.controls.clientName;
    });

    it('should return "unknown error" when there is not an error', ()=> {
      nameControl.setValue('Mason Eischens');
      expect(newRequestComponent.getErrorMessage('clientName') === 'Unknown error');
    });

    it('should return "required" error when name is empty', ()=> {
      nameControl.setValue('');
      expect(newRequestComponent.getErrorMessage('clientName')).toBeTruthy();
    });

    it('should return "minlength" error when name too short', ()=> {
      nameControl.setValue('A');
      expect(newRequestComponent.getErrorMessage('clientName')).toBeTruthy();
    });

    it('should return "maxlength" error when name is too long', ()=> {
      nameControl.setValue('MASON EISCHENS TO THE MOON, I LOVE DOGECOIN AND ELON MUSK WOOOOOOOO TAKE MY MONEY TESLA');
      expect(newRequestComponent.getErrorMessage('clientName')).toBeTruthy();
    });
  });

  describe('Can we submit stuff to the client database?', ()=>{
    let nameControl: AbstractControl;

    beforeEach(() => {
      nameControl = newRequestForm.controls.clientName;
    });

    it('should not get angy', ()=> {
      nameControl.setValue('Mr. Rogers');
      newRequestComponent.selections = ['hotSauce', 'bdayPartyKit'];
      newRequestComponent.submitForm();

      expect(service.addedClientRequests[0].selections.includes('hotSauce')).toBeTruthy();
    });
  });

  describe('Can we submit stuff to the donor database?', ()=>{
    let nameControl: AbstractControl;

    beforeEach(() => {
      nameControl = newRequestForm.controls.clientName;
    });

    it('should not get angy', ()=> {
      newRequestComponent.destination = 'donor';

      nameControl.setValue('Mr. Rogers');
      newRequestComponent.selections = ['hotSauce', 'bdayPartyKit'];
      newRequestComponent.submitForm();

      expect(service.addedClientRequests[0].name).toEqual('Mr. Rogers');
      expect(service.addedClientRequests[0].selections.includes('hotSauce')).toBeTruthy();
    });
  });
});

describe('Misbehaving request service', () => {
  let descControl: AbstractControl;
  let newRequestComponent: NewRequestComponent;
  let newRequestForm: FormGroup;
  let fixture: ComponentFixture<NewRequestComponent>;

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
      declarations: [NewRequestComponent]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(NewRequestComponent);
      newRequestComponent = fixture.componentInstance;
      fixture.detectChanges();
      newRequestForm = newRequestComponent.newRequestForm;
      expect(newRequestForm).toBeDefined();
      expect(newRequestForm.controls).toBeDefined();

      descControl = newRequestComponent.newRequestForm.controls.misc;
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRequestComponent);
    newRequestComponent = fixture.componentInstance;
    fixture.detectChanges();
    newRequestForm = newRequestComponent.newRequestForm;
    expect(newRequestForm).toBeDefined();
    expect(newRequestForm.controls).toBeDefined();
  });

  it('should get angy when talking with the donor database', ()=> {
    newRequestComponent.destination = 'donor';


    descControl.setValue('this is a description I guess');

    newRequestComponent.submitForm();
  });

  it('should get angy when talking with the client database', ()=> {
    newRequestComponent.destination = 'client';


    descControl.setValue('this is a description I guess');

    newRequestComponent.submitForm();
  });


  describe('The updateDiapers method', ()=>{

    beforeEach(() => {
      newRequestComponent.diapers = false;
    });

    it('correctly changes diapers to true when it\'s false', ()=> {
      newRequestComponent.updateDiapers();
      expect(newRequestComponent.diapers).toBeTruthy();
    });

    it('correctly changes diapers to false when it\'s true', ()=> {
      newRequestComponent.diapers = true;
      newRequestComponent.updateDiapers();
      expect(newRequestComponent.diapers).toBeFalsy();
    });

  });

  describe('The updateList method', ()=>{

    beforeEach(() => {
      newRequestComponent.selections = ['hotSauce', 'rice', 'bread'];
    });

    it('correctly adds items to selections', ()=> {
      newRequestComponent.updateList('tomatoSoup');
      expect(newRequestComponent.selections.includes('tomatoSoup')).toBeTruthy();
    });

    it('correctly removes items from selections', ()=> {
      newRequestComponent.updateList('hotSauce');
      expect(newRequestComponent.selections.includes('hotSauce')).toBeFalsy();
    });

    it('behaves correctly when newItem = diapers', ()=> {
      newRequestComponent.updateList('diapers');
      expect(newRequestComponent.diapers).toBeTruthy();
    });

  });

  describe('The formatDate method', ()=>{

    beforeEach(() => {
      newRequestComponent.selections = ['hotSauce', 'rice', 'bread'];
    });

    it('should work with a long month and a long day', ()=> {
      const output = newRequestComponent.formatDate('12', '12').substring(4, 8);
      expect(output === '1212').toBeTruthy();
    });

    it('should work with a long month and a short day', ()=> {
      const output = newRequestComponent.formatDate('12', '2').substring(4, 8);
      expect(output === '1202').toBeTruthy();
    });

    it('should work with a short month and a long day', ()=> {
      const output = newRequestComponent.formatDate('4', '12').substring(4, 8);
      expect(output === '0412').toBeTruthy();
    });

    it('should work with a short month and a short day', ()=> {
      const output = newRequestComponent.formatDate('2', '2').substring(4, 8);
      expect(output === '0202').toBeTruthy();
    });

  });


});


