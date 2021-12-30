import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

// todo: the regex in the HTML is invalid and will need to be fixed

@Component({
  selector: 'app-writein-popup',
  templateUrl: './writein-popup.page.html',
  styleUrls: ['./writein-popup.page.scss'],
})
export class WriteinPopupPage {
  private writeinName: string;

  constructor(private modal: ModalController) {}

  async closeModal() {
    await this.modal.dismiss(this.writeinName);
  }
}
