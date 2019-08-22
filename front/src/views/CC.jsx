
import React from "react";
import Popup from 'react-popup';
import 'assets/css/styles.css';
// reactstrap components
import {
  Card,
  CardBody,
  Row,
  Col,
  Button
} from "reactstrap";
import Autosuggest from 'react-autosuggest';
import { CircularProgress } from '@material-ui/core';
// core components
import axios from 'axios';
var oackland = {
    "GF1-1-SALIDA": "2_7",
    "GF1-2-SALIDA": "2_9",
    "GF1-3-SALIDA": "2_11",
    "GF4-1-SALIDA": "1_3",
}

var miraflores = {
  "GF2-1-SALIDA": "2_1",
  "GF2-2-SALIDA": "2_3",
  "GF2-3-SALIDA": "2_6",
  "GF3-1-SALIDA": "2_9",
  "GF4-1-SALIDA": "1_1",
  "GF9-1-SALIDA": "4_3",
  "GF8-1-SALIDA": "3_1",
  "GF8-2-SALIDA": "3_3",
}

var plate = ''

var stationsMall = {"1":oackland,"2":miraflores}

var ipAndToken = {"1": "181.114.27.114|69cec5a91966e436c97c995f2a356f01dad69c32","2": "181.114.29.114|2916afc2252bf3acbf2afe6a80265e97dee845db"}

const languages = []

axios.get('http://ec2-3-95-241-62.compute-1.amazonaws.com:5000/get_plates').then(response => {
        response.data.forEach(function(element) {
          if(element.state!=="outside" && element.state!=="blacklist"){
            languages.push({name:element.plate})
          }
          
        });
      });

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : languages.filter(lang =>
    lang.name.toLowerCase().slice(0, inputLength) === inputValue
  );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
  <Button color="success" onClick={plate=suggestion.name}>{suggestion.name}</Button>
);

class Dashboard extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      plates:[],
      plateToOpen : "",
      gateToOpen: "",
      mall : "",
      nameMall: "",
      value: '',
      suggestions: [],
    };
  }
  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };
  openDevice(e){
    document.getElementById("blackdiv").style.display = "";
    axios.post('http://ec2-3-95-241-62.compute-1.amazonaws.com:5000/openDevice',{mall: this.state.mall,plate: plate, computerCamera : this.state.gateToOpen}).then(response => {
     console.log(response.status)
     if(response.status===200){
       Popup.alert('Puerta abierta')
     }
     else{
       Popup.alert('ERROR')
     }
     document.getElementById("blackdiv").style.display = 'none';
    });
  }
  setStationAndMall(e,station,mall){
    Popup.alert('Se selecciono la placa' +plate+ ' en la puerta ' +stationsMall[mall][station]+ ' en el centro comercial ' +mall);
    this.setState({
      gateToOpen : stationsMall[mall][station],
      mall: ipAndToken[mall]
    })
  }
  componentDidMount(){
    document.getElementById("blackdiv").style.display = 'none';
  }
  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Placa',
      value,
      onChange: this.onChange
    };
    const oaklandMall = ['GF1-1-SALIDA','GF1-2-SALIDA','GF1-3-SALIDA','GF4-1-SALIDA'];
    const miraflores = ['GF2-1-SALIDA','GF2-2-SALIDA','GF2-3-SALIDA','GF3-1-SALIDA','GF4-1-SALIDA','GF9-1-SALIDA','GF8-1-SALIDA','GF8-2-SALIDA']
    return (
      <>
      <div className="blackdiv" id="blackdiv">
        <CircularProgress size={60} thickness={7}  />
        </div>
        
        <div className="content"> Placa seleccionada: {plate}
        <Popup />
        {document.getElementById('popupContainer')}
          <Row>
            <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="3" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-delivery-fast text-warning" />
                      </div>
                    </Col>
                    <Col md="9" xs="7">
                      <div className="numbers">
                        <p className="card-category">Placas</p>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>  
              <Autosuggest
                  suggestions={suggestions}
                  onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                  getSuggestionValue={getSuggestionValue}
                  renderSuggestion={renderSuggestion}
                  inputProps={inputProps}
                />
              
            </Col>
            <Col lg="3" md="8" sm="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="2" xs="5">
                      <div className="icon-big text-center icon-primary">
                        <i className="nc-icon nc-planet text-success" />
                      </div>
                    </Col>
                    <Col md="10" xs="7">
                      <div className="numbers">
                        <p className="card-category">Estaciones oakland mall</p>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              {oaklandMall.map((value) => {
                  return <Button color="primary" onClick={(e) => this.setStationAndMall(e,value,"1")}>{value}</Button>
              })}
            </Col>
            <Col lg="3" md="8" sm="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="2" xs="5">
                      <div className="icon-big text-center icon-info">
                        <i className="nc-icon nc-planet text-success" />
                      </div>
                    </Col>
                    <Col md="10" xs="7">
                      <div className="numbers">
                        <p className="card-category">Estaciones Miraflores</p>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              {miraflores.map((value) => {
                  return <Button color="info" onClick={(e) => this.setStationAndMall(e,value,"2")}>{value}</Button>
              })}
            </Col>
            <Col lg="3" md="6" sm="6">
            <Button color="danger" onClick={(e) => this.openDevice(e)}>Abrir Puerta</Button>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Dashboard;
