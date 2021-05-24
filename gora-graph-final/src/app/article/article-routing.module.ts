import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleDraftListComponent } from './_components/article-draft-list/article-draft-list.component';
import { ArticleFormComponent } from './_components/article-form/article-form.component';
import { ArticleReadComponent } from './_components/article-read/article-read.component';

const routes: Routes = [
  { path: 'form', component: ArticleFormComponent },
  { path: 'read', component: ArticleReadComponent },
  { path: 'draft', component: ArticleDraftListComponent }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule {
}
