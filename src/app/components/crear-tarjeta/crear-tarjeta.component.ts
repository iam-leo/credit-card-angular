import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TarjetaCredito } from 'src/app/models/TarjetaCredito';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-crear-tarjeta',
  templateUrl: './crear-tarjeta.component.html',
  styleUrls: ['./crear-tarjeta.component.css']
})
export class CrearTarjetaComponent implements OnInit {
  form: FormGroup;
  loading = false;
  titulo = 'Agregar tarjeta';
  id: string | undefined

  constructor(private fb: FormBuilder, private _tarjetaService: TarjetaService, private toastr: ToastrService){
    this.form = this.fb.group({
      titular: ['', Validators.required],
      numeroTarjeta: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      fechaExpiracion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
    });
  }

  ngOnInit(): void {
    this._tarjetaService.obtenerTarjetaEditar().subscribe(data => {
      console.log(data)
      this.titulo = 'Editar tarjeta';
      this.id = data.id
      this.form.patchValue({
        titular: data.titular,
        numeroTarjeta: data.numeroTarjeta,
        fechaExpiracion: data.fechaExpiracion,
        cvv: data.cvv
      })
    })
  }

  guardarTarjeta(){
    if(this.id === undefined){
      // Crear tarjeta
      this.crearTarjeta();
    }else{
      // Editar tarjeta
      this.editarTarjeta(this.id);
    }
  }

  crearTarjeta(){
    const tarjeta: TarjetaCredito = {
      titular: this.form.value.titular,
      numeroTarjeta: this.form.value.numeroTarjeta,
      fechaExpiracion: this.form.value.fechaExpiracion,
      cvv: this.form.value.cvv,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    }

    // Acitvamos el spinner
    this.loading = true;

    this._tarjetaService.guardarTarjeta(tarjeta).then(()=>{
      this.toastr.success('La tarjeta fue guardada correctamente', 'Tarjeta registrada');

      // Ocultamos el spinner
      this.loading = false;

      // Reseteamos el form
      this.form.reset();
    }).catch(e => {
      this.loading = false;
      this.toastr.error('La tarjeta no se guardo', 'Opsss...Error!');
    })
  }

  editarTarjeta(id: string){
    const tarjeta: any = {
      titular: this.form.value.titular,
      numeroTarjeta: this.form.value.numeroTarjeta,
      fechaExpiracion: this.form.value.fechaExpiracion,
      cvv: this.form.value.cvv,

      fechaActualizacion: new Date(),
    }

    this.loading = true;
    this._tarjetaService.editarTarjeta(id, tarjeta).then(()=>{
      // Ocultar spinner
      this.loading = false;

      // Resetear titulo
      this.titulo = 'Agregar tarjeta'

      // Resetear form
      this.form.reset();

      // Resetear id
      this.id = undefined;

      // Mostrar alerta
      this.toastr.success('Los datos se han actualizado', 'Guardado!')
    }).catch( () => {
      // Ocultar spinner
      this.loading = false;

      // Mostrar alerta
      this.toastr.error('Los datos no se guardaron', 'Opss... Error!')
    })
  }

}
