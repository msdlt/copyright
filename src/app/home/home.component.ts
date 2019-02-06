import { Component, OnInit } from '@angular/core';
import { 
    faBook, 
    faChalkboardTeacher,
    faVideo,
    faFile,
    faComments,
    faExternalLinkAlt,
    faShareSquare,
    faImage,
    faFilm,
    faVolumeUp,
    faBroadcastTower
    
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    faBook = faBook;
    faFilm = faFilm;
    faVolumeUp = faVolumeUp;
    faImage = faImage;
    faBroadcastTower = faBroadcastTower;
    faChalkboardTeacher = faChalkboardTeacher;
    faVideo = faVideo;
    faFile = faFile;
    faComments = faComments;
    faExternalLinkAlt = faExternalLinkAlt;
    faShareSquare = faShareSquare;
    
    constructor() { }

    ngOnInit() {
    }

}
