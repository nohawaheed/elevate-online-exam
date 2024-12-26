import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxAuthApiComponent } from './ngx-auth-api.component';

describe('NgxAuthApiComponent', () => {
  let component: NgxAuthApiComponent;
  let fixture: ComponentFixture<NgxAuthApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxAuthApiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NgxAuthApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
