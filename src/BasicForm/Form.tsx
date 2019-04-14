import * as React from "react";
import {IFieldProps} from "./Field";

import { PacmanLoader } from 'react-spinners';

export interface IFields {
  [key: string]: IFieldProps;
}

interface IFormProps {
  action: string;

  fields: IFields;

  handleInputChange: (newText: any) => void

  render: () => React.ReactNode
}

export interface IValues {
  [key: string]: any;
}

export const required = (values: IValues, fieldName: string): string =>
  values[fieldName] === undefined ||
  values[fieldName] === null ||
  values[fieldName] === ""
    ? "This must be populated"
    : "";

export interface IErrors {
  [key: string]: string;
}

export interface IFormState {
  values: IValues;

  errors: IErrors;

  isLoading: boolean;

  submitSuccess?: boolean;

  serverResponse: any;
}

export interface IFormContext extends IFormState {
  setValues: (values: IValues) => void;

  validate: (fieldName: string) => void;
}

export const FormContext = React.createContext<IFormContext | undefined>(
  undefined
);

export class Form extends React.Component<IFormProps, IFormState> {
  constructor(props: any) {
    super(props);

    const errors: IErrors = {};
    const values: IValues = {};
    const isLoading: boolean = false;
    let serverResponse: any = {};
    this.state = {
      errors,
      values,
      isLoading,
      serverResponse
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateServerResponse = this.updateServerResponse.bind(this);
  }

  private setValues = (values: IValues) => {
    this.setState({ values: { ...this.state.values, ...values } });
  };

  private haveErrors(errors: IErrors) {
    let haveError: boolean = false;
    Object.keys(errors).map((key: string) => {
      if (errors[key].length > 0) {
        haveError = true;
      }
    });
    return haveError;
  }

  handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    console.log(this.state.values);

    if (this.validateForm()) {
      const submitSuccess: boolean = await this.submitForm();
      this.setState({ submitSuccess }, this.updateServerResponse);
    }
  };

  updateServerResponse(){
    this.props.handleInputChange(this.state.serverResponse);
  }

  private validateForm(): boolean {
    const errors: IErrors = {};
    Object.keys(this.props.fields).map((fieldName: string) => {
      errors[fieldName] = this.validate(fieldName);
    });
    this.setState({ errors });
    return !this.haveErrors(errors);
  }

  private validate = (fieldName: string): string => {
    let newError: string = "";

    if (
      this.props.fields[fieldName] &&
      this.props.fields[fieldName].validation
    ) {
      newError = this.props.fields[fieldName].validation!.rule(
        this.state.values,
        fieldName,
        this.props.fields[fieldName].validation!.args
      );
    }
    this.state.errors[fieldName] = newError;
    this.setState({
      errors: { ...this.state.errors, [fieldName]: newError }
    });
    return newError;
  };

  private async submitForm(): Promise<boolean> {
    try {
      this.setState({ isLoading: true });
      const response = await fetch(this.props.action, {
        method: "post",
        headers: new Headers({
          "Content-Type": "application/json",
          Accept: "application/json"
        }),
        body: JSON.stringify(this.state.values)
      });
      if (response.status !== 200) {
        let responseBody: any;
        responseBody = await response.json();
        const errors: IErrors = {};
        Object.keys(responseBody).map((key: string) => {
          const fieldName = key.charAt(0).toLowerCase() + key.substring(1);
          errors[fieldName] = responseBody[key];
        });
        this.setState({ errors });
        this.setState({ isLoading: false });
      }else{
        let responseBody: any;
        responseBody = await response.json();
        this.setState({ isLoading: false });
        if(responseBody !== null || responseBody !== undefined){
          this.setState({ serverResponse: responseBody });
        }
      }
      return response.ok;
    } catch (ex) {
      this.setState({ isLoading: false });
      return false;
    }
  }

  public render() {
    const { submitSuccess, errors, isLoading } = this.state;
    const context: IFormContext = {
      ...this.state,
      setValues: this.setValues,
      validate: this.validate
    };
    return (
      <FormContext.Provider value={context}>
        <form onSubmit={this.handleSubmit.bind(this)} noValidate={true}>
          <div className="container">
            
            {this.props.render()}
            
            <div className="form-group">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={this.haveErrors(errors)}
              >
                Submit
              </button>
            </div>
            {isLoading && (
              <div>
                  <PacmanLoader
                    sizeUnit={"px"}
                    size={15}
                    color={'#f9ff00'}
                  />
              </div>
            )}
            {submitSuccess && isLoading === false && (
              <div className="alert alert-info" role="alert">
                The form was successfully submitted!
              </div>
            )}
            {submitSuccess === false && isLoading === false &&
              !this.haveErrors(errors) && (
                <div className="alert alert-danger" role="alert">
                  Sorry, an unexpected error has occurred
                </div>
              )}
            {submitSuccess === false && isLoading === false &&
              this.haveErrors(errors) && (
                <div className="alert alert-danger" role="alert">
                  Sorry, the form is invalid. Please review, adjust and try again
                </div>
              )}
          </div>
        </form>
      </FormContext.Provider>
    );
  }
}