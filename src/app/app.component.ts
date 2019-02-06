import { Component, OnInit } from '@angular/core';
import { 
    faThumbsUp
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    faThumbsUp = faThumbsUp;
    
    constructor() { }

    ngOnInit() {
    }
    
}
