import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

import { HomePage } from '../home/home.page';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  @Input() public home: HomePage;

  public edFiles: string[];
  public selectEDF: string;

  constructor(public readonly modalController: ModalController, private readonly httpClient: HttpClient) {}

  ngOnInit() {
    // this.selectEDF = this.home.xmlFile;
    // // todo: do something with this: presumably we'd fetch the list of available files here
    // const xmlFiles = '/assets/data/index.txt';
    // this.httpClient
    //   .get(xmlFiles, { responseType: 'text' })
    //   .toPromise()
    //   .then((response) => {
    //     console.log('🚀 ~ file: election-model.service.ts ~ line 29 ~ ElectionModelService ~ .toPromise ~ response', response);
    //     return response;
    //   })
    //   .catch((err) => {
    //     // todo: figure out what to do here
    //     console.log(err);
    //   });
  }

  // async closeModal() {
  //   await this.modalController.dismiss();

  //   const filePath = `/assets/data/${this.selectEDF}`;
  //   if (filePath !== this.home.xmlFile) {
  //     this.home.setEDF(filePath);
  //   }
  // }

  // // todo: what is "myChange"? can this be updated to use a more descriptive, action-based method name?
  // myChange() {
  //   if (this.selectEDF !== this.home.xmlFile) {
  //   }
  // }
}
