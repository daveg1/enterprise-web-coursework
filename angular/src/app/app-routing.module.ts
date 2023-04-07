import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './pages/account/account.component';
import { AdminComponent } from './pages/admin/admin.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { QuoteComponent } from './pages/quote/quote.component';
import { SignupComponent } from './pages/signup/signup.component';

const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'account', component: AccountComponent },
	{ path: 'admin', component: AdminComponent }, // TODO add route guard
	{ path: 'login', component: LoginComponent },
	{ path: 'signup', component: SignupComponent },
	{ path: 'quote/:id', component: QuoteComponent },
	{ path: '**', redirectTo: '' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
