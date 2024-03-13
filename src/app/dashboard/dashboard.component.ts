import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // HTTP Client
import { AgGridAngular } from 'ag-grid-angular'; // AG Grid Component
import { ColDef, ColumnSparklineOptions } from 'ag-grid-community'; // AG Grid Column Definition
import * as Papa from 'papaparse'; // CSV Parser
import { GridReadyEvent, GridApi, ColumnApi } from 'ag-grid-community';
import { GridOptions } from 'ag-grid-community';
// import { MetricSparklineCellRenderer } from '../metric-sparkline/metric-sparkline.component';
import { MetricSparklineComponent } from '../metric-sparkline/metric-sparkline.component';
// import { GridReadyEvent} from 'ag-grid-enterprise'

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
  // Year: string;
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  enableCharts = true;
  autoGroupColumnDef = {
    headerName: 'Container Port',
    cellRendererParams: {
      suppressCount: true,
      showOpenedGroup: true
    }
  };

  constructor(private http: HttpClient) {
    this.fetchCSV()
  }

  public labelFormatter(params: any) {
    // return params.value.toFixed(2) + "\nTest";
    return params.value.toFixed(2);
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
    // {
    //   headerName: 'Rank',
    //   valueGetter: 'node.rowIndex + 1',
    //   cellClass: 'align-right' // if you want the numbers right-aligned
    // },
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
        // console.log('Weighted Average:', weightedAverage);

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
        sparklineOptions: {
          type: 'column',
          // formatter: this.columnFormatter,
          label: {
            enabled: true,
            formatter: this.labelFormatter

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
        const values = [
          params.getValue('Efficiency').value,
          params.getValue('Smartness').value,
          params.getValue('Greenness').value,
          params.getValue('Resilience').value
        ];
        // console.log(values); // Debugging purposes
        return values;
      },
    },
    { field: 'Efficiency', headerName: 'Efficiency', aggFunc: 'avg', hide: true },
    { field: 'Smartness', headerName: 'Smartness', aggFunc: 'avg', hide: true },
    { field: 'Greenness', headerName: 'Greenness', aggFunc: 'avg', hide: true },
    { field: 'Resilience', headerName: 'Resilience', aggFunc: 'avg', hide: true },
    // { field: 'Year', headerName: 'Year', filter: true },

  ];

  defaultColDef = {
    // sortable: true,
    // filter: true
    cellStyle: { 'white-space': 'normal', 'line-height': '75px', 'text-align': 'center' },
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


  setShipliner() {
    this.gridApi.setFilterModel({ 'Stakeholder': { type: 'set', values: ['Shipliner'] } })
      .then(() => {
        this.gridApi.onFilterChanged();
      });
  }

  setRegulator() {
    this.gridApi.setFilterModel({ 'Stakeholder': { type: 'set', values: ['Regulator'] } }).then(() => {
      this.gridApi.onFilterChanged();
    });
  }

  setLogisticsPartners() {
    this.gridApi.setFilterModel({ 'Stakeholder': { type: 'set', values: ['Logistics Partners'] } }).then(() => {
      this.gridApi.onFilterChanged();
    });

  }

  setPortOperations() {
    this.gridApi.setFilterModel({ 'Stakeholder': { type: 'set', values: ['Port Operators'] } }).then(() => {
      this.gridApi.onFilterChanged();
    });

  }

  clearStakeholders() {
    this.gridApi.setFilterModel({ 'Stakeholder': null }).then(() => {
      this.gridApi.onFilterChanged();
    });
  }

  setEfficiency() {

  }

  // setEfficiency() {
  //   // Get the column definition for the 'Score Chart' column
  //   const columnDef = this.gridApi.getColumnDef('sparkline');

  //   // Update the valueGetter function in the column definition
  //   columnDef.valueGetter = (params: any) => {
  //     const values = [
  //       params.getValue('Efficiency').value
  //     ];
  //     return values;
  //   };

  //   // Refresh the cells in the 'Score Chart' column
  //   this.gridApi.refreshCells({ columns: ['sparkline'] });
  // }

  // setEfficiency() {

  //   const efficiencyColumnDefs = [
  //     {
  //       headerName: 'Rank',
  //       valueGetter: 'node.rowIndex + 1',
  //       // cellClass: 'align-right' // if you want the numbers right-aligned
  //     },
  //     {
  //       headerName: 'Container Port',
  //       field: 'City',
  //     },
  //     {
  //       field: 'Stakeholder', 
  //       headerName: 'Stakeholder', 
  //       rowGroup: true, 
  //       filter: true, 
  //       hide: true
  //     },
  //     {
  //       headerName: 'Resilience Score',
  //       rowGroup: true,
  //       valueGetter: (params: any) => {
  //         const resilience = params.getValue('Resilience') || 0;
  //         return resilience;
  //       }
  //     }


  //   ]

  //   //Update the column definitions 
  //   this.gridApi.setColumnDefs(efficiencyColumnDefs);
  // }

  setSmartness() {
    // Get the column definition for the 'Score Chart' column
    const columnDef = this.gridApi.getColumnDef('sparkline');

    // Update the valueGetter function in the column definition
    columnDef.valueGetter = (params: any) => {
      const values = [
        params.getValue('Smartness').value
      ];
      return values;
    };

    // Refresh the cells in the 'Score Chart' column
    this.gridApi.refreshCells({ columns: ['sparkline'] });
  }

  setGreenness() {
    // Get the column definition for the 'Score Chart' column
    const columnDef = this.gridApi.getColumnDef('sparkline');

    // Update the valueGetter function in the column definition
    columnDef.valueGetter = (params: any) => {
      const values = [
        params.getValue('Greenness').value
      ];
      return values;
    };

    // Refresh the cells in the 'Score Chart' column
    this.gridApi.refreshCells({ columns: ['sparkline'] });
  }

  setResilience() {
    // Get the column definition for the 'Score Chart' column
    const columnDef = this.gridApi.getColumnDef('sparkline');

    // Update the valueGetter function in the column definition
    columnDef.valueGetter = (params: any) => {
      const values = [
        params.getValue('Resilience').value
      ];
      return values;
    };

    // Refresh the cells in the 'Score Chart' column
    this.gridApi.refreshCells({ columns: ['sparkline'] });
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
