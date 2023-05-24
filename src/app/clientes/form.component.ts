import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent implements OnInit{
  public cliente: Cliente = new Cliente();
  public title:string ="Crear cliente";
  
  public errores: string[];


  constructor(private clienteService: ClienteService, 
    private router: Router,
    private activatedRouter: ActivatedRoute){}

  ngOnInit(){
    this.cargarCliente();
  }
  
  cargarCliente(): void{
    this.activatedRouter.params.subscribe(params =>{
      let id = params['id'];

      if(id){
        this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente)
      }

    });
  }

  create(): void{
    this.clienteService.create(this.cliente)
    .subscribe(cliente => {
      this.router.navigate(['/clientes']);
      Swal.fire('Nuevo cliente',`El cliente ${cliente.nombre} ha sido creado con exito!`,
      'success');
    },
    err =>{
      this.errores = err.error.errors as string[];
    }
    );
  }

  update(): void{
    this.clienteService.update(this.cliente)
    .subscribe( json =>{
      this.router.navigate(['/clientes']);
      Swal.fire('Datos actualizados',`${json.mensaje} : ${json.cliente.nombre}`,
      'success');
    },
    err =>{
      this.errores = err.error.errors as string[];
    }
    );
  }

}
