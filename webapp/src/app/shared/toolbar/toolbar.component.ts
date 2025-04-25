import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {MatAnchor, MatButton, MatIconButton} from "@angular/material/button";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatToolbar, MatToolbarRow} from "@angular/material/toolbar";
import {RouterLink} from "@angular/router";
import {filter, Observable, switchMap} from "rxjs";
import {environment} from "@env/.environment";
import {MatIcon} from "@angular/material/icon";
import {Profile} from "../../core/model/profile.model";
import {ProfilesService} from "../../core/services/profiles.service";
import {subscribe} from "@angular/fire/data-connect";

@Component({
  selector: 'app-toolbar',
  imports: [
    AsyncPipe,
    MatAnchor,
    MatIconButton,
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

  @Input()
  hasLogin!: Observable<Boolean>;
  displayName!: string;

  @Output()
  logoutEvent: EventEmitter<any> = new EventEmitter();

  constructor(private profileService: ProfilesService) {
  }

  ngOnChanges(changes: SimpleChanges): void {

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
    }
  }

  ngOnInit() {

  }

  logout(){
    this.logoutEvent.emit();
  }

}
