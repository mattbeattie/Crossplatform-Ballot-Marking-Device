import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

// todo: the regex in the HTML is invalid and will need to be fixed

@Component({
  selector: 'app-writein-modal',
  templateUrl: './writein-modal.page.html',
  styleUrls: ['./writein-modal.page.scss'],
})
export class WriteinModalPage {
  private writeinName: string;

  constructor(private modalController: ModalController) {}

  async closeModal() {
    await this.modalController.dismiss(this.writeinName);
  }
}
