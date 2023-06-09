import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Request } from './request';
import { RequestService } from './request.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


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
  public requestDescription: string;
  public archiveView: string;
  public sortedRequests: Request[];

  authHypothesis: boolean;

  private ngUnsubscribe = new Subject<void>();
// eslint-disable-next-line @typescript-eslint/member-ordering

  constructor(public requestService: RequestService, private snackBar: MatSnackBar) {
  }

  updatePriorities(): void {
    this.filteredRequests.forEach((request, index) => {
      const newPriority = index + 1;
      if (request.priority !== newPriority) {
        request.priority = newPriority;
        this.updateRequestPriority(request, newPriority);
      }
    });
  }

  public markAsComplete(request: Request): void {
    this.requestService.markRequestAsComplete(request).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (updatedRequest) => {
        this.snackBar.open(
          `Request successfully archived`,
          'OK',
          {duration: 5000});
        this.getRequestsFromServer();
      },
      error: (err) => {
        this.snackBar.open(
          `Problem contacting the server to mark request as complete – Error Code: ${err.status}\nMessage: ${err.message}`,
          'OK',
          {duration: 5000});
      },
    });
  }
  //Gets the requests from the server with the correct filters
  getRequestsFromServer(): void {
    this.requestService.getClientRequests({
      description: this.requestDescription,
      archived: this.archiveView
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


  addRequestPriority(request: Request, priority: number): Observable<number> {
    return this.requestService.addRequestPriority(request, priority).pipe(
      map(() => priority)
    );
  }



  updateRequestPriority(request: Request, priority: number) {
    this.addRequestPriority(request, priority).subscribe({
      next: () => {
        this.updateFilter();
      },
    });
  }


  setRequestPriority(request: Request, priority: number): void {
    this.requestService.addRequestPriority(request, priority).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: () => {
        this.getRequestsFromServer();
      },
      error: (err) => {
        this.snackBar.open(
          `Problem contacting the server to update priority – Error Code: ${err.status}\nMessage: ${err.message}`,
          'OK',
          {duration: 5000});
      },
    });
  }

  ngOnInit(): void {
    this.archiveView = 'false';
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

