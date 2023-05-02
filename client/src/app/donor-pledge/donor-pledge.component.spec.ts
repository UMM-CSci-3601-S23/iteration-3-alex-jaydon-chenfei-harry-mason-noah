import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorPledgeComponent } from './donor-pledge.component';

describe('DonorPledgeComponent', () => {
  let component: DonorPledgeComponent;
  let fixture: ComponentFixture<DonorPledgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonorPledgeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonorPledgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
