import { Component } from '@angular/core';
import { ChartType } from 'chart.js';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { HTTP } from '@ionic-native/http/ngx';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  public chartData: ChartDataSets[] = [{ data: [], label: 'Histórico de umidade do solo' }];
  public chartType: ChartType = 'line';
  public chartLabels: Label[]

  socket: any;

  constructor(private http: HTTP) {

    this.socket = io('http://192.168.0.110:3000/')
    this.loadData();
  }
  valorUmidade = 0; // valores que vão ser recebidos do serviço
  valorTemperatura = 0;
  valorSoilMisture = 0;

  ngOnInit() {
    this.socket.on('sensorData', (message) => {
      this.valorTemperatura = message.temperature
      this.valorUmidade = message.umidity
      this.valorSoilMisture = message.soilMisture
    })
    this.socket.emit('set-name', 'haha');
  }

  loadData() {
    const request: string = 'http://192.168.0.110/get/average/week/temperature'

    //call first time 
    this.callApi()


    //call every # ######
    setInterval(() => {
      this.callApi()
    }, 60000)

  }

  callApi(){
    const url: string = 'http://192.168.0.110:3000/get/average/week/temperature'
 
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
 
      const averageSoilMisture = data.averages.map((item) => {
        return item.soilmoisture
      })
    this.chartData[0].data = [...averageSoilMisture]; 
    }).catch(error => {
/*       console.log(error)
      console.log(error.status);
      console.log(error.error); // error message as string
      console.log(error.headers); */
 
    });
  }
}