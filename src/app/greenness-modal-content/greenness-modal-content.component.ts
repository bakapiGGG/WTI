import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // HTTP Client
import { ColDef, ColumnSparklineOptions } from 'ag-grid-community'; // AG Grid Column Definition
import * as Papa from 'papaparse'; // CSV Parser
import { GridReadyEvent, GridApi, ColumnApi } from 'ag-grid-community';
import { GridOptions } from 'ag-grid-community';
import { MetricSparklineComponent } from '../metric-sparkline/metric-sparkline.component';

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
  selector: 'app-greenness-modal-content',
  templateUrl: './greenness-modal-content.component.html',
  styleUrl: './greenness-modal-content.component.css'
})
export class GreennessModalContentComponent {

  rowData: any[] = [];
  gridApi: any;
  gridColumnApi: any;
  enableCharts = true;
  autoGroupColumnDef = {
    headerName: 'Container Port',
    width: 500,
    cellRendererParams: {
      suppressCount: true,
      showOpenedGroup: false,
      suppressDoubleClickExpand: true,
      suppressEnterExpand: true,
      suppressExpandable: true
    }
  };

  defaultColDef = {
    cellStyle: { 'white-space': 'normal', 'text-align': 'center' },
  };

  columnDefs: ColDef[] = [
    
    { headerName: 'ID', field: 'ID', hide: true },
    { headerName: 'Name', field: 'Name', hide: true },
    {
        headerName: 'Rank',
        valueGetter: 'node.rowIndex + 1',
        cellClass: 'align-right' // if you want the numbers right-aligned
      },
    { headerName: 'City', field: 'City', sortable: true, filter: true , rowGroup: true, hide: true},
    { headerName: 'Stakeholder', field: 'Stakeholder', sortable: true, filter: true, hide: true},
    { headerName: 'Greenness', field: 'Greenness', sortable: true, filter: true, aggFunc: 'avg', sort: 'desc' },
  ];


  constructor(private http: HttpClient) {
    this.fetchCSV()

  }

  // After the grid has been initialized...
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // Auto-size all columns
    // this.gridApi.sizeColumnsToFit();
    setTimeout(() => {
      params.api.sizeColumnsToFit();
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
        // console.log('Parsed data:', parsedData);
        // console.log('Row data:', this.rowData);
        // console.log('Column definitions:', this.columnDefs);
        // console.log('Data type of first cell in Greenness column:', typeof this.rowData[0]['Greenness'], this.rowData[0]['Greenness']);
      },
      err => console.error(err)
    );
  }

}
