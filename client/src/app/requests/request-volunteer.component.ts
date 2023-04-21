import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Request, ItemType, FoodType } from './request';
import { RequestService } from './request.service';


@Component({
  selector: 'app-request-volunteer',
  templateUrl: './request-volunteer.component.html',
  styleUrls: ['./request-volunteer.component.scss'],
  providers: []
})

export class RequestVolunteerComponent implements OnInit, OnDestroy {
  @Input() request: Request;
  public serverFilteredRequests: Request[] = [];
  public filteredRequests: Request[];
  public requestItemType: ItemType;
  public requestDescription: string;
  public requestFoodType: FoodType;
  public sortedRequests: Request[];

  authHypothesis: boolean;

  private ngUnsubscribe = new Subject<void>();


  constructor(private requestService: RequestService, private snackBar: MatSnackBar) {
  }
  //Gets the requests from the server with the correct filters
  getRequestsFromServer(): void {
    this.requestService.getClientRequests({
      itemType: this.requestItemType,
      foodType: this.requestFoodType
    }).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (returnedRequests) => {
        this.serverFilteredRequests = returnedRequests;
      },

      error: (err) => {
        this.snackBar.open(
          `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`,
          'OK',
          {duration: 5000});
      },
    });
  }
  //
  public updateFilter(): void {
    this.filteredRequests = this.serverFilteredRequests;
  }

  updateRequestPriority(reqeust: Request, priority: string){
    this.requestService
    .addRequestPriority(this.request, priority)
    .subscribe({
      next: () => {
        this.updateFilter();
      }
    });
  }

  ngOnInit(): void {
    this.getRequestsFromServer();
    this.authHypothesis = document.cookie.includes('auth_token');
}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  public deleteRequest(request: Request): void {
    this.requestService.deleteClientRequest(request).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (returnedRequests) => {
        this.getRequestsFromServer();
      },

      error: (err) => {
        this.snackBar.open(
          `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`,
          'OK',
          {duration: 5000});
      },
    });
  }
  public postRequest(request: Request): void {
    const strippedRequest: Partial<Request> = {...request};
    delete strippedRequest._id;
    this.requestService.addDonorRequest(strippedRequest).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (returnedRequests) => {
        this.requestService.deleteClientRequest(request).subscribe({
          next: (_) => { this.getRequestsFromServer(); },
          error: (err) => {
            this.snackBar.open(
              `Problem contacting the server to delete request – Error Code: ${err.status}\nMessage: ${err.message}`,
              'OK',
              {duration: 5000});
          },
        });

      },

      error: (err) => {
        this.snackBar.open(
          `Problem contacting the server to add request – Error Code: ${err.status}\nMessage: ${err.message}`,
          'OK',
          {duration: 5000});
      },
    });
  }
}

