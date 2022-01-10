import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WriteInPage } from './write-in.page';

const routes: Routes = [
  {
    path: '',
    component: WriteInPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WriteInPageRoutingModule {}
