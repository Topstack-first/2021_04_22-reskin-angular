import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ContestFormComponent} from './_components/contest-form/contest-form.component';
import {ContestReadComponent} from './_components/contest-read/contest-read.component';

const routes: Routes = [
  {path: 'form', component: ContestFormComponent},
  {path: 'read', component: ContestReadComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContestRoutingModule {
}
