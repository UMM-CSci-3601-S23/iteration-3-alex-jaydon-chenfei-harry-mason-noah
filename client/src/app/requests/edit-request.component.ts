import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { map, Subject, switchMap, takeUntil } from 'rxjs';
import { Request } from './request';
import { RequestVolunteerComponent } from './request-volunteer.component';
import { RequestService } from './request.service';

@Component({
  selector: 'app-edit-request',
  templateUrl: './edit-request.component.html',
  styleUrls: ['./edit-request.component.scss'],
  providers: [RequestVolunteerComponent]
})

export class EditRequestComponent implements OnInit, OnDestroy{
  request: Request;
  itemType: any;
  fulfilled: string[];
  checked: true;
  editRequestForm = this.formBuilder.group({
    clientName:['', Validators.compose([
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50),
    ])],
    diaperSize: new FormControl({value: '0', disabled: true}),
    description: ''
  });

  readonly editRequestValidationMessages = {
    clientName: [
      { type: 'required', message: 'Name is required' },
      { type: 'minlength', message: 'Name must be at least 2 characters long' },
      { type: 'maxlength', message: 'Name cannot be more than 50 characters long' },
    ]
  };
  private ngUnsubscribe = new Subject<void>();



  constructor(private snackBar: MatSnackBar, private route: ActivatedRoute, public requestService: RequestService,
    private formBuilder: FormBuilder, private router: Router) {
  }

  formControlHasError(controlName: string): boolean {
    return this.editRequestForm.get(controlName).invalid &&
      (this.editRequestForm.get(controlName).dirty || this.editRequestForm.get(controlName).touched);
  }

  getErrorMessage(name: string): string {
    for (const { type, message } of this.editRequestValidationMessages[name]) {
      if (this.editRequestForm.get(name).hasError(type)) {
        return message;
      }
    }
    return 'Unknown error';
  }

  submitForm() {
    const newRequest = {
      _id: this.request._id,
      name: this.editRequestForm.get('clientName').getRawValue(),
      incomeValid: this.request.incomeValid,
      dateAdded: this.request.dateAdded,
      description: this.editRequestForm.get('description').getRawValue(),
      selections: this.request.selections,
      fulfilled: this.request.fulfilled,
      diaperSize: (this.request.selections.includes('diapers') ? this.request.diaperSize : undefined)
    };
    this.requestService.updateRequest(newRequest).subscribe({
      next: () => {
        this.snackBar.open(
          `Request successfully saved`,
          null,
          { duration: 2000 }
        );
        this.router.navigate(['/requests/volunteer']);
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

  setRequestValues(request: Request): void {
    this.request = request;
    this.editRequestForm.get('clientName').setValue(this.request.name);
    this.editRequestForm.get('description').setValue(this.request.description);
  }



  ngOnInit(): void {
    this.route.paramMap.pipe(
      //Map the paramMap into the id
      map((paramMap: ParamMap) => paramMap.get('id')),
      //maps the id string to the Observable<Request>
      switchMap((id: string) => this.requestService.getRequestById(id)),
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
    this.fulfilled = [''];
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  updateFulfilled(item: string): void {
    if (!this.request.fulfilled.includes(item)){
      this.request.fulfilled.push(item);
    }
    else{
      this.request.fulfilled.splice(this.request.fulfilled.indexOf(item), 1);
    }
  }

  postRequest(itemName: string): void {
    const newItem = {
      name: itemName,
      amount: 1,
    };
    this.requestService.addDonorItem(newItem).subscribe({
      next: () => {
        this.snackBar.open(
          `Item successfully posted to donor`,
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
    });
  }

}
