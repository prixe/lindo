import {Component, NgZone, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import * as marked from 'marked';
import {ApplicationService} from "@services/electron/application.service";

const fs = fsLib;

@Component({
    templateUrl: './changelog.component.html',
    styleUrls: ['./changelog.component.scss']
})
export class ChangeLogComponent implements OnInit {
    public versions: Array<string>;

    public versionList: Array<Object>;
    public versionContent: string;
    public versionNumber: string;
    public versionDate: Date;

    public lexedContent: Array<Object>;

    constructor(
        public dialogRef: MatDialogRef<ChangeLogComponent>,
        private zone: NgZone,
        private applicationService: ApplicationService,
    ) {
    }

    ngOnInit() {
        marked.setOptions({
            gfm: true,
            tables: true,
            breaks: true,
            sanitize: true,
            smartLists: true,
            smartypants: true
        });

        fs.readFile(this.applicationService.appPath + '/CHANGELOG.md', { encoding: 'utf-8' }, (err: any, data: any) => {
            this.zone.run(() => {
                // On parse le fichier
                this.lexedContent = marked.lexer(data);

                // On remplie les variables
                this.populateVersion();
                this.populateList();

                // On choisi la première version (TODO pouvoir passer la version ciblé dans l'URL)
                this.changeVersion(this.versions[0]);
            });
        });
    }

    private populateVersion(): void {
        const filteredContent = this.lexedContent.filter((node: any) => {
            return (node.depth == 2 && node.type == "heading");
        });

        let nodeVersion: any;
        const versionArray: Array<string> = [];
        for (nodeVersion of filteredContent) {
            if (!nodeVersion.text.startsWith('⚠')) {
                versionArray.push(nodeVersion.text);
            }
        }

        this.versions = versionArray
    }

    private populateList() {
        let version: any;
        const versionArray: { number: string, date: Date }[] = [];

        for (version of this.versions) {
            const splitedVersion: Array<string> = version.split(" - ");
            const versionNumber = splitedVersion[0].replace(/^[\[]+|[\]]+$/g, "");
            const versionDate = new Date(splitedVersion[1]);

            versionArray.push({ number: versionNumber, date: versionDate });
        }

        this.versionList = versionArray;
    }

    public selectVersion($event, version: string) {
        this.changeVersion(version);

        const old = document.querySelector(".tab-bar-item.selected");
        if (old !== undefined) {
            old.classList.remove("selected");
        }
        const target = $event.target.classList.add("selected");
    }

    private changeVersion(version: string): void {
        let node: any;
        let record: boolean = false;
        const result: Array<Object> = [];

        for (node of this.lexedContent) {
            // Lors de la rencontre du titre recherché, on commence l'enregistrement pour stocker toute les lignes qui suivents
            // On stock au passage la version et la date que l'on va afficher au dessus du contenu.
            if (node["depth"] == 2 && node["type"] == "heading" && node["text"].indexOf(version) >= 0) {
                const splitedVersion: Array<string> = node["text"].split(" - ");
                this.versionNumber = splitedVersion[0].replace(/^[\[]+|[\]]+$/g, "");
                this.versionDate = new Date(splitedVersion[1]);

                record = true;
            }

            // On arrête l'enregistrement des lignes si on rencontre un deuxième titre
            if (node["depth"] == 2 && node["type"] == "heading" && node["text"].indexOf(version) == -1) {
                record = false;
            }

            // Si l'enregistrement est actif, alors on stock la ligne dans un tableau
            if (record == true) {
                //Exclusion du titre car c'est fait manuellement
                if (node["depth"] != 2 || node["type"] != "heading") {
                    result.push(node);
                }
            }
        }

        result["links"] = {};

        this.versionContent = marked.parser(result);
    }
}
