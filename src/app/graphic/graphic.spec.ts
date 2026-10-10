import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Graphic } from './graphic';

describe('Graphic', () => {
  let component: Graphic;
  let fixture: ComponentFixture<Graphic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Graphic]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Graphic);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
