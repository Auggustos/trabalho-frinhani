import { Component } from '@angular/core';
import { ChartType } from 'chart.js';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { io } from 'socket.io-client';
import { SERVER_URL } from 'src/environments/environment';

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

  constructor(private http: HttpClient) {

    this.socket = io(`${SERVER_URL}/`)
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

  callApi(){
    const url: string = `${SERVER_URL}/get/average/week/temperature`
 
    this.http.get(url).subscribe((res:any) => {
      console.log(res)
 
      let label ='';
      this.chartLabels = [...label];
 
      const averageSoilMisture = res.averages.map((item) => {
        return item.soilmoisture
      })
    this.chartData[0].data = [...averageSoilMisture]; 
    }, error => {
      console.log(error)
      console.log(error.status);
      console.log(error.error); // error message as string
      console.log(error.headers); 
 
    });
  }
}