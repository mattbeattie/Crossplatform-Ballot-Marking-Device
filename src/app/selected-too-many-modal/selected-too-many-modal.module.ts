import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicModule } from '@ionic/angular';

import { SelectedTooManyModalPageRoutingModule } from './selected-too-many-modal-routing.module';
import { SelectedTooManyModalPage } from './selected-too-many-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectedTooManyModalPageRoutingModule,
    HttpClientModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json'),
        deps: [HttpClient],
      },
    }),
  ],
  declarations: [SelectedTooManyModalPage],
})
export class SelectedTooManyModalPageModule {}
