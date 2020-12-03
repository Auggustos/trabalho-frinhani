import { Component } from '@angular/core';
import { ChartType } from 'chart.js';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { io } from 'socket.io-client';
import { SERVER_URL } from 'src/environments/environment';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public chartData: ChartDataSets[] = [{ data: [], label: 'Histórico de temperatura' }];
  public chartType: ChartType = 'line';
  public chartLabels: Label[]

  socket: any;

  constructor(private http: HttpClient) {

    this.socket = io(`${SERVER_URL}/`);
    this.loadData();


  }
  valorUmidade = 0; // valores que vão ser recebidos do serviço
  valorTemperatura = 0;
  valorSoilMisture = 0;

  ngOnInit() {
    this.socket.on('sensorData', (message) => {
      this.valorTemperatura = message.temperature
      this.valorUmidade = message.umidity
      this.valorSoilMisture = message.soilMisture;
      this.loadData();
    })
    this.socket.emit('set-name', 'haha');
  }

  loadData() {
    const request: string = `${SERVER_URL}/get/average/week/temperature`;

    //call first time 
    this.callApi()


    //call every # ######
    setInterval(() => {
      this.callApi()
    }, 60000)

  }

  callApi() {
    const url: string = `${SERVER_URL}/get/average/week/temperature`;
    this.http.get(url).subscribe((res: any) => {
      console.log("Res: ",res)
      let label = ''
      this.chartLabels = [...label];
      const averageTemp = res.averages.map((item) => {
        return item.temp
      })
      this.chartData[0].data = [...averageTemp];
    }, (err: any) => {
      console.error(err);
    });
  }
}