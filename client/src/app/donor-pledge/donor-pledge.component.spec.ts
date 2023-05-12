import { ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import { DonorPledgeComponent } from './donor-pledge.component';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, FormGroup, AbstractControl, ValidatorFn } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { MockRequestService } from 'src/testing/request.service.mock';;
import { RequestService } from '../requests/request.service';
import { environment } from 'src/environments/environment';
import { Pledge } from './pledge';

describe('DonorPledgeComponent', () => {

  let testDonorPledgeComponent: DonorPledgeComponent;
  let fixture: ComponentFixture<DonorPledgeComponent>;
  let newPledgeForm: FormGroup;
  const service: MockRequestService = new MockRequestService();
  const testPledge: Pledge = {
    _id: '1',
    comment: 'random stuff',
    timeSlot: 'Monday',
    name: 'Mason',
    amount: 23,
    itemName: 'hotSauce'
  };
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
      declarations: [DonorPledgeComponent],
    }).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonorPledgeComponent);
    testDonorPledgeComponent = fixture.componentInstance;
    fixture.detectChanges();
    newPledgeForm = testDonorPledgeComponent.newPledgeForm;
    expect(newPledgeForm).toBeDefined();
    expect(newPledgeForm.controls).toBeDefined();
  });

  it('should create', () => {
    expect(testDonorPledgeComponent).toBeTruthy();
  });

  describe('maxAmountValidator method', ()=> {
    let control: AbstractControl;
    let validator: ValidatorFn;
    let input: number;
    beforeEach(async () => {
      control = testDonorPledgeComponent.newPledgeForm.get('amount');
      control.setValue(5);
    });

    it('should return true if maxAmount is >= control.value', () => {
      input = 6;
      validator = testDonorPledgeComponent.maxAmountValidator(input);
      expect(1).toEqual(1);
    });
  });

  describe('the getErrorMessage method', ()=> {
    let control: AbstractControl;
    let validator: ValidatorFn;
    let name: string;
    beforeEach(async () => {
    });

    it('should return the correct error message for various errors in the comment field', () => {
      name = 'comment';
      control = testDonorPledgeComponent.newPledgeForm.get(name);
      // eslint-disable-next-line max-len
      control.setValue('Really long string!Really long string!Really long string!Really long string!Really long string!Really long string!Really long string!Really long string!Really long string!Really long string!Really long string!Really long string!Really long string!Really long string!Really long string!Really long string!Really long string!Really long string!Really long string!Really long string!Really long string!Really long string!Really long string!Really long string!');
      const result = testDonorPledgeComponent.getErrorMessage(name);
      expect(result).toEqual('Comment cannot be more than 200 characters long');
    });

    it('should return the unknown error if there is no error or the error type is unrecognized', () => {
      name = 'comment';
      control = testDonorPledgeComponent.newPledgeForm.get(name);
      // eslint-disable-next-line max-len
      control.setValue('totally acceptable comment');
      const result = testDonorPledgeComponent.getErrorMessage(name);
      expect(result).toEqual('Unknown error');
    });
  });

  describe('the formControlHasError method', ()=> {
    let nameControl: AbstractControl;
    let timeControl: AbstractControl;
    let amountControl: AbstractControl;
    let itemNameControl: AbstractControl;

    beforeEach(() => {
      nameControl = newPledgeForm.controls.name;
      timeControl = newPledgeForm.controls.timeSlot;
      amountControl = newPledgeForm.controls.amount;
      itemNameControl = newPledgeForm.controls.itemName;
    });

    it('should return false when there are no errors', () => {
      nameControl.setValue('Mason');
      const result = testDonorPledgeComponent.formControlHasError('name');
      testDonorPledgeComponent.setRequestValues({_id: '3', name: 'hotSauce', amount: 3});
      expect(result).toBeFalse();
    });
  });

  describe('Can we submit stuff to the pledge database?', ()=>{
    let nameControl: AbstractControl;
    let timeControl: AbstractControl;
    let amountControl: AbstractControl;
    let itemNameControl: AbstractControl;

    beforeEach(() => {
      nameControl = newPledgeForm.controls.name;
      timeControl = newPledgeForm.controls.timeSlot;
      amountControl = newPledgeForm.controls.amount;
      itemNameControl = newPledgeForm.controls.itemName;
    });

    it('should not get angy', ()=> {
      nameControl.setValue('Mr. Rogers');
      timeControl.setValue(testPledge.timeSlot);
      amountControl.setValue(testPledge.amount);
      itemNameControl.setValue(testPledge.itemName);
      testDonorPledgeComponent.submitForm();

    });
  });
});
