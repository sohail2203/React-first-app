import * as React from "react";

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const columnDefs= [
  {headerName: "Sensi Name", field: "sensiname"}, 
  {headerName: "Sensi Value", field: "sensivalue"}
];

const field = ["id", "rpname", "rpvalue"];

export class SensiGrid extends React.Component<any, any> {
  public api: any;
  public columnApi: any;

  constructor(props: any) {
    super(props);
    this.api;
    this.columnApi;
    let gridData:any = [];
    this.state = {
      gridData
    };
  }

  createRowDataObject(updatedData: any): any{
    //Do all converted manip here
    
    return updatedData;
  }

  componentWillReceiveProps(updatedData: any) {
    let convertData = this.createRowDataObject(updatedData.refresh);
    this.setState({ gridData: convertData }, 
      () => {
      this.api.setRowData(this.state.gridData);
      }
    );
  }

  onGridReady = (params: any) => {
    this.api = params.api;
    this.columnApi = params.columnApi;
    this.api.setColumnDefs(columnDefs);
    this.api.setRowData(this.state.gridData);
  }

  public render() {
    return (
      <div 
        className="ag-theme-balham"
        style={{ 
        height: '500px', 
        width: '600px' }} 
      >
        <AgGridReact
          onGridReady = {this.onGridReady}
          columnDefs={[]}
          rowData={[]}>
        </AgGridReact>
      </div>
      
    );
  }
}