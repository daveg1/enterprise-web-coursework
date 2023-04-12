import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AccountComponent } from './pages/account/account.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { UserNoticeComponent } from './components/user-notice/user-notice.component';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { XButtonComponent } from './components/buttons/x-button/x-button.component';
import { CalculatorFormComponent } from './components/calculator-form/calculator-form.component';
import { AdminComponent } from './pages/admin/admin.component';
import { QuoteComponent } from './pages/quote/quote.component';
import { ExpanderButtonComponent } from './components/buttons/expander-button/expander-button.component';
import { ButtonDirective } from './directives/app-button.directive';
import { ProjectNameDialogComponent } from './components/dialogs/project-name-dialog/project-name-dialog.component';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { NewPaygradeDialogComponent } from './components/dialogs/new-paygrade-dialog/new-paygrade-dialog.component';

const pages = [
	AccountComponent,
	AdminComponent,
	HomeComponent,
	LoginComponent,
	QuoteComponent,
	SignupComponent,
];

const components = [
	ExpanderButtonComponent,
	XButtonComponent,
	CalculatorFormComponent,
	ProjectNameDialogComponent,
	NavbarComponent,
	PageTitleComponent,
	UserNoticeComponent,
];

const directives = [ButtonDirective];

@NgModule({
	declarations: [AppComponent, ...pages, ...components, ...directives, NewPaygradeDialogComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		ReactiveFormsModule,
		DialogModule,
	],
	providers: [Dialog],
	bootstrap: [AppComponent],
})
export class AppModule {}
