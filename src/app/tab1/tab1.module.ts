import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Tab1PageRoutingModule } from './tab1-routing.module';
import { ChartsModule } from 'ng2-charts'
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    ChartsModule,
    HttpClientModule

  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}
