import { Component} from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  title = "EDI"

  links = [
    {
      title:'About',
      url: '#'
    },
    {
      title:'SOCIAM',
      url: '#'
    },
    {
      title:'GitHub',
      url: '#'
    }
  ]
}
