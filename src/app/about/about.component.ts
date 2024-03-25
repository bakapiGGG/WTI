import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

  submitForm(event: Event) {
    event.preventDefault(); // Prevent the default action of the hyperlink
    window.alert('Do you want to join us?');
  }
  

}
