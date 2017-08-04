/**
 * Imports
 * 
 * Allows the inclusion of other services/functionality needed in later derived components
 */
import { Component, OnInit, Injectable } from '@angular/core'; // Allows for creation of components
import { HttpClient, HttpHeaders } from '@angular/common/http';
  

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

  constructor() {}

  ngOnInit(): void {}

}
