import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-write-in',
  templateUrl: './write-in.page.html',
  styleUrls: ['./write-in.page.scss'],
})
export class WriteInPage {
  @Input() writeInName: string;

  constructor(private readonly modalController: ModalController) {}

  async closeModal() {
    await this.modalController.dismiss({ writeInName: this.writeInName });
  }
}
