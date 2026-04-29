import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterNewBookingComponent } from './counter-new-booking.component';

describe('CounterNewBookingComponent', () => {
  let component: CounterNewBookingComponent;
  let fixture: ComponentFixture<CounterNewBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounterNewBookingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CounterNewBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
