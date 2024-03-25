import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResilienceModalContentComponent } from './resilience-modal-content.component';

describe('ResilienceModalContentComponent', () => {
  let component: ResilienceModalContentComponent;
  let fixture: ComponentFixture<ResilienceModalContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResilienceModalContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResilienceModalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
