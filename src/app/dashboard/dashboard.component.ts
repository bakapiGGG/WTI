import { AfterViewInit, Component, inject, Input, Renderer2, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // HTTP Client
// import { AgGridAngular } from 'ag-grid-angular'; // AG Grid Component
import { ColDef, ColumnSparklineOptions } from 'ag-grid-community'; // AG Grid Column Definition
import * as Papa from 'papaparse'; // CSV Parser
import { ViewChild, ElementRef } from '@angular/core';
import { ColumnFormatterParams } from 'ag-grid-community';
import { ScoreChartComponent } from '../score-chart/score-chart.component';


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
  calculateEfficiencyOnly: boolean = false;
  calculateSmartnessOnly: boolean = false;
  calculateGreennessOnly: boolean = false;
  calculateResilienceOnly: boolean = false;
  selectedIndicator: string = 'Indicators';
  selectedStakeholder: string = 'Stakeholders';
  modalTitle = 'Default Title';
  frameworkComponents: any;
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

  constructor(private http: HttpClient) {
    this.frameworkComponents = {
      scoreChart: ScoreChartComponent,
    };
    this.fetchCSV()
  }

  private counter: number = 0;

  public labelFormatter = (params: any) => {
    this.counter += 1;

    if (this.counter % 4 == 1) {
      // return "Efficiency" + '\n' + params.value.toFixed(2);
      return Math.round(params.value) + '%' + '\n\n' + 'E';
    }

    else if (this.counter % 4 == 2) {
      // return "Smartness" + '\n' + params.value.toFixed(2);
      return Math.round(params.value) + '%' + '\n\n' + 'S';
    }

    else if (this.counter % 4 == 3) {
      // return "Greenness" + '\n' + params.value.toFixed(2);
      return Math.round(params.value) + '%' + '\n\n' + 'G';
    }

    else {
      // return "Resilience" + '\n' + params.value.toFixed(2);
      return Math.round(params.value) + '%' + '\n\n' + 'R';
    }
  }

  
  public columnFormatter = (params: ColumnFormatterParams) => {

    let color;
    if (params.xValue.toString() === 'Efficiency') 
    {
      color = '#37C9EE'
    } 
    else if (params.xValue.toString() === 'Smartness') 
    {
      color = '#6F6CF9'
    }
    else if (params.xValue.toString() === 'Greenness') 
    {
      color = '#01B9AF'
    }
    else 
    {
      color = '#3794FF'
    }
    
    return {
      fill: color,
      stroke: color
    };
  }

  

  columnDefs: ColDef[] = [

    {
      headerName: 'Rank',
      field: 'Rank',
      valueGetter: 'node.rowIndex + 1',
      width: 100,
    },
    { field: 'ID', headerName: 'ID', hide: true },
    { field: 'Name', headerName: 'Name', hide: true },
    { field: 'City', headerName: 'City', rowGroup: true, filter: true, hide: true },
    { field: 'Stakeholder', headerName: 'Stakeholder', rowGroup: true, filter: true, hide: true },
    {
      headerName: 'Average Score',
      width: 50,
      valueGetter: params => {
        const efficiency = Number(params.getValue('Efficiency')) || 0;
        const smartness = Number(params.getValue('Smartness')) || 0;
        const greenness = Number(params.getValue('Greenness')) || 0;
        const resilience = Number(params.getValue('Resilience')) || 0;
        const weightedAverage = 0.3 * efficiency + 0.2 * smartness + 0.3 * greenness + 0.2 * resilience;

        if (this.calculateEfficiencyOnly) {
          return efficiency;
        }
        else if (this.calculateSmartnessOnly) {
          return smartness;
        }
        else if (this.calculateGreennessOnly) {
          return greenness;
        }
        else if (this.calculateResilienceOnly) {
          return resilience;
        }
        else {
          return weightedAverage;
        }
      },
      valueFormatter: params => params.value.toFixed(2),
      sort: 'desc',
    },
    {
      headerName: 'Score Chart',
      field: 'sparkline',
      colId: 'score',
      width: 40,
      cellRenderer: 'agSparklineCellRenderer',
      cellRendererParams: {
        sparklineOptions:
          {
            type: 'column',

            // fill: 'lightgrey',
            label: {
              enabled: true,
              placement: 'insideBase',
              color: '#000000',
              fontWeight: 'bold',
              fontSize: 11,
              fontFamily: 'Arial, Helvetica, sans-serif',
              formatter: this.labelFormatter,
            },
            formatter: this.columnFormatter,
            highlightStyle: {
              fill: 'black',
              placement: 'center'
            },
            paddingInner: 0.2,
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
    // { field: 'chart', headerName: 'Chart', cellRenderer: ScoreChartComponent},

  ];

  defaultColDef = {
    // sortable: true,
    // filter: true
    cellStyle: { 'white-space': 'normal', 'line-height': '100px', 'text-align': 'left', 'font-size': '32px' },
  };

  rowData: any[] = [];
  gridApi: any;
  gridColumnApi: any;

  // After the grid has been initialized...
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.moveColumns(['Rank'], 0);
    // Auto-size all columns
    this.gridApi.sizeColumnsToFit();

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

  clearIndicators() {
    this.calculateEfficiencyOnly = false;
    this.calculateSmartnessOnly = false;
    this.calculateGreennessOnly = false;
    this.calculateResilienceOnly = false;
    this.selectedIndicator = 'Indicators';
    this.gridApi.refreshCells();
    this.gridApi.setColumnsVisible(['score'], true); // Unhide the score column
    this.gridApi.sizeColumnsToFit();

  }

  

  setEfficiency() {
    this.calculateEfficiencyOnly = true;
    this.calculateSmartnessOnly = false;
    this.calculateGreennessOnly = false;
    this.calculateResilienceOnly = false;
    this.selectedIndicator = 'Indicators: Efficiency';
    this.gridApi.setColumnsVisible(['score'], false); // Hide the score column
    this.gridApi.refreshCells();
    this.gridApi.sizeColumnsToFit();
  }

  setSmartness() {
    this.calculateEfficiencyOnly = false;
    this.calculateSmartnessOnly = true;
    this.calculateGreennessOnly = false;
    this.calculateResilienceOnly = false;
    this.selectedIndicator = 'Indicators: Smartness';
    this.gridApi.setColumnsVisible(['score'], false); // Hide the score column
    this.gridApi.refreshCells();
    this.gridApi.sizeColumnsToFit();
  }

  setGreenness() {
    this.calculateEfficiencyOnly = false;
    this.calculateSmartnessOnly = false;
    this.calculateGreennessOnly = true;
    this.calculateResilienceOnly = false;
    this.selectedIndicator = 'Indicators: Greenness';
    this.gridApi.setColumnsVisible(['score'], false); // Hide the score column
    this.gridApi.refreshCells();
    this.gridApi.sizeColumnsToFit();
  }

  setResilience() {
    this.calculateEfficiencyOnly = false;
    this.calculateSmartnessOnly = false;
    this.calculateGreennessOnly = false;
    this.calculateResilienceOnly = true;
    this.selectedIndicator = 'Indicators: Resilience';
    this.gridApi.setColumnsVisible(['score'], false); // Hide the score column
    this.gridApi.refreshCells();
    this.gridApi.sizeColumnsToFit();
  }



  setShipliner() {
    this.selectedStakeholder = 'Stakeholder: Shipliner';
    this.gridApi.setFilterModel({ 'Stakeholder': { type: 'set', values: ['Shipliner'] } });
    this.gridApi.onFilterChanged();
    setTimeout(() => {
      this.gridApi.refreshCells();
    }, 0);

  }

  setRegulator() {
    this.selectedStakeholder = 'Stakeholder: Regulator';
    this.gridApi.setFilterModel({ 'Stakeholder': { type: 'set', values: ['Regulator'] } });
    this.gridApi.onFilterChanged();
    setTimeout(() => {
      this.gridApi.refreshCells();
    }, 0);

  }

  setLogisticsPartners() {
    this.selectedStakeholder = 'Stakeholder: Logistics Partners';
    this.gridApi.setFilterModel({ 'Stakeholder': { type: 'set', values: ['Logistics Partners'] } });
    this.gridApi.onFilterChanged();
    setTimeout(() => {
      this.gridApi.refreshCells();
    }, 0);


  }

  setPortOperations() {
    this.selectedStakeholder = 'Stakeholder: Port Operators';
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
