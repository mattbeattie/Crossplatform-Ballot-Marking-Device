import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-selected-too-many',
  templateUrl: './selected-too-many.page.html',
  styleUrls: ['./selected-too-many.page.scss'],
})
export class SelectedTooManyPage {
  constructor(public modalController: ModalController) {}

  async closeModal() {
    await this.modalController.dismiss();
  }
}
