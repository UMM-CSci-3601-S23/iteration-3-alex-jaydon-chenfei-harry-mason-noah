import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ViewPledgesComponent } from './view-pledges.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RequestService } from '../requests/request.service';
import { MockRequestService } from 'src/testing/request.service.mock';
import { Pledge } from '../donor-pledge/pledge';

describe('ViewPledgesComponent', () => {
  let viewPledgesComponent: ViewPledgesComponent;
  let fixture: ComponentFixture<ViewPledgesComponent>;
  const testPledge: Pledge = {
    _id: '2',
    comment: 'hahah',
    timeSlot: 'Monday',
    name: 'Mason',
    amount: 4,
    itemName: 'hotSauce'
  };
  const COMMON_IMPORTS: unknown[] = [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatInputModule,
    MatExpansionModule,
    MatTooltipModule,
    MatListModule,
    MatDividerModule,
    MatRadioModule,
    MatIconModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    RouterTestingModule,
  ];

  const service = new MockRequestService();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [ViewPledgesComponent],
      providers: [{ provide: RequestService, useValue: service }]
    });
  });

  beforeEach(waitForAsync (() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ViewPledgesComponent);
      viewPledgesComponent = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  describe('Get pledges from server method', ()=> {
    it('contains all pledges', () => {
      viewPledgesComponent.getPledgesFromServer();
      expect(viewPledgesComponent.pledges.length).toBe(1);
    });
  });

  describe('deletePledge method', ()=> {
    it('deletes pledges', () => {
      viewPledgesComponent.deletePledge(testPledge);
    });
  });
});
