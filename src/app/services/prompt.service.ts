import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {default as Swal, SweetAlertOptions} from 'sweetalert2';

@Injectable()
export class PromptService {

    constructor(private translate: TranslateService) {

    }

    close() {
        Swal.close();
    }

    public custom(options: SweetAlertOptions) {

        const Toast = Swal.mixin({
            buttonsStyling: false,
            reverseButtons: true,
            allowOutsideClick: false,
            heightAuto: false,
            customClass: {
                confirmButton: 'mat-primary mat-raised-button',
                denyButton: 'mat-warn mat-raised-button'
            },
            target: "body",
            icon: undefined
        })

        return Toast.fire(options);
    }

    public confirm(options: SweetAlertOptions) {

        const Toast = Swal.mixin({

            buttonsStyling: false,
            reverseButtons: true,
            allowOutsideClick: false,
            target: "body",
            heightAuto: false,

            icon: "question",
            title: this.translate.instant("app.prompt.title.confirm"),

            confirmButtonText: this.translate.instant("app.prompt.button.confirm"),
            customClass: {
                confirmButton: 'mat-primary mat-raised-button',
                denyButton: 'mat-warn mat-raised-button'
            },
            showDenyButton: true,
            denyButtonText: this.translate.instant("app.prompt.button.cancel")
        })

        return Toast.fire(options);
    }

    public info(options: SweetAlertOptions) {

        const Toast = Swal.mixin({

            buttonsStyling: false,
            reverseButtons: true,
            allowOutsideClick: false,
            heightAuto: false,
            customClass: {
                confirmButton: 'mat-primary mat-raised-button',
                denyButton: 'mat-warn mat-raised-button'
            },
            target: "body",

            icon: "info",
            title: this.translate.instant("app.prompt.title.info"),

            confirmButtonText: this.translate.instant("app.prompt.button.close"),

            showDenyButton: false
        })

        return Toast.fire(options);
    }


    public success(options: SweetAlertOptions) {

        const Toast = Swal.mixin({

            buttonsStyling: false,
            reverseButtons: true,
            allowOutsideClick: false,
            heightAuto: false,
            customClass: {
                confirmButton: 'mat-primary mat-raised-button',
                denyButton: 'mat-warn mat-raised-button'
            },
            target: "body",

            icon: "success",
            title: this.translate.instant("app.prompt.title.success"),

            confirmButtonText: this.translate.instant("app.prompt.button.close"),

            showDenyButton: false
        })

        return Toast.fire(options);
    }

    public alert(options: SweetAlertOptions) {

        const Toast = Swal.mixin({

            buttonsStyling: false,
            reverseButtons: true,
            allowOutsideClick: false,
            heightAuto: false,
            customClass: {
                confirmButton: 'mat-primary mat-raised-button',
                denyButton: 'mat-warn mat-raised-button'
            },
            target: "body",

            icon: "error",
            title: this.translate.instant("app.prompt.title.error"),

            confirmButtonText: this.translate.instant("app.prompt.button.close"),

            showDenyButton: false
        })

        return Toast.fire(options);
    }
}
