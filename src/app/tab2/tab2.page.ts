import { Component } from '@angular/core';
import { ChartType } from 'chart.js';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import {HttpClient }from '@angular/common/http';
import {io} from 'socket.io-client';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  public chartData: ChartDataSets[] = [{data: [], label: 'Histórico de umidade do ar'}];
  public chartType: ChartType = 'line';
  public chartLabels: Label[]

  socket : any;

  constructor(private httpClient: HttpClient) {

      this.socket = io('http://localhost:3000/')
      this.loadData();
    
    
  }
  valorUmidade = 0; // valores que vão ser recebidos do serviço
  valorTemperatura = 0;

  ngOnInit(){
    this.socket.on('sensorData', (message) => {
      this.valorTemperatura = message.temperature
      this.valorUmidade = message.umidity
    })
    this.socket.emit('set-name','haha');
  }

  loadData(){
    const request: string = 'http://127.0.0.1:3000/get/average/week/temperature'
    
    //call first time 
    this.callApi()


    //call every # ######
    setInterval(() => {
      this.callApi()
    }, 60000)
    
  }

  callApi(){
    const request: string = 'http://127.0.0.1:3000/get/average/week/temperature'

    this.httpClient.get(request).subscribe(res =>{
      console.log(res)

      const data:any = (res as any);

      this.chartLabels = [...data.label];
      const averageUmidity = data.averages.map((item) => {
        return item.umidity
      })
    this.chartData[0].data = [...averageUmidity]; 
    })
  }
}