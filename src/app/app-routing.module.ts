import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'selected-too-many',
    loadChildren: () => import('./modals/selected-too-many/selected-too-many.module').then((m) => m.SelectedTooManyPageModule),
  },
  {
    path: 'vote-review',
    loadChildren: () => import('./modals/vote-review/vote-review.module').then((m) => m.VoteReviewPageModule),
  },
  {
    path: 'present-one-contest',
    loadChildren: () => import('./modals/present-one-contest/present-one-contest.module').then((m) => m.PresentOneContestPageModule),
  },
  {
    path: 'settings',
    loadChildren: () => import('./modals/settings/settings.module').then((m) => m.SettingsPageModule),
  },
  {
    path: 'write-in',
    loadChildren: () => import('./modals/write-in/write-in.module').then((m) => m.WriteInPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
