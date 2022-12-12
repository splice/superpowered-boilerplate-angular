import { Injectable } from '@angular/core';

// @ts-ignore
import '../assets/js/Superpowered.js';

const minimumSampleRate = 48000;
const superPoweredLocation = "/assets/Superpowered.js";

@Injectable({
  providedIn: 'root',
})
export class AudioEngineService {
  // @ts-ignore
  superpowered;
  initted = false;
  // @ts-ignore
  webaudioManager;
  // @ts-ignore
  userInputStream;
  // @ts-ignore
  audioInputNode;

  loadSuperpoweredLibrary = async (wasmPublicLocation: any) => {
    // @ts-ignore
    this.superpowered = await SuperpoweredGlue.Instantiate(
      'ExampleLicenseKey-WillExpire-OnNextUpdate',
      superPoweredLocation
    );
    console.log(`Running Superpowered v${this.superpowered.Version()}`);
    this.initted = true;
      // @ts-ignore
    this.webaudioManager = new SuperpoweredWebAudio(
      minimumSampleRate,
      this.superpowered
    );
  };

  startUserInputStream = async () => {
    if (this.initted && !this.userInputStream) {
      this.userInputStream =
        await this.webaudioManager.getUserMediaForAudioAsync({
          fastAndTransparentAudio: true,
        });
      if (!this.userInputStream) return;

      this.audioInputNode =
        this.webaudioManager.audioContext.createMediaStreamSource(
          this.userInputStream
        );
    }
  };

  getSampleRate() {
    return this.webaudioManager.audioContext.sampleRate;
  }

  getEstimatedLatency() {
    return this.webaudioManager.audioContext.baseLatency;
  }
}
