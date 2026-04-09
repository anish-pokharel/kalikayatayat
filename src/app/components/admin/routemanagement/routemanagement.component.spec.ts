import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutemanagementComponent } from './routemanagement.component';

describe('RoutemanagementComponent', () => {
  let component: RoutemanagementComponent;
  let fixture: ComponentFixture<RoutemanagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutemanagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoutemanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
