import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { VoteReviewPageRoutingModule } from './vote-review-routing.module';
import { VoteReviewPage } from './vote-review.page';

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
  declarations: [VoteReviewPage],
})
export class VoteReviewPageModule {}
