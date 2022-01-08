import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectedTooManyModalPage } from './selected-too-many-modal.page';

const routes: Routes = [
  {
    path: '',
    component: SelectedTooManyModalPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectedTooManyModalPageRoutingModule {}
