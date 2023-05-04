import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPledgesComponent } from './view-pledges.component';

describe('ViewPledgesComponent', () => {
  let component: ViewPledgesComponent;
  let fixture: ComponentFixture<ViewPledgesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPledgesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPledgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
