import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { HealthService, HealthResponse } from './services/health';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    JsonPipe
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');

  result = signal<HealthResponse | null>(null);
  error = signal<string | null>(null);

  constructor(private health: HealthService) {}

  pingBackend() {
    this.result.set(null);
    this.error.set(null);

    this.health.getHealth().subscribe({
      next: (res) => this.result.set(res),
      error: (err) => this.error.set(err?.message ?? 'Request failed'),
    });
  }
}

//
/*
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('default-angular');
}

  --> */