import {AfterRenderRef, Component, EventEmitter, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {environment} from "@env/.environment";
import {AuthService} from "./core/services/auth.service";
import {ToolbarComponent} from "./shared/toolbar/toolbar.component";
import {ProfilesService} from "./core/services/profiles.service";
import {MessagesService} from "./core/services/messages.service";
import {MessageDto} from "./core/dto/message.dto";
import {MessageComponent} from "./shared/message/message.component";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToolbarComponent, MessageComponent, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true
})
export class AppComponent implements OnChanges, OnInit {
  displayName = ""
  title = environment.applicationName;
  currentYear = new Date().getFullYear()
  currentMessage: MessageDto = {type:"info", hasMessage : false};


  constructor(private authService: AuthService, private router: Router, public messageService: MessagesService) {
    this.messageService.currentMessage$.subscribe(msg => {

    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("ngOnChanges changes", changes);
  }

  ngOnInit() {
    console.log("ngOnInit()");
  }

  logout($event:EventEmitter<any>){
    this.authService.logout().subscribe(async () => {
      this.messageService.sendMessage("info", "Vous vous êtes déconnecté");
      await this.router.navigate(['user/login']);
    });
  }
}
