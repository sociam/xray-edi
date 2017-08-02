
/**
 * Imports
 * 
 * Allows the inclusion of other services/functionality needed in later derived components
 */
import { Component, OnInit, Injectable } from '@angular/core'; // Allows for creation of components
import { HttpClient, HttpHeaders } from '@angular/common/http';

/**
 * Err Response interface
 * 
 * Expected format for the response from the xray archiver api.
 */
interface ErrResponse {
  err: string;
  message: string; 
}


// Components (Component Decorator)
/**
 * Components
 * 
 * A component is signified with the Componenet Decorator, it can be used by importing
 * component from the core angular library.
 * 
 * A component is made of a few config settings
 * - Selector: the name of the tag that this component applies too
 * - templateUrl: the name of the html file used with this component
 * - styleUrl: the name of the html file used to style the template associated with this component.
 * 
 * Other props can be defined using the componenet decorator. 
 */
@Component({
  selector: 'app-root', /* applies to the <app-root> ... </app-root> tags. */
  templateUrl: './app.component.html', /* the html used to inject into the chosen selector */
  styleUrls: ['./app.component.css'] /* The css used to style the html injected */
})


/**
 * Component Class
 * 
 * The component class allows for the definition of methods and variables. Each method and
 * variable defined here is accessible through from the template. Likewise, events that take
 * place in the template can be referenced from within the component class.
 * 
 * Components outlines can be quickly created using the angular cli... ng g component comp-name
 * 
 */
export class AppComponent implements OnInit{

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.httpClient.get('http://localhost:8080/api/search/apps/a',{ headers}).
    subscribe(
      (data) => {
      // Read the result field from the JSON response.
      console.log(data);
    },
    (err) => {
      console.log(err)
    });

  }

  appData = [
    {
      title: 'Facebook',
      leeks: 40,
      usrRating: 4.8,
      description: 'The Facebook app does more than help you stay connected with your friends and interests. It\'s also your personal organizer for storing, saving and sharing photos. It\'s easy to share photos straight from your Android camera, and you have full control over your photos and privacy settings. You can choose when to keep individual photos private or even set up a secret photo album to control who sees it.',
      image: '../assets/images/facebook.png'
    },
    {
      title: 'Twitter',
      leeks: 28,
      usrRating: 4.5,
      description: 'From breaking news and entertainment to sports, politics, and everyday interests, when it happens in the world, it happens on Twitter first. See all sides of the story. Join the conversation. Watch live streaming events. Twitter is what’s happening in the world and what people are talking about right now.',
      image: '../assets/images/twitter.png'
    },
    {
      title: 'Sociam Social',
      leeks: 2,
      usrRating: 3.8,
      description: 'A Social media playform that complies with the Ethical Data Initiative\'s data handling guidelines, the platform allows you to connect with and share content with friends. All Whilst not giving away your personal information to the highest bidder.',
      image: '../assets/images/sociam_social.png'
    }
  ];
}
