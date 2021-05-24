import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContestDraftListComponent } from './_components/contest-draft-list/contest-draft-list.component';
import { ContestFormComponent } from './_components/contest-form/contest-form.component';
import { ContestReadComponent } from './_components/contest-read/contest-read.component';

const routes: Routes = [
  { path: 'form', component: ContestFormComponent },
  { path: 'read', component: ContestReadComponent },
  { path: 'draft', component: ContestDraftListComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContestRoutingModule {
}
