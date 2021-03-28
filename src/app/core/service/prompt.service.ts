import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { default as Swal, SweetAlertOptions } from 'sweetalert2';

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
            confirmButtonClass: 'mat-primary mat-raised-button',
            cancelButtonClass: 'mat-warn mat-raised-button',
            target: "body",
            type: undefined
        })

        return Toast.fire(options);
    }

    public confirm(options: SweetAlertOptions) {

        const Toast = Swal.mixin({

            buttonsStyling: false,
            reverseButtons: true,
            allowOutsideClick: false,
            target: "body",

            type: "question",
            title: this.translate.instant("app.prompt.title.confirm"),

            confirmButtonText: this.translate.instant("app.prompt.button.confirm"),
            confirmButtonClass: 'mat-primary mat-raised-button spacing-left',

            showCancelButton: true,
            cancelButtonText: this.translate.instant("app.prompt.button.cancel"),
            cancelButtonClass: 'mat-warn mat-raised-button',
        })

        return Toast.fire(options);
    }

    public info(options: SweetAlertOptions) {

        const Toast = Swal.mixin({

            buttonsStyling: false,
            reverseButtons: true,
            allowOutsideClick: false,
            confirmButtonClass: 'mat-primary mat-raised-button',
            cancelButtonClass: 'mat-warn mat-raised-button',
            target: "body",

            type: "info",
            title: this.translate.instant("app.prompt.title.info"),

            confirmButtonText: this.translate.instant("app.prompt.button.close"),

            showCancelButton: false
        })

        return Toast.fire(options);
    }


    public success(options: SweetAlertOptions) {

        const Toast = Swal.mixin({

            buttonsStyling: false,
            reverseButtons: true,
            allowOutsideClick: false,
            confirmButtonClass: 'mat-primary mat-raised-button',
            cancelButtonClass: 'mat-warn mat-raised-button',
            target: "body",

            type: "success",
            title: this.translate.instant("app.prompt.title.success"),

            confirmButtonText: this.translate.instant("app.prompt.button.close"),

            showCancelButton: false
        })

        return Toast.fire(options);
    }

    public alert(options: SweetAlertOptions) {

        const Toast = Swal.mixin({

            buttonsStyling: false,
            reverseButtons: true,
            allowOutsideClick: false,
            confirmButtonClass: 'mat-primary mat-raised-button',
            cancelButtonClass: 'mat-warn mat-raised-button',
            target: "body",

            type: "error",
            title: this.translate.instant("app.prompt.title.error"),

            confirmButtonText: this.translate.instant("app.prompt.button.close"),

            showCancelButton: false
        })

        return Toast.fire(options);
    }
}
