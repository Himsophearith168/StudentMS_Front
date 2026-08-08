import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddScore } from './add-score';

describe('AddScore', () => {
  let component: AddScore;
  let fixture: ComponentFixture<AddScore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddScore],
    }).compileComponents();

    fixture = TestBed.createComponent(AddScore);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
