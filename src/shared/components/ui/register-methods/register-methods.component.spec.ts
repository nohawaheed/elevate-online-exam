import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterMethodsComponent } from './register-methods.component';

describe('RegisterMethodsComponent', () => {
  let component: RegisterMethodsComponent;
  let fixture: ComponentFixture<RegisterMethodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterMethodsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterMethodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
