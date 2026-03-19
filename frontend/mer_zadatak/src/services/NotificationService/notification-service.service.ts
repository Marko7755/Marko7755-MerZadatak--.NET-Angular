import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private router: Router) { }

  successNotification(title: string, message: string) {
    Swal.fire({
      title: title,
      icon: "success",
      text: message
    });
  }

  successNotificationWithConfirmation(title: string, message: string, onConfirm: () => void) {
    Swal.fire({
      title: title,
      icon: "success",
      text: message
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      }
    });
  }

  errorNotification(title: string, message: string) {
    Swal.fire({
      title: title,
      icon: "error",
      text: message
    });
  }

  errorNotificationWithConfirmation(title: string, message: string, onConfirm: () => void) {
  Swal.fire({
    title: title,
    icon: "error",
    text: message
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
    }
  });
}


  warningNotification(title: string, message: string) {
    Swal.fire({
      title: title,
      icon: "warning",
      text: message
    });
  }

  authentificationMessageSuccess(title: string, message: string) {
    Swal.fire({
      title: title,
      icon: "success",
      text: message,
      timer: 4000,
      timerProgressBar: true,
      showConfirmButton: false
    })
  }

  logoutMessageSuccess(title: string, text: string) {
    Swal.fire({
      title: title,
      text: text,
      icon: "success",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    })
  }

  successNotificationRegisterWithRedirection(title: string, message: string) {
    Swal.fire({
      title: title,
      text: message + ' redirecting to login...',
      icon: 'success',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false
    }).then(() => {
      this.router.navigate(['/login']);
    });
  }

  successNotificationRegisterWithRedirectionConfirmation(title: string, message: string) {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      showConfirmButton: true,
      confirmButtonText: 'Return to login',
      customClass: {
        confirmButton: 'swal-custom-confirm-btn'
      },
      buttonsStyling: false
    }).then(() => {
      this.router.navigate(['/login']);
    });
  }

  confirmCancelNotification(action: string, callback: () => void) {
  Swal.fire({
    title: "Are you sure?",
    text: `Are you sure you want to ${action}?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#e64a19",
    cancelButtonColor: "#d33",
    confirmButtonText: `Yes, ${action}!`
  }).then((result) => {
    if (result.isConfirmed) {
      callback();
    }
  });
}



}
