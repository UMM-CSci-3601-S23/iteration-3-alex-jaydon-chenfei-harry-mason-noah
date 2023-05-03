import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { Request } from './request';
import { RequestService } from './request.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-request-volunteer',
  templateUrl: './request-volunteer.component.html',
  styleUrls: ['./request-volunteer.component.scss'],
  providers: []
})

export class RequestVolunteerComponent implements OnInit, OnDestroy {
  public serverFilteredRequests: Request[];
  public filteredRequests: Request[];
  public requestDescription: string;
  public readableRequests: Request[];
  public sortedRequests: Request[];


  authHypothesis: boolean;

  private ngUnsubscribe = new Subject<void>();
// eslint-disable-next-line @typescript-eslint/member-ordering

  constructor(public requestService: RequestService, private snackBar: MatSnackBar) {
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.filteredRequests, event.previousIndex, event.currentIndex);
    this.updatePriorities();
  }

  // Add this method for updating priorities based on the new order of the cards
  updatePriorities(): void {
    this.filteredRequests.forEach((request, index) => {
      const newPriority = index + 1;
      if (request.priority !== newPriority) {
        request.priority = newPriority;
        this.updateRequestPriority(request, newPriority);
      }
    });
  }
  //Gets the requests from the server with the correct filters
  getRequestsFromServer(): void {
    this.requestService.getClientRequests({
      description: this.requestDescription
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

  updateRequestPriority(reqeust: Request, priority: number){
    this.requestService
    .addRequestPriority(this.request, priority)
    .subscribe({
      next: () => {
        this.updateFilter();
      }
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
  // MAY NOT BE NECESSARY
  sortRequestsByPriority(): void {
    this.filteredRequests.sort((a, b) => a.priority - b.priority);
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
}

