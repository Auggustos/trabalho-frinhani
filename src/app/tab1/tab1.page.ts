import { Component } from '@angular/core';
import { ChartType } from 'chart.js';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { HTTP } from '@ionic-native/http/ngx';
import {io} from 'socket.io-client';
import { SERVER_URL } from 'src/environments/environment';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public chartData: ChartDataSets[] = [{data: [], label: 'Histórico de temperatura'}];
  public chartType: ChartType = 'line';
  public chartLabels: Label[]

  socket : any;

  constructor(private http: HTTP) {

      this.socket = io(`${SERVER_URL}:3000/`);
      this.loadData();
    
    
  }
  valorUmidade = 0; // valores que vão ser recebidos do serviço
  valorTemperatura = 0;
  valorSoilMisture = 0;

  ngOnInit(){
    this.socket.on('sensorData', (message) => {
      this.valorTemperatura = message.temperature
      this.valorUmidade = message.umidity
      this.valorSoilMisture = message.soilMisture
    })
    this.socket.emit('set-name','haha');
  }

  loadData(){
    const request: string = `${SERVER_URL}/get/average/week/temperature`;
    
    //call first time 
    this.callApi()


    //call every # ######
    setInterval(() => {
      this.callApi()
    }, 60000)
    
  }

  callApi(){
    const url: string = `${SERVER_URL}:3000/get/average/week/temperature`;
 
    this.http.setServerTrustMode('nocheck')
 
    this.http.setHeader('*', 'Access-Control-Allow-Origin', '*');
    this.http.setHeader('*', 'Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    this.http.setHeader('*', 'Accept', 'application/json');
    this.http.setHeader('*', 'content-type', 'application/json');
    this.http.setDataSerializer('json');
 
    this.http.get(url, {}, {}).then(res => {
 
      let body:any = JSON.stringify(res as any)
      body = JSON.parse(body)
      let data = JSON.parse(body.data)
 
      this.chartLabels = [...data.label];
 
      const averageTemp = data.averages.map((item) => {
        return item.temp
      })
    this.chartData[0].data = [...averageTemp]; 
    }).catch(error => {
 
      console.log(error)
      console.log(error.status);
      console.log(error.error); // error message as string
      console.log(error.headers);
 
    });
  }
}