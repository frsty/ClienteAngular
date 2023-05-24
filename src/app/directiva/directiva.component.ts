import { Component } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',
  
})
export class DirectivaComponent {

  listaCurso: string[]=['TypeScript','JavaScript','C#'];

  habilitar: boolean = true;

  setHabilitar(): void{
    this.habilitar = (this.habilitar==true)? false : true;
  }
}
