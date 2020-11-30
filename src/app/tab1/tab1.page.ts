import { Component } from '@angular/core';
import { ChartType } from 'chart.js';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import {HttpClient }from '@angular/common/http';

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

  constructor(private httpClient: HttpClient) {

      this.loadData();
      this.loadData1();
    
    
  }
  valorUmidade = 23.6; // valores que vão ser recebidos do serviço
  valorTemperatura = 32.4;
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
  }
  loadData1(){
    const request: string = 'http://api.marketstack.com/v1/eod?access_key=5b8a5c0833a40aaa9d468e0f6ac97a19&symbols=AAPL&date_from=2020-05-05&date_to=2020-09-09'
    this.httpClient.get(request).subscribe(res =>{
      console.log(res)

      const data:any = (res as any).data;

      this.chartLabels1 = [];
    this.chartData1[0].data = []; 

      for(let i = 0; i<data.length; i++){
        const date: Date = new Date(data[i].date);
        this.chartLabels1.push(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`);
        this.chartData1[0].data.push(data[i].close);
      }
    })
  }
}