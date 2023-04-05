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
import { DialogComponent } from './components/dialog/dialog.component';
import { SaveQuoteDialogComponent } from './components/dialog/save-quote-dialog/save-quote-dialog.component';
import { XButtonComponent } from './components/buttons/x-button/x-button.component';
import { CalculatorFormComponent } from './components/calculator-form/calculator-form.component';

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		NavbarComponent,
		AccountComponent,
		LoginComponent,
		SignupComponent,
		UserNoticeComponent,
		PageTitleComponent,
		DialogComponent,
		SaveQuoteDialogComponent,
  XButtonComponent,
  CalculatorFormComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		ReactiveFormsModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
