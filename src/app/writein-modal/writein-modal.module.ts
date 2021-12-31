import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WriteinModalPageRoutingModule } from './writein-modal-routing.module';

import { WriteinModalPage } from './writein-modal.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, WriteinModalPageRoutingModule],
  declarations: [WriteinModalPage],
})
export class WriteinModalPageModule {}
