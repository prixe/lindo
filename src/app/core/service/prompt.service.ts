import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { default as swal, SweetAlertOptions } from 'sweetalert2';

@Injectable()
export class PromptService {
    constructor(private translate: TranslateService) {
        swal.setDefaults({
            buttonsStyling: false,
            reverseButtons: true,
            allowOutsideClick: false,
            confirmButtonClass: 'mat-primary mat-raised-button',
            cancelButtonClass: 'mat-warn mat-raised-button',
            target: "body"
        });
    }

    close() {
        swal.close();
    }

    public custom(options: SweetAlertOptions) {
        swal.setDefaults({
            type: undefined
        });

        return swal(options);
    }

    public confirm(options: SweetAlertOptions) {
        swal.setDefaults({
            type: "question",
            title: this.translate.instant("app.prompt.title.confirm"),

            confirmButtonText: this.translate.instant("app.prompt.button.confirm"),
            confirmButtonClass: 'mat-primary mat-raised-button spacing-left',

            showCancelButton: true,
            cancelButtonText: this.translate.instant("app.prompt.button.cancel"),
            cancelButtonClass: 'mat-warn mat-raised-button',
        });

        return swal(options);
    }

    public info(options: SweetAlertOptions) {
        swal.setDefaults({
            type: "info",
            title: this.translate.instant("app.prompt.title.info"),

            confirmButtonText: this.translate.instant("app.prompt.button.close"),

            showCancelButton: false
        });

        return swal(options);
    }


    public success(options: SweetAlertOptions) {
        swal.setDefaults({
            type: "success",
            title: this.translate.instant("app.prompt.title.success"),

            confirmButtonText: this.translate.instant("app.prompt.button.close"),

            showCancelButton: false
        });

        return swal(options);
    }

    public alert(options: SweetAlertOptions) {
        swal.setDefaults({
            type: "error",
            title: this.translate.instant("app.prompt.title.error"),

            confirmButtonText: this.translate.instant("app.prompt.button.close"),

            showCancelButton: false
        });

        return swal(options);
    }
}
