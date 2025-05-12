import {AfterRenderRef, Component, EventEmitter, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {environment} from "@env/.environment";
import {AuthService} from "./core/services/auth.service";
import {ToolbarComponent} from "./shared/toolbar/toolbar.component";
import {ProfilesService} from "./core/services/profiles.service";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToolbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent implements OnChanges, OnInit {
  displayName = ""
  title = environment.applicationName;
  currentYear = new Date().getFullYear()


  constructor(private authService: AuthService, private router: Router) {
  }


  ngOnChanges(changes: SimpleChanges): void {
        console.log("ngOnChanges changes", changes);
  }

  ngOnInit() {
    console.log("ngOnInit()");
  }

  logout($event:EventEmitter<any>){
    this.authService.logout().subscribe(async () => {
      await this.router.navigate(['user/login'], {queryParams : {logout:true}});
    });
  }
}
