import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswersDialogComponent } from './answers-dialog.component';

describe('AnswersDialogComponent', () => {
  let component: AnswersDialogComponent;
  let fixture: ComponentFixture<AnswersDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnswersDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnswersDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
