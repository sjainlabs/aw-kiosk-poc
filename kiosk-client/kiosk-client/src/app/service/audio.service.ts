import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AudioService {
  private mediaRecorder?: MediaRecorder;
  private ws?: WebSocket;

  transcript$ = new BehaviorSubject<string>("");
  isListening$ = new BehaviorSubject<boolean>(false);

  async init() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

    this.mediaRecorder.ondataavailable = (event) => {
      console.log("Audio chunk:", event.data);
      if (event.data.size > 0 && this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(event.data);
      }
    };
  }

  startStreaming() {
    console.log('message in streaming started:');
    this.ws = new WebSocket('ws://localhost:8787/asr');
    this.isListening$.next(true);

    this.ws.addEventListener("open", () => {
      this.mediaRecorder?.start(250);
      this.transcript$.next("Listening...");
      console.log("listening")
    });



    this.ws.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      console.log('message in streaming:', data);
      if (data.transcript) {
        this.transcript$.next(data.transcript);
        console.log('message in transcript:', data);
      }
    });
  }

  stopStreaming() {
    console.log("Stopping streaming...");
    try {
      this.mediaRecorder?.stop();
    } catch (e) {
      console.warn("MediaRecorder stop failed:", e);
    }

    try {
      this.ws?.close();
    } catch (e) {
      console.warn("WS close failed:", e);
    }

    this.isListening$.next(false);
    this.transcript$.next("Stopped");
  }

}
