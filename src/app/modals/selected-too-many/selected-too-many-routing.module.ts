import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectedTooManyPage } from './selected-too-many.page';

const routes: Routes = [
  {
    path: '',
    component: SelectedTooManyPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectedTooManyPageRoutingModule {}
