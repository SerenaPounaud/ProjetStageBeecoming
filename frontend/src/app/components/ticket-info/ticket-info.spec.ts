import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketInfo } from './ticket-info';

describe('TicketInfo', () => {
  let component: TicketInfo;
  let fixture: ComponentFixture<TicketInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
