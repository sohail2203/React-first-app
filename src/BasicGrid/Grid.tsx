import * as React from "react";

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const columnDefs= [
  {headerName: "ID", field: "id"},
  {headerName: "RP Name", field: "rpname"}, 
  {headerName: "RP Value", field: "rpvalue"}
];

const field = ["id", "rpname", "rpvalue"];

export class Grid extends React.Component<any, any> {
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
    let finalData: any = [];
    if(updatedData !== null || updatedData !== undefined){
      Object.keys(updatedData).map(function(key)
      {
        for(let item of updatedData[key]){
          let myDict: any = {}
          for(let column of field){
            if(column in item){
              myDict[column] = item[column];
            }
            else{
              myDict[column] = "---";
            }
          }
          myDict.id = key;
          finalData.push(myDict);
        }
      });
    }
    return finalData;
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