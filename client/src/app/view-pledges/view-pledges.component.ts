import { Component, OnInit } from '@angular/core';
import { RequestService } from '../requests/request.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Pledge } from '../donor-pledge/pledge';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-view-pledges',
  templateUrl: './view-pledges.component.html',
  styleUrls: ['./view-pledges.component.scss']
})
export class ViewPledgesComponent implements OnInit {

  public pledges: Pledge[];
  private ngUnsubscribe = new Subject<void>();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  authHypothesis: boolean;

  constructor(public requestService: RequestService, private snackBar: MatSnackBar) {
  }

  getPledgesFromServer(): void {
    this.requestService.getPledges(
    ).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (returnedPledges) => {
        this.pledges = returnedPledges;
      },

      error: (err) => {
        this.snackBar.open(
          `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`,
          'OK',
          {duration: 5000});
      },
    });
  }

  public deletePledge(pledge: Pledge): void {
    this.requestService.deletePledge(pledge).pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (returnedRequests) => {
        this.getPledgesFromServer();
      },

      error: (err) => {
        this.snackBar.open(
          `Problem contacting the server – Error Code: ${err.status}\nMessage: ${err.message}`,
          'OK',
          {duration: 5000});
      },
    });
  }

  ngOnInit(): void {
    this.getPledgesFromServer();
    this.authHypothesis = document.cookie.includes('auth_token');
}
}
