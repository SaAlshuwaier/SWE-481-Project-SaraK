import { Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/AuthService';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  showConfirm = signal<boolean>(false);

    openLogoutModal(): void {
    this.showConfirm.set(true);
  }

    closeLogoutModal(): void {
      this.showConfirm.set(false);
    }

    confirmLogout(): void {
      this.showConfirm.set(false);
      this.logout();
    }


  logout() {

    this.auth.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      }
    });

  }

}