import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ArticleFormComponent} from './_components/article-form/article-form.component';
import {ArticleReadComponent} from './_components/article-read/article-read.component';

const routes: Routes = [
  {path: 'form', component: ArticleFormComponent},
  {path: 'read', component: ArticleReadComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule {
}
