import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { VoteReviewPageRoutingModule } from './vote-review-routing.module';
import { VoteReviewPage } from './vote-review.page';
import { CandidateContestComponent } from '../../components/candidate-contest/candidate-contest.component';
import { BallotMeasureContestComponent } from '../../components/ballot-measure-contest/ballot-measure-contest.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    VoteReviewPageRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json'),
        deps: [HttpClient],
      },
    }),
  ],
  entryComponents: [CandidateContestComponent, BallotMeasureContestComponent],
  declarations: [VoteReviewPage, CandidateContestComponent, BallotMeasureContestComponent],
})
export class VoteReviewPageModule {}
