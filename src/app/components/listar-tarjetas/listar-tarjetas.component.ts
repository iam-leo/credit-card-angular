import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TarjetaCredito } from 'src/app/models/TarjetaCredito';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-listar-tarjetas',
  templateUrl: './listar-tarjetas.component.html',
  styleUrls: ['./listar-tarjetas.component.css']
})
export class ListarTarjetasComponent implements OnInit {
  listaTarjetas: TarjetaCredito[] = [];

  constructor( private _tarjetaService: TarjetaService, private toastr: ToastrService){ }

  ngOnInit(): void {
    this.obtenerTarjetas();
  }

  obtenerTarjetas(){
    this._tarjetaService.obtenerTarjetas().subscribe( doc => {
      this.listaTarjetas = [];

      doc.forEach((element: any) => {
        this.listaTarjetas.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        });
      });
    });
  }

  eliminarTarjeta(id: any){
    this._tarjetaService.eliminarTarjeta(id).then(()=>{
      this.toastr.info('La tarjeta fue eliminada correctamente', 'Tarjeta eliminada');
    }).catch(e => {
      this.toastr.error('La tarjeta no se eliminó', 'Opsss...Error!');
    })
  }

  editarTarjeta(tarjeta: any){
    this._tarjetaService.agregarTarjetaEditar(tarjeta)
  }
}
