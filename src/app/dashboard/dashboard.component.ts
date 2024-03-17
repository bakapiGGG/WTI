import { AfterViewInit, Component, inject, Input, Renderer2, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // HTTP Client
// import { AgGridAngular } from 'ag-grid-angular'; // AG Grid Component
import { ColDef, ColumnSparklineOptions } from 'ag-grid-community'; // AG Grid Column Definition
import * as Papa from 'papaparse'; // CSV Parser
import { GridReadyEvent, GridApi, ColumnApi } from 'ag-grid-community';
import { GridOptions } from 'ag-grid-community';
import { MetricSparklineComponent } from '../metric-sparkline/metric-sparkline.component';
import { ViewChild, ElementRef } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

interface DataRow {
  ID: string;
  Name: string;
  Stakeholder: string;
  City: string;
  Efficiency: number;
  Smartness: number;
  Greenness: number;
  Resilience: number;
  Score: number;
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  @ViewChild('efficiencyModal') efficiencyModal!: ElementRef;

  uniqueContainerPorts: string[] = ['Guangzhou', 'Singapore', 'Los Angeles (Long Beach)', 'Ningbo-Zhoushan', 'Shenzhen', 'Qingdao', 'Shanghai', 'Tianjin', 'Hong Kong', 'Busan'];
  modalTitle = 'Default Title';
  enableCharts = true;
  autoGroupColumnDef = {
    headerName: 'Container Port',
    cellRendererParams: {
      suppressCount: true,
      showOpenedGroup: true
    },
    cellRendererSelector: (params: any) => {
      if (this.uniqueContainerPorts.includes(params.node.key)) {
        return; // use Default Cell Renderer
      }
      return { component: 'agGroupCellRenderer' };
    }
  };
  @Output() modalOpened = new EventEmitter<void>();

  constructor(private http: HttpClient, private modalService: NgbModal, private renderer: Renderer2) {
    this.labelFormatter = this.labelFormatter.bind(this);
    this.fetchCSV()
  }

  private counter: number = 0;

  public labelFormatter = (params: any) => {
    this.counter += 1;

    if (this.counter % 4 == 1) {
      return "Efficiency" + '\n' + params.value.toFixed(2);
    }

    else if (this.counter % 4 == 2) {
      return "Smartness" + '\n' + params.value.toFixed(2);
    }

    else if (this.counter % 4 == 3) {
      return "Greenness" + '\n' + params.value.toFixed(2);
    }

    else {
      return "Resilience" + '\n' + params.value.toFixed(2);
    }
  }


  public columnFormatter = (params: any) => {
    const { first, second, third, last } = params;

    let color;
    if (first) {
      color = '#ea7ccc'; // color for first column
    } else if (second) {
      color = 'skyblue'; // color for second column
    } else if (third) {
      color = 'green'; // color for third column
    } else if (last) {
      color = 'orange'; // color for last column
    } else {
      color = 'skyblue'; // default color for other columns
    }

    return {
      fill: color,
      stroke: color
    };
  }

  columnDefs: ColDef[] = [

    { field: 'ID', headerName: 'ID', hide: true },
    { field: 'Name', headerName: 'Name', hide: true },
    { field: 'City', headerName: 'City', rowGroup: true, filter: true, hide: true },
    { field: 'Stakeholder', headerName: 'Stakeholder', rowGroup: true, filter: true, hide: true },
    {
      headerName: 'Average Score',
      valueGetter: params => {
        const efficiency = params.getValue('Efficiency') || 0;
        // console.log('Efficiency:', efficiency);
        const smartness = params.getValue('Smartness') || 0;
        const greenness = params.getValue('Greenness') || 0;
        const resilience = params.getValue('Resilience') || 0;
        const weightedAverage = 0.3 * efficiency + 0.2 * smartness + 0.3 * greenness + 0.2 * resilience;

        return weightedAverage;
      },
      valueFormatter: params => params.value.toFixed(2),
      sort: 'desc',
    },
    {
      headerName: 'Score Chart',
      field: 'sparkline',
      cellRenderer: 'agSparklineCellRenderer',
      cellRendererParams: {
        sparklineOptions:
          {
            type: 'column',
            fill: 'lightgrey',
            // formatter: this.columnFormatter,
            label: {
              enabled: true,
              placement: 'insideBase',
              fontWeight: 'bold',
              fontSize: 11,
              fontFamily: 'Arial, Helvetica, sans-serif',
              formatter: this.labelFormatter,


            },
            stroke: '#91cc75',
            highlightStyle: {
              fill: 'orange',
              placement: 'center'
            },
            paddingInner: 0.3,
            paddingOuter: 0.1,
          } as ColumnSparklineOptions,
      },
      valueGetter: params => {
        // console.log(params); // Debug purposes

        const values: any = [
          ['Efficiency', params.getValue('Efficiency').value],
          ['Smartness', params.getValue('Smartness').value],
          ['Greenness', params.getValue('Greenness').value],
          ['Resilience', params.getValue('Resilience').value]
        ];
        // console.log("The value you get", values); // Debugging purposes
        return values;
      },
    },
    { field: 'Efficiency', headerName: 'Efficiency', aggFunc: 'avg', hide: true },
    { field: 'Smartness', headerName: 'Smartness', aggFunc: 'avg', hide: true },
    { field: 'Greenness', headerName: 'Greenness', aggFunc: 'avg', hide: true },
    { field: 'Resilience', headerName: 'Resilience', aggFunc: 'avg', hide: true },

  ];

  defaultColDef = {
    // sortable: true,
    // filter: true
    cellStyle: { 'white-space': 'normal', 'line-height': '75px', 'text-align': 'left' },
  };

  rowData: any[] = [];
  gridApi: any;
  gridColumnApi: any;

  // After the grid has been initialized...
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // Auto-size all columns
    this.gridApi.sizeColumnsToFit();

    // Or auto-size a specific column
    // this.gridColumnApi.autoSizeColumn('yourColumnName');
  }



  openModal(id: string) {

    // Debugging purposes
    // console.log('id is ', id);

    switch (id) {
      case 'resilienceModal':
        this.modalTitle = 'Resilience Ranking';
        this.modalOpened.emit();
        // console.log('event emitting is working!')
        break;
      case 'efficiencyModal':
        this.modalTitle = 'Efficiency Ranking';
        this.modalOpened.emit();
        // console.log('event emitting is working!')
        break;
      case 'smartnessModal':
        this.modalTitle = 'Smartness Ranking';
        this.modalOpened.emit();
        // console.log('event emitting is working!')
        break;
      case 'greennessModal':
        this.modalTitle = 'Greenness Ranking';
        this.modalOpened.emit();
        // console.log('event emitting is working!')
        break;
      // add more cases as needed
    }
    // code to open the modal

  }

  setShipliner() {
    this.gridApi.setFilterModel({ 'Stakeholder': { type: 'set', values: ['Shipliner'] } });
    this.gridApi.onFilterChanged();
    setTimeout(() => {
      this.gridApi.refreshCells();
    }, 0);

  }

  setRegulator() {
    this.gridApi.setFilterModel({ 'Stakeholder': { type: 'set', values: ['Regulator'] } });
    this.gridApi.onFilterChanged();
    setTimeout(() => {
      this.gridApi.refreshCells();
    }, 0);

  }

  setLogisticsPartners() {
    this.gridApi.setFilterModel({ 'Stakeholder': { type: 'set', values: ['Logistics Partners'] } });
    this.gridApi.onFilterChanged();
    setTimeout(() => {
      this.gridApi.refreshCells();
    }, 0);


  }

  setPortOperations() {
    this.gridApi.setFilterModel({ 'Stakeholder': { type: 'set', values: ['Port Operators'] } });
    this.gridApi.onFilterChanged();
    setTimeout(() => {
      this.gridApi.refreshCells();
    }, 0);


  }

  clearStakeholders() {
    this.gridApi.setFilterModel({ 'Stakeholder': null });
    this.gridApi.onFilterChanged();
    setTimeout(() => {
      this.gridApi.refreshCells();
    }, 0);
  }

 

 



  clearIndicators() {
    // Get the column definition for the 'Score Chart' column
    const columnDef = this.gridApi.getColumnDef('sparkline');

    // Update the valueGetter function in the column definition
    columnDef.valueGetter = (params: any) => {
      const values = [
        params.getValue('Efficiency').value,
        params.getValue('Smartness').value,
        params.getValue('Greenness').value,
        params.getValue('Resilience').value
      ];
      return values;
    };

    // Refresh the cells in the 'Score Chart' column
    this.gridApi.refreshCells({ columns: ['sparkline'] });
  }

  fetchCSV() {
    this.http.get('assets/data.csv', { responseType: 'text' }).subscribe(
      data => {
        let parsedData = Papa.parse(data, { header: true, skipEmptyLines: true }).data as DataRow[];
        // Convert 'Efficiency', 'Smartness', 'Greenness', and 'Resilience' values to numbers
        parsedData = parsedData.map((row: DataRow) => ({
          ...row,
          'Efficiency': Number(row['Efficiency']),
          'Smartness': Number(row['Smartness']),
          'Greenness': Number(row['Greenness']),
          'Resilience': Number(row['Resilience'])
        }));

        this.rowData = parsedData;

        // Log the result
        console.log('Parsed data:', parsedData);
        console.log('Row data:', this.rowData);
        console.log('Column definitions:', this.columnDefs);
        // console.log('Data type of first cell in Greenness column:', typeof this.rowData[0]['Greenness'], this.rowData[0]['Greenness']);
      },
      err => console.error(err)
    );
  }
}
