import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-role-selector',
  templateUrl: './role-selector.component.html',
  styleUrls: ['./role-selector.component.scss']
})
export class RoleSelectorComponent implements OnInit {
  availableRoles: string[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser;
    if (user) {
      this.availableRoles = user.roles;
    }
  }

  selectRole(role: string) {
    this.authService.setCurrentRole(role);
    this.router.navigate(['/dashboard']);
  }
}
