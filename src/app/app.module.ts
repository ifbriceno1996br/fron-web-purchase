import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RoleSelectorComponent } from './components/role-selector/role-selector.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CommentModalComponent } from './components/comment-modal/comment-modal.component';
import { AuditLogComponent } from './components/audit-log/audit-log.component';
import { RequestFormComponent } from './components/request-form/request-form.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RoleSelectorComponent,
    DashboardComponent,
    CommentModalComponent,
    AuditLogComponent,
    RequestFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    registerLocaleData(localeEs);
  }
}
