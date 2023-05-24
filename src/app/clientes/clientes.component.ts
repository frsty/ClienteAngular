import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit{

  clientes: Cliente[];
  paginador: any;

  constructor(private clienteService: ClienteService,
    private activatedRouter: ActivatedRoute){ }

  ngOnInit(){
    
    this.activatedRouter.paramMap.subscribe( params => {
        let page: number = +params.get('page');

        if(!page){
          page = 0;
        }

        this.clienteService.getClientes(page).subscribe(
        response => {
          this.clientes = response.content as Cliente[];
          this.paginador = response;
        });
      }
    );
    
  }

  delete(cliente: Cliente): void{
    swalWithBootstrapButtons.fire({
      title: 'Esta seguro?',
      text: `¿Seguro que desea eliminar a ${cliente.nombre} ${cliente.apellido}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminalo!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        this.clienteService.delete(cliente.id)
        .subscribe( response => {

          this.clientes = this.clientes.filter(cli => cli !== cliente);

          swalWithBootstrapButtons.fire(
            'Eliminado!',
            `Cliente ${cliente.nombre} ${cliente.apellido} eliminado con exito!.`,
            'success'
          )
        });
      } 
    });
  }

}
