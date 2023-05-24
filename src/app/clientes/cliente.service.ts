import { Injectable } from '@angular/core';
import { Observable, map, throwError, catchError, tap} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { Cliente } from './cliente';


@Injectable()
export class ClienteService {

  private urlEndPoint:string = "http://localhost:8080/api/clientes";

  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'})

  constructor(private http:HttpClient, private router: Router) { }

  getClientes(page: number): Observable<any>{

     return this.http.get(this.urlEndPoint+ '/page/'+ page).pipe(
      map( (response: any) => {
              
        (response.content as Cliente[]).map(cliente =>{
          cliente.nombre = cliente.nombre.toUpperCase();
          
          let datePipe = new DatePipe('es');
          cliente.createAt = datePipe.transform(cliente.createAt, 'fullDate');

          return cliente;
        });
        return response;
      })
     );
  }

  create(cliente: Cliente): Observable<Cliente>{
    return this.http.post(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      map((response:any)=> response.cliente as Cliente),
      catchError(e =>{

        if(e.status==400){
          return throwError(e);
        }

        Swal.fire(e.error.mensaje,'Error al guardar en la BD','error');
        return throwError(e);
      })
    );
  }

  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError( e => {
        this.router.navigate(['/clientes']);
        Swal.fire('Error al editar', e.error.mensaje,'error');

        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`,cliente, {headers: this.httpHeaders}).pipe(
      catchError(e =>{

        if(e.status==400){
          return throwError(e);
        }

        Swal.fire(e.error.mensaje, e.error.error,'error');
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e =>{
        Swal.fire(e.error.mensaje, e.error.error,'error');
        return throwError(e);
      })
    );
  }

}
