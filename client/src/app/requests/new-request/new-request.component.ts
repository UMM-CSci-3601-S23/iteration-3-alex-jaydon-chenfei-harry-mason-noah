import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FoodType } from '../request';
import { ItemType } from '../request';
import { RequestService } from '../request.service';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.scss']
})
export class NewRequestComponent {

  @Input() destination: 'client' | 'donor' = 'client';
  public type: ItemType = 'food';

  newRequestForm = this.formBuilder.group({
    clientName:['', Validators.compose([
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50),
    ])],
    diaperSize: new FormControl({value: '0', disabled: true}),
    misc: ''
  });

  /*newRequestForm = new FormGroup({
    // We want descriptions to be short and sweet, yet still required so we have at least some idea what
    // the client wants
    description: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(200),
    ])),

    itemType: new FormControl<ItemType>('food', Validators.compose([
      Validators.required,
      Validators.pattern('^(food|toiletries|other)$'),
    ])),

    foodType: new FormControl<FoodType>('', Validators.compose([
      Validators.pattern('^(dairy|grain|meat|fruit|vegetable|)$'),
    ])),
  });*/

  readonly newRequestValidationMessages = {
    clientName: [
      { type: 'required', message: 'Name is required' },
      { type: 'minlength', message: 'Name must be at least 2 characters long' },
      { type: 'maxlength', message: 'Name cannot be more than 50 characters long' },
    ],
    description: [
      { type: 'required', message: 'Description is required' },
      { type: 'minlength', message: 'Description must be at least 5 characters long' },
      { type: 'maxlength', message: 'Description cannot be more than 200 characters long' },
    ],
    itemType: [
      { type: 'required', message: 'Item type is required' },
      { type: 'pattern', message: 'Item type must be food, toiletries, or other' },
    ],
    foodType: [
      { type: 'pattern', message: 'Food type must be one of dairy, grain, meat, fruit, or vegetable' },
    ]
  };

  selections: string[] = new Array();
  isLinear = false;
  diapers = false;
  diaperSize = '1';
  date: Date = new Date();
  done = false;

  constructor(private formBuilder: FormBuilder, private requestService: RequestService, private snackBar: MatSnackBar,
    private router: Router) {
  }

  formControlHasError(controlName: string): boolean {
    return this.newRequestForm.get(controlName).invalid &&
      (this.newRequestForm.get(controlName).dirty || this.newRequestForm.get(controlName).touched);
  }

  getErrorMessage(name: string): string {
    for (const { type, message } of this.newRequestValidationMessages[name]) {
      if (this.newRequestForm.get(name).hasError(type)) {
        return message;
      }
    }
    return 'Unknown error';
  }

  submitForm() {
    const newRequest = {
      selections: this.selections,
      dateAdded: this.formatDate(this.date.getMonth().toString(), this.date.getDate().toString()),
      name: this.newRequestForm.get('clientName').getRawValue(),
      description: this.newRequestForm.get('misc').getRawValue(),
      diaperSize: (this.diapers ? this.newRequestForm.controls.diaperSize.getRawValue() : undefined)
    };
    console.log(newRequest);
    if (this.destination === 'client') {
      this.requestService.addClientRequest(newRequest).subscribe({
        next: (newId) => {
          this.snackBar.open(
            `Request successfully submitted`,
            null,
            { duration: 2000 }
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
//this if statement checks if destination is set to donor. Destination is set in the
//html of the request-volunteer component.
    if (this.destination === 'donor') {
      this.requestService.addDonorRequest(newRequest).subscribe({
        next: (newId) => {
          this.snackBar.open(
            `Request successfully submitted`,
            null,
            { duration: 2000 }
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
  }



  updateDiapers(): void{
    if (this.diapers){
      this.diapers = false;
      this.newRequestForm.get('diaperSize')?.disable();
    }
    else {
      this.diapers = true;
      this.newRequestForm.get('diaperSize')?.enable();
    }
  }

  updateList(newItem: string): void{
    if (newItem === 'diapers'){
      this.updateDiapers();
    }
    if (this.selections.length !== 0 && this.selections.includes(newItem)){
      this.selections.splice(this.selections.indexOf(newItem));
    }
    else{
      this.selections.push(newItem);
    }
    console.log(this.selections);
    console.log(this.newRequestForm.controls.diaperSize.getRawValue());
  }

  formatDate(month: string, day: string): string{
    if (month.length !== 2){
      month = '0' + month;
    }
    if (day.length !== 2){
      day = '0' + day;
    }
    return this.date.getFullYear().toString()+  month + day;
  }
}
