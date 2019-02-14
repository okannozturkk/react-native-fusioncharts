import React, { Component } from 'react';
// import DataStore from 'fusioncharts/datastore';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Platform,
  ScrollView
} from 'react-native';
import ReactNativeFusionCharts from './FusionCharts';

const jsonify = res => res.json();
// This is the remote url to fetch the data.
const dataFetch = fetch(
  'https://s3.eu-central-1.amazonaws.com/fusion.store/ft/data/line-chart-with-time-axis-data.json'
).then(jsonify);
// This is the remote url to fetch the schema.
const schemaFetch = fetch(
  'https://s3.eu-central-1.amazonaws.com/fusion.store/ft/schema/line-chart-with-time-axis-schema.json'
).then(jsonify);

const dataFetch2 = fetch(
  'https://s3.eu-central-1.amazonaws.com/fusion.store/ft/data/column-chart-with-time-axis-data.json'
).then(jsonify);
const schemaFetch2 = fetch(
  'https://s3.eu-central-1.amazonaws.com/fusion.store/ft/schema/column-chart-with-time-axis-schema.json'
).then(jsonify);

export default class App extends Component {
  constructor(props) {
    super(props);

    this.apiCaller = null;
    this.state = {
      type: 'column2d',
      width: '90%',
      height: '100%',
      dataFormat: 'json',
      dataSource: {
        chart: {
          caption: "Harry's ss",
          subCaption: 'Top 5 stores in last month by revenue',
          numberPrefix: '$',
          theme: 'ocean'
        },
        data: [
          {
            label: 'Bakersfield Central',
            value: '880000'
          },
          {
            label: 'Garden Groove harbour',
            value: '730000'
          },
          {
            label: 'Los Angeles Topanga',
            value: '590000'
          },
          {
            label: 'Compton-Rancho Dom',
            value: '520000'
          },
          {
            label: 'Daly City Serramonte',
            value: '330000'
          }
        ]
      },
      containerBackgroundColor: 'transparent',
      displayValue: '',
      schemaJson: null,
      dataJson: null,
      timeseriesDs: {
        type: 'timeseries',
        width: '100%',
        height: '100%',
        dataFormat: 'json',
        dataSource: {
          // Initially data is set as null
          data: null,
          caption: {
            text: 'Sales Analysis'
          },
          subcaption: {
            text: 'Grocery'
          },
          yAxis: [
            {
              plot: {
                value: 'Grocery Sales Value',
                type: 'line'
              },
              format: {
                prefix: '$'
              },
              title: 'Sale Value'
            }
          ]
        }
      }
    };

    this.libraryPath = Platform.select({
      ios: require('../assets/fusioncharts.html'),
      android: { uri: 'file:///android_asset/fusioncharts.html' }
    });

    this.fc = Platform;

    this.bindApiCaller = this.bindApiCaller.bind(this);
    this.onPress = this.onPress.bind(this);
    this.onChangeJson = this.onChangeJson.bind(this);
    this.onChangeSize = this.onChangeSize.bind(this);
    this.fetchDataAndSchema2 = this.fetchDataAndSchema2.bind(this);
    this.events = {
      dataPlotClick: (eventObj, dataObj) => {
        this.setState({
          displayValue: dataObj.displayValue
        });
      }
    };
  }

  // We are creating the DataTable immidietly after the component is mounted
  componentDidMount() {
    this.fetchDataAndSchema();
  }

  onPress() {
    console.log('clicked');
    // const newDs = Object.assign({}, this.state.dataSource);
    // newDs.chart.caption = 'Changed';
    // this.setState({
    //   dataSource: newDs
    // });
    // const newTsDs = this.state.timeseriesDs;
    // newTsDs.dataSource.caption.text = 'Changed!';
    // newTsDs.dataSource.subcaption.text = 'This is changed as well!';
    // this.setState({ timeseriesDs: newTsDs });
    this.apiCaller('min', 'Time');
  }

  fetchDataAndSchema() {
    Promise.all([dataFetch, schemaFetch]).then(res => {
      const data = res[0];
      const schema = res[1];
      // const dataTable = new DataStore().createDataTable(data, schema);
      // console.log(dataTable);
      // const timeseriesDs = Object.assign({}, this.state.timeseriesDs);
      // timeseriesDs.dataSource.data = dataTable;
      // this.setState({ timeseriesDs });
      this.setState({ dataJson: data, schemaJson: schema });
    });
  }

  fetchDataAndSchema2() {
    Promise.all([dataFetch2, schemaFetch2]).then(res => {
      const data = res[0];
      const schema = res[1];
      this.setState({ dataJson: data, schemaJson: schema });
    });
  }

  onChangeJson() {
    const data = this.state.dataJson.slice(0, 200);
    const schema = [
      {
        name: 'Time',
        type: 'date',
        format: '%d-%b-%y'
      },
      {
        name: 'Grocery Sales Value',
        type: 'number'
      }
    ];
    this.setState({ dataJson: data, schemaJson: schema });
  }

  onChangeSize() {
    this.setState({
      timeseriesDs: { ...this.state.timeseriesDs, height: '50%', width: '80%' }
    });
  }

  bindApiCaller(caller) {
    // Now this.apiCaller will be a function where you can pass js code for the WebView
    // to access the chart Object. See the method changeType.
    this.apiCaller = caller;
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>
          FusionCharts Integration with React Native
        </Text>
        <View style={styles.chartContainer}>
          <ReactNativeFusionCharts
            type={this.state.type}
            width={this.state.width}
            height={this.state.height}
            dataFormat={this.state.dataFormat}
            dataSource={this.state.dataSource}
            containerBackgroundColor={this.state.containerBackgroundColor}
            events={this.events}
            libraryPath={this.libraryPath}
          />
        </View>
        <View style={styles.chartContainer}>
          <ReactNativeFusionCharts
            dataJson={this.state.dataJson}
            schemaJson={this.state.schemaJson}
            type={this.state.timeseriesDs.type}
            width={this.state.timeseriesDs.width}
            height={this.state.timeseriesDs.height}
            dataFormat={this.state.timeseriesDs.dataFormat}
            dataSource={this.state.timeseriesDs.dataSource}
            libraryPath={this.libraryPath}
            onDataTableInitialized={caller => {
              this.bindApiCaller(caller);
            }}
          />
        </View>
        <Text style={styles.text}>DisplayValue: {this.state.displayValue}</Text>
        <View style={{ alignItems: 'center' }}>
          <Button
            onPress={this.onPress}
            title="Update Chart Data"
            color="#841577"
            accessibilityLabel="Update the chart data"
          />
          <Button
            onPress={this.fetchDataAndSchema2}
            title="Update JSON"
            color="#841577"
          />
          <Button
            onPress={this.onChangeSize}
            title="Update Size"
            color="#841577"
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  heading: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10
  },
  text: {
    fontSize: 15,
    margin: 13
  },
  chartContainer: {
    height: 350
  }
});
