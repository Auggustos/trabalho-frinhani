import { Component } from '@angular/core';
import { ChartType } from 'chart.js';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import {HttpClient }from '@angular/common/http';
import {io} from 'socket.io-client';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public chartData: ChartDataSets[] = [{data: [], label: 'Histórico de temperatura'}];
  public chartType: ChartType = 'line';
  public chartLabels: Label[]

  public chartData1: ChartDataSets[] = [{data: [], label: 'Histórico de umidade'}];
  public chartType1: ChartType = 'line';
  public chartLabels1: Label[]
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


  /*
  loadData(){

    const request: string = 'http://api.marketstack.com/v1/eod?access_key=5b8a5c0833a40aaa9d468e0f6ac97a19&symbols=AAPL&date_from=2020-05-05&date_to=2020-09-09'
    
    this.httpClient.get(request).subscribe(res =>{
      console.log(res)

      const data:any = (res as any).data;

      this.chartLabels = [];
    this.chartData[0].data = []; 

      for(let i = 0; i<data.length; i++){
        const date: Date = new Date(data[i].date);
        this.chartLabels.push(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`);
        this.chartData[0].data.push(data[i].close);
      }
    })   
  }*/
  loadData(){
    const request: string = 'http://127.0.0.1:3000/get/average/week/temperature'
    //const request: string = 'http://api.marketstack.com/v1/eod?access_key=5b8a5c0833a40aaa9d468e0f6ac97a19&symbols=AAPL&date_from=2020-05-05&date_to=2020-09-09'
    
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
      this.chartLabels1 = [...data.label];

      const averageUmidity = data.averages.map((item) => {
        return item.umidity
      })

      const averageTemp = data.averages.map((item) => {
        return item.temp
      })
    this.chartData1[0].data = [...averageUmidity]; 
    this.chartData[0].data = [...averageTemp]; 
    
    /*
      for(let i = 0; i<data.length; i++){
        //const date: Date = new Date(data[i].date);
        //this.chartLabels1.push(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`);
        this.chartData1[0].data.push(data[i].close);
      }*/
    })
  }
}