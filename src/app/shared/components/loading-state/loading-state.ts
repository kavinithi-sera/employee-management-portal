import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  imports: [MatProgressSpinnerModule],
  selector: 'app-loading-state',
  styleUrl: './loading-state.scss',
  templateUrl: './loading-state.html',
})
export class LoadingState {}
