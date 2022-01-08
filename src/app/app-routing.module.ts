import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'modal-popup',
    loadChildren: () =>
      import('./modals/selected-too-many-modal/selected-too-many-modal.module').then((m) => m.SelectedTooManyModalPageModule),
  },
  {
    path: 'vote-review',
    loadChildren: () => import('./vote-review/vote-review.module').then((m) => m.VoteReviewPageModule),
  },
  {
    path: 'present-one-contest',
    loadChildren: () => import('./present-one-contest/present-one-contest.module').then((m) => m.PresentOneContestPageModule),
  },
  {
    path: 'settings',
    loadChildren: () => import('./modals/settings-modal/settings-modal.module').then((m) => m.SettingsModalPageModule),
  },
  {
    path: 'writein-popup',
    loadChildren: () => import('./writein-modal/writein-modal.module').then((m) => m.WriteinModalPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
