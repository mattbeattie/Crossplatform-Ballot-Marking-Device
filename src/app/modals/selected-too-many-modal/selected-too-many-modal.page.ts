import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-selected-too-many-modal',
  templateUrl: './selected-too-many-modal.page.html',
  styleUrls: ['./selected-too-many-modal.page.scss'],
})
export class SelectedTooManyModalPage {
  constructor(public modalController: ModalController) {}

  async closeModal() {
    await this.modalController.dismiss();
  }
}
