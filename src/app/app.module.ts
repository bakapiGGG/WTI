import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AgGridModule } from 'ag-grid-angular';
import { MenubarComponent } from './menubar/menubar.component'; // AG Grid Module
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule} from '@angular/material/button-toggle';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { StakeholdersComponent } from './stakeholders/stakeholders.component';
import { ResearchComponent } from './research/research.component';
import { FAQComponent } from './faq/faq.component';
import { ContactComponent } from './contact/contact.component';
import { JoinUsComponent } from './join-us/join-us.component';
import { LoginUserComponent } from './login-user/login-user.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { HttpClientModule } from '@angular/common/http';
import 'ag-grid-enterprise';
import { MetricSparklineComponent } from './metric-sparkline/metric-sparkline.component';
import { EfficiencyModalContentComponent } from './efficiency-modal-content/efficiency-modal-content.component';




@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MenubarComponent,
    AboutComponent,
    HomeComponent,
    StakeholdersComponent,
    ResearchComponent,
    FAQComponent,
    ContactComponent,
    JoinUsComponent,
    LoginUserComponent,
    LoginAdminComponent,
    MetricSparklineComponent,
    EfficiencyModalContentComponent,
  ],
  
  imports: [
    BrowserModule,
    AppRoutingModule,
    AgGridModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    HttpClientModule,
    BsDropdownModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
