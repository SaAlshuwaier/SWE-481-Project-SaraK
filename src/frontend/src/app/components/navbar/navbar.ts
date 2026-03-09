import { Component } from '@angular/core';
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

  confirmLogout() {

    const confirmAction = confirm("Are you sure you want to logout?");

    if (confirmAction) {
      this.logout();
    }

  }

  logout() {

    this.auth.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      }
    });

  }

}