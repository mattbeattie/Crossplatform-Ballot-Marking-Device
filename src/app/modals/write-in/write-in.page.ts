import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

// todo: the regex in the HTML is invalid and will need to be fixed

@Component({
  selector: 'app-write-in',
  templateUrl: './write-in.page.html',
  styleUrls: ['./write-in.page.scss'],
})
export class WriteInPage {
  private writeinName: string;

  constructor(private modalController: ModalController) {}

  async closeModal() {
    await this.modalController.dismiss(this.writeinName);
  }
}
