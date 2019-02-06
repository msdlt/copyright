import { Component, OnInit } from '@angular/core';
import { 
    faCreativeCommons,
    faCreativeCommonsNc,
    faCreativeCommonsBy
} from '@fortawesome/free-brands-svg-icons';

import { library } from '@fortawesome/fontawesome-svg-core';

import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons/faLinkedinIn';
import { faLink } from '@fortawesome/free-solid-svg-icons/faLink';
import { faPrint } from '@fortawesome/free-solid-svg-icons/faPrint';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';


const icons = [
  faTwitter, faLinkedinIn, faEnvelope, faPrint, faLink
];

library.add(...icons);

@Component({
  selector: 'footer-component',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
    
    faCreativeCommons = faCreativeCommons;
    faCreativeCommonsBy = faCreativeCommonsBy;
    faCreativeCommonsNc = faCreativeCommonsNc;

    constructor() { }

    ngOnInit() {
    }

}
