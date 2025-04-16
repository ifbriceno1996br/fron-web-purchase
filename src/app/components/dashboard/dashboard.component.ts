import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RequestService } from '../../services/request.service';
import { PurchaseRequest } from '../../interfaces/purchase-request.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  showAudit = false;
  purchaseRequests: PurchaseRequest[] = [];
  filteredRequests: PurchaseRequest[] = [];
  selectedStatus: string = 'todos';
  
  currentRole: string = '';
  currentUser: any = null;
  showModal: boolean = false;
  selectedRequest: PurchaseRequest | null = null;
  modalTitle: string = '';
  isRejection: boolean = false;

  constructor(
    private requestService: RequestService,
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.currentUser;
  }

  ngOnInit(): void {
    this.loadCurrentRole();
    this.loadRequests();

    // Suscribirse a cambios en el rol
    this.authService.currentRoleObservable.subscribe((role: string) => {
      this.currentRole = role;
    });
  }

  loadRequests() {
    this.requestService.getRequests().subscribe({
      next: (requests) => {
        this.purchaseRequests = requests;
        this.filteredRequests = requests;
      },

      error: (error) => {
        console.error('Error loading requests:', error);
      }
    });
  }

  onStatusFilterChange(status: string) {
    this.selectedStatus = status;
    if (status === 'todos') {
      this.filteredRequests = this.purchaseRequests;
    } else {
      this.filteredRequests = this.purchaseRequests.filter(
        request => request.status.toLowerCase() === status
      );
    }
  }

  downloadReport() {
    this.requestService.downloadReport().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `solicitudes_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading report:', error);
      }
    });
  }

  downloadUserStatsReport() {
    this.requestService.downloadReportUserStats().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `solicitudes_usuario_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Error downloading user stats report:', error);
      }
    });
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pendiente': 'pending',
      'aprobado': 'approved',
      'rechazado': 'rejected'
    };
    return statusMap[status.toLowerCase()] || 'pending';
  }

  onApproveRequest(request: PurchaseRequest) {
    this.selectedRequest = request;
    this.isRejection = false;
    this.modalTitle = 'Aprobar Solicitud';
    
    if (request.amount > 500) {
      this.showModal = true;
    } else {
      this.updateRequestStatus(request.id, 'aprobado', '');
    }
  }

  onRejectRequest(request: PurchaseRequest) {
    this.selectedRequest = request;
    this.isRejection = true;
    this.modalTitle = 'Rechazar Solicitud';
    this.showModal = true;
  }

  viewComments(request: PurchaseRequest) {
    this.selectedRequest = request;
    this.modalTitle = 'Comentarios de la Solicitud';
    this.showModal = true;
  }

  onModalClose() {
    this.showModal = false;
    this.selectedRequest = null;
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error al cerrar sesión:', error);
      }
    });
  }

  onModalSubmit(comment: string | null) {
    if (this.selectedRequest) {
      const status = this.isRejection ? 'rechazado' : 'aprobado';
      this.updateRequestStatus(this.selectedRequest.id, status, comment || '');
      this.showModal = false;
      this.selectedRequest = null;
    }
  }

  private loadCurrentRole() {
    this.currentRole = this.authService.getCurrentRole() || '';
  }

  private updateRequestStatus(requestId: number, status: string, comment: string) {
    this.requestService.updateRequestStatus(requestId, status, comment).subscribe({
      next: () => {
        this.loadRequests();
      },
      error: (error) => {
        console.error('Error updating request status:', error);
      }
    });
  }
}
