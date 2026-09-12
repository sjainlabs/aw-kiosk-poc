export class AppComponent {
  transcript = '';

  onMicTap() {
    console.log('Mic tapped');
    // For now, just fake a transcript:
    this.transcript = 'Listening... (this will be real speech later)';
  }
}
