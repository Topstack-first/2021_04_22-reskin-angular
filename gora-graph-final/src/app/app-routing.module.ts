import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPageComponent } from './error-page/error-page.component';
import { AuthGuard } from './auth/auth.guard';
import { NavigationComponent } from './navigation/navigation.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { COMPLETED_STATE } from './common/const';
import { OrganizationEntityComponent } from './profile/_components/organization-entity/organization-entity.component';
import { UserEntityComponent } from './profile/_components/user-entity/user-entity.component';
import { ProfileFormComponent } from './profile/_components/profile-form/profile-form.component';


const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'error-page', component: ErrorPageComponent },
  { path: 'navigation', component: NavigationComponent, canLoad: [AuthGuard], canActivate: [AuthGuard] },
  {
    path: '', component: NavigationComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: COMPLETED_STATE,
            redirectTo: {
              navigationCommands: ['navigation'],
            }
          }
        }
      },
      {
        path: 'entity', loadChildren: () => import('./entity-homepage/entity-homepage.module').then(m => m.EntityHomepageModule),
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: COMPLETED_STATE,
            redirectTo: {
              navigationCommands: ['navigation'],
            }
          }
        }
      },
      {
        path: 'article', loadChildren: () => import('./article/article.module').then(m => m.ArticleModule),
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: COMPLETED_STATE,
            redirectTo: {
              navigationCommands: ['navigation'],
            }
          }
        }
      },
      {
        path: 'contest', loadChildren: () => import('./contest/contest.module').then(m => m.ContestModule),
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: COMPLETED_STATE,
            redirectTo: {
              navigationCommands: ['navigation'],
            }
          }
        }
      },
      {
        path: 'organization', component: OrganizationEntityComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: COMPLETED_STATE,
            redirectTo: {
              navigationCommands: ['navigation'],
            }
          }
        }
      },
      {
        path: 'expert', component: UserEntityComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: COMPLETED_STATE,
            redirectTo: {
              navigationCommands: ['navigation'],
            }
          }
        }
      },
      {
        path: 'profile', component: ProfileFormComponent,
        canActivate: [NgxPermissionsGuard],
        canActivateChild: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: COMPLETED_STATE,
            redirectTo: {
              navigationCommands: ['navigation'],
            }
          }
        }
      }
    ],
    canLoad: [AuthGuard],
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/auth/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
