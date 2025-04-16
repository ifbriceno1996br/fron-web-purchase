import { Component, OnInit } from '@angular/core';
import { AuditService } from '../../services/audit.service';
import { Audit } from '../../interfaces/audit.interface';

@Component({
  selector: 'app-audit-log',
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.scss']
})
export class AuditLogComponent implements OnInit {
  auditLogs: Audit[] = [];
  filteredLogs: Audit[] = [];
  searchRequestId: number | null = null;
  loading = true;

  constructor(private auditService: AuditService) {}

  ngOnInit(): void {
    this.loadAuditLogs();
  }

  private loadAuditLogs(): void {
    this.auditService.getAuditLogs().subscribe({
      next: (logs) => {
        this.auditLogs = logs;
        this.filteredLogs = logs;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading audit logs:', error);
        this.loading = false;
      }
    });
  }

  getActionIcon(action: string): string {
    switch (action) {
      case 'create':
        return 'fa-plus-circle';
      case 'status_change':
        return 'fa-exchange-alt';
      default:
        return 'fa-info-circle';
    }
  }

  getRoleName(role: string): string {
    const roleMap: { [key: string]: string } = {
      'supervisor': 'Supervisor',
      'requester': 'Solicitante',
      'approver': 'Aprobador'
    };
    return roleMap[role] || role;
  }

  getActionText(action: string): string {
    switch (action) {
      case 'create':
        return 'Creación de solicitud';
      case 'status_change':
        return 'Cambio de estado';
      default:
        return action;
    }
  }

  getStatusClass(status: string | null): string {
    if (!status) return '';
    switch (status.toLowerCase()) {
      case 'aprobado':
        return 'approved';
      case 'rechazado':
        return 'rejected';
      default:
        return 'pending';
    }
  }

  onSearchChange(): void {
    if (this.searchRequestId) {
      this.filteredLogs = this.auditLogs.filter(log => 
        log.request_id === this.searchRequestId
      );
    } else {
      this.filteredLogs = this.auditLogs;
    }
  }

  clearSearch(): void {
    this.searchRequestId = null;
    this.filteredLogs = this.auditLogs;
  }
}
