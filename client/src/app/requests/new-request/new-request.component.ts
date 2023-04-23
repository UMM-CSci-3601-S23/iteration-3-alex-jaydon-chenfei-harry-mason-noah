import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RequestService } from '../request.service';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.scss']
})
export class NewRequestComponent {

  @Input() destination: 'client' | 'donor' = 'client';

  newRequestForm = this.formBuilder.group({
    clientName:['', Validators.compose([
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50),
    ])],
    clientHouseholdSize: [1, Validators.compose([
      Validators.required,
      Validators.min(1),
      Validators.pattern('^(\\d*)$'),
      // need a validator for it being something thats not a number
    ])],
    incomeValid: ['false', Validators.compose([
      Validators.required,
    ])],
    diaperSize: new FormControl({value: '0', disabled: true}),
    misc: ''
  });

  readonly newRequestValidationMessages = {
    clientName: [
      { type: 'required', message: 'Name is required' },
      { type: 'minlength', message: 'Name must be at least 2 characters long' },
      { type: 'maxlength', message: 'Name cannot be more than 50 characters long' },
    ],
    clientHouseholdSize: [
      { type: 'required', message: 'Household size is required' },
      { type: 'min', message: 'Household size needs to be at least 1 ' },
      { type: 'pattern', message: 'Household size must be a number'}
      // need a validator message for it being something thats not a number
    ],
    incomeValid:[
      { type: 'required', message: 'Household income validity is required ' +
      '/n **Note, you can still make a request even if you do not meet validity standards' },
    ]
    /*description: [
      { type: 'maxlength', message: 'Description cannot be more than 200 characters long' },
    ],*/
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

  calculateHouseholdIncome(): string{
    const pop = this.newRequestForm.get('clientHouseholdSize').getRawValue();
    if (pop === 1) {
      return '$40770';
    } else if (pop === 2) {
      return '$54930';
    } else if (pop === 3) {
      return '$69090';
    } else if (pop === 4) {
      return '$83250';
    } else if (pop === 5) {
      return '$97410';
    } else if (pop === 6) {
      return '$111570';
    } else if (pop === 7) {
      return '$125730';
    } else if (pop === 8) {
      return '$139890';
    } else {
      return '$' + (139890 + (pop - 8) * 4720).toString();
    }
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
      name: this.newRequestForm.get('clientName').getRawValue(),
      incomeValid: this.newRequestForm.get('incomeValid').getRawValue(),
      dateAdded: this.formatDate((this.date.getMonth() + 1).toString(), this.date.getDate().toString()),
      description: this.newRequestForm.get('misc').getRawValue(),
      selections: this.selections,
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
