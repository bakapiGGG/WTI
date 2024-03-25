import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-enterprise';

@Component({
  selector: 'app-score-chart',
  templateUrl: './score-chart.component.html',
  styleUrl: './score-chart.component.css'
})
export class ScoreChartComponent implements  ICellRendererAngularComp, OnInit{

  title = 'ng-chart'
  chart: any = [];
  public params!: ICellRendererParams;
  private static chartIdCounter = 0;
  public chartId!: string;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.chartId = 'chart' + ScoreChartComponent.chartIdCounter++; // Generate unique ID
    this.createChart();
  }

  refresh(params: any): boolean {
    return false;
  }

  ngOnInit() {
    this.createChart();
  }

  createChart() {
    if (this.chart && typeof this.chart.destroy === 'function') {
      this.chart.destroy();
    }
    console.log(this.chartId);
    const data = this.params.value;

    this.chart = new Chart(this.chartId, {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: 'Series A',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1,
            borderRadius:
            {

              bottomLeft: 50,
              bottomRight: 50,
            },
            borderSkipped: false


          },
          {
            label: 'Series B',
            data: [7, 11, 5, 8, 3, 7],
            borderWidth: 1,
            // borderRadius: 10, // make bars rounded
            borderRadius:
            {
              topLeft: 50,
              topRight: 50,
            },
            borderSkipped: false
          },
        ],
      },
      options: {
        scales: {
          x: {
            stacked: true, // stack bars
          },
          y: {
            beginAtZero: true,
            stacked: true, // stack bars
          },
        },
      },
    });
  }



  // ngOnInit() {
  //   this.chart = new Chart(this.chartId, {
  //     type: 'bar',
  //     data: {
  //       labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  //       datasets: [
  //         {
  //           label: 'Series A',
  //           data: [12, 19, 3, 5, 2, 3],
  //           borderWidth: 1,
  //           borderRadius:
  //           {

  //             bottomLeft: 50,
  //             bottomRight: 50,
  //           },
  //           borderSkipped: false


  //         },
  //         {
  //           label: 'Series B',
  //           data: [7, 11, 5, 8, 3, 7],
  //           borderWidth: 1,
  //           // borderRadius: 10, // make bars rounded
  //           borderRadius:
  //           {
  //             topLeft: 50,
  //             topRight: 50,
  //           },
  //           borderSkipped: false
  //         },
  //       ],
  //     },
  //     options: {
  //       scales: {
  //         x: {
  //           stacked: true, // stack bars
  //         },
  //         y: {
  //           beginAtZero: true,
  //           stacked: true, // stack bars
  //         },
  //       },
  //     },
  //   });
  // }
}


