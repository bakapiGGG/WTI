import { Component, ViewChild, Input, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // HTTP Client
import { ColDef, ColumnSparklineOptions } from 'ag-grid-community'; // AG Grid Column Definition
import * as Papa from 'papaparse'; // CSV Parser
import { GridReadyEvent, GridApi, ColumnApi } from 'ag-grid-community';
import { GridOptions } from 'ag-grid-community';
import { DashboardComponent } from '../dashboard/dashboard.component';

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
  selector: 'app-efficiency-modal-content',
  templateUrl: './efficiency-modal-content.component.html',
  styleUrl: './efficiency-modal-content.component.css'
})
export class EfficiencyModalContentComponent implements OnDestroy {


  rowData: any[] = [];
  gridApi: any;
  gridColumnApi: any;
  enableCharts = true;
  uniqueContainerPorts: string[] = ['Guangzhou', 'Singapore', 'Los Angeles (Long Beach)', 'Ningbo-Zhoushan', 'Shenzhen', 'Qingdao', 'Shanghai', 'Tianjin', 'Hong Kong', 'Busan'];
  autoGroupColumnDef = {
    headerName: 'Container Port',
    width: 500,
    cellRendererParams: {
      suppressCount: true,
      showOpenedGroup: true,
      suppressDoubleClickExpand: true,
      suppressEnterExpand: true,
      suppressExpandable: true,
      suppressAggFuncInHeader: true
    },
    cellRendererSelector: (params: any) => {
      if (this.uniqueContainerPorts.includes(params.node.key)) {
        return; // use Default Cell Renderer
      }
      return { component: 'agGroupCellRenderer' };
    }
  };

  defaultColDef = {
    cellStyle: { 'white-space': 'normal', 'text-align': 'left' },
  };

  columnDefs: ColDef[] = [
    { headerName: 'ID', field: 'ID', hide: true },
    { headerName: 'Name', field: 'Name', hide: true },
    {
      headerName: 'Rank',
      field: 'Rank',
      valueGetter: 'node.rowIndex + 1',
      cellClass: 'align-right' // if you want the numbers right-aligned
    },
    { headerName: 'City', field: 'City', sortable: true, filter: true, rowGroup: true, hide: true },
    { headerName: 'Stakeholder', field: 'Stakeholder', sortable: true, filter: true, hide: true },
    {
      headerName: 'Efficiency',
      field: 'Efficiency',
      sortable: true,
      filter: true,
      aggFunc: 'avg',
      sort: 'desc',

      valueFormatter: params => {
        const value = params.value.value;
        return typeof value === 'number' ? value.toFixed(2) : params.value;
      }
    }
  ];


  constructor(private http: HttpClient) {
    this.fetchCSV();

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

  private intervalId: any;

  // After the grid has been initialized...
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.moveColumns(['Rank'], 0);
    // this.intervalId = setInterval(() => {
    //   params.api.sizeColumnsToFit();
    // }, 500);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
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


