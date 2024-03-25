import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartnessModalContentComponent } from './smartness-modal-content.component';

describe('SmartnessModalContentComponent', () => {
  let component: SmartnessModalContentComponent;
  let fixture: ComponentFixture<SmartnessModalContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SmartnessModalContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SmartnessModalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
