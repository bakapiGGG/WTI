import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EfficiencyModalContentComponent } from './efficiency-modal-content.component';

describe('EfficiencyModalContentComponent', () => {
  let component: EfficiencyModalContentComponent;
  let fixture: ComponentFixture<EfficiencyModalContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EfficiencyModalContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EfficiencyModalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
