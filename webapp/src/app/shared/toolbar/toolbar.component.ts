import {Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {MatAnchor, MatButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatToolbar, MatToolbarRow} from "@angular/material/toolbar";
import {RouterLink} from "@angular/router";
import {map} from "rxjs";
import {environment} from "@env/.environment";
import {MatIcon} from "@angular/material/icon";
import {ProfilesService} from "../../core/services/profiles.service";
import {AuthService} from "../../core/services/auth.service";

@Component({
  selector: 'app-toolbar',
  imports: [
    AsyncPipe,
    MatAnchor,
    MatMenu,
    MatMenuItem,
    MatToolbar,
    MatToolbarRow,
    RouterLink,
    MatMenuTrigger,
    MatIcon,
    MatButton,
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent implements OnInit, OnChanges {

  titleApp = environment.applicationName;

  hasLogin = this.authService.hasLogin;
  isAdmin = this.profileService.isAdmin;

  displayName = this.profileService.getDisplayName().pipe(map(user => user.username));

  @Output()
  logoutEvent: EventEmitter<any> = new EventEmitter();

  constructor(private authService: AuthService, private profileService: ProfilesService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    /*console.log(changes);

    if(changes['hasLogin'].currentValue) {
      console.log("On n'y est !");
      this.profileService.getDisplayName().subscribe({
        next: result => {
          {
            console.log("username", result);
            this.displayName = result.username;
          }
        },
        error: error => {
          console.log(error);
        }
      });
    }*/
  }

  ngOnInit() {
    //console.log("Toolbar - ngOnInit");
  }

  logout(){
    this.logoutEvent.emit();
  }

}
