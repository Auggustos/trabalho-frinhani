import { Directive, HostBinding, ElementRef,Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
@Directive({
  selector: '[show-hide-input]'
})
export class Tab2Page {
  @HostBinding() type: string;

    constructor(private el: ElementRef) {
        this.type = 'password';
    }

    changeType(type: string) {  // in your case function name is type
        this.type = type;
        this.el.nativeElement.children[0].type = this.type; // change type for input inside the ion-input
    }

}
