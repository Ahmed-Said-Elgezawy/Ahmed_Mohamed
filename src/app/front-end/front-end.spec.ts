import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontEnd } from './front-end';

describe('FrontEnd', () => {
  let component: FrontEnd;
  let fixture: ComponentFixture<FrontEnd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrontEnd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrontEnd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
