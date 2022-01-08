import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Contest } from '../../classes/Contest';

@Component({
  selector: 'app-selected-too-many-modal',
  templateUrl: './selected-too-many-modal.page.html',
  styleUrls: ['./selected-too-many-modal.page.scss'],
})
export class SelectedTooManyModalPage {
  @Input() contest: Contest;

  constructor(public modalController: ModalController) {}

  async closeModal() {
    await this.modalController.dismiss();
  }
}
