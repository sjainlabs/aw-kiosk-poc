import {Component, OnInit} from '@angular/core';
import {AppStatusService} from '../../service/app-status.service';
import {AudioService} from '../../service/audio.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  isBackendHealthy = false;
  transcript = '';
  isListening = false;
  constructor( private appStatus: AppStatusService,
               private audio: AudioService) {}

  ngOnInit() {
    // this.appStatus.backendHealthy$.subscribe(ok => {
    //   console.log('Backend health:', ok);
    // });

    this.audio.transcript$.subscribe(text => {
      this.transcript = text;
    });
    this.audio.isListening$.subscribe(isListening => {
      this.isListening = isListening;
    });
  }


  onMicTap() {
    this.transcript = 'Listening...';

    // FIX: initialize mic before streaming
    this.audio.init().then(() => {
      this.audio.startStreaming();
    });
  }

  onMicStop() {
    this.audio.stopStreaming();
    this.transcript = 'Stopped';
  }



}
