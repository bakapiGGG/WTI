import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreennessModalContentComponent } from './greenness-modal-content.component';

describe('GreennessModalContentComponent', () => {
  let component: GreennessModalContentComponent;
  let fixture: ComponentFixture<GreennessModalContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GreennessModalContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GreennessModalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
