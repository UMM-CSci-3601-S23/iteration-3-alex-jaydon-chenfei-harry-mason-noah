import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { Request } from './request';
import { RequestService } from './request.service';
import { RequestedItem } from './requestedItem';


@Component({
  selector: 'app-request-donor',
  templateUrl: './request-donor.component.html',
  styleUrls: ['./request-donor.component.scss'],
  providers: []
})

export class RequestDonorComponent implements OnInit, OnDestroy {
  @Input() simple?: boolean = false;

  public serverFilteredItems: RequestedItem[];
  public filteredRequests: RequestedItem[];
  public itemName: string;
  // public readableRequests: Request[];

  authHypothesis: boolean;

  private ngUnsubscribe = new Subject<void>();

  constructor(public requestService: RequestService, private snackBar: MatSnackBar) {
  }
  //Gets the requests from the server with the correct filters
  getRequestsFromServer(): void {
    this.requestService.getDonorRequests({
      name: this.itemName
    }).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (returnedRequests) => {
        this.serverFilteredItems = returnedRequests;
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
    this.filteredRequests = this.serverFilteredItems;
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
    this.requestService.deleteDonorRequest(request).pipe(
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

