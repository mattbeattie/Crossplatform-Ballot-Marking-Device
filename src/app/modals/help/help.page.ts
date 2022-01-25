import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage {
  constructor(private readonly modalController: ModalController) {}

  async closeModal() {
    await this.modalController.dismiss();
  }
}
