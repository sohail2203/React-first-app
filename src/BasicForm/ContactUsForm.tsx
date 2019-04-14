import * as React from "react";
import { IFields, Form, required } from "./Form";
import { Field } from "./Field";
import { Grid } from "../BasicGrid/Grid";
import { SensiGrid } from "../BasicGrid/SensiGrid";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";

const fields: IFields = {
    perimeter: {
        id: "perimeter",
        label: "Perimeter",
        validation: { rule: required }
    },
    date: {
        id: "date",
        label: "AR Date",
        editor: "datepicker",
        validation: { rule: required }
    },
    businessUnit: {
        id: "businessUnit",
        label: "Business Unit",
        editor: "dropdown",
        options: ["", "EQD", "FIC"],
        validation: { rule: required }
    },
    dealIds: {
        id: "dealIds",
        label: "Deals ID",
        editor: "multilinetextbox",
        validation: { rule: required }
    }
};

export class ContactUsForm extends React.Component<any, any> {
    constructor(props: any) {
      super(props);
      this.state = {
          dataRP: [],
          dataSensi: []
        };
      this.handleInputChange = this.handleInputChange.bind(this);
    }

    checkServerData(newResponse: any): boolean{
        if("rp" in newResponse && "sensi" in newResponse){
            return true;
        }
        return false;
    }

    handleInputChange(newText:any) {
        if(this.checkServerData(newText)){
            this.setState({ dataRP: newText["rp"] });
            this.setState({ dataSensi: newText["sensi"] });
        }
    }

    public render() {
      return (
        <div>
        <Form
            action="http://localhost:5000/test"
            handleInputChange={this.handleInputChange}
            fields={fields}
            render={() => (
                <React.Fragment>
                    <div className="form-row">
                        <div className="form-group col-md-2">
                            <Field {...fields.perimeter} />
                        </div>
                        <div className="form-group col-md-2">
                            <Field {...fields.date} />
                        </div>
                        <div className="form-group col-md-2">
                            <Field {...fields.businessUnit} />
                        </div>
                    </div>
                    <div className="form-group">
                        <Field {...fields.dealIds} />
                    </div>
                </React.Fragment>
            )}
        />
        
        <Tabs forceRenderTabPanel={true}>
            <TabList>
            <Tab>Reserve Policies</Tab>
            <Tab>Sensitivities</Tab>
            </TabList>
        
            <TabPanel forceRender={true}>
                <Grid refresh={this.state.dataRP}/>   
            </TabPanel>
            <TabPanel forceRender={true}>
                <SensiGrid refresh={this.state.dataSensi}/>
            </TabPanel>
        </Tabs>
        
        
        </div>
      );
    }
}