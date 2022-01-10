import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { WriteInPageRoutingModule } from './write-in-routing.module';
import { WriteInPage } from './write-in.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, WriteInPageRoutingModule],
  declarations: [WriteInPage],
})
export class WriteInPageModule {}
