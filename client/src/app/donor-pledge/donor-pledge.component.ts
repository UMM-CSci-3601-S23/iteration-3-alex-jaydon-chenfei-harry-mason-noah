import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map, Subject, switchMap, takeUntil } from 'rxjs';
import { RequestService } from '../requests/request.service';
import { TimeSlot } from './pledge';
import { RequestedItem } from '../requests/requestedItem';



@Component({
  selector: 'app-donor-pledge',
  templateUrl: './donor-pledge.component.html',
  styleUrls: ['./donor-pledge.component.scss']
})

export class DonorPledgeComponent implements OnInit, OnDestroy{
  item: RequestedItem;
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
    itemName: new FormControl('', Validators.required),
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
      { type: 'maxAmount', message: 'The amount cannot be greater than the current amount needed' }
    ]
  };
  private ngUnsubscribe = new Subject<void>();



  // eslint-disable-next-line max-len
  constructor(private router: Router, private snackBar: MatSnackBar, private route: ActivatedRoute, public requestService: RequestService ) {
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
    this.newPledgeForm.get('itemName').setValue(this.item.name);
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
        this.router.navigate(['/requests/donor']);
      },
      error: err => {
        this.snackBar.open(
          `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`,
          'OK',
          { duration: 5000 }
        );
      },
    });
  }

  setRequestValues(item: RequestedItem): void {
    this.item = item;
    this.newPledgeForm.get('itemName').setValue(item.name);

    // Update the max amount for the amount FormControl
    const currentAmount = item.amount;
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
      switchMap((id: string) => this.requestService.getRequestedItemById(id)),
      //Allows the pipeline to continue until 'this.ngUnsubscribe' emits a value
      //It then destroys the pipeline
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: item => {
        this.setRequestValues(item);
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
