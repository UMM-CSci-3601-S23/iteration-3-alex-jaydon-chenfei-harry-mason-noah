import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';
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
  router: any;
  itemType: any;

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



  constructor(private snackBar: MatSnackBar, private route: ActivatedRoute, private requestService: RequestService,
    private formBuilder: FormBuilder) {
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
    this.requestService.addDonorRequest(this.editRequestForm.value).subscribe({
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

  setRequestValues(request: Request): void {
    console.log('THIS IS THE REQUEST:');
    console.log(request);
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


  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
