import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricSparklineComponent } from './metric-sparkline.component';

describe('MetricSparklineComponent', () => {
  let component: MetricSparklineComponent;
  let fixture: ComponentFixture<MetricSparklineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MetricSparklineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MetricSparklineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
