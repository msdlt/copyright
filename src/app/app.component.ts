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
    //faEnvelope,
    faExternalLinkAlt,
    faShareSquare,
    faImage,
    faFilm,
    faVolumeUp,
    faBroadcastTower
    
} from '@fortawesome/free-solid-svg-icons';

    
    enum Uses {
        Presentation, //Presentation or lecture, faChalkboardTeacher
        Recording, //Recorded presentation or lecture, faVideo
        Handout, //Distribute as a handout, faFile
        VLE, //Embed in VLE materials, faComments
        //Email, //Share by email, faEnvelope
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
        Text,  //0
        Video, //1
        Audio, //2
        Image, //3
        Broadcast //4
    };
    namespace Materials {
        export function keys() {
            return Object.keys(Materials).filter(k => !isNaN(Number(k)));
        }
    }

    enum Licences {
        CLA, //CLA licence 
        ERA, //ERA licence
        YouTube, //Youtube T&C
        Section30, //Quotation (criticism and review)
        //Section31A31B, //Accessible copies for disabled users
        Section32, //Illustration for Instruction exception subject to \"fair dealing\"
        Section34, //Performing or playing a work for educational purposes
        //Research, //\"research and private study\" exception
        Unlicensed
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
        ChapterPrinted,//Printed book chapter
        ArticlePrinted,//Printed journal article
        ChaptereBook,//eBook chapter
        ArticleeJournal,//eJournal article
        Book,//Entire book, journal or music score
        ImageInternet, //Image from the internet
        ImageJournalBook, //Image from a journal or book
        BroadcastBoxOf, //Programme from Box of Broadcasts
        BroadcastExtract, //Extract from a TV or radio broadcast
        Broadcast, //Entire TV or radio broadcast
        FilmYouTubeUnofficial, //YouTube (untrusted channel)
        FilmYouTubeOfficial, //YouTube (official channel)
        FilmExtract, //Extract from a film (DVD/digital) 
        Film, //Entire film 
        MusicExtract, //Extract from commercial piece of music 
        SoundRecording //Commercial sound recording
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
    //faEnvelope = faEnvelope;
    faExternalLinkAlt = faExternalLinkAlt;
    faShareSquare = faShareSquare;
    faImage = faImage;
    faFilm = faFilm;
    faVolumeUp = faVolumeUp;
    faBroadcastTower = faBroadcastTower;
    
    mobileQuery: MediaQueryList;
    
    usesType = Uses;
    statusesType = Statuses;
    materialsType = Materials;
    licencesType = Licences;
    reproductionsType = Reproductions;
    filters = [];
    allNoneCheckBoxes = [];
    
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
    
    filteredItemReproductions: { type: Materials, reproduction: Reproductions, reproductionUses: ItemReproductionUse[] }[] = [];
    filteredItemUses: { use: Uses, materialReproductions: ItemMaterialReproduction[] }[] = [];
    
    /** BEGIN EDITABLE MATERIAL **/
    
    //Descriptions below are used to convert human-readable enum values back into long-form text
    useDescriptions = {
        "Presentation": "Presentation or lecture",  
        "Recording": "Recorded presentation or lecture",  
        "Handout": "Distribute as a handout", 
        "VLE": "Embed in VLE materials", 
        //"Email": "Share by email", 
        "Website": "Public website or resource (OER)", 
        "Share": "Share via social media/cloud service"
    }
    
    reproductionDescriptions = {
        "Quotation": "Quotation",
        "TextExtract": "Extract <400 words",
        "ScoreExtract": "Extract from music score",
        "ChapterPrinted": "Printed book chapter",
        "ArticlePrinted": "Printed journal article",
        "ChaptereBook": "eBook chapter",
        "ArticleeJournal": "eJournal article",
        "Book": "Entire book, journal or music score",
        "ImageInternet": "Image from the internet",
        "ImageJournalBook": "Image from a journal or book",
        "BroadcastBoxOf": "Programme from Box of Broadcasts",
        "BroadcastExtract": "Extract from a TV or radio broadcast",
        "Broadcast": "Entire TV or radio broadcast",
        "FilmYouTubeUnofficial": "YouTube (untrusted channel)",
        "FilmYouTubeOfficial": "YouTube (official channel)",
        "FilmExtract": "Extract from a film (DVD/digital)",
        "Film": "Entire film",
        "MusicExtract": "Extract from commercial piece of music",
        "SoundRecording": "Commercial sound recording"
    };
    
    statusDescriptions = {
        "Free": "OK, subject to \"fair dealing\"",
        "FreeCLA": "OK, if CLA licensed",
        "May": "Check with librarian",
        "Forbidden": "Not permitted",
        "NA": "Not appropriate"
    };
    
    licenceDescriptions = {
        "CLA": "CLA licence",
        "ERA": "ERA licence",
        "YouTube": "Youtube T&C",
        "Section30": "Section 30: Quotation (criticism and review)",
        //"Section31A31B": "Section 31A & 31B: Accessible copies for disabled users",
        "Section32": "Section 32: Illustration for Instruction exception subject to \"fair dealing\"",
        "Section34": "Section 34: Performing or playing a work for educational purposes",
        "Unlicensed": "Unlicensed: Not covered by any licences, agreements or exceptions"
    };
    
    //setup which reproductions belong to which material
    materialChildren: any = new Array();
        
    items: { type: Materials, reproduction: Reproductions, use: Uses, status: Statuses, licences: Licences[], explanation: string }[] = [
        //TEXT - Quotation
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.Quotation, 
            "use": Uses.Presentation, 
            "status": Statuses.Free, 
            "licences": [Licences.CLA, Licences.Section32, Licences.Section30], 
            "explanation": "under terms of CLA licence; or Quotation (criticism and review) or Illustration for Instruction exceptions, subject to \"fair dealing\"" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.Quotation, 
            "use": Uses.Recording, 
            "status": Statuses.Free, 
            "licences": [Licences.CLA, Licences.Section32, Licences.Section30], 
            "explanation": "under terms of CLA licence; or Quotation (criticism and review) or Illustration for Instruction exceptions, subject to \"fair dealing\"" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.Quotation, 
            "use": Uses.Handout, 
            "status": Statuses.Free, 
            "licences": [Licences.CLA, Licences.Section32, Licences.Section30], 
            "explanation": "under terms of CLA licence; or Quotation (criticism and review) or Illustration for Instruction exceptions, subject to \"fair dealing\"" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.Quotation, 
            "use": Uses.VLE, 
            "status": Statuses.Free, 
            "licences": [Licences.CLA, Licences.Section32, Licences.Section30], 
            "explanation": "under terms of CLA licence; or Quotation (criticism and review) or Illustration for Instruction exceptions, subject to \"fair dealing\"" 
        },
        /*{ 
            "type": Materials.Text, 
            "reproduction": Reproductions.Quotation, 
            "use": Uses.Email, 
            "status": Statuses.Free, 
            "licences": [Licences.CLA, Licences.FairDealing], 
            "explanation": "under terms of CLA licence or \"fair dealing\" exception" 
        },*/
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.Quotation, 
            "use": Uses.Website, 
            "status": Statuses.May, 
            "licences": [Licences.Section32, Licences.Section30], 
            "explanation": "under Quotation (criticism and review) or Illustration for Instruction exceptions, subject to \"fair dealing\" - talk to your librarian" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.Quotation, 
            "use": Uses.Share, 
            "status": Statuses.May, 
            "licences": [Licences.Section32, Licences.Section30], 
            "explanation": "under Quotation (criticism and review) or Illustration for Instruction exceptions, subject to \"fair dealing\" - talk to your librarian" 
        },
        //TEXT - Extract
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.TextExtract, 
            "use": Uses.Presentation, 
            "status": Statuses.Free, 
            "licences": [Licences.CLA, Licences.Section32], 
            "explanation": "under terms of CLA licence or Illustration for Instruction exception, subject to \"fair dealing\"" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.TextExtract, 
            "use": Uses.Recording, 
            "status": Statuses.Free, 
            "licences": [Licences.CLA, Licences.Section32], 
            "explanation": "under terms of CLA licence or Illustration for Instruction exception, subject to \"fair dealing\"" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.TextExtract, 
            "use": Uses.Handout, 
            "status": Statuses.Free, 
            "licences": [Licences.CLA, Licences.Section32], 
            "explanation": "under terms of CLA licence or Illustration for Instruction exception, subject to \"fair dealing\"" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.TextExtract, 
            "use": Uses.VLE, 
            "status": Statuses.FreeCLA, 
            "licences": [Licences.CLA], 
            "explanation": "under terms of CLA licence - report to CLA coordinator" 
        },
        /*{ 
            "type": Materials.Text, 
            "reproduction": Reproductions.TextExtract, 
            "use": Uses.Email, 
            "status": Statuses.Free, 
            "licences": [Licences.CLA, Licences.FairDealing], 
            "explanation": "under terms of CLA licence or \"fair dealing\" exception" 
        },*/
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.TextExtract, 
            "use": Uses.Website, 
            "status": Statuses.May, 
            "licences": [Licences.Section32],
            "explanation": "under Illustration for Instruction exception, subject to \"fair dealing\" - talk to your librarian" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.TextExtract, 
            "use": Uses.Share, 
            "status": Statuses.May, 
            "licences": [Licences.Section32],
            "explanation": "under Illustration for Instruction exception, subject to \"fair dealing\" - talk to your librarian" 
        },
        //TEXT - Score extract
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ScoreExtract, 
            "use": Uses.Presentation, 
            "status": Statuses.Free, 
            "licences": [Licences.Section32],
            "explanation": "under Illustration for Instruction exception, subject to \"fair dealing\"" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ScoreExtract, 
            "use": Uses.Recording, 
            "status": Statuses.Free, 
            "licences": [Licences.Section32],
            "explanation": "under Illustration for Instruction exception, subject to \"fair dealing\"" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ScoreExtract, 
            "use": Uses.Handout, 
            "status": Statuses.Free, 
            "licences": [Licences.Section32],
            "explanation": "under Illustration for Instruction exception, subject to \"fair dealing\"" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ScoreExtract, 
            "use": Uses.VLE, 
            "status": Statuses.Free, 
            "licences": [Licences.Section32],
            "explanation": "under Illustration for Instruction exception, subject to \"fair dealing\""
        },
        /*{ 
            "type": Materials.Text, 
            "reproduction": Reproductions.ScoreExtract, 
            "use": Uses.Email, 
            "status": Statuses.Free, 
            "licences": [Licences.FairDealing],
            "explanation": "under \"fair dealing\" exception" 
        },*/
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ScoreExtract, 
            "use": Uses.Website, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons." 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ScoreExtract, 
            "use": Uses.Share, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons." 
        },
        //TEXT - ChapterPrinted
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ChapterPrinted, 
            "use": Uses.Presentation, 
            "status": Statuses.NA, 
            "licences": [Licences.Unlicensed], 
            "explanation": "Not applicable" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ChapterPrinted, 
            "use": Uses.Recording,
            "status": Statuses.NA, 
            "licences": [Licences.Unlicensed], 
            "explanation": "Not applicable"
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ChapterPrinted, 
            "use": Uses.Handout, 
            "status": Statuses.Free,
            "licences": [Licences.CLA, Licences.Section32], 
            "explanation": "under terms of CLA licence or Illustration for Instruction exception, subject to \"fair dealing\"" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ChapterPrinted, 
            "use": Uses.VLE, 
            "status": Statuses.FreeCLA, 
            "licences": [Licences.CLA], 
            "explanation": "under terms of CLA licence - report to CLA coordinator"
        },
        /*{ 
            "type": Materials.Text, 
            "reproduction": Reproductions.ChapterPrinted, 
            "use": Uses.Email, 
            "status": Statuses.Free,
            "licences": [Licences.Research], 
            "explanation": "You may send a single copy to yourself, a student or a fellow researcher under the \"research and private study\" exception" 
        },*/
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ChapterPrinted, 
            "use": Uses.Website, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed], 
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons." 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ChapterPrinted, 
            "use": Uses.Share, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed], 
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons." 
        },
        //TEXT - ArticlePrinted
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ArticlePrinted, 
            "use": Uses.Presentation, 
            "status": Statuses.NA, 
            "licences": [Licences.Unlicensed], 
            "explanation": "Not applicable"
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ArticlePrinted, 
            "use": Uses.Recording,
            "status": Statuses.NA, 
            "licences": [Licences.Unlicensed], 
            "explanation": "Not applicable"
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ArticlePrinted, 
            "use": Uses.Handout, 
            "status": Statuses.FreeCLA,
            "licences": [Licences.CLA], 
            "explanation": "under terms of CLA licence - report to CLA coordinator" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ArticlePrinted, 
            "use": Uses.VLE, 
            "status": Statuses.FreeCLA, 
            "licences": [Licences.CLA], 
            "explanation": "under terms of CLA licence - report to CLA coordinator"
        },
        /*{ 
            "type": Materials.Text, 
            "reproduction": Reproductions.ArticlePrinted, 
            "use": Uses.Email, 
            "status": Statuses.Free,
            "licences": [Licences.Research], 
            "explanation": "You may send a single copy to yourself, a student or a fellow researcher under the \"research and private study\" exception" 
        },*/
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ArticlePrinted, 
            "use": Uses.Website, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed], 
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons." 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ArticlePrinted, 
            "use": Uses.Share, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed], 
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons." 
        },
        //TEXT - ChaptereBook
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ChaptereBook, 
            "use": Uses.Presentation, 
            "status": Statuses.NA, 
            "licences": [Licences.Unlicensed], 
            "explanation": "Not applicable" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ChaptereBook, 
            "use": Uses.Recording,
            "status": Statuses.NA, 
            "licences": [Licences.Unlicensed], 
            "explanation": "Not applicable"
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ChaptereBook, 
            "use": Uses.Handout, 
            "status": Statuses.Free,
            "licences": [Licences.CLA, Licences.Section32], 
            "explanation": "under terms of CLA licence or Illustration for Instruction exception, subject to \"fair dealing\"" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ChaptereBook, 
            "use": Uses.VLE, 
            "status": Statuses.FreeCLA, 
            "licences": [Licences.CLA], 
            "explanation": "under terms of CLA licence - report to CLA coordinator"
        },
        /*{ 
            "type": Materials.Text, 
            "reproduction": Reproductions.ChaptereBook, 
            "use": Uses.Email, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons. You can, of course share a link to e-books/e-journals" 
        },*/
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ChaptereBook, 
            "use": Uses.Website, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons. You can, of course share a link to e-books/e-journals" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ChaptereBook, 
            "use": Uses.Share, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed], 
            "explanation": "not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons. You can, of course share a link to e-books/e-journals" 
        },
        //TEXT - ArticleeJournal
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ArticleeJournal, 
            "use": Uses.Presentation, 
            "status": Statuses.NA, 
            "licences": [Licences.Unlicensed], 
            "explanation": "Not applicable" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ArticleeJournal, 
            "use": Uses.Recording,
            "status": Statuses.NA, 
            "licences": [Licences.Unlicensed], 
            "explanation": "Not applicable"
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ArticleeJournal, 
            "use": Uses.Handout, 
            "status": Statuses.FreeCLA,
            "licences": [Licences.CLA], 
            "explanation": "under terms of CLA licence - report to CLA coordinator" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ArticleeJournal, 
            "use": Uses.VLE, 
            "status": Statuses.FreeCLA, 
            "licences": [Licences.CLA], 
            "explanation": "under terms of CLA licence - report to CLA coordinator"
        },
        /*{ 
            "type": Materials.Text, 
            "reproduction": Reproductions.ArticleeJournal, 
            "use": Uses.Email, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons. You can, of course share a link to e-books/e-journals" 
        },*/
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ArticleeJournal, 
            "use": Uses.Website, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons. You can, of course share a link to e-books/e-journals" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.ArticleeJournal, 
            "use": Uses.Share, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed], 
            "explanation": "not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons. You can, of course share a link to e-books/e-journals" 
        },
        //TEXT - Book
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.Book, 
            "use": Uses.Presentation, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed], 
            "explanation": "not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons. You can, of course share a link to e-books/e-journals" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.Book, 
            "use": Uses.Recording,
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed], 
            "explanation": "not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons. You can, of course share a link to e-books/e-journals" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.Book, 
            "use": Uses.Handout, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed], 
            "explanation": "not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons. You can, of course share a link to e-books/e-journals" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.Book, 
            "use": Uses.VLE, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed], 
            "explanation": "not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons. You can, of course share a link to e-books/e-journals" 
        },
        /*{ 
            "type": Materials.Text, 
            "reproduction": Reproductions.Book, 
            "use": Uses.Email, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons. You can, of course share a link to e-books/e-journals" 
        },*/
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.Book, 
            "use": Uses.Website, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons. You can, of course share a link to e-books/e-journals" 
        },
        { 
            "type": Materials.Text, 
            "reproduction": Reproductions.Book, 
            "use": Uses.Share, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed], 
            "explanation": "not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons. You can, of course share a link to e-books/e-journals" 
        },
        //Image - Internet
        { 
            "type": Materials.Image, 
            "reproduction": Reproductions.ImageInternet, 
            "use": Uses.Presentation, 
            "status": Statuses.Free, 
            "licences": [Licences.Section32],
            "explanation": "under Illustration for Instruction exception, subject to \"fair dealing\""
        },
        { 
            "type": Materials.Image, 
            "reproduction": Reproductions.ImageInternet, 
            "use": Uses.Recording,
            "status": Statuses.May, 
            "licences": [Licences.Section32, Licences.CLA], 
            "explanation": "under terms of CLA licence or Illustration for Instruction exception, subject to \"fair dealing\" - talk to your librarian" 
        },
        { 
            "type": Materials.Image, 
            "reproduction": Reproductions.ImageInternet, 
            "use": Uses.Handout, 
            "status": Statuses.May, 
            "licences": [Licences.Section32, Licences.CLA], 
            "explanation": "under terms of CLA licence or Illustration for Instruction exception, subject to \"fair dealing\" - talk to your librarian" 
        },
        { 
            "type": Materials.Image, 
            "reproduction": Reproductions.ImageInternet, 
            "use": Uses.VLE, 
            "status": Statuses.May, 
            "licences": [Licences.Section32, Licences.CLA], 
            "explanation": "under terms of CLA licence or Illustration for Instruction exception, subject to \"fair dealing\" - talk to your librarian" 
        },
        /*{ 
            "type": Materials.Image, 
            "reproduction": Reproductions.ImageInternet, 
            "use": Uses.Email, 
            "status": Statuses.Free,
            "licences": [Licences.Research], 
            "explanation": "You may send a single copy to yourself, a student or a fellow researcher under the \"research and private study\" exception" 
        },*/
        { 
            "type": Materials.Image, 
            "reproduction": Reproductions.ImageInternet, 
            "use": Uses.Website, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons. You can, of course share a link to the image (unless this is specifically forbidden by the terms and conditions of the source website)" 
        },
        { 
            "type": Materials.Image, 
            "reproduction": Reproductions.ImageInternet, 
            "use": Uses.Share, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed], 
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons. You can, of course share a link to the image (unless this is specifically forbidden by the terms and conditions of the source website)" 
        },
        //Image - ImageJournalBook
        { 
            "type": Materials.Image, 
            "reproduction": Reproductions.ImageJournalBook, 
            "use": Uses.Presentation, 
            "status": Statuses.Free, 
            "licences": [Licences.CLA, Licences.Section32], 
            "explanation": "under terms of CLA licence or Illustration for Instruction exception, subject to \"fair dealing\""
        },
        { 
            "type": Materials.Image, 
            "reproduction": Reproductions.ImageJournalBook, 
            "use": Uses.Recording,
            "status": Statuses.Free, 
            "licences": [Licences.CLA, Licences.Section32], 
            "explanation": "under terms of CLA licence or Illustration for Instruction exception, subject to \"fair dealing\""
        },
        { 
            "type": Materials.Image, 
            "reproduction": Reproductions.ImageJournalBook, 
            "use": Uses.Handout, 
            "status": Statuses.May, 
            "licences": [Licences.Section32],
            "explanation": "under Illustration for Instruction exception, subject to \"fair dealing\" - talk to your librarian" 
        },
        { 
            "type": Materials.Image, 
            "reproduction": Reproductions.ImageJournalBook, 
            "use": Uses.VLE, 
            "status": Statuses.Free, 
            "licences": [Licences.CLA, Licences.Section32], 
            "explanation": "under terms of CLA licence or Illustration for Instruction exception, subject to \"fair dealing\""
        },
        /*{ 
            "type": Materials.Image, 
            "reproduction": Reproductions.ImageJournalBook, 
            "use": Uses.Email, 
            "status": Statuses.Free, 
            "licences": [Licences.CLA, Licences.FairDealing], 
            "explanation": "under terms of CLA licence or \"fair dealing\" exception" 
        },*/
        { 
            "type": Materials.Image, 
            "reproduction": Reproductions.ImageJournalBook, 
            "use": Uses.Website, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons. You can, of course share a link to the image (unless this is specifically forbidden by the terms and conditions of the source website)" 
        },
        { 
            "type": Materials.Image, 
            "reproduction": Reproductions.ImageJournalBook, 
            "use": Uses.Share, 
            "status": Statuses.May, 
            "licences": [Licences.Section32, Licences.CLA], 
            "explanation": "under terms of CLA licence or Illustration for Instruction exception, subject to \"fair dealing\" - talk to your librarian"
        },
        //Broadcast - Box of Broadcasts
        { 
            "type": Materials.Broadcast, 
            "reproduction": Reproductions.BroadcastBoxOf, 
            "use": Uses.Presentation, 
            "status": Statuses.Free, 
            "licences": [Licences.ERA], 
            "explanation": "under terms of ERA licence"
        },
        { 
            "type": Materials.Broadcast, 
            "reproduction": Reproductions.BroadcastBoxOf, 
            "use": Uses.Recording,
            "status": Statuses.Free, 
            "licences": [Licences.ERA], 
            "explanation": "under terms of ERA licence"
        },
        { 
            "type": Materials.Broadcast, 
            "reproduction": Reproductions.BroadcastBoxOf, 
            "use": Uses.Handout, 
            "status": Statuses.NA, 
            "licences": [Licences.Unlicensed], 
            "explanation": "Not applicable"
        },
        { 
            "type": Materials.Broadcast, 
            "reproduction": Reproductions.BroadcastBoxOf, 
            "use": Uses.VLE, 
            "status": Statuses.Free, 
            "licences": [Licences.ERA], 
            "explanation": "under terms of ERA licence"
        },
        /*{ 
            "type": Materials.Broadcast, 
            "reproduction": Reproductions.BroadcastBoxOf, 
            "use": Uses.Email, 
            "status": Statuses.NA, 
            "licences": [Licences.Unlicensed], 
            "explanation": "Not applicable"
        },*/
        { 
            "type": Materials.Broadcast, 
            "reproduction": Reproductions.BroadcastBoxOf, 
            "use": Uses.Website, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons. You can of course share a link to the programme which would only be accessible to those with access to Box of Broadcasts" 
        },
        { 
            "type": Materials.Broadcast, 
            "reproduction": Reproductions.BroadcastBoxOf, 
            "use": Uses.Share, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons. You can of course share a link to the programme which would only be accessible to those with access to Box of Broadcasts" 
        },
        //Broadcast - BroadcastExtract
        { 
            "type": Materials.Broadcast, 
            "reproduction": Reproductions.BroadcastExtract, 
            "use": Uses.Presentation, 
            "status": Statuses.Free, 
            "licences": [Licences.ERA, Licences.Section32], 
            "explanation": "under terms of ERA licence or Illustration for Instruction exception, subject to \"fair dealing\""
        },
        { 
            "type": Materials.Broadcast, 
            "reproduction": Reproductions.BroadcastExtract, 
            "use": Uses.Recording,
            "status": Statuses.Free, 
            "licences": [Licences.ERA, Licences.Section32], 
            "explanation": "under terms of ERA licence or Illustration for Instruction exception, subject to \"fair dealing\""
        },
        { 
            "type": Materials.Broadcast, 
            "reproduction": Reproductions.BroadcastExtract, 
            "use": Uses.Handout, 
            "status": Statuses.NA, 
            "licences": [Licences.Unlicensed], 
            "explanation": "Not applicable"
        },
        { 
            "type": Materials.Broadcast, 
            "reproduction": Reproductions.BroadcastExtract, 
            "use": Uses.VLE, 
            "status": Statuses.Free, 
            "licences": [Licences.ERA, Licences.Section32], 
            "explanation": "under terms of ERA licence or Illustration for Instruction exception, subject to \"fair dealing\""
        },
        /*{ 
            "type": Materials.Broadcast, 
            "reproduction": Reproductions.BroadcastExtract, 
            "use": Uses.Email, 
            "status": Statuses.NA, 
            "licences": [Licences.Unlicensed], 
            "explanation": "Not applicable"
        },*/
        { 
            "type": Materials.Broadcast, 
            "reproduction": Reproductions.BroadcastExtract, 
            "use": Uses.Website, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons. You can of course share a link to the programme which would only be accessible to those with access to Box of Broadcasts" 
        },
        { 
            "type": Materials.Broadcast, 
            "reproduction": Reproductions.BroadcastExtract, 
            "use": Uses.Share, 
            "status": Statuses.May, 
            "licences": [Licences.Section32, Licences.ERA], 
            "explanation": "under terms of ERA licence or Illustration for Instruction exception, subject to \"fair dealing\"- talk to your librarian"
        },
        //Broadcast - Broadcast
        { 
            "type": Materials.Broadcast, 
            "reproduction": Reproductions.Broadcast, 
            "use": Uses.Presentation, 
            "status": Statuses.May, 
            "licences": [Licences.ERA], 
            "explanation": "under terms of ERA licence - talk to your librarian"
        },
        { 
            "type": Materials.Broadcast, 
            "reproduction": Reproductions.Broadcast, 
            "use": Uses.Recording,
            "status": Statuses.May, 
            "licences": [Licences.ERA], 
            "explanation": "under terms of ERA licence - talk to your librarian"
        },
        { 
            "type": Materials.Broadcast, 
            "reproduction": Reproductions.Broadcast, 
            "use": Uses.Handout, 
            "status": Statuses.NA, 
            "licences": [Licences.Unlicensed], 
            "explanation": "Not applicable"
        },
        { 
            "type": Materials.Broadcast, 
            "reproduction": Reproductions.Broadcast, 
            "use": Uses.VLE, 
            "status": Statuses.May, 
            "licences": [Licences.ERA], 
            "explanation": "under terms of ERA licence - talk to your librarian"
        },
        /*{ 
            "type": Materials.Broadcast, 
            "reproduction": Reproductions.Broadcast, 
            "use": Uses.Email, 
            "status": Statuses.NA, 
            "licences": [Licences.Unlicensed], 
            "explanation": "Not applicable"
        },*/
        { 
            "type": Materials.Broadcast, 
            "reproduction": Reproductions.Broadcast, 
            "use": Uses.Website, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons. You can of course share a link to the programme" 
        },
        { 
            "type": Materials.Broadcast, 
            "reproduction": Reproductions.Broadcast, 
            "use": Uses.Share, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons. You can of course share a link to the programme" 
        },
        //Film - Youtube official
        { 
            "type": Materials.Video, 
            "reproduction": Reproductions.FilmYouTubeOfficial, 
            "use": Uses.Presentation, 
            "status": Statuses.Free, 
            "licences": [Licences.YouTube], 
            "explanation": "under TouTube terms and conditions"
        },
        { 
            "type": Materials.Video, 
            "reproduction": Reproductions.FilmYouTubeOfficial, 
            "use": Uses.Recording,
            "status": Statuses.Free, 
            "licences": [Licences.YouTube], 
            "explanation": "under TouTube terms and conditions"
        },
        { 
            "type": Materials.Video, 
            "reproduction": Reproductions.FilmYouTubeOfficial, 
            "use": Uses.Handout, 
            "status": Statuses.Free, 
            "licences": [Licences.YouTube], 
            "explanation": "under TouTube terms and conditions"
        },
        { 
            "type": Materials.Video, 
            "reproduction": Reproductions.FilmYouTubeOfficial, 
            "use": Uses.VLE, 
            "status": Statuses.Free, 
            "licences": [Licences.YouTube], 
            "explanation": "under TouTube terms and conditions"
        },
        /*{ 
            "type": Materials.Video, 
            "reproduction": Reproductions.FilmYouTubeOfficial, 
            "use": Uses.Email, 
            "status": Statuses.Free, 
            "licences": [Licences.YouTube], 
            "explanation": "under TouTube terms and conditions"
        },*/
        { 
            "type": Materials.Video, 
            "reproduction": Reproductions.FilmYouTubeOfficial, 
            "use": Uses.Website, 
            "status": Statuses.Free, 
            "licences": [Licences.YouTube], 
            "explanation": "under TouTube terms and conditions"
        },
        { 
            "type": Materials.Video, 
            "reproduction": Reproductions.FilmYouTubeOfficial, 
            "use": Uses.Share, 
            "status": Statuses.Free, 
            "licences": [Licences.YouTube], 
            "explanation": "under TouTube terms and conditions"
        },
        //Film - Youtube untrusted
        { 
            "type": Materials.Video, 
            "reproduction": Reproductions.FilmYouTubeUnofficial, 
            "use": Uses.Presentation, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "low risk but not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons."
        },
        { 
            "type": Materials.Video, 
            "reproduction": Reproductions.FilmYouTubeUnofficial, 
            "use": Uses.Recording,
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons. EVEN LINKING could constitute secondary infringement with both you and primary infringer liable"
        },
        { 
            "type": Materials.Video, 
            "reproduction": Reproductions.FilmYouTubeUnofficial, 
            "use": Uses.Handout, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons. EVEN LINKING could constitute secondary infringement with both you and primary infringer liable"
        },
        { 
            "type": Materials.Video, 
            "reproduction": Reproductions.FilmYouTubeUnofficial, 
            "use": Uses.VLE, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons. EVEN LINKING could constitute secondary infringement with both you and primary infringer liable"
        },
        /*{ 
            "type": Materials.Video, 
            "reproduction": Reproductions.FilmYouTubeUnofficial, 
            "use": Uses.Email, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "low risk but not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons."
        },*/
        { 
            "type": Materials.Video, 
            "reproduction": Reproductions.FilmYouTubeUnofficial, 
            "use": Uses.Website, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons. EVEN LINKING could constitute secondary infringement with both you and primary infringer liable"
        },
        { 
            "type": Materials.Video, 
            "reproduction": Reproductions.FilmYouTubeUnofficial, 
            "use": Uses.Share, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons. EVEN LINKING could constitute secondary infringement with both you and primary infringer liable"
        },
        //Film - FilmExtract
        { 
            "type": Materials.Video, 
            "reproduction": Reproductions.FilmExtract, 
            "use": Uses.Presentation, 
            "status": Statuses.Free, 
            "licences": [Licences.Section32],
            "explanation": "under Illustration for Instruction exception, subject to \"fair dealing\""
        },
        { 
            "type": Materials.Video, 
            "reproduction": Reproductions.FilmExtract, 
            "use": Uses.Recording,
            "status": Statuses.May, 
            "licences": [Licences.Section32], 
            "explanation": "under Illustration for Instruction exception, subject to \"fair dealing\" - talk to your librarian"
        },
        { 
            "type": Materials.Video, 
            "reproduction": Reproductions.FilmExtract, 
            "use": Uses.Handout, 
            "status": Statuses.NA, 
            "licences": [Licences.Unlicensed], 
            "explanation": "Not applicable"
        },
        { 
            "type": Materials.Video, 
            "reproduction": Reproductions.FilmExtract, 
            "use": Uses.VLE, 
            "status": Statuses.May, 
            "licences": [Licences.Section32], 
            "explanation": "under Illustration for Instruction exception, subject to \"fair dealing\" - talk to your librarian"
        },
        /*{ 
            "type": Materials.Video, 
            "reproduction": Reproductions.FilmExtract, 
            "use": Uses.Email, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "low risk but not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons."
        },*/
        { 
            "type": Materials.Video, 
            "reproduction": Reproductions.FilmExtract, 
            "use": Uses.Website, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons."
        },
        { 
            "type": Materials.Video, 
            "reproduction": Reproductions.FilmExtract, 
            "use": Uses.Share, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons."
        },
        //Film - Entire Film
        { 
            "type": Materials.Video, 
            "reproduction": Reproductions.Film, 
            "use": Uses.Presentation, 
            "status": Statuses.May, 
            "licences": [Licences.Section32], 
            "explanation": "under \"fair dealing\" exception - talk to your librarian"
        },
        { 
            "type": Materials.Video, 
            "reproduction": Reproductions.Film, 
            "use": Uses.Recording,
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons."
        },
        { 
            "type": Materials.Video, 
            "reproduction": Reproductions.Film, 
            "use": Uses.Handout, 
            "status": Statuses.NA, 
            "licences": [Licences.Unlicensed], 
            "explanation": "Not applicable"
        },
        { 
            "type": Materials.Video, 
            "reproduction": Reproductions.Film, 
            "use": Uses.VLE, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons."
        },
        /*{ 
            "type": Materials.Video, 
            "reproduction": Reproductions.Film, 
            "use": Uses.Email, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons."
        },*/
        { 
            "type": Materials.Video, 
            "reproduction": Reproductions.Film, 
            "use": Uses.Website, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons."
        },
        { 
            "type": Materials.Video, 
            "reproduction": Reproductions.Film, 
            "use": Uses.Share, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons."
        },
        //Audio - Music extract
        { 
            "type": Materials.Audio, 
            "reproduction": Reproductions.MusicExtract, 
            "use": Uses.Presentation, 
            "status": Statuses.May, 
            "licences": [Licences.Section32], 
            "explanation": "under Illustration for Instruction exception, subject to \"fair dealing\" - talk to your librarian"
        },
        { 
            "type": Materials.Audio, 
            "reproduction": Reproductions.MusicExtract, 
            "use": Uses.Recording,
            "status": Statuses.May, 
            "licences": [Licences.Section32], 
            "explanation": "under Illustration for Instruction exception, subject to \"fair dealing\" - talk to your librarian"
        },
        { 
            "type": Materials.Audio, 
            "reproduction": Reproductions.MusicExtract, 
            "use": Uses.Handout, 
            "status": Statuses.NA, 
            "licences": [Licences.Unlicensed], 
            "explanation": "Not applicable"
        },
        { 
            "type": Materials.Audio, 
            "reproduction": Reproductions.MusicExtract, 
            "use": Uses.VLE, 
            "status": Statuses.May, 
            "licences": [Licences.Section32], 
            "explanation": "under Illustration for Instruction exception, subject to \"fair dealing\" - talk to your librarian"
        },
        /*{ 
            "type": Materials.Audio, 
            "reproduction": Reproductions.MusicExtract, 
            "use": Uses.Email, 
            "status": Statuses.Free,
            "licences": [Licences.Research], 
            "explanation": "You may send a single copy to yourself, a student or a fellow researcher under the \"research and private study\" exception"
        },*/
        { 
            "type": Materials.Audio, 
            "reproduction": Reproductions.MusicExtract, 
            "use": Uses.Website, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons."
        },
        { 
            "type": Materials.Audio, 
            "reproduction": Reproductions.MusicExtract, 
            "use": Uses.Share, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons."
        },
        //Audio - Sound recording
        { 
            "type": Materials.Audio, 
            "reproduction": Reproductions.SoundRecording, 
            "use": Uses.Presentation, 
            "status": Statuses.May, 
            "licences": [Licences.Section32], 
            "explanation": "under Illustration for Instruction exception, subject to \"fair dealing\" - talk to your librarian"
        },
        { 
            "type": Materials.Audio, 
            "reproduction": Reproductions.SoundRecording, 
            "use": Uses.Recording,
            "status": Statuses.May, 
            "licences": [Licences.Section32], 
            "explanation": "under Illustration for Instruction exception, subject to \"fair dealing\" - talk to your librarian"
        },
        { 
            "type": Materials.Audio, 
            "reproduction": Reproductions.SoundRecording, 
            "use": Uses.Handout, 
            "status": Statuses.NA, 
            "licences": [Licences.Unlicensed], 
            "explanation": "Not applicable"
        },
        { 
            "type": Materials.Audio, 
            "reproduction": Reproductions.SoundRecording, 
            "use": Uses.VLE, 
            "status": Statuses.May, 
            "licences": [Licences.Section32], 
            "explanation": "under Illustration for Instruction exception, subject to \"fair dealing\" - talk to your librarian"
        },
        /*{ 
            "type": Materials.Audio, 
            "reproduction": Reproductions.SoundRecording, 
            "use": Uses.Email, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons."
        },*/
        { 
            "type": Materials.Audio, 
            "reproduction": Reproductions.SoundRecording, 
            "use": Uses.Website, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons."
        },
        { 
            "type": Materials.Audio, 
            "reproduction": Reproductions.SoundRecording, 
            "use": Uses.Share, 
            "status": Statuses.Forbidden, 
            "licences": [Licences.Unlicensed],
            "explanation": "high risk as not covered by any licences, agreements or exceptions unless in the Public Domain, Open Access or licenced by Creative Commons."
        }
    ];
    
    /** END EDITABLE MATERIAL **/
    
    
    constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
        this.mobileQuery = media.matchMedia('(max-width: 959px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }
    
    ngOnInit() {
        
        this.materialChildren[Materials.Text] = [
            Reproductions.Quotation, 
            Reproductions.TextExtract, 
            Reproductions.ScoreExtract, 
            Reproductions.ChapterPrinted, 
            Reproductions.ArticlePrinted, 
            Reproductions.ChaptereBook, 
            Reproductions.ArticleeJournal,
            Reproductions.Book
        ];
        this.materialChildren[Materials.Video] = [
            Reproductions.FilmYouTubeUnofficial, 
            Reproductions.FilmYouTubeOfficial,
            Reproductions.FilmExtract,
            Reproductions.Film
        ];
        this.materialChildren[Materials.Audio] = [
            Reproductions.MusicExtract, 
            Reproductions.SoundRecording   
        ];
        this.materialChildren[Materials.Image] = [
            Reproductions.ImageInternet, 
            Reproductions.ImageJournalBook
        ];
        this.materialChildren[Materials.Broadcast] = [
            Reproductions.BroadcastBoxOf, 
            Reproductions.BroadcastExtract, 
            Reproductions.Broadcast   
        ];
        console.log(this.materialChildren);
        
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
        this.filters['materialsIndeterminacy'] = []; //note this is only here to control indeterminate state of material chcekbox in side panel
        for (let material in this.materialsType.keys()) {
            this.filters['materialsIndeterminacy'][this.materialsType[material]] = false;
        }
        this.filters['licences'] = [];
        for (let licence in this.licencesType.keys()) {
            this.filters['licences'][this.licencesType[licence]] = true;
        }
        this.filters['reproductions'] = [];
        for (let reproduction in this.reproductionsType.keys()) {
            this.filters['reproductions'][this.reproductionsType[reproduction]] = true;
        }
        
        //now an array for the all/none chcekboxes in the sidepanel
        this.allNoneCheckBoxes['uses'] = true;
        this.allNoneCheckBoxes['statuses'] = true;
        this.allNoneCheckBoxes['materials'] = true;
        this.allNoneCheckBoxes['licences'] = true;
        this.allNoneCheckBoxes['reproductions'] = true;
        
        this.allNoneCheckBoxes['usesIndeterminacy'] = false;
        this.allNoneCheckBoxes['statusesIndeterminacy'] = false;
        this.allNoneCheckBoxes['materialsIndeterminacy'] = false;
        this.allNoneCheckBoxes['licencesIndeterminacy'] = false;
        this.allNoneCheckBoxes['reproductionsIndeterminacy'] = false;
                
        //now let's create filtered lists which we'll actually display
        this.filteredItemReproductions = this.itemReproductions;
        this.filteredItemUses = this.itemUses;
        
        /*for (let key of this.filters['uses'].keys()) {
            console.log('bla');
            console.log(this.filters['uses'][key]);
        }*/
    }
    
    onFilterChange (event, target) {
        //Clicking all/none or materials headers chceks/unchecks children
        //first of all, check whether the checkbox clicked is one of the materials that has children
        if(target && target.includes('material_')) {
            //it's one of the parent material checkboxes
            //find out which one
            let idParts = target.split('_');
            let parentMaterial = idParts[1];
            let parentMaterialEnum = Materials[parentMaterial];
            //and react to its state
            //let's check all of its children
            for (let reproduction of this.materialChildren[parentMaterialEnum]) {
                this.filters['reproductions'][this.reproductionsType[reproduction]] = event.checked;       
            } 
            let countForMaterials = 0;
            let countForMaterialsCheckboxes = 0;
            for (let material of this.materialsType.keys()) {
                //console.log(material);
                for (let reproduction of this.materialChildren[material]) {
                    countForMaterialsCheckboxes += 1;
                    if (this.filters['reproductions'][this.reproductionsType[reproduction]] === true){
                        countForMaterials += 1;
                    }
                }
            }
            if(countForMaterials===0) {
                this.allNoneCheckBoxes['materials'] = false;
                this.allNoneCheckBoxes['materialsIndeterminacy'] = false;
            } else if (countForMaterials === countForMaterialsCheckboxes ) {
                this.allNoneCheckBoxes['materials'] = true; 
                this.allNoneCheckBoxes['materialsIndeterminacy'] = false; 
            } else {
                this.allNoneCheckBoxes['materials'] = true; //needed so that parent filter doesn't override children 
                this.allNoneCheckBoxes['materialsIndeterminacy'] = true; //BUT this is more powerful than checked which will be set by line above 
            }
        } else if(target && target.includes('allnone_')) {
            let idParts = target.split('_');
            let group = idParts[1]; 
            switch(group) { 
                case 'materials': { 
                    for (let material of this.materialsType.keys()) {
                        this.filters['materials'][this.materialsType[material]] = event.checked;
                    }
                    for (let reproduction of this.reproductionsType.keys()) {
                        this.filters['reproductions'][this.reproductionsType[reproduction]] = event.checked;    
                    }
                    break; 
                } 
                case 'uses': { 
                    for (let use of this.usesType.keys()) {
                        this.filters['uses'][this.usesType[use]] = event.checked;    
                    }
                    break; 
                }
                case 'statuses': { 
                    for (let status of this.statusesType.keys()) {
                        this.filters['statuses'][this.statusesType[status]] = event.checked;    
                    }
                    break; 
                }
                case 'licences': { 
                    for (let licence of this.licencesType.keys()) {
                        this.filters['licences'][this.licencesType[licence]] = event.checked;    
                    }
                    break; 
                }
                default: { 
                    //statements; 
                    break; 
                } 
            } 
        }
        //Now deal with clicking children chnaging state (checked/unchecked/indeterminate) of parent
        //if it's a child of a material, update the state of the parent material checkbox
        if (target && target.includes('reproduction_')) {
            //for each material check how many are checked 
            let countForMaterials = 0;
            let countForMaterialCheckboxes = 0;
            for (let material of this.materialsType.keys()) {
                //console.log(material);
                let countForThisMaterial = 0;
                for (let reproduction of this.materialChildren[material]) {
                    countForMaterialCheckboxes += 1;
                    if (this.filters['reproductions'][this.reproductionsType[reproduction]] === true){
                        countForThisMaterial += 1;
                        countForMaterials += 1;
                    }
                }
                if(countForThisMaterial===0) {
                    this.filters['materials'][this.materialsType[material]] = false;
                    this.filters['materialsIndeterminacy'][this.materialsType[material]] = false;
                } else if (countForThisMaterial === this.materialChildren[material].length) {
                    this.filters['materials'][this.materialsType[material]] = true; 
                    this.filters['materialsIndeterminacy'][this.materialsType[material]] = false; 
                } else {
                    this.filters['materials'][this.materialsType[material]] = true; //needed so that parent filter doesn't override children 
                    this.filters['materialsIndeterminacy'][this.materialsType[material]] = true; //BUT this is more powerful than checked which will be set by lne above 
                }
            }
            if(countForMaterials===0) {
                this.allNoneCheckBoxes['materials'] = false;
                this.allNoneCheckBoxes['materialsIndeterminacy'] = false;
            } else if (countForMaterials === countForMaterialCheckboxes) {
                this.allNoneCheckBoxes['materials'] = true; 
                this.allNoneCheckBoxes['materialsIndeterminacy'] = false; 
            } else {
                this.allNoneCheckBoxes['materials'] = true; //needed so that parent filter doesn't override children 
                this.allNoneCheckBoxes['materialsIndeterminacy'] = true; //BUT this is more powerful than checked which will be set by line above 
            }
        } else if (target && target.includes('use_')) {
            //for each use check how many are checked 
            let countForUses = 0;
            for (let use of this.usesType.keys()) {
                if (this.filters['uses'][this.usesType[use]] === true){
                    countForUses += 1;
                }
                if(countForUses===0) {
                    this.allNoneCheckBoxes['uses'] = false;
                    this.allNoneCheckBoxes['usesIndeterminacy'] = false;
                } else if (countForUses === this.usesType.keys().length) {
                    this.allNoneCheckBoxes['uses'] = true; 
                    this.allNoneCheckBoxes['usesIndeterminacy'] = false; 
                } else {
                    this.allNoneCheckBoxes['uses'] = true; //needed so that parent filter doesn't override children 
                    this.allNoneCheckBoxes['usesIndeterminacy'] = true; //BUT this is more powerful than checked which will be set by line above 
                }
            }
        } else if (target && target.includes('status_')) {
            //for each use check how many are checked 
            let countForStatuses = 0;
            for (let use of this.statusesType.keys()) {
                if (this.filters['statuses'][this.statusesType[use]] === true){
                    countForStatuses += 1;
                }
                if(countForStatuses===0) {
                    this.allNoneCheckBoxes['statuses'] = false;
                    this.allNoneCheckBoxes['statusesIndeterminacy'] = false;
                } else if (countForStatuses === this.statusesType.keys().length) {
                    this.allNoneCheckBoxes['statuses'] = true; 
                    this.allNoneCheckBoxes['statusesIndeterminacy'] = false; 
                } else {
                    this.allNoneCheckBoxes['statuses'] = true; //needed so that parent filter doesn't override children 
                    this.allNoneCheckBoxes['statusesIndeterminacy'] = true; //BUT this is more powerful than checked which will be set by line above 
                }
            }
        } else if (target && target.includes('licence_')) {
            //for each use check how many are checked 
            let countForLicences = 0;
            for (let use of this.licencesType.keys()) {
                if (this.filters['licences'][this.licencesType[use]] === true){
                    countForLicences += 1;
                }
                if(countForLicences===0) {
                    this.allNoneCheckBoxes['licences'] = false;
                    this.allNoneCheckBoxes['licencesIndeterminacy'] = false;
                } else if (countForLicences === this.licencesType.keys().length) {
                    this.allNoneCheckBoxes['licences'] = true; 
                    this.allNoneCheckBoxes['licencesIndeterminacy'] = false; 
                } else {
                    this.allNoneCheckBoxes['licences'] = true; //needed so that parent filter doesn't override children 
                    this.allNoneCheckBoxes['licencesIndeterminacy'] = true; //BUT this is more powerful than checked which will be set by line above 
                }
            }
        }
        
        /*this.allNoneCheckBoxes['uses'] = true;
        this.allNoneCheckBoxes['statuses'] = true;
        this.allNoneCheckBoxes['materials'] = true;
        this.allNoneCheckBoxes['licences'] = true;
        this.allNoneCheckBoxes['reproductions'] = true;
        
        this.allNoneCheckBoxes['usesIndeterminacy'] = false;
        this.allNoneCheckBoxes['statusesIndeterminacy'] = false;
        this.allNoneCheckBoxes['materialsIndeterminacy'] = false;
        this.allNoneCheckBoxes['licencesIndeterminacy'] = false;
        this.allNoneCheckBoxes['reproductionsIndeterminacy'] = false;*/
                
        this.filteredItemReproductions = []
        //basically run though and only transfer to this.filteredItemReproductions and this.filteredItemUses those items which match filters
        for (let itemReproduction of this.itemReproductions) {
            let newItemReproduction = {type: null, reproduction: null, reproductionUses: []};
            let add = true;  //add unless one of below is false
            //type
            //console.log(itemReproduction.type);
            //console.log(this.filters['materials'][this.materialsType[itemReproduction.type]]);
            
            if (this.filters['materials'][this.materialsType[itemReproduction.type]] === false){
                add = false;
            } else {
                newItemReproduction.type = itemReproduction.type;
            }
            //reproduction
            if (this.filters['reproductions'][this.reproductionsType[itemReproduction.reproduction]] === false){
                add = false;
            } else {
                newItemReproduction.reproduction = itemReproduction.reproduction;
            }
            //reproductionUses
            for (let reproductionUse of itemReproduction.reproductionUses) {
                let addReproductionUse = true;
                let newReproductionUse: ItemReproductionUse = {use: null, status: null, licences: [], explanation: null };
                if (this.filters['uses'][this.usesType[reproductionUse.use]] === false) {
                    addReproductionUse = false;        
                } else {
                    newReproductionUse.use = reproductionUse.use;
                }
                if (this.filters['statuses'][this.statusesType[reproductionUse.status]] === false) {
                    addReproductionUse = false;        
                } else {
                    newReproductionUse.status = reproductionUse.status;
                }
                //licences
                for (let licence of reproductionUse.licences) {
                    let addLicence = true;   
                    let newLicence: Licences;   
                    if (this.filters['licences'][this.licencesType[licence]] === false) {
                        addLicence = false;        
                    } else {
                        newLicence = licence;
                    }
                    if (addLicence){
                       newReproductionUse.licences.push(newLicence); 
                    }
                }
                newReproductionUse.explanation = reproductionUse.explanation; //need this and can't filter by
                if (addReproductionUse && newReproductionUse.licences.length > 0){
                   newItemReproduction.reproductionUses.push(newReproductionUse); 
                }
            }
            if(newItemReproduction.reproductionUses.length === 0) {
                add = false;
            }
            //if anything left in it and not excluded by filters then add, otherwise, don't add
            if (add){
               this.filteredItemReproductions.push(newItemReproduction); 
            }
        }
        this.filteredItemUses = []
        //console.log(this.itemUses);
        for (let itemUse of this.itemUses) {
            let newItemUse = {use: null, materialReproductions: []};
            let add = true;  //add unless one of below is false
            //use
            if (this.filters['uses'][this.usesType[itemUse.use]] === false) {
                add = false;        
            } else {
                newItemUse.use = itemUse.use;
            }
            //materialReproductions
            for (let materialReproduction of itemUse.materialReproductions) {
                let addMaterial = true;
                let newMaterialReproduction = {type: null, reproduction: null, status: null, licences: [], explanation: null}
                if (this.filters['materials'][this.materialsType[materialReproduction.type]] === false){
                    addMaterial = false;
                } else {
                    newMaterialReproduction.type = materialReproduction.type;
                }
                if (this.filters['reproductions'][this.reproductionsType[materialReproduction.reproduction]] === false){
                    addMaterial = false;
                } else {
                    newMaterialReproduction.reproduction = materialReproduction.reproduction;
                }
                if (this.filters['statuses'][this.statusesType[materialReproduction.status]] === false) {
                    addMaterial = false;        
                } else {
                    newMaterialReproduction.status = materialReproduction.status;
                }
                //licences
                for (let licence of materialReproduction.licences) {
                    let addLicence = true;   
                    let newLicence: Licences;   
                    if (this.filters['licences'][this.licencesType[licence]] === false) {
                        addLicence = false;        
                    } else {
                        newLicence = licence;
                    }
                    if (addLicence){
                       newMaterialReproduction.licences.push(newLicence); 
                    }
                }
                newMaterialReproduction.explanation = materialReproduction.explanation; //need this and can't filter by
                if (addMaterial && newMaterialReproduction.licences.length > 0){
                   newItemUse.materialReproductions.push(newMaterialReproduction); 
                }
            }
            if(newItemUse.materialReproductions.length === 0) {
                add = false;
            }
            //if anything left in it and not excluded by filters then add, otherwise, don't add
            if (add){
               this.filteredItemUses.push(newItemUse); 
            }
        }
        //console.log(this.itemReproductions);
        //console.log(this.filteredItemUses);
    }
    
    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }
    
}
