import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map, Subject, switchMap, takeUntil } from 'rxjs';
import { Request } from '../requests/request';
import { RequestService } from '../requests/request.service';
import { TimeSlot } from './pledge';


@Component({
  selector: 'app-donor-pledge',
  templateUrl: './donor-pledge.component.html',
  styleUrls: ['./donor-pledge.component.scss']
})

export class DonorPledgeComponent implements OnInit, OnDestroy{
  request: Request;
  timeSlot: any;



  newPledgeForm = new FormGroup({
    // We want comments to be short and sweet, yet still required so we have at least some idea what
    // the client wants
    comment: new FormControl('', Validators.compose([
      Validators.maxLength(200),
    ])),

    timeSlot: new FormControl<TimeSlot>('',Validators.compose([
      Validators.required,
      Validators.pattern('^(Monday|Tuesday|Wednesday|Thursday|Friday)$'),
    ])),

    name: new FormControl('', Validators.compose([
      Validators.required,
      Validators.pattern('^[A-Za-z ]+$'),
    ])),

    amount: new FormControl<number>(0, Validators.compose([
      Validators.required,
      Validators.min(1),
      this.maxAmountValidator(0),
    ])),

    requestId: new FormControl('', Validators.required),
  });

  readonly newRequestValidationMessages = {
    comment: [
      {type: 'maxlength', message: 'Comment cannot be more than 200 characters long'},
    ],
    timeSlot: [
      { type: 'required', message: 'Timeslot is required' },
      { type: 'pattern', message: 'Choose one of the weekdays' },
    ],
    name: [
      { type: 'required', message: 'Preferred name is required' },
      { type: 'pattern', message: 'Only letters allowed' },
    ],
    amount:[
      { type: 'required', message: 'The amount is required' },
      { type: 'min', message: 'The amount can not be less than 1' },
      { type: 'maxAmount', message: 'The amount cannot be greater than the current amount needed' },
    ]
  };
  private ngUnsubscribe = new Subject<void>();



  constructor(private snackBar: MatSnackBar, private route: ActivatedRoute, private requestService: RequestService ) {
  }

  formControlHasError(controlName: string): boolean {
    return this.newPledgeForm.get(controlName).invalid &&
      (this.newPledgeForm.get(controlName).dirty || this.newPledgeForm.get(controlName).touched);
  }
  getErrorMessage(name: string): string {
    for (const { type, message } of this.newRequestValidationMessages[name]) {
      if (this.newPledgeForm.get(name).hasError(type)) {
        return message;
      }
    }
    return 'Unknown error';
  }

  maxAmountValidator(maxAmount: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value > maxAmount) {
        return { maxAmount: true };
      }
      return null;
    };
  }

  submitForm() {
    this.requestService.addDonorPledge(this.newPledgeForm.value).subscribe({
      next: (newId) => {
        const name = this.newPledgeForm.get('name').value;
        const timeSlot = this.newPledgeForm.get('timeSlot').value;
        this.snackBar.open(
          `Dear ${name}, thank you so much for your generous pledge!
          We truly appreciate your support and can't wait to welcome you on ${timeSlot}.`,
          null,
          { duration: 10000 }
        );
      },
      error: err => {
        this.snackBar.open(
          `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`,
          'OK',
          { duration: 5000 }
        );
      },
      // complete: () => console.log('Add user completes!')
    });
  }

  setRequestValues(request: Request): void {
    console.log('THIS IS THE REQUEST:');
    console.log(request);
    this.request = request;
    this.newPledgeForm.get('requestId').setValue(request._id);

    // Update the max amount for the amount FormControl
    const currentAmount = request.amount;
    this.newPledgeForm.get('amount').setValidators([
      Validators.required,
      Validators.min(1),
      this.maxAmountValidator(currentAmount),
    ]);
    this.newPledgeForm.get('amount').updateValueAndValidity();
  }



  ngOnInit(): void {
    this.route.paramMap.pipe(
      //Map the paramMap into the id
      map((paramMap: ParamMap) => paramMap.get('id')),
      //maps the id string to the Observable<Request>
      switchMap((id: string) => this.requestService.getDonorRequestById(id)),
      //Allows the pipeline to continue until 'this.ngUnsubscribe' emits a value
      //It then destroys the pipeline
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: request => {
        this.setRequestValues(request);
      },
      error: _err => {
        /*(this.snackbar.open('Problem loading the Request – try again', 'OK', {
          duration: 5000,
        }); */
      }
    });


  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
