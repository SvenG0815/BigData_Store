import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './advertisment/create/create.component';
import { EditComponent } from './advertisment/edit/edit.component';
import { IndexComponent } from './advertisment/index/index.component';
import { ViewComponent } from './advertisment/view/view.component';

const routes: Routes = [
  {path: '', redirectTo: 'advertisment/index', pathMatch: 'full'},
  {path: 'advertisment/index', component: IndexComponent},
  {path: 'advertisment/:id/view', component: ViewComponent},
  {path: 'advertisment/create', component: CreateComponent},
  {path: 'advertisment/:id/edit', component: EditComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
