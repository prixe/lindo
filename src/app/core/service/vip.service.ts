import { Injectable } from '@angular/core';
import { ApplicationService } from 'app/core/electron/application.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class VipService {

    constructor(
        private applicationService: ApplicationService,
        private http: HttpClient
    ) { }

    public getStatus(): number {
        //TODO
        return 0;
    }

    public getExpiration(): Date {
        //TODO
        return new Date();
    }
}
