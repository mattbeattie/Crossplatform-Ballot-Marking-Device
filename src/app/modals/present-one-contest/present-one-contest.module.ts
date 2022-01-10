import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { PresentOneContestPageRoutingModule } from './present-one-contest-routing.module';
import { PresentOneContestPage } from './present-one-contest.page';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, PresentOneContestPageRoutingModule],
  declarations: [PresentOneContestPage],
})
export class PresentOneContestPageModule {}
