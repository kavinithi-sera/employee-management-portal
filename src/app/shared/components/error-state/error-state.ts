import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatIconModule],
  selector: 'app-error-state',
  styleUrl: './error-state.scss',
  templateUrl: './error-state.html',
})
export class ErrorState {
  message = input.required<string>();
}
