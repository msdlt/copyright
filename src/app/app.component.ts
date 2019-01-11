import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { 
    faBook, 
    faCheckCircle, 
    faTimesCircle, 
    faQuestionCircle,
    faChalkboardTeacher,
    faVideo,
    faFile,
    faComments,
    faEnvelope,
    faExternalLinkAlt,
    faShareSquare
} from '@fortawesome/free-solid-svg-icons';

    
    enum Uses {
        Presentation, //Presentation or lecture, faChalkboardTeacher
        Recording, //Recorded presentation or lecture, faVideo
        Handout, //Distribute as a handout, faFile
        VLE, //Embed in VLE materials, faComments
        Email, //Share by email, faEnvelope
        Website, //Use on a public website or in an Open Educational Resource (OER), faExternalLinkAlt
        Share //Share it on social media or via a cloud service, faShareSquare
    };
    namespace Uses {  //this allows me to *ngFor the enum - see: https://stackoverflow.com/a/53652596/2235210
        export function keys() {
            return Object.keys(Uses).filter(k => !isNaN(Number(k)));
        }
    }

    enum Statuses {
        Free, //0 - Free to use,
        FreeCLA, //1 - Free to use IF CLA licensed
        May, //2 - You MAY be able to use, //Recorded presentation or lecture,
        Forbidden, //3 - Not permitted
        NA //4 = not appropriate for this use IE don't shiow in UI
    };
    namespace Statuses {
        export function keys() {
            return Object.keys(Statuses).filter(k => !isNaN(Number(k)));
        }
    }

    enum Materials {
        Text, 
        Video, 
        Audio, 
        Image 
    };
    namespace Materials {
        export function keys() {
            return Object.keys(Materials).filter(k => !isNaN(Number(k)));
        }
    }

    enum Licences {
        CLA, //CLA licence 
        FairDealing, //\"fair dealing\" exception
        Research //\"research and private study\" exception
    };
    namespace Licences {
        export function keys() {
            return Object.keys(Licences).filter(k => !isNaN(Number(k)));
        }
    }

    enum Reproductions {
        Quotation, //Quotation
        TextExtract, //Extract <400 words
        ScoreExtract, //Extract from music score
        ChapterPrinted//Printed book chapter (photocopy or scan of printed book)
    };
    namespace Reproductions {
        export function keys() {
            return Object.keys(Reproductions).filter(k => !isNaN(Number(k)));
        }
    }

    interface ItemReproductionUse { 
        use: Uses, 
        status: Statuses, 
        licences: Licences[], 
        explanation: string 
    };

    interface ItemMaterialReproduction { 
        type: Materials, 
        reproduction: Reproductions,     
        status: Statuses, 
        licences: Licences[], 
        explanation: string 
    };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'Copyright';
    faBook = faBook;
    faCheckCircle = faCheckCircle;
    faTimesCircle = faTimesCircle;
    faQuestionCircle = faQuestionCircle;
    faChalkboardTeacher = faChalkboardTeacher;
    faVideo = faVideo;
    faFile = faFile;
    faComments = faComments;
    faEnvelope = faEnvelope;
    faExternalLinkAlt = faExternalLinkAlt;
    faShareSquare = faShareSquare;
    
    mobileQuery: MediaQueryList;
    
    usesType = Uses;
    statusesType = Statuses;
    materialsType = Materials;
    licencesType = Licences;
    reproductionsType = Reproductions;
    filters = [];
    
    private _mobileQueryListener: () => void;
    
    // Store a reference to the enums (must be public for --AOT to work)
    //required to make enums available in html: https://stackoverflow.com/a/44662893/2235210
    public EnumTable = { 
        Uses: Uses, 
        Statuses: Statuses, 
        Materials: Materials, 
        Licences: Licences,
        Reproductions: Reproductions
    };
    
    itemReproductions: { type: Materials, reproduction: Reproductions, reproductionUses: ItemReproductionUse[] }[] = [];
    itemUses: { use: Uses, materialReproductions: ItemMaterialReproduction[] }[] = [];
    
    /** BEGIN EDITABLE MATERIAL **/
    
    //Descriptions below are used to convert human-readable enum values back into long-form text
    useDescriptions = {
        "Presentation": "Presentation or lecture",  
        "Recording": "Recorded presentation or lecture",  
        "Handout": "Distribute as a handout", 
        "VLE": "Embed in VLE materials", 
        "Email": "Share by email", 
        "Website": "Public website or Open Educational Resource (OER)", 
        "Share": "Share via social media/cloud service"
    }
    
    reproductionDescriptions = {
        "Quotation": "Quotation",
        "TextExtract": "Extract <400 words",
        "ScoreExtract": "Extract from music score",
        "ChapterPrinted": "Printed book chapter (photocopy or scan of printed book)"
    };
    
    statusDescriptions = {
        "Free": "Free to use",
        "FreeCLA": "Free to use IF CLA licensed",
        "May": "You MAY be able to use",
        "Forbidden": "Not permitted",
        "NA": "Not appropriate"
    };
    
    items: { type: Materials, reproduction: Reproductions, use: Uses, status: Statuses, licences: Licences[], explanation: string }[] = [
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.Quotation, 
            "use": Uses.Presentation, 
            "status": Statuses.Free, 
            "licences": [Licences.CLA, Licences.FairDealing], 
            "explanation": "under terms of CLA licence or \"fair dealing\" exception" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.Quotation, 
            "use": Uses.Recording, 
            "status": Statuses.Free, 
            "licences": [Licences.CLA, Licences.FairDealing], 
            "explanation": "under terms of CLA licence or \"fair dealing\" exception" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.Quotation, 
            "use": Uses.Handout, 
            "status": Statuses.Free, 
            "licences": [Licences.CLA, Licences.FairDealing], 
            "explanation": "under terms of CLA licence or \"fair dealing\" exception" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.Quotation, 
            "use": Uses.VLE, 
            "status": Statuses.Free, 
            "licences": [Licences.CLA, Licences.FairDealing], 
            "explanation": "under terms of CLA licence or \"fair dealing\" exception" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.Quotation, 
            "use": Uses.Email, 
            "status": Statuses.Free, 
            "licences": [Licences.CLA, Licences.FairDealing], 
            "explanation": "under terms of CLA licence or \"fair dealing\" exception" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.Quotation, 
            "use": Uses.Website, 
            "status": Statuses.May, 
            "licences": [Licences.FairDealing], 
            "explanation": "under \"fair dealing\" exception - talk to your librarian" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.Quotation, 
            "use": Uses.Share, 
            "status": Statuses.May, 
            "licences": [Licences.FairDealing], 
            "explanation": "under \"fair dealing\" exception - talk to your librarian" 
        },

        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.TextExtract, 
            "use": Uses.Presentation, 
            "status": Statuses.Free, 
            "licences": [Licences.CLA, Licences.FairDealing], 
            "explanation": "under terms of CLA licence or \"fair dealing\" exception" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.TextExtract, 
            "use": Uses.Recording, 
            "status": Statuses.Free, 
            "licences": [Licences.CLA, Licences.FairDealing], 
            "explanation": "under terms of CLA licence or \"fair dealing\" exception" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.TextExtract, 
            "use": Uses.Handout, 
            "status": Statuses.Free, 
            "licences": [Licences.CLA, Licences.FairDealing], 
            "explanation": "under terms of CLA licence or \"fair dealing\" exception" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.TextExtract, 
            "use": Uses.VLE, 
            "status": Statuses.FreeCLA, 
            "licences": [Licences.CLA], 
            "explanation": "under terms of CLA licence - report to CLA coordinator" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.TextExtract, 
            "use": Uses.Email, 
            "status": Statuses.Free, 
            "licences": [Licences.CLA, Licences.FairDealing], 
            "explanation": "under terms of CLA licence or \"fair dealing\" exception" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.TextExtract, 
            "use": Uses.Website, 
            "status": Statuses.May, 
            "licences": [Licences.FairDealing],
            "explanation": "under \"fair dealing\" exception - talk to your librarian" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.TextExtract, 
            "use": Uses.Share, 
            "status": Statuses.May, 
            "licences": [Licences.FairDealing],
            "explanation": "under \"fair dealing\" exception - talk to your librarian" 
        },

        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ScoreExtract, 
            "use": Uses.Presentation, 
            "status": Statuses.Free, 
            "licences": [Licences.FairDealing],
            "explanation": "under \"fair dealing\" exception" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ScoreExtract, 
            "use": Uses.Recording, 
            "status": Statuses.Free, 
            "licences": [Licences.FairDealing],
            "explanation": "under \"fair dealing\" exception" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ScoreExtract, 
            "use": Uses.Handout, 
            "status": Statuses.Free, 
            "licences": [Licences.FairDealing],
            "explanation": "under \"fair dealing\" exception" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ScoreExtract, 
            "use": Uses.VLE, 
            "status": Statuses.Free, 
            "licences": [Licences.FairDealing],
            "explanation": "under \"fair dealing\" exception"
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ScoreExtract, 
            "use": Uses.Email, 
            "status": Statuses.Free, 
            "licences": [Licences.FairDealing],
            "explanation": "under \"fair dealing\" exception" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ScoreExtract, 
            "use": Uses.Website, 
            "status": Statuses.Forbidden, 
            "licences": [],
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons." 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ScoreExtract, 
            "use": Uses.Share, 
            "status": Statuses.Forbidden, 
            "licences": [],
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons." 
        },

        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ChapterPrinted, 
            "use": Uses.Presentation, 
            "status": Statuses.NA,
            "licences": [],
            "explanation": "under \"fair dealing\" exception" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ChapterPrinted, 
            "use": Uses.Recording,
            "status": Statuses.NA,
            "licences": [],
            "explanation": "under \"fair dealing\" exception" },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ChapterPrinted, 
            "use": Uses.Handout, 
            "status": Statuses.Free,
            "licences": [Licences.CLA, Licences.FairDealing], 
            "explanation": "under terms of CLA licence or \"fair dealing\" exception" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ChapterPrinted, 
            "use": Uses.VLE, 
            "status": Statuses.FreeCLA, 
            "licences": [Licences.CLA], 
            "explanation": "under terms of CLA licence - report to CLA coordinator"
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ChapterPrinted, 
            "use": Uses.Email, 
            "status": Statuses.Free,
            "licences": [Licences.Research], 
            "explanation": "You may send a single copy to yourself, a student or a fellow researcher under the \"research and private study\" exception" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ChapterPrinted, 
            "use": Uses.Website, 
            "status": Statuses.Forbidden, 
            "licences": [], 
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons." 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ChapterPrinted, 
            "use": Uses.Share, 
            "status": Statuses.Forbidden, 
            "licences": [], 
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons." 
        },
    ];
    
    /** END EDITABLE MATERIAL **/
    
    
    constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
        this.mobileQuery = media.matchMedia('(max-width: 959px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }
    
    ngOnInit() {
        //build structures for: Type of item; Use of item
        for (let item of this.items) {
            /* BEGIN data structures by material being reproduced */
            //do we already have an itemReproduction of this .reproduction?
            let reproductionExists = false;
            if(this.itemReproductions && this.itemReproductions.length > 0) {
                for (let existingItemReproduction of this.itemReproductions) {
                    if(existingItemReproduction.reproduction == item.reproduction) {
                        //let's add this use to it
                        let reproductionUse = {
                            "use": item.use, 
                            "status": item.status, 
                            "licences": item.licences, 
                            "explanation": item.explanation
                        };
                        existingItemReproduction.reproductionUses.push(reproductionUse);
                        reproductionExists = true;
                    }
                }
            }
            if(!reproductionExists){
                //we need to create the reproductionUse and add this item's details to it
                let reproductionUse = {
                    use: item.use, 
                    status: item.status, 
                    licences: item.licences, 
                    explanation: item.explanation
                };
                let itemReproduction = {"type": item.type, "reproduction": item.reproduction, "reproductionUses": []};
                itemReproduction.reproductionUses.push(reproductionUse);
                this.itemReproductions.push(itemReproduction);
            }
            /* END data structures by material being reproduced */ 
            /* BEGIN data structures by use */
            //do we already have an itemUse of this .use?
            let useExists = false;
            if(this.itemUses && this.itemUses.length > 0) {
                for (let existingItemUse of this.itemUses) {
                    if(existingItemUse.use == item.use) {
                        //let's add this use to it
                        let materialReproduction = {
                            "type": item.type, 
                            "reproduction": item.reproduction, 
                            "status": item.status, 
                            "licences": item.licences, 
                            "explanation": item.explanation
                        };
                        existingItemUse.materialReproductions.push(materialReproduction);
                        useExists = true;
                    }
                }
            }
            if(!useExists){
                //we need to create the materialReproduction and add this item's details to it
                let materialReproduction = {
                    "type": item.type, 
                    "reproduction": item.reproduction, 
                    "status": item.status, 
                    "licences": item.licences, 
                    "explanation": item.explanation
                };
                let itemUse = {"use": item.use, "materialReproductions": []};
                itemUse.materialReproductions.push(materialReproduction);
                this.itemUses.push(itemUse);
            }
            /* END data structures by material being reproduced */ 
        }
        //now let's populate an array of filter values and states
        this.filters['uses'] = [];
        for (let use in this.usesType.keys()) {
            this.filters['uses'][this.usesType[use]] = true;
        }
        this.filters['statuses'] = [];
        for (let status in this.statusesType.keys()) {
            this.filters['statuses'][this.statusesType[status]] = true;
        }
        this.filters['materials'] = [];
        for (let material in this.materialsType.keys()) {
            this.filters['materials'][this.materialsType[material]] = true;
        }
        this.filters['licences'] = [];
        for (let licence in this.licencesType.keys()) {
            this.filters['licences'][this.licencesType[licence]] = true;
        }
        this.filters['reproductions'] = [];
        for (let reproduction in this.reproductionsType.keys()) {
            this.filters['reproductions'][this.reproductionsType[reproduction]] = true;
        }
        /*for (let key of this.filters['uses'].keys()) {
            console.log('bla');
            console.log(this.filters['uses'][key]);
        }*/
    }
    
    onFilterChange () {
        //need to filter both: this.itemReproductions and this.itemUses
        //var filteredEvents = events.filter(function(event){
        //    return event.date == '22-02-2016';
        //});
    }
    
    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }
    
}
