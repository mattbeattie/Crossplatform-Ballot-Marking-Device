import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { CandidateContestComponent } from '../contest-components/candidate-contest/candidate-contest.component';
import { BallotMeasureContestComponent } from '../contest-components/ballot-measure-contest/ballot-measure-contest.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json'),
        deps: [HttpClient],
      },
    }),
  ],
  entryComponents: [CandidateContestComponent, BallotMeasureContestComponent],
  declarations: [HomePage, CandidateContestComponent, BallotMeasureContestComponent],
})
export class HomePageModule {}
