import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './_components/homepage/homepage.component';

const routes: Routes = [
  { path: 'homepage/:id', component: HomepageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntityHomepageRoutingModule {
}
