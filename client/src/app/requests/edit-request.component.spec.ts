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


    it('should fill in values properly', ()=> {
      editRequestComponent.setRequestValues({
        _id: '588935f57546a2daea44de7c',
        name: 'joe',
        fulfilled: [],
        incomeValid: 'true',
        dateAdded: '13980507',
        description: 'This is a test edit',
        priority: 1,
        archived: 'true'
      });
      descControl.setValue('This is a test edit');
      // expect(itemTypeControl.value === 'food').toBeTrue();
      // expect(foodTypeControl.value === 'fruit').toBeTrue();
      expect(descControl.value === 'This is a test edit').toBeTrue();
    });
  });
});












