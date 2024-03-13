import { Component } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-enterprise';

@Component({
  selector: 'app-metric-sparkline',
  // templateUrl: './metric-sparkline.component.html',
  // template: `<span [sparklines]="params.value"></span>`,
  template: `<span>{{ params.value }}</span>`,
  styleUrl: './metric-sparkline.component.css'
})
export class MetricSparklineComponent implements AgRendererComponent {

  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(params: any): boolean {
    return false;
  }
}
